const { Router, static } = require('express');
const teamsRouter = require('./api/teams.js');
const apiEventsRouter = require('./api/events');
const { uploads_dir } = require('../controllers/filesControllers');

const router = Router();

router.use('/teams', teamsRouter);
router.use('/events', apiEventsRouter);
router.use('/uploads', static(uploads_dir));

module.exports = router;