const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth');

exports.verifyToken = (req, res, next) => {

    console.log(req.headers);

    // Comprobar que existe el token
    if(!req.headers.authorization) {
        res.status(401).json({ msg: "Acceso no autorizado" });
    } else {

        // Comrpobar la validez de este token
        let token = req.headers.authorization.split(" ")[1];

        // Comprobar la validez de este token
        jwt.verify(token, authConfig.secret, (err, decoded) => {

            if(err) {
                res.status(500).json({ msg: "Ha ocurrido un problema al decodificar el token", err });
            } else {
                req.user = decoded;
                next();
            }

        })
    }

};

exports.isAdmin = (req, res, next) => {
    if ((req.user.id.role !== "ADMIN") && (req.user.id.role !== "admin")) {
        return res.status(401).json({ error: "Acceso no autorizado usted no es admin" });
    }
    next();
};