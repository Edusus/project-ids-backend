const router = require('express').Router();
const { finder } = require('../../controllers/benchesControllers');

router.get('/public-events/:eventId/bench', finder.find);


router.delete('/:playerId', );

module.exports = router;