const { Router } = require('express');
const teamsRouter = require('./api/teams.js');
const apiEventsRouter = require('./api/events');sRouter = require('./api/events.js');
const router = Router();

router.use('/teams', teamsRouter);
router.use('/events', apiEventsRouter);

module.exports = router;