const { Router } = require('express');
const ads = Router();

const { ad } = require('../databases/db');

ads.get('/', async (req, res) => {
  const ads = await ad.findAll();
  res.status(200).json(ads);
});

ads.get('/:adId', async (req, res) => {
  const reqAd = await ad.findAll({
    where: { id: req.params.adId }
  });
  res.status(200).json(reqAd);
});

ads.post('/', async (req, res) => {
  const upAd = await ad.create(req.body);
  res.status(201).json(upAd);
});

ads.put('/:adId', async (req, res) => {
  await ad.update(req.body, { 
    where: { id: req.params.adId }
  });
  res.status(200).json('Modified');
});

ads.delete('/:adId', async (req, res) => {
  await ad.destroy({
    where: { id: req.params.adId }
  });
  res.status(200).json('Deleted');
});

module.exports = ads;