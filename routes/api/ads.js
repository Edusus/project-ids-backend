const router = require('express').Router();
const { ad, random, Op } = require('../../databases/db');
const controllerFile = require('../../controllers/img/upload');
const controllerAd = require('../../controllers/ads/uploadAd')

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
  //return res.status(500).json({ success: false, message: "Error random del servidor :3" });
  if (await ad.findOne()) {
    const cont = 1;
    const singleAd = await ad.findOne({ order: random});
    let valorActual = singleAd.dataValues.requestedQuantities;
    let valorNuevo = valorActual + cont;
    singleAd.update({ requestedQuantities: valorNuevo });
    return res.status(200).json({ success: true, ad: singleAd });
  } else {
    console.error('NO ADS IN DB ');
    return res.status(500).json({
      success: false,
      message: "No hay anuncios que mostrar :)"
    });
  }
});

router.get('/watch-detailed/:adId', async (req, res) => {
  //return res.status(500).json({ success: false, message: "Error random del servidor :3" });
  if (await findAdById(req.params.adId)) {
     const reqAd = await findAdById(req.params.adId);
     const cont = 1;
     let valorActual = reqAd.dataValues.clickedQuantities;
     let valorNuevo = valorActual + cont;
     reqAd.update({ clickedQuantities: valorNuevo });
     let URL = reqAd.dataValues.redirecTo;
     return res.redirect(302, URL);
  } else {
    console.error('NO ADS IN DB ');
    return res.status(500).json({
      success: false,
      message: "No hay anuncios que mostrar :)"
    });
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
