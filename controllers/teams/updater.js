const { Team } = require('../../databases/db');
const { imgController, fileController } = require('../filesControllers');
const path = require('path');
const responses= require('../../utils/responses/responses');
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
    if (typeof team === 'undefined' || team === null)
      throw new Error('Error: team not found');
    
    const { badge: prevFileurl } = team;
    const img_relative_dir = '/' + imgController.img_relative_dir.replaceAll('\\', '/');
    const prevFilepath = prevFileurl.split(img_relative_dir)[1];
    fileController.deleteFile(path.join(imgController.img_dir, prevFilepath), prevFilepath);
    const { name, idEvents: eventsid } = req.body;
    let filepath = `${process.env.DOMAIN}${img_relative_dir}/${req.file.filename}`;
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
    responses.singleDTOResponse(res,200,"Equipo modificado con exito del id: ",teamId);
  } catch (error) {
    console.error(error);
    if (typeof req.file !== 'undefined') {
      fileController.deleteFile(req.file.path, req.file.filename);
      responses.errorDTOResponse(res,400,error.message);
    } else {
      responses.errorDTOResponse(res,400,error.message + '\nError: imagen no se subio correctamente o no se envio');
    }
  }
}

const updater = {
  update
}

module.exports = updater;