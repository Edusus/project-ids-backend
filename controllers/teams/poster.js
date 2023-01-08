const csv = require('csvtojson');
const { Team } = require('../../databases/db');
const { imgController, fileController } = require('../filesControllers');
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
    const img_relative_dir = '/' + imgController.img_relative_dir.replaceAll('\\', '/') + '/';
    let filepath = `${process.env.DOMAIN}${img_relative_dir}${req.file.filename}`;
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
    responses.singleDTOResponse(res,201,"S subio con exito el equipo: ",team);
  } catch (error) {
    console.error(error);
    if (typeof req.file !== 'undefined') {
      fileController.deleteFile(req.file.path, req.file.filename);
      responses.errorDTOResponse(res,400,error.message);
   }
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

  console.log(teamsFromCsv)
  console.log(getImageUrl(teamsFromCsv[0].codeEquipo + '.png'));
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
