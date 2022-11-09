const { Router } = require('express');
const { Op } = require('sequelize');
const { ad } = require('../../databases/db');

const ads = Router();

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

ads.get('/', async (req, res) => {
  const ads = await ad.findAll();
  httpGetResponse(res, ads, 'ads');
});

// TODO: Refactorizar paginación
ads.get('/paginated', async (req, res) => {
  try {
    let previousId = ad.findOne().id;
    let options = {
      where: {
        id: {
          [Op.gt]: previousId
        }
      },
      limit: 10
    };
    do {
      const ads = await ad.findAndCountAll(options);
      previousId++;
      httpGetResponse(res, ads);
      console.log(ads.count, ads.rows.length);
    } while (previousId < ads.count * ads.rows.length)
  } catch (error) {
    console.error(error);
  }
});

ads.get('/:adId', async (req, res) => {
  const reqAd = await findAdById(req.params.adId);
  httpGetResponse(res, reqAd, 'Required ad');
});

ads.post('/', async (req, res) => {
  try {
    const upAd = await ad.create(req.body, { fields: [
      'announcer', 
      'adType', 
      'redirectTo', 
      'img'
    ]});
    res.status(201).json(upAd);
  } catch (error) {
    console.error(error.toJSON());
    res.status(400).send(error.message);
  }
});

ads.put('/:adId', async (req, res) => {
  if (await findAdById(req.params.adId)) {
    await ad.update(req.body, { 
      where: { id: req.params.adId }
    });
    res.status(200).send('Modified ad ' + req.params.adId);
  } else {
    res.status(404).send('Ad not found');
  }
});

ads.delete('/:adId', async (req, res) => {
  if (await findAdById(req.params.adId)) {
    await ad.destroy({
      where: { id: req.params.adId }
    });
    res.status(200).send('Deleted ad ' + req.params.adId);
  } else {
    res.status(404).send('Ad not found');
  }
});

module.exports = ads;