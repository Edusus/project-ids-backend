const path = require('path');

const { Sticker }= require('../../databases/db');
const { imgController, fileController } = require('../filesControllers'); 
const getImageUrl = require('../../utils/helpers/get-image-url');

exports.createSticker = async (body) => {
  const { playerName, country, position, height, weight, appearanceRate, teamId, externalUuid, jerseyNumber } = body;
  let img = getImageUrl(body.fileName);

  const newSticker = await Sticker.create({
    playerName,
    country,
    position,
    img,
    height,
    weight,
    appearanceRate,
    teamId,
    externalUuid,
    jerseyNumber
  });

  return newSticker;
}

//funcion de subir imagenes de los cromos
exports.uploadFileSticker = async (req, res) => {
    if (!req.file || !req.file.path) {
        return res.status(400).json({
            success: false,
            message: "No se ha subido archivo o no cumple el filtro",
        })
    }

    try {
        const newSticker = await createSticker({
          ...req.body,
          fileName: req.file.filename
        });
        res.status(201).json({
          message: 'Cromo creado con exito',
          item: newSticker
        });
      } catch (error) {
        console.error(error);
        if (typeof req.file !== 'undefined') {
          fileController.deleteFile(req.file.path, req.file.filename);
          res.status(400).send(error.message);
        }
    }
};

exports.uploadUpdatedFileSticker = async (req, res) => {
  const playerId = req.params.playerId;  
    try {
      const player = await Sticker.findByPk(playerId);
         if (typeof player === 'undefined' || player === null)
          throw new Error('Error: sticker not found');
      const { img: prevFileurl } = player;
      const img_relative_dir = '/' + imgController.img_relative_dir.replaceAll('\\', '/');
      const prevFilepath = prevFileurl.split(img_relative_dir)[1];
      fileController.deleteFile(path.join(imgController.img_dir, prevFilepath), prevFilepath);
      const {playerName, country, position, height, weight, appearanceRate, teamId, externalUuid, jerseyNumber } = req.body;
      const filepath = `${proess.env.DOMAIN}${img_relative_dir}/${req.file.filename}`;
      await Sticker.update({
            playerName,
            country,
            position,
            img: filepath,
            height,
            weight,
            appearanceRate,
            teamId,
            externalUuid,
            jerseyNumber
      }, { 
        where: { id: req.params.playerId }
      });
      res.status(200).send({
        success:true,
        message:"Sticker update",
        item: Sticker
      });
    } catch (error) {
      console.error(error);
    if (typeof req.file !== 'undefined') {
      fileController.deleteFile(req.file.path, req.file.filename);
      res.status(400).send(error.message);
    } else {
      res.status(400).send(error.message + '\nError: img not sent');
    }
  }
};