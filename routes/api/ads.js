const router = require('express').Router();
const { Op } = require('sequelize');
const { ad, random } = require('../../databases/db');
const controllerFile = require('../../controller/upload');
const controllerAd = require('../../controller/uploadAd')

const allowedFields = ['announcer', 'adType', 'redirecTo', 'img'];

const httpGetResponse = (res, resource, resourceName) => {
  if (resource) {
    res.status(200).json(resource);
  } else {
    res.status(404).send(resourceName + ' not found');
  }
}

const findAdById = (id) => {
  return ad.findByPk(id);
}

router.get('/', async (req, res) => {
  const ads = await ad.findAll();
  httpGetResponse(res, ads, 'ads');
});

router.get('/search', async (req, res) => {
  try {
    let { page = 0, size = 10, announcer: ann = '.*', adtype: type = ['static', 'float'] } = req.query;
    const [ pageAsNumber, sizeAsNumber ] = [ Number.parseInt(page), Number.parseInt(size) ];
    let options = {
      limit: sizeAsNumber,
      offset: pageAsNumber * sizeAsNumber, 
      where: {
        announcer: {
          [Op.regexp]: ann
        },
        adtype: type
      },
    };
    const { count, rows } = await ad.findAndCountAll(options);
    httpGetResponse(res, {
      totalAds: count,
      pageNumber: pageAsNumber,
      pageSize: sizeAsNumber,
      ads: rows
    }, 'ads');
  } catch (error) {
    console.error(error);
    res.send(error.message);
  }
});

router.get('/watch', async (req, res) => {
  if (await ad.findOne()) {
    let singleAds;
    singleAds = await ad.findOne({
      order: random
      });
    res.status(200).json({
      "success": true,
      "ads": singleAds
    });
  } else {
    console.error('NO ADS IN DB ');
    res.status(500).send('Servicio en mantenimiento...');
  }
});

router.get('/:adId', async (req, res) => {
  const reqAd = await findAdById(req.params.adId);
  httpGetResponse(res, reqAd, 'Required ad');
});

router.post('/', controllerFile.upload, controllerAd.uploadFileAd);

router.put('/:adId', controllerFile.upload, controllerAd.uploadUpdatedFileAd);



router.delete('/:adId', async (req, res) => {
  if (await findAdById(req.params.adId)) {
    await ad.destroy({
      where: { id: req.params.adId }
    });
    res.status(200).send('Deleted ad ' + req.params.adId);
  } else {
    res.status(404).send('Ad not found');
  }
});

module.exports = router;