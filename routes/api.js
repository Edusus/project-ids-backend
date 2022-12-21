const { Router, static } = require('express');
const path = require('path');
const apiUsersRouter = require('./api/users');
const apiAuthRouter = require('./api/auth');
const apiStickerRouter = require('./api/stickers');
const testEndpoints = require('./api/test-endpoints');
const gamesEndpoints = require('./api/games');
const apiEventsRouter = require('./api/events');
const adsRouter = require('./api/ads');
const teamsRouter = require('./api/teams.js');
const inventoryRouter = require('./api/inventory');
const benchesRouter = require('./api/bench');
const squadsRouter = require('./api/squad');

const auth = require('../middlewares/auth');
const current_dir = path.dirname(__filename);
const router = Router();

const passEventId = (req, res, next) => {
  req.eventId = req.params.eventId;
  next();
}

router.use('/users', auth.verifyToken, auth.isAdmin, apiUsersRouter);
router.use('/stickers',auth.verifyToken, apiStickerRouter);
router.use('/auth',apiAuthRouter);
router.use('/events',apiEventsRouter);
router.use('/ads', adsRouter);
router.use('/test-endpoints', testEndpoints);
router.use('/games', gamesEndpoints);
router.use('/teams', teamsRouter);
router.use('/uploads', static(path.join(current_dir, '..', 'uploads')));
router.use('/inventory',auth.verifyToken, inventoryRouter);
router.use('/public-events/:eventId/bench', auth.verifyToken, passEventId, benchesRouter);
router.use('/public-events/:eventId/squad', auth.verifyToken, passEventId, squadsRouter);

module.exports = router;





