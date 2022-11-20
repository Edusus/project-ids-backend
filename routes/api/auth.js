const router = require('express').Router();
const authcontroller = require('../../controller/authcontroller');
const authConfig = require('../../config/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {User} = require('../../databases/db')

router.post('/login', authcontroller.signIn);

router.post('/register', authcontroller.signUp);

router.put('/forgot-password', authcontroller.forgotPassword);

router.put('/new-password', (req, res) => {
    console.log(req.headers);
    if(!req.headers.authorization) {
        res.status(401).json({ msg: "Acceso no autorizado" });
    } else {
        let token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, authConfig.secret, (err, decoded) => {

            if(err) {
                res.status(500).json({ msg: "Ha ocurrido un problema al decodificar el token", err });
            } else {
                req.user = decoded;
                let {id} = req.user.id
                let {password} = req.body;
                let newPassword = bcrypt.hashSync(password, Number.parseInt(authConfig.rounds));
                User.update({
                    password: newPassword
                }, {
                    where: {
                        id: id
                    }    
                })
              res.status(200).json({ success: true, message:'Se ha modificado'});
            }    

        })
    }
            

});



module.exports = router