
const { Sticker }= require('../databases/db');

//funcion de subir imagenes de los cromos
exports.uploadFileSticker = async (req, res) => {
    if (!req.file?.path) {
        return res.status(400).json({
            success: false,
            message: "No se ha subido archivo o no cumple el filtro",
        })
    }

    try {

        const file = req.file.path;
        const {playerName, team, country, position, height, weight, appearanceRate, teamId } = req.body;
        const newSticker = await Sticker.create({
          playerName,
          team,
          country,
          position,
          img: `${process.env.DOMAIN}/${file}`,
          height,
          weight,
          appearanceRate,
          teamId
    });
    res.status(201).json({
      message:'item created',
      item:newSticker
    });
    } catch (error) {
            console.log(error);
            res.status(400).send(error.message);
        }
};

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
      res.status(200).send({
        success:true,
        message:"item modified"
      });
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  };