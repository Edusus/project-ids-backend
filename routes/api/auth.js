const router = require('express').Router();
const authcontroller = require('../../controllers/auth/authcontroller');
const authConfig = require('../../config/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {User} = require('../../databases/db')
const responses = require('../../utils/responses/responses');
router.post('/login', authcontroller.signIn);

router.post('/register', authcontroller.signUp);

router.put('/forgot-password', authcontroller.forgotPassword);

router.put('/new-password', (req, res) => {
    console.log(req.headers);
    if(!req.headers.authorization) {
        responses.errorDTOResponse(res,401,"Acceso no autorizado");
    } else {
        let token = req.headers.authorization.split(" ")[1];

        jwt.verify(token, authConfig.secret, (err, decoded) => {

            if(err) {
                responses.errorDTOResponse(res,500,"Ha ocurrido un problema al decodificar el token", err );
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
              responses.successDTOResponse(res,200,'Se ha modificado');
            }    

        })
    }
            

});



module.exports = router