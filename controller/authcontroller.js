const { User } = require('../databases/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authconfig = require('../config/auth');
const {check,  validationResult} = require('express-validator');


module.exports = {
    
    //Login
    signIn(req, res) {

        let {email, password } = req.body;

        //Buscar usuario

        User.findOne({
            where: {
                email: email
            }
        }).then(user => {

             if (!user){
                res.status(404).json({message: "Usuario con este correo no encontrado"});
             } else {

               if (bcrypt.compareSync(password, user.password)) {

                let token = jwt.sign({id: user}, authconfig.secret, {
                    expiresIn: authconfig.expire
                });
                
                res.json({
                    user: user,
                    token: token
                });

               }else {
                   //Acceso no autorizado 
                 res.status(401).json({message: "Contraseña incorrecta"});
               }

             }

        }).catch(err => {
            res.status(500).json(err);
        });

    },

    //Register
    signUp(req, res) {

        const role = "user";
        let password = bcrypt.hashSync(req.body.password, Number.parseInt(authconfig.rounds));

         User.create({
            name: req.body.name,
            role: role,
            email: req.body.email,
            password: password
         }).then(user => {  

            //Creacion de token
            let token = jwt.sign({id: user}, authconfig.secret, {
                expiresIn: authconfig.expire
            });

            res.json({
                user: user,
                token: token
            })

         }).catch(err => {
             res.status(500).json(err);
         });
         
    }
}