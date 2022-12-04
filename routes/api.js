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
const inventoryRouter = require('./api/inventory')

const auth = require('../middlewares/auth');
const current_dir = path.dirname(__filename);
const router = Router();

router.use('/users', auth, apiUsersRouter);
router.use('/stickers',apiStickerRouter);
router.use('/auth',apiAuthRouter);
router.use('/events',apiEventsRouter);
router.use('/ads', adsRouter);
router.use('/test-endpoints', testEndpoints);
router.use('/games', gamesEndpoints);
router.use('/teams', teamsRouter);
router.use('/uploads', static(path.join(current_dir, '..', 'uploads')));
router.use('/inventory', inventoryRouter);

module.exports = router;





