const { Team, Game, Sticker } = require('../../databases/db');
const { imgController, fileController } = require('../filesControllers'); 
const path = require('path');
const responses = require('../../utils/responses/responses');
const getImageUrl = require('../../utils/helpers/get-image-url');

/**
 * If the team exists, delete it and send a 200 response, otherwise send a 404 response.
 * @param req - The request object.
 * @param res - the response object
 */
const destroy = async (req, res) => {
  const teamId = req.params.teamId;
  const team = await Team.findByPk(teamId);
  if (!team) {
    return responses.errorDTOResponse(res,404,"No se encontro el equipo con el id: "+teamId +" entonces no se pudo borrar");
  }

  const sticker = await Sticker.findOne({
    raw: true,
    where: { teamId : req.params.teamId }
  });
  const game = await Game.findOne({
    raw: true,
    where: { teamId : req.params.teamId }
  });

  if (sticker || game) {
    return responses.errorDTOResponse(res, 400, "No se puede eliminar el equipo porque tiene jugadores o partidos asociados");
  }

  try {
    const filepath = getImageUrl(team.dataValues.badge);
    await team.destroy();
    fileController.deleteFile(path.join(imgController.img_dir, filepath), filepath);
  } catch (e) {
    return responses.errorDTOResponse(res, 500, e.message);
  }

  return responses.successDTOResponse(res,200,"Se ha borrado con exito el equipo registrado con el id: " + teamId);
}

const deleter = { destroy }

module.exports = deleter;
