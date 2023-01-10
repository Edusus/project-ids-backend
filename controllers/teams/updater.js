const { Team } = require('../../databases/db');
const { imgController, fileController } = require('../filesControllers');
const getImageUrl = require('../../utils/helpers/get-image-url');
const path = require('path');
const responses = require('../../utils/responses/responses');
const allowedFields = ['name', 'badge', 'idEvents'];

/**
 * If the team exists, update the team with the new data.
 * @param req - The request object.
 * @param res - the response object
 */
const update = async (req, res) => {
  const teamId = req.params.teamId;
  try {
    const team = await Team.findByPk(teamId);
    if (!team)
      throw new Error('Equipo no encontrado');

    const { badge: prevFileurl } = team;
    const img_relative_dir = '/' + imgController.img_relative_dir.replace('\\', '/');
    const prevFilepath = prevFileurl.split(img_relative_dir)[1];
    fileController.deleteFile(path.join(imgController.img_dir, prevFilepath), prevFilepath);
    const { name, idEvents: eventsid } = req.body;

    const filepath = `${process.env.DOMAIN}${img_relative_dir}/${req.file.filename}`;

    let idEvents = 0;
    if (typeof eventsid == 'object') {
      idEvents = eventsid[0];
    } else {
      idEvents = eventsid;
    }
    await Team.update({
      "name": name,
      "badge": filepath,
      "idEvents": idEvents
    }, { 
      where: { id: teamId },
      fields: allowedFields 
    });
    return responses.singleDTOResponse(res,200,"Equipo actualizado con exito.");
  } catch (error) {
    if (!req?.file) {
      return responses.errorDTOResponse(res,400,error.message + '\nError: La imagen no se subio correctamente o no fue enviada');
    }

    fileController.deleteFile(req.file.path, req.file.filename);
    return responses.errorDTOResponse(res,400,error.message);
  }
}

const updater = { update }

module.exports = updater;