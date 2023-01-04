const router = require('express').Router();
const { finder } = require('../../controllers/benchesControllers');

/**
 * Route to get a page of benches, can be filtered by a like of the team name,
 * a regexp of the player name and by the position of the players.
 * * Query params:
 * @param page: an integer representing the page to get, default value is 0
 * @param size: an integer representing the size of each page, default value is 10
 * @param teamname: a like representing the filter to the teams name, default value is % (any team name)
 * @param playername: a regexp representing the filter to the player's name, default value is .* (any player)
 * @param position: represents the filter to the position of the players, 
 * default value is ['arquero', 'defensa', 'delantero', 'medio campo'] (any position)
 */

router.get('/', finder.find);

module.exports = router;