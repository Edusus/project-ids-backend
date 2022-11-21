const { team } = require('../../databases/db');

const allowedFields = ['name', 'badge', 'idEvents'];

/**
 * It creates a new team in the database, and returns the newly created team.
 * @param req - the request object
 * @param res - the response object
 */
const post = async (req, res) => {
  try {
    const { name, badge, idEvents: eventsid } = req.body;
    let idEvents = 0;
    if (typeof eventsid == 'object') {
      idEvents = eventsid[0];
    } else {
      idEvents = eventsid;
    }
    const Team = await team.create({
      "name": name,
      "badge": badge,
      "idEvents": idEvents
    }, { fields: allowedFields });
    res.status(201).json(Team);
  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
};

const poster = {
  post
}

module.exports = poster;