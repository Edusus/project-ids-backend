const { Team } = require('../../databases/db');
const { imgController, fileController } = require('../filesControllers'); 

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
    let filepath;
    if (process.env.USINGIMGHOST == 'true') {
      filepath = `${process.env.DOMAIN}${img_relative_dir}${req.file.filename}`;
    } else {
      filepath = `${process.env.DOMAIN}${img_relative_dir}${req.file.filename}`;
    }
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
    res.status(201).json(team);
  } catch (error) {
    console.error(error);
    if (typeof req.file !== 'undefined') {
      fileController.deleteFile(req.file.path, req.file.filename);
      res.status(400).send(error.message);
   }
  }
}
const poster = {
  post
}

module.exports = poster