const { Ad } = require('../../databases/db');
const { imgController, fileController } = require('../filesControllers');
const path = require('path');

exports.uploadFileAd = async (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({
        success: false,
        message: "No se ha subido archivo o no cumple el filtro",
    });
  }

  try {
      const { announcer, adType, redirecTo } = req.body;
      const img_relative_dir = '/' + imgController.img_relative_dir.replace('\\', '/') + '/';
      const filepath = `${process.env.DOMAIN}${img_relative_dir}${req.file.filename}`;
      const newAd = await Ad.create({
        announcer,
        adType,
        redirecTo,
        img: filepath,
      });
      res.status(201).json(newAd);
  } catch (error) {
      if (typeof req.file !== 'undefined') {
        fileController.deleteFile(req.file.path, req.file.filename);
        res.status(400).send(error.message);
      } else {
        res.status(400).send('Error: img not sent');
      }
  }
};

exports.uploadUpdatedFileAd = async (req, res) => {
  const adId = req.params.adId;

  try {
      const ads = await Ad.findByPk(adId);
        if (typeof ads === 'undefined' || ads === null)
          throw new Error('Error: ad not found');

      const { img: prevFileurl } = ads;
      const img_relative_dir = '/' + imgController.img_relative_dir.replace('\\', '/');
      const prevFilepath = prevFileurl.split(img_relative_dir)[1];
      fileController.deleteFile(path.join(imgController.img_dir, prevFilepath), prevFilepath);
      let filepath = `${process.env.DOMAIN}${img_relative_dir}/${req.file.filename}`;
      const { announcer, adType, redirecTo } = req.body;

      await Ad.update({
        announcer,
        adType,
        redirecTo,
        img: filepath,
      }, { 
        where: { id: req.params.adId }
      });

      return res.status(200).send("Modified ad " + req.params.adId);
  } catch (error) {
    if (typeof req.file !== 'undefined') {
      fileController.deleteFile(req.file.path, req.file.filename);
      return res.status(400).send(error.message);
    } else {
      return res.status(400).send(error.message + '\nError: img not sent');
    }
  }
};
