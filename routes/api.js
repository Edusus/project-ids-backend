const router = require('express').Router();
const apiUsersRouter = require('./api/users');
const apiLoginRouter = require('./api/login');
const apiRegisterRouter = require('./api/register');
const auth = require('../middlewares/auth');

router.use('/users', auth, apiUsersRouter);
router.use('/login',apiLoginRouter);
router.use('/register',apiRegisterRouter);

module.exports = router;
