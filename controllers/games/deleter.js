const { Game } = require('../../databases/db');
const responses = require('../../utils/responses/responses');

const destroy = async (req, res) => {
  const gameId = req.params.gameId;
  try {
    if (!await Game.findByPk(gameId)) 
      return responses.errorDTOResponse(res, 404, 'Partido no encontrado');

    await Game.destroy({
      where: {
        id: gameId
      }
    });
 
    return responses.successDTOResponse(res, 200, 'Partido eliminado con exito');
  } catch(error) {
    console.log(error);
    return responses.errorDTOResponse(res, 400, error.message);
  }
}

const deleter = {
  destroy
}

module.exports = deleter;
