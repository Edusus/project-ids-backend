const { Router, static } = require('express');
const teamsRouter = require('./api/teams.js');
const apiEventsRouter = require('./api/events');
const path = require('path');

const router = Router();
const current_dir = path.dirname(__filename);

router.use('/teams', teamsRouter);
router.use('/events', apiEventsRouter);
router.use('/uploads', static(path.join(current_dir, '..', 'uploads')));

module.exports = router;