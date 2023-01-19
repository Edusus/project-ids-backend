const { User, Code } = require('../../databases/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authconfig = require('../../config/auth');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");
const responses = require('../../utils/responses/responses');

module.exports = {
    //Login
    signIn(req, res) {
        let { email, password } = req.body;
        //Buscar usuario
        User.findOne({
            where: { email }
        }).then(user => {
          if (!user) {
              responses.errorDTOResponse(res, 404, "El correo electrónico no esta registrado.");
          } else {
            if (!bcrypt.compareSync(password, user.password)) {
              //Acceso no autorizado 
              return responses.errorDTOResponse(res,400,"La contraseña es incorrecta");
            }

            const token = jwt.sign({id: user}, authconfig.secret, {
              expiresIn: authconfig.expire
            });

            const item = { user, token };
            return responses.singleDTOResponse(res, 200, 'Usuario logueado con exito', item);
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
        }

        const role = "user";
        const password = bcrypt.hashSync(req.body.password, Number.parseInt(authconfig.rounds));
        const user = await User.create({ name, role, email, password });
        //Creacion de token
        const token = jwt.sign({id: user}, authconfig.secret, {
            expiresIn: authconfig.expire
        });

        const item = { user, token };
        responses.singleDTOResponse(res, 200, 'Usuario registrado con exito', item);
      } catch (err) {
        responses.errorDTOResponse(res,500,err.message); 
      }

    },

    //Forgot password
    forgotPassword(req, res) {
        let { email } = req.body;

        if (!email){
          responses.errorDTOResponse(res,400,"Campo vacio");
        }

        User.findOne({
            raws: true,
            where: { email }
        }).then(async user => {
            if (!user){
              return responses.errorDTOResponse(res, 404, "Usuario con este correo no encontrado");
            }

            const transporter = nodemailer.createTransport({
              host: process.env.HOST,
              port: process.env.PORTGMAIL,
              auth: {
                user: process.env.USERHOST,
                pass: process.env.PASSWORD
              }
            });

            const code = randomstring.generate({
              length: 5,
              charset: 'alphanumeric'
            });

            const codeDB = await Code.findOne({
              where: {
                userId: user.id
              }
            });

            if (codeDB){
              await Code.update({ verificationCode: code, isAvailable: true }, {
                where: {
                  userId: user.id
                }
              });
            } else {
              await Code.create({ verificationCode: code, isAvailable: true, userId: user.id });
            }

            let mensaje = 'El codigo de recuperacion de contraseña es : ' + code;

            let mailOptions = {
              from: process.env.GMAIL,
              to: user.email,
              subject: 'Recuperacion de contraseña playoffside.online',
              text: mensaje
            };

            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
                return responses.errorDTOResponse(res,500,'Error interno del servidor');
              }

              console.log('Email enviado: ' + info.response);

              return responses.singleDTOResponse(res,250,'Correo enviado');
            });
        }).catch(err => {
            return responses.errorDTOResponse(res,500,err.message);
        });
    }
}