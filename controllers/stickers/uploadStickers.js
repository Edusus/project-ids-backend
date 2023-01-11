const path = require('path');

const { Sticker }= require('../../databases/db');
const { imgController, fileController } = require('../filesControllers'); 
const getImageUrl = require('../../utils/helpers/get-image-url');
const responses = require('../../utils/responses/responses');

const createSticker = async (body) => {
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
  if (!req.file?.path) {
    return responses.errorDTOResponse(res,400,"No se ha subido archivo o no cumple el filtro");
  }

  try {
      const newSticker = await createSticker({
        ...req.body,
        fileName: req.file.filename
      });
      return responses.singleDTOResponse(res, 200, "Cromo creado con exito", newSticker);
  } catch (error) {
      if (!req?.file) {
        return responses.errorDTOResponse(res, 400, "No se ha subido archivo o no cumple el filtro");
      }
      fileController.deleteFile(req.file.path, req.file.filename);
      return responses.errorDTOResponse(res, 400, error.message);
  }
};

exports.uploadUpdatedFileSticker = async (req, res) => {
  const playerId = req.params.playerId;
  try {
      const player = await Sticker.findByPk(playerId);
         if (typeof player === 'undefined' || player === null)
          throw new Error('Sticker no encontrado');

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
      }, { where: { id: req.params.playerId } });
      return responses.successDTOResponse(res, 200, "Cromo actualizado con exito");
  } catch (e) {
    if (!req?.file) {
      return responses.errorDTOResponse(res, 400, e.message + '\nError: La imagen no se subio correctamente o no fue enviada');
    }

    fileController.deleteFile(req.file.path, req.file.filename);
    return responses.errorDTOResponse(res, 500, e.message);
  }
};

exports.createSticker = createSticker;