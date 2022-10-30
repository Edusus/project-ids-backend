const router = require('express').Router();

const apiChromesRouter=require('./api/chromes');
router.use('/chromes',apiChromesRouter);

module.exports = router;
