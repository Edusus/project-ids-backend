const { team } = require('../../databases/db');
const imgController = require('../imgControllers');
const path = require('path');

const allowedFields = ['name', 'badge', 'idEvents'];

/**
 * If the team exists, update the team with the new data.
 * @param req - The request object.
 * @param res - the response object
 */
const update = async (req, res) => {
  const teamId = req.params.teamId;
  try {
    const Team = await team.findByPk(teamId);
    if (typeof Team === 'undefined' || Team === null)
      throw new Error('Error: team not found');
    
    const { badge: prevFileurl } = Team;
    const prevFilepath = prevFileurl.split('/uploads')[1];
    imgController.deleteImg(path.join(imgController.uploads_dir, prevFilepath), prevFilepath);
    const { name, idEvents: eventsid } = req.body;
    let filepath;
    if (process.env.USINGIMGHOST == 'true') {
      filepath = `${process.env.DOMAIN}/uploads/${req.file.filename}`;
    } else {
      filepath = `${process.env.DOMAIN}/uploads/${req.file.filename}`;
    }
    let idEvents = 0;
    if (typeof eventsid == 'object') {
      idEvents = eventsid[0];
    } else {
      idEvents = eventsid;
    }
    await team.update({
      "name": name,
      "badge": filepath,
      "idEvents": idEvents
    }, { 
      where: { id: teamId },
      fields: allowedFields 
    });
    res.status(200).json({
      success: true,
      message: `Modified team ${teamId}`
    });
  } catch (error) {
    console.error(error);
    if (typeof req.file !== 'undefined') {
      imgController.deleteImg(req.file.path, req.file.filename);
      res.status(400).send(error.message);
    } else {
      res.status(400).send(error.message + '\nError: img not sent');
    }
  }
}

const updater = {
  update
}

module.exports = updater;