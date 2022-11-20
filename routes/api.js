const router = require('express').Router();
const apiUsersRouter = require('./api/users');
const apiAuthRouter = require('./api/auth');
const apiChromesRouter = require('./api/chromes');
const apiEventsRouter = require('./api/events');

const auth = require('../middlewares/auth');

router.use('/users', auth, apiUsersRouter);
router.use('/chromes',apiChromesRouter);
router.use('/auth',apiAuthRouter);
router.use('/events',apiEventsRouter);


module.exports = router;
