const router = require('express').Router();
const { find } = require('../../controllers/squad/finder');
const { poster } = require('../../controllers/squad/poster');
const { deleter } = require('../../controllers/squad/deleter');

router.get('/players', find);

router.post('/player', poster);

router.delete('/player/:playerId', deleter);


module.exports = router;