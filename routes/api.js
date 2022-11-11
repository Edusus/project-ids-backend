const { Router } = require('express');
const teamsRouter = require('./api/teams.js');
const router = Router();

router.use('/teams', teamsRouter);

module.exports = router;