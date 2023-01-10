const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');
const responses = require('../utils/responses/responses');

exports.verifyToken = (req, res, next) => {

    console.log(req.headers);

    // Comprobar que existe el token
    if(!req.headers.authorization) {
        return responses.errorDTOResponse(res,401,"Acceso no autorizado");
    } else {

        // Comrpobar la validez de este token
        let token = req.headers.authorization.split(" ")[1];

        // Comprobar la validez de este token
        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if(err) {
                return responses.errorDTOResponse(res,500,"Ha ocurrido un problema al decodificar el token");
            }

            req.user = decoded;
            return next();
        })
    }

};

exports.isAdmin = (req, res, next) => {
    if ((req.user.id.role !== "ADMIN") && (req.user.id.role !== "admin")) {
        return res.status(401).json({success: false, message: "Acceso no autorizado usted no es admin" });
    };
    next();
};