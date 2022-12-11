const { Router } = require('express');
const { finder, poster, updater, deleter } = require('../../controllers/promotionsControllers');
const { imgController } = require('../../controllers/filesControllers');

const promotionsRouter = Router();

/**
 * Route to get a page of promotions, can be filtered by a regexp of the alias of the announcer
 * and by promotiontype.
 * * Query params:
 * @param page: an integer representing the page to get, default value is 0
 * @param size: an integer representing the size of each page, default value is 10
 * @param alias: a regexp representing the filter to the announcer's alias, default value is .* (any alias)
 * @param promotiontype: a string representing the filter to the promotion's type, can be static or popup,
 * default value is ['static', 'popup'] (any promotion)
 */

promotionsRouter.get('/', finder.find);



/**
 * Route to get all promotions
 */

promotionsRouter.get('/all', finder.findAll);



/**
 * Route to get a promotion by a specific id, passed as a request param
 * * Request params:
 * @param promotionId: the id of the promotion to get from the db
 */

promotionsRouter.get('/:promotionId', finder.findById);



/**
 * Route to post a new promotion
 * * Expected multiform/data: { "alias": "value", "myFile": [file.jpg | file.jpeg | file.png], 
 * * "promotionType": ['static' | 'popup'], "redirecTo": 'url', "description": "value" (can be omitted) }
 */

promotionsRouter.post('/', imgController.uploadImg, poster.post);



/**
 * Route to update an existing promotion by its id, passed as a request param
 * * Request params:
 * @param promotionId: the id of the promotion to update
 * * Expected multiform/data: { "alias": "value", "myFile": [file.jpg | file.jpeg | file.png], 
 * * "promotionType": ['static' | 'popup'], "redirecTo": 'url', "description": "value" (can be omitted) }
 */

promotionsRouter.put('/:promotionId', imgController.uploadImg, updater.update);



/**
 * Route to delete an existing promotion by a specific id, passed as a request param
 * * Request params:
 * @param promotionId: the id of the promotion to delete
 */

promotionsRouter.delete('/:promotionId', deleter.destroy);

module.exports = promotionsRouter;