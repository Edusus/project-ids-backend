const { Ad } = require('../../databases/db');
const { imgController, fileController } = require('../filesControllers');
const path = require('path');
const responses = require('../../utils/responses/responses');
const { json } = require('body-parser');
const getImageUrl = require('../../utils/helpers/get-image-url');

exports.uploadFileAd = async (req, res) => {
  if (!req.file?.path) {
    return responses.errorDTOResponse(res,400,"No se ha subido archivo o no cumple el filtro");
  }

  try {
      const { announcer, adType, redirecTo } = req.body;
      const filePath = getImageUrl(req.file.filename);
      const newAd = await Ad.create({
        announcer,
        adType,
        redirecTo,
        img: filePath,
      });
      return responses.singleDTOResponse(res,200,"se ha creado con exito el nuevo anuncio",json(newAd));
  } catch (error) {
    if (typeof req.file !== 'undefined') {
      fileController.deleteFile(req.file.path, req.file.filename);
      return responses.errorDTOResponse(res,400,error.message);
    } else {
      return responses.errorDTOResponse(res,400,'Error: la imagen no fue subida o no se subio correctamente');
    }
  }
};

exports.uploadUpdatedFileAd = async (req, res) => {
  const adId = req.params.adId;

  try {
      const ads = await Ad.findByPk(adId);
        if (typeof ads === 'undefined' || ads === null)
          throw new Error('No se ha encontrado el anuncio');

      const { img: prevFileurl } = ads;
      const img_relative_dir = '/' + imgController.img_relative_dir.replace('\\', '/');
      const prevFilepath = prevFileurl.split(img_relative_dir)[1];
      fileController.deleteFile(path.join(imgController.img_dir, prevFilepath), prevFilepath);

      const filePath = getImageUrl(req.file.filename);
      const { announcer, adType, redirecTo } = req.body;

      await Ad.update({
        announcer,
        adType,
        redirecTo,
        img: filePath,
      }, { 
        where: { id: req.params.adId }
      });

      return responses.singleDTOResponse(res,200,"Se ha modificado con exito el anuncio del id: ",req.params.adId);
  } catch (error) {
    if (typeof req.file !== 'undefined') {
      fileController.deleteFile(req.file.path, req.file.filename);
      return responses.errorDTOResponse(res,400,error.message);
    } else {
      return responses.errorDTOResponse(res,400,error.message + '\nError: La imagen no fue enviada o no se subio correctamente');
    }
  }
};