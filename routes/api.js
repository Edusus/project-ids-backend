const router = require('express').Router();
const apiUsersRouter = require('./api/users');
const apiAuthRouter = require('./api/auth');
const apiChromesRouter = require('./api/chromes');


const auth = require('../middlewares/auth');

router.use('/users', auth, apiUsersRouter);
router.use('/chromes',apiChromesRouter);
router.use('/auth',apiAuthRouter);

module.exports = router;
