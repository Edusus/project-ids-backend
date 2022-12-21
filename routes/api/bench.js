const router = require('express').Router();
const { finder } = require('../../controllers/benchesControllers');

router.get('/', finder.find);

router.post('/', );

router.delete('/:playerId', );

module.exports = router;