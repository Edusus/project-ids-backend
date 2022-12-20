const { User } = require('../../databases/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authconfig = require('../../config/auth');
const nodemailer = require('nodemailer');

module.exports = {
    
    //Login
    signIn(req, res) {

        let { email, password } = req.body;

        //Buscar usuario

        User.findOne({
            where: { email }
        }).then(user => {

             if (!user){
                res.status(404).json({ success: false, message: "Usuario con este correo no encontrado" });
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
                 res.status(401).json({ success: false, message: "Contraseña incorrecta" });
               }

             }

        }).catch(err => {
            res.status(500).json(err);
        });

    },

    //Register
     async signUp(req, res) {
      try {
      const { name, email } = req.body;
      const userOfEmail = await User.findOne({ where: { email: req.body.email } });
        if (userOfEmail)  {
        res.status(409).json({success: false, message: "Ya existe un usuario con este correo"});
        } else {
        const role = "user";
        const password = bcrypt.hashSync(req.body.password, Number.parseInt(authconfig.rounds));
        const user = await User.create({ name, role, email, password });
          //Creacion de token
          const token = jwt.sign({id: user}, authconfig.secret, {
              expiresIn: authconfig.expire
          });
          res.json({ user, token })
        }
      } catch (err) {
        res.status(500).json(err);
      }

    },
    
    //Forgot password
    forgotPassword(req, res) {
        let {email} = req.body;

           if (!(email)){
            res.status(404).json({success: false, message: "Campo vacio"});
           } else {
          User.findOne({
            where: {
                email: email
            }
        }).then(user => {

             if (!user){
                res.status(404).json({success: false, message: "Usuario con este correo no encontrado"});
             } else {

                let transporter = nodemailer.createTransport({
                  host: process.env.HOST,
                  port: process.env.PORTGMAIL,
                    auth: {
                      user: process.env.USERHOST,
                      pass: process.env.PASSWORD
                    }
                  });

                  //Creando el token de recuperacion
                  let token = jwt.sign({id: user}, authconfig.secret, {
                    expiresIn: '10m'
                });

                
 
                  const linkVerification = `${process.env.DOMAIN}/new-password/${token}`
                  let mensaje = 'Ingrese al link '+ linkVerification;
                  
                  let mailOptions = {
                    from: process.env.GMAIL,
                    to: user.email,
                    subject: 'Offside_recovery',
                    text: mensaje
                  };

                  transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                      res.status(500).json({success: false, message: 'fallo no se pq' })
                    } else {
                      console.log('Email enviado: ' + info.response);
                      res.status(250).json({success: true, message: 'Correo enviado', user: user,
                      token: token })
                    }
                  });

             }

        }).catch(err => {
            res.status(500).json(err);
            console.log(err);
        });
      }     
    },


}