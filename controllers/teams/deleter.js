const { team} = require('../../databases/db');
const { imgController, fileController } = require('../filesControllers'); 
const path = require('path');
const responses= require('../../utils/responses/responses');
const Sticker= require('../../databases/db');
const game= require('../../databases/db');
/**
 * If the team exists, delete it and send a 200 response, otherwise send a 404 response.
 * @param req - The request object.
 * @param res - the response object
 */
const destroy = async (req, res) => {
  const teamId = req.params.teamId;
  const Team = await team.findByPk(teamId);

  const sticker = await Sticker.findOne({
    raw:true,
    where: {teamId : req.params.teamId}
  });
  const Game = await game.findOne({
    raw:true,
    where: {teamId : req.params.teamid}
  });    
  if (sticker || Game) {
      return responses.errorDTOResponse(res, 400, "No se puede eliminar el equipo porque tiene jugadores o partidos asociados");
  }
  if(Team) {
    const { badge: fileurl } = Team;
    const img_relative_dir = '/' + imgController.img_relative_dir.replaceAll('\\', '/');
    const filepath = fileurl.split(img_relative_dir)[1];
    await team.destroy({
      where: { id: teamId }
    });
    return responses.successDTOResponse(res,true,"Se ha borrado con exito el equipo registrado con el id: " + teamId);
      fileController.deleteFile(path.join(imgController.img_dir, filepath), filepath);
    } else {
      return(res,false,"No se encontro el equipo con el id: "+teamId +" entonces no se pudo borrar");
    }
}

const deleter = {
  destroy
}

module.exports = deleter;
