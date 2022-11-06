const router = require('express').Router();
const authcontroller = require('../../controller/authcontroller');

router.post('/login', authcontroller.signIn);

router.post('/register', authcontroller.signUp);

router.put('/forgot-password', authcontroller.forgotPassword);



module.exports = router