const { Router } = require('express');
const adsRouter = require('./api/ads');
const router = Router();

router.use('/ads', adsRouter);

module.exports = router;