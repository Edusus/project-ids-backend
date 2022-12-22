const { Router, static } = require('express');
const apiUsersRouter = require('./api/users');
const apiAuthRouter = require('./api/auth');
const apiStickerRouter = require('./api/stickers');
const testEndpoints = require('./api/test-endpoints');
const apiEventsRouter = require('./api/events');
const adsRouter = require('./api/ads'); //Vieja implementacion de ads
const promotionsRouter = require('./api/promotions'); //Nueva implementacion de ads
const teamsRouter = require('./api/teams.js');
const inventoryRouter = require('./api/inventory')
const { uploads_dir } = require('../controllers/filesControllers');

const auth = require('../middlewares/auth');
const router = Router();

router.use('/users', auth.verifyToken, auth.isAdmin, apiUsersRouter);
router.use('/stickers',auth.verifyToken, apiStickerRouter);
router.use('/auth',apiAuthRouter);
router.use('/events',apiEventsRouter);
router.use('/ads', adsRouter); //Vieja implementacion de ads
router.use('/promotions', promotionsRouter); //Nueva implementacion de ads
router.use('/test-endpoints', testEndpoints);
router.use('/teams', teamsRouter);
router.use('/uploads', static(uploads_dir));
router.use('/inventory',auth.verifyToken, inventoryRouter);

module.exports = router;
