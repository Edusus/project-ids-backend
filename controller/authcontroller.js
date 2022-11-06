const { User } = require('../databases/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authconfig = require('../config/auth');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');


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
         
    },
    
    //Forgot password
    forgotPassword(req, res) {
        let {email} = req.body;

           if (!(email)){
            res.status(404).json({message: "Campo vacio"});
           } else {
          User.findOne({
            where: {
                email: email
            }
        }).then(user => {

             if (!user){
                res.status(404).json({message: "Usuario con este correo no encontrado"});
             } else {

                let transporter = nodemailer.createTransport({
                  host: "smtp.ethereal.email",
                  port: 587,
                    auth: {
                      user: 'tre.waelchi6@ethereal.email',
                      pass: 'eCfmXYbMBYTjUVqgHq'
                    }
                  });

                  //Creando el token de recuperacion
                  let token = jwt.sign({id: user}, authconfig.secret, {
                    expiresIn: '10m'
                });

                
 
                  const linkVerification = `http://localhost:3000/new-password/${token}`
                  let mensaje = 'Ingrese al link '+ linkVerification;
                  
                  let mailOptions = {
                    from: "salcedoplan20@gmail.com",
                    to: user.email,
                    subject: 'Offside_recovery',
                    text: mensaje
                  };

                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                      res.status(500).json({ message: 'fallo no se pq' })
                    } else {
                      console.log('Email enviado: ' + info.response);
                      res.status(250).json({ message: 'Correo enviado', user: user,
                      token: token })
                    }
                  });

                res.json({
                  user: user,
                  token: token
                })  

             }

        }).catch(err => {
            res.status(500).json(err);
            console.log(err);
        });
      }     
    },


}