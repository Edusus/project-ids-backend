const { Router, static } = require('express');
const promotionsRouter = require('./api/promotions');
const { uploads_dir } = require('../controllers/filesControllers');

const router = Router();


router.use('/promotions', promotionsRouter);
router.use('/uploads', static(uploads_dir));

module.exports = router;