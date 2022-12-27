const { ad } = require('../../databases/db');
const { imgController, fileController } = require('../filesControllers'); 

exports.uploadFileAd = async (req, res) => {
 
  if (!req.file?.path) {
    return res.status(400).json({
        success: false,
        message: "No se ha subido archivo o no cumple el filtro",
    })
   }
    try {
      const { announcer, adType, redirecTo } = req.body;
      const img_relative_dir = '/' + imgController.img_relative_dir.replaceAll('\\', '/') + '/';
      let filepath;
      if (process.env.USINGIMGHOST == 'true') {
        filepath = `${process.env.DOMAIN}${img_relative_dir}${req.file.filename}`;
      } else {
        filepath = `${process.env.DOMAIN}${img_relative_dir}${req.file.filename}`;
      }
      const newAd = await ad.create({
        announcer,
        adType,
        redirecTo,
        img: filepath,
      });
      res.status(201).json(newAd);
    } catch (error) {
      console.error(error);
      if (typeof req.file !== 'undefined') {
        fileController.deleteFile(req.file.path, req.file.filename);
        res.status(400).send(error.message);
      } else {
        res.status(400).send('Error: img not sent');
      }
    }
  };

  exports.uploadUpdatedFileAd = async (req, res) => {
    try {
    const { img: prevFileurl } = ad;
    const img_relative_dir = '/' + imgController.img_relative_dir.replaceAll('\\', '/');
    const prevFilepath = prevFileurl.split(img_relative_dir)[1];
    fileController.deleteFile(path.join(imgController.img_dir, prevFilepath), prevFilepath);
    let filepath;
    if (process.env.USINGIMGHOST == 'true') {
      filepath = `${process.env.DOMAIN}${img_relative_dir}/${req.file.filename}`;
    } else {
      filepath = `${process.env.DOMAIN}${img_relative_dir}/${req.file.filename}`;
    }
      const { announcer, adType, redirecTo } = req.body;
      await ad.update({
        announcer,
        adType,
        redirecTo,
        img: filepath,
      }, { 
        where: { id: req.params.adId }
      });
      res.status(200).send("Modified ad " + req.params.adId);
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
  //commit