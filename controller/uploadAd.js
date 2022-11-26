const { ad } = require('../databases/db');

exports.uploadFileAd = async (req, res) => {
 
  if (!req.file?.path) {
    return res.status(400).json({
        success: false,
        message: "No se ha subido archivo o no cumple el filtro",
    })
   }
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
  