const { team } = require('../../databases/db');
const { imgController, fileController } = require('../filesControllers');
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
    const img_relative_dir = '/' + imgController.img_relative_dir.replaceAll('\\', '/');
    const prevFilepath = prevFileurl.split(img_relative_dir)[1];
    fileController.deleteFile(path.join(imgController.img_dir, prevFilepath), prevFilepath);
    const { name, idEvents: eventsid } = req.body;
    let filepath;
    if (process.env.USINGIMGHOST == 'true') {
      filepath = `${process.env.IMGURL}${img_relative_dir}/${req.file.filename}`;
    } else {
      filepath = `${process.env.OFFSIDEURL}${img_relative_dir}/${req.file.filename}`;
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
      fileController.deleteFile(req.file.path, req.file.filename);
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