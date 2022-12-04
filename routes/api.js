const { Router, static } = require('express');
const apiUsersRouter = require('./api/users');
const apiAuthRouter = require('./api/auth');
const apiStickerRouter = require('./api/stickers');
const apiEventsRouter = require('./api/events');
const teamsRouter = require('./api/teams.js');
const { uploads_dir } = require('../controllers/filesControllers');

const router = Router();

const auth = require('../middlewares/auth');

router.use('/users', auth, apiUsersRouter);
router.use('/stickers',apiStickerRouter);
router.use('/auth',apiAuthRouter);
router.use('/events',apiEventsRouter);
router.use('/teams', teamsRouter);
router.use('/uploads', static(uploads_dir));

module.exports = router;
