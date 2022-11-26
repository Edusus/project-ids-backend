const { team } = require('../../databases/db');
const imgController = require('../imgControllers'); 

const allowedFields = ['name', 'badge', 'idEvents'];

/**
 * It creates a new team in the database, and returns the newly created team.
 * @param req - the request object
 * @param res - the response object
 */

const post = async (req, res) => {
  try {
    const { name, idEvents: eventsid } = req.body;
    let filepath;
    if (process.env.USINGIMGHOST == 'true') {
      filepath = `${process.env.IMGURL}/uploads\\${req.file.filename}`;
    } else {
      filepath = `${process.env.OFFSITEURL}/uploads\\${req.file.filename}`;
    }
    let idEvents = 0;
    if (typeof eventsid == 'object') {
      idEvents = eventsid[0];
    } else {
      idEvents = eventsid;
    }
    const Team = await team.create({
      "name": name,
      "badge": filepath,
      "idEvents": idEvents
    }, { fields: allowedFields });
    res.status(201).json(Team);
  } catch (error) {
    console.error(error);
    if (typeof req.file !== 'undefined') {
      imgController.deleteImg(req.file.path, req.file.filename);
      res.status(400).send(error.message);
    } else {
      res.status(400).send('Error: img not sent');
    }
  }
}

const poster = {
  post
}

module.exports = poster;