const { Router } = require('express');
const { Op } = require('sequelize');
const ads = Router();

const { ad } = require('../databases/db');

const httpGetResponse = (res, resource) => {
  if (resource) {
    res.status(200).json(resource);
  } else {
    res.status(404).send('Requested resource not found');
  }
}

const findAdById = (id) => {
  return ad.findByPk(id);
}

ads.get('/', async (req, res) => {
  const ads = await ad.findAll();
  httpGetResponse(res, ads);
});

ads.get('/:adId', async (req, res) => {
  const reqAd = await findAdById(req.params.adId);
  httpGetResponse(res, reqAd)
});

// TODO: Refactorizar paginación
ads.get('/paginated/get', async (req, res) => {
  let previousId = 0;
  let options = {
    where: {
      id: {
        [Op.gt]: previousId = previousId++
      }
    },
    limit: 10
  };
  const ads = await ad.findAndCountAll(options);
  httpGetResponse(res, ads);
});

ads.post('/', async (req, res) => {
  const upAd = await ad.create(req.body);
  res.status(201).json(upAd);
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