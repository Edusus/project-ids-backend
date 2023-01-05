const { Router, static } = require('express');
const apiUsersRouter = require('./api/users');
const apiAuthRouter = require('./api/auth');
const apiStickerRouter = require('./api/stickers');
const testEndpoints = require('./api/test-endpoints');
const apiEventsRouter = require('./api/events');
const adsRouter = require('./api/ads'); //Vieja implementacion de ads
const promotionsRouter = require('./api/promotions'); //Nueva implementacion de ads
const teamsRouter = require('./api/teams.js');
const inventoryRouter = require('./api/inventory');
const benchesRouter = require('./api/bench');
const squadsRouter = require('./api/squad');
const marketRouter = require('./api/market');
const { uploads_dir } = require('../controllers/filesControllers');
const moneyRouter =require('./api/playerFantasyModel');

const auth = require('../middlewares/auth');
const router = Router();

const passEventId = (req, res, next) => {
  req.eventId = Number.parseInt(req.params.eventId);
  next();
}

router.use('/users', auth.verifyToken, auth.isAdmin, apiUsersRouter);
router.use('/stickers',auth.verifyToken, apiStickerRouter);
router.use('/auth',apiAuthRouter);
router.use('/events',auth.verifyToken, apiEventsRouter);
router.use('/ads', adsRouter); //Vieja implementacion de ads
router.use('/promotions', promotionsRouter); //Nueva implementacion de ads
router.use('/test-endpoints', testEndpoints);
router.use('/teams',auth.verifyToken, teamsRouter);
router.use('/uploads', static(uploads_dir));
router.use('/inventory',auth.verifyToken, inventoryRouter);
router.use('/public-events/:eventId/squad', auth.verifyToken, passEventId, benchesRouter);
router.use('/public-events/:eventId/squad', auth.verifyToken, passEventId, squadsRouter);
router.use('/public-events/:eventId/market', auth.verifyToken, marketRouter);
router.use('/public-events',auth.verifyToken, moneyRouter);


module.exports = router;
