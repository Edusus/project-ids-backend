const { Op } = require('sequelize');
const { Team, Sticker, Event } = require('../../databases/db');

/**
 * If the resource is found, send a 200 status code with the resource in the response body. If the
 * resource is not found, send a 404 status code with a message in the response body.
 * @param res - the response object
 * @param resource - the resource that was found
 * @param resourceName - The name of the resource you're trying to get.
 */
const httpGetResponse = (res, resource, resourceName) => {
  if (resource) {
    res.status(200).json(resource);
  } else {
    res.status(404).send(resourceName + ' not found');
  }
}

/**
 * Find takes a page number and a page size, and returns a page of teams, where the teams are filtered by
 * a regexp on the team name and a like on the event id.
 * @param req - the request object
 * @param res - the response object
 */
const find = async (req, res) => {
  try {
    let { page = 0, size = 10, teamname = '.*', eventid = '%' } = req.query;
    const [ pageAsNumber, sizeAsNumber ] = [ Number.parseInt(page), Number.parseInt(size) ];
    let options = {
      limit: sizeAsNumber,
      offset: pageAsNumber * sizeAsNumber,
      where: {
        name: {
          [Op.regexp]: teamname
        },
        idEvents: {
          [Op.like]: eventid
        }
      }
    }
    const { count, rows } = await Team.findAndCountAll(options);
    httpGetResponse(
      res, {
        success: true,
        paginate:{
          total: count,
          page: pageAsNumber,
          pages:Math.ceil(count/sizeAsNumber),
          perPage: sizeAsNumber
        },
        items: rows 
      }, 'teams');
  } catch (err) {
    console.error(err);
    res.status(400).send(err.message);
  }
}

/**
 * It finds a team by its id and returns it in the response.
 * @param req - The request object
 * @param res - response object
 */
const findById = async (req, res) => {
  const team = await Team.findByPk(req.params.teamId);
  httpGetResponse(res, team, "team");
}

/**
 * It finds all the teams and then sends them back to the client.
 * @param req - The request object
 * @param res - the response object
 */
const findAll = async (req, res) => {
  const eventId = req.params.eventId;
  const teams = await Team.findAll({
    include: [
      {
         model: Sticker
      },
      {
        model: Event
      }
  ],
  where: {
    idEvents: eventId
  }
  });
  httpGetResponse(res, teams, 'teams');
}

module.exports = {
  findAll, find, findById
}
