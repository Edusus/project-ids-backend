const { team } = require('../../databases/db');

/**
 * If the team exists, delete it and send a 200 response, otherwise send a 404 response.
 * @param req - The request object.
 * @param res - the response object
 */
const destroy = async (req, res) => {
  const teamId = req.params.teamId;
  if (await team.findByPk(teamId)) {
    await team.destroy({
      where: { id: teamId }
    });
    res.status(200).send("Deleted team " + teamId);
  } else {
    res.status(404).send("team not found");
  }
}

const deleter = {
  destroy
}

module.exports = deleter;
