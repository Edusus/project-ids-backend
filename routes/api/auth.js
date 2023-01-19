const router = require('express').Router();
const authcontroller = require('../../controllers/auth/authcontroller');
const authConfig = require('../../config/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {User, Code} = require('../../databases/db')
const responses = require('../../utils/responses/responses');
router.post('/login', authcontroller.signIn);

router.post('/register', authcontroller.signUp);

router.put('/forgot-password', authcontroller.forgotPassword);

router.put('/new-password', async (req, res) => {
        let {code, password} = req.body;
        const verifityCode = await Code.findOne({
            raws: true,
            where: {
                verificationCode: code,
                isAvailable: true
            }
        });


        password = password.toString();
        code = code.toString();
        
        if(!verifityCode){
            return responses.errorDTOResponse(res, 404, 'El codigo no se encuentra o es incorrecto');
        }


        const id = verifityCode.userId;
        
        let newPassword = bcrypt.hashSync(password, Number.parseInt(authConfig.rounds));
        User.update({
            password: newPassword
        }, {
            where: {
                id: id
            }    
        })

        await Code.update({
            isAvailable: false
        }, {
            where: {
                verificationCode: code
            }
        });

        return responses.successDTOResponse(res,200,'Se ha modificado');

        
            
});



module.exports = router