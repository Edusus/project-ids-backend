const { Router } = require('express');
const { finder, poster, updater, deleter } = require('../../controllers/teamsControllers');
const { imgController, csvController } = require('../../controllers/filesControllers');
const { isAdmin } = require('../../middlewares/auth');


const teamsRouter = Router();

/**
 * Route to get a page of teams, can be filtered by a regexp of the team name
 * and by a like of the event id.
 * * Query params:
 * @param page: an integer representing the page to get, default value is 0
 * @param size: an integer representing the size of each page, default value is 10
 * @param teamname: a regexp representing the filter to the teams name, default value is .* (any team name)
 * @param eventid: a like (similar to a regexp, search mysql like or sequelize like for more info) 
 * representing the filter to the eventid, default value is % (any event id)
 */

teamsRouter.get('/', finder.find);



/**
 * Route to get all teams of a specific event
 */

teamsRouter.get('/all/:eventId', finder.findAll);



/**
 * Route to get a team by a specific id, passed as a request param
 * * Request params:
 * @param teamId: the id of the team to get from the db
 */

teamsRouter.get('/:teamId', finder.findById);



/**
 * Route to post a new team
 * * Expected multiform/data: { "name": "value", "myFile": [file.jpg | file.jpeg | file.png], "idEvents": value }
 * idEvents value must be an already existing event id
 */

teamsRouter.post('/', isAdmin, imgController.uploadImg, poster.post);



/**
 * Route to post a csv of teams
 * * Expected multiform/data: { "myFile": [file.csv] }
 */

teamsRouter.post('/system/massive-import', isAdmin, csvController.uploadCsv, poster.postMassive);


/**
 * Route to update an existing team
 * * Expected multiform/data: { "name": "value", "myFile": [file.jpg | file.jpeg | file.png], "idEvents": value }
 * idEvents value must be an already existing event id
 */

teamsRouter.put('/:teamId', isAdmin, imgController.uploadImg, updater.update);



/**
 * Route to delete an existing team by a specific id, passed as a request param
 * * Request params:
 * @param teamId: the id of the team to delete
 */

teamsRouter.delete('/:teamId', isAdmin, deleter.destroy);



module.exports = teamsRouter;