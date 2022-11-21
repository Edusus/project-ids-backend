const { team } = require('../../databases/db');

const allowedFields = ['name', 'badge', 'idEvents'];

/**
 * If the team exists, update the team with the new data.
 * @param req - The request object.
 * @param res - the response object
 */
const update = async (req, res) => {
  const teamId = req.params.teamId;
  if (await team.findByPk(teamId)) {
    try {
      await team.update(req.body, { 
        fields: allowedFields,
        where: { id: teamId }
      });
      res.status(200).send('Modified team ' + teamId);
    } catch (err) {
      console.error(err);
      res.status(400).send(err.message);
    }
  } else {
    res.status(404).send('team not found');
  }
};

const updater = {
  update
}

module.exports = updater;