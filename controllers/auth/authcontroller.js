const { User } = require('../../databases/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authconfig = require('../../config/auth');
const nodemailer = require('nodemailer');
const responses = require('../../utils/responses/responses');

module.exports = {
    
    //Login
    signIn(req, res) {

        let { email, password } = req.body;

        //Buscar usuario

        User.findOne({
            where: { email }
        }).then(user => {
          if (!user){
              responses.errorDTOResponse(res, 404, "El correo electrónico no esta registrado.");
          } else {
            if (bcrypt.compareSync(password, user.password)) {
              const token = jwt.sign({id: user}, authconfig.secret, {
                expiresIn: authconfig.expire
              });
              const item = { user, token }
              return responses.singleDTOResponse(res, 200, 'Usuario logueado con exito', item);
            } else {
                //Acceso no autorizado 
                responses.errorDTOResponse(res,400,"La contraseña es incorrecta");
            }
          }
        }).catch(err => {
            responses.errorDTOResponse(res, 500, err.message);
        });

    },

    //Register
    async signUp(req, res) {
      try {
        const { name, email } = req.body;
        const userOfEmail = await User.findOne({ where: { email: req.body.email } });
        if (userOfEmail) {
          responses.errorDTOResponse(res,409,"Ya existe un usuario con este correo");
        } else {
          const role = "user";
          const password = bcrypt.hashSync(req.body.password, Number.parseInt(authconfig.rounds));
          const user = await User.create({ name, role, email, password });
          //Creacion de token
          const token = jwt.sign({id: user}, authconfig.secret, {
              expiresIn: authconfig.expire
          });

          let item = {
            user,
            token
          }
          
          responses.singleDTOResponse(res, 200, 'Usuario registrado con exito', item);
        }
      } catch (err) {
        responses.errorDTOResponse(res,500,err.message); 
      }

    },
    
    //Forgot password
    forgotPassword(req, res) {
        let {email} = req.body;

          if (!(email)){
            responses.errorDTOResponse(res,400,"Campo vacio");
          } else {
            User.findOne({
              where: {
                email: email
              }
            }).then(user => {

              if (!user){
                responses.errorDTOResponse(res,404,"Usuario con este correo no encontrado");
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
                    responses.errorDTOResponse(res,500,'Error interno del servidor');
                  } else {
                    console.log('Email enviado: ' + info.response);
                    
                    let item = {
                      user,
                      token
                    }
                    responses.singleDTOResponse(res,250,'Correo enviado',item);
                  }
                });
             }

        }).catch(err => {
            console.log(err);


            responses.errorDTOResponse(res,500,error.message);
        });
      }     
    },


}