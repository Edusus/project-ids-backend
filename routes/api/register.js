const router = require('express').Router();
const authcontroller = require('../../controller/authcontroller');

router.post('/', authcontroller.signUp);

module.exports = router