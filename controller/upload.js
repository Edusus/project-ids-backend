const multer = require("multer");

const fs1 = require("fs-extra");
const { Sticker }= require('../databases/db');
const { ad } = require('../databases/db');
let filtro = false;

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const ruta = './uploads'
        fs1.mkdirsSync(ruta)
        cb(null, ruta);
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
        
    }   
});

const uploadFilter = function (req, file, cb,) {

     let typeArray = file.mimetype.split('/');
     let fileType = typeArray[1];
    if (fileType == 'jpg' || fileType == 'png' || fileType == 'jpeg') {
        cb(null, true);
    } else {
            cb(null, false);
            filtro = true;
    }

 };

const upload = multer({ 
    storage: storage,
    fileFilter: uploadFilter
 });

exports.upload = upload.single("myFile");

//funcion de subir imagenes de los cromos
exports.uploadFileSticker = async (req, res) => {
    if (!req.file?.path) {
        return res.status(400).json({
            success: false,
            message: "No se ha subido archivo",
        })
    }

    try {

        const file = req.file.path;
        const {playerName, team, country, position, height, weight, appearanceRate } = req.body;
        const newSticker = await Sticker.create({
          playerName,
          team,
          country,
          position,
          img: `${process.env.DOMAIN}/${file}`,
          height,
          weight,
          appearanceRate
    });
    res.status(201).json(newSticker);
    } catch (error) {
         if (filtro == true) {
            res.status(400).json({"success": false, "message": "El archivo no es una imagen"});
         } else {
            console.log(error);
            res.status(400).send(error.message);
         }
    }
}

exports.uploadUpdatedFileSticker = async (req, res) => {
  try {
    const file = req.file.path;
    const {playerName, team, country, position, height, weight, appearanceRate } = req.body;
    await Sticker.update({
      playerName,
          team,
          country,
          position,
          img: `${process.env.DOMAIN}/${file}`,
          height,
          weight,
          appearanceRate
    }, { 
      where: { id: req.params.playerId }
    });
    res.status(200).send("Modified ad " + req.params.playerId);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

exports.uploadFileAd = async (req, res) => {
  try {
    const file = req.file.path;
    const { announcer, adType, redirecTo } = req.body;
    const newAd = await ad.create({
      announcer,
      adType,
      redirecTo,
      img: file,
    });
    res.status(201).json(newAd);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

exports.uploadUpdatedFileAd = async (req, res) => {
  try {
    const file = req.file.path;
    const { announcer, adType, redirecTo } = req.body;
    await ad.update({
      announcer,
      adType,
      redirecTo,
      img: file,
    }, { 
      where: { id: req.params.adId }
    });
    res.status(200).send("Modified ad " + req.params.adId);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};
