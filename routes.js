const { Router } = require('express');
const ads = require('./routes/ads')
const router = Router();

router.use('/ads', ads)

module.exports = router;