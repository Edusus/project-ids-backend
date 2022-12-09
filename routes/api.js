const { Router, static } = require('express');
const apiUsersRouter = require('./api/users');
const apiAuthRouter = require('./api/auth');
const apiStickerRouter = require('./api/stickers');
const testEndpoints = require('./api/test-endpoints');
const gamesEndpoints = require('./api/games');
const apiEventsRouter = require('./api/events');
const adsRouter = require('./api/ads');
const teamsRouter = require('./api/teams.js');
const { uploads_dir } = require('../controllers/filesControllers');

const auth = require('../middlewares/auth');
const router = Router();

router.use('/users', auth, apiUsersRouter);
router.use('/stickers',apiStickerRouter);
router.use('/auth',apiAuthRouter);
router.use('/events',apiEventsRouter);
router.use('/ads', adsRouter);
router.use('/test-endpoints', testEndpoints);
router.use('/games', gamesEndpoints);
router.use('/teams', teamsRouter);
router.use('/uploads', static(uploads_dir));

module.exports = router;





