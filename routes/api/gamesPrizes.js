const { Router } = require('express');
const prizeAwarder = require('../../controllers/prizeAwarder/prizeAwarder');
const responses = require('../../utils/responses/responses');

const router = Router();

router.get('/', async (req, res) => {
  await prizeAwarder.award();
  responses.successDTOResponse(res, 200, 'Se ha recompensado a los usuarios con exito');
});

module.exports = router;