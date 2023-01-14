const { Router } = require('express');
const prizeAwarder = require('../../controllers/prizeAwarder/prizeAwarder');
const responses = require('../../utils/responses/responses');

const router = Router();

router.get('/', async (req, res) => {
  try {
    await prizeAwarder.award();
    return responses.successDTOResponse(res, 200, 'Se ha recompensado a los usuarios con exito');
  } catch(error) {
    return responses.errorDTOResponse(res, 500, 'Sucedio un error durante la reparticion de recompensas');
  }
});

module.exports = router;