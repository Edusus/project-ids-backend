const { team } = require('../../databases/db');
const { imgController, fileController } = require('../filesControllers'); 
const path = require('path');

/**
 * If the team exists, delete it and send a 200 response, otherwise send a 404 response.
 * @param req - The request object.
 * @param res - the response object
 */
const destroy = async (req, res) => {
  const teamId = req.params.teamId;
  const Team = await team.findByPk(teamId);
  if (Team) {
    const { badge: fileurl } = Team;
    const img_relative_dir = '/' + imgController.img_relative_dir.replaceAll('\\', '/');
    const filepath = fileurl.split(img_relative_dir)[1];
    await team.destroy({
      where: { id: teamId }
    });
    res.status(200).send("Deleted team " + teamId);
    fileController.deleteFile(path.join(imgController.img_dir, filepath), filepath);
  } else {
    res.status(404).send("team not found");
  }
}

const deleter = {
  destroy
}

module.exports = deleter;
