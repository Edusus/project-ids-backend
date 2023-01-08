const path = require('path');

const { imgController, fileController } = require('../filesControllers'); 
const { Sticker } = require('../../databases/db');
const getImageUrl = require('../../utils/helpers/get-image-url');
const responses = require('../../utils/responses/responses');
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

  return responses.singleDTOResponse(res,200,"Se creo con exito el nuevo sticker",newSticker);
}

//funcion de subir imagenes de los cromos
exports.uploadFileSticker = async (req, res) => {
    if (!req.file?.path) {
        return responses.errorDTOResponse(res,400,"No se ha subido archivo o no cumple el filtro");
    }

    try {
      const newSticker = await createSticker({
        ...req.body,
        fileName: req.file.filename
      });
      responses.single
      res.status(201).json({
        message: 'Cromo creado con exito',
        item: newSticker
      });
    } catch (error) {
      console.error(error);
      if (typeof req.file !== 'undefined') {
        fileController.deleteFile(req.file.path, req.file.filename);
        return responses.errorDTOResponse(res,400,error.message);
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
      responses.successDTOResponse(res,200,"Sticker modificado con exito");
    } catch (error) {
      console.error(error);
    if (typeof req.file !== 'undefined') {
      fileController.deleteFile(req.file.path, req.file.filename);
      responses.errorDTOResponse(res,500,error.message);
    } else {
      responses.errorDTOResponse(res,400,error.message + '\nError: La imagen no se subio correctamente o no fue enviada');
    }
  }
};