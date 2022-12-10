
const { Item }= require('../databases/db');

//funcion de subir imagenes de los cromos
exports.uploadFileItem = async (req, res) => {
    if (!req.file?.path) {
        return res.status(400).json({
            success: false,
            message: "No se ha subido archivo o no cumple el filtro",
        })
    }

    try {

        const file = req.file.path;
        const {playerName, team, country, position, height, weight, appearanceRate, teamId } = req.body;
        const newItem = await Item.create({
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
    res.status(201).json(newItem);
    } catch (error) {
            console.log(error);
            res.status(400).send(error.message);
        }
};

exports.uploadUpdatedFileItem = async (req, res) => {
    try {
      const file = req.file.path;
      const {playerName, team, country, position, height, weight, appearanceRate } = req.body;
      await Item.update({
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
      res.status(200).send("Modified Item " + req.params.playerId);
    } catch (error) {
      console.error(error);
      res.status(400).send(error.message);
    }
  };