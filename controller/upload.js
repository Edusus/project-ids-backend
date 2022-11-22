const multer = require("multer");

const { Sticker } = require("../databases/db");
const { ad } = require("../databases/db");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

exports.upload = upload.single("myFile");

//funcion de subir imagenes de los cromos
exports.uploadFileSticker = async (req, res) => {
  const file = req.file.path;
  const {
    playerName,
    team,
    country,
    position,
    height,
    weight,
    appearanceRate,
  } = req.body;
  const newSticker = await Sticker.create({
    playerName,
    team,
    country,
    position,
    img: file,
    height,
    weight,
    appearanceRate,
  });
  res.status(201).json(newSticker);
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
