const multer = require('multer');

const { Chrome }= require('../databases/db');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
        
    }
});

const upload = multer({ storage: storage });

exports.upload = upload.single('myFile')

//funcion de subir imagenes de los cromos
exports.uploadFileSticker = async (req, res) => {
    const file = req.file.path;
    const {playerName, team, country, position, height, weight, appearanceRate } = req.body;
    const newSticker = await Chrome.create({
        playerName,
        team,
        country,
        position,
        img: file,
        height,
        weight,
        appearanceRate
    });
    res.status(201).json(newSticker);
}