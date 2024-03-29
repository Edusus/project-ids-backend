const csv = require('csvtojson');
const { Team } = require('../../databases/db');
const { fileController } = require('../filesControllers');
const responses = require('../../utils/responses/responses');
const getImageUrl = require('../../utils/helpers/get-image-url');

const allowedFields = ['name', 'badge', 'idEvents'];

/**
 * It creates a new team in the database, and returns the newly created team.
 * @param req - the request object
 * @param res - the response object
 */

const post = async (req, res) => {
  try {
    const { name, idEvents: eventsid } = req.body;
    const filepath = getImageUrl(req.file.filename);

    let idEvents = 0;
    if (typeof eventsid == 'object') {
      idEvents = eventsid[0];
    } else {
      idEvents = eventsid;
    }
    const team = await Team.create({
        "name": name,
        "badge": filepath,
        "idEvents": idEvents
    }, { fields: allowedFields });
    return responses.singleDTOResponse(res, 201, "Equipo creado con exito", team);
  } catch (error) {
    if (!req?.file) {
      return responses.errorDTOResponse(res,400,'La imagen enviada no se pudo procesar adecuadamente o no se envió una imagen');
    }

    fileController.deleteFile(req.file.path, req.file.filename);
    return responses.errorDTOResponse(res,400,error.message);
  }
}

const headers = ['idEquipo', 'teamName', 'idEvento', 'codeEquipo'];

const postMassive = async (req, res) => {
  const csvParser = csv({
    trim: true,
    delimiter: [',', ';', '|', '$', '\t'],
    noheader: false,
    headers
  });

  const teamsFromCsv = await csvParser.fromFile(req.file.path);

  try {
    await Promise.all(teamsFromCsv.map(async (team) => {
      return await Team.create({
        id: +team.idEquipo,
        name: team.teamName,
        badge: getImageUrl(team.codeEquipo + '.png'),
        idEvents: team.idEvento
      });
    }));
  } catch (e) {
    return responses.errorDTOResponse(res, 500, "Error al subir la mrda de equipos xP");
  }

  return responses.successDTOResponse(res, 201, 'Equipos creados con exito');
};

const poster = { 
  post, 
  postMassive 
};

module.exports = poster;
