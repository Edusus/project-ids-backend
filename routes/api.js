const router = require('express').Router();
const apiUsersRouter = require('./api/users');
const apiAuthRouter = require('./api/auth');
const apiStickerRouter = require('./api/stickers');
const apiEventsRouter = require('./api/events');
const adsRouter = require('./api/ads');

const auth = require('../middlewares/auth');

router.use('/users', auth, apiUsersRouter);
router.use('/stickers',apiStickerRouter);
router.use('/auth',apiAuthRouter);
router.use('/events',apiEventsRouter);
router.use('/ads', adsRouter);

module.exports = router;
