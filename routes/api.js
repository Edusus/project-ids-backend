const { Router, static } = require('express');
const apiUsersRouter = require('./api/users');
const apiAuthRouter = require('./api/auth');
const apiStickerRouter = require('./api/stickers');
const testEndpoints = require('./api/test-endpoints');
const gamesEndpoints = require('./api/games');
const apiEventsRouter = require('./api/events');
const adsRouter = require('./api/ads');
const teamsRouter = require('./api/teams.js');
const inventoryRouter = require('./api/inventory')
const { uploads_dir } = require('../controllers/filesControllers');

const auth = require('../middlewares/auth');
const router = Router();

router.use('/users', auth.verifyToken, auth.isAdmin, apiUsersRouter);
router.use('/stickers',auth.verifyToken, apiStickerRouter);
router.use('/auth',apiAuthRouter);
router.use('/events',auth.verifyToken,apiEventsRouter);
router.use('/ads',auth.verifyToken, adsRouter);
router.use('/test-endpoints', testEndpoints);
router.use('/games', gamesEndpoints);
router.use('/teams',auth.verifyToken, teamsRouter);
router.use('/inventory',auth.verifyToken, inventoryRouter);
router.use('/uploads', static(uploads_dir));

module.exports = router;





