const router = require('express').Router();
const { finder, poster, deleter } = require('../../controllers/gamesControllers');
const { csvController } = require('../../controllers/filesControllers');

/*
const games = [
    {
				id: 1,
        teamOneId: 10, // Arg
        teamTwoId: 12, // Vnlz
        matchedAt: "2022-11-27T03:30:40.000Z",
        updatedAt: "2022-11-27T03:30:40.000Z",
        createdAt: "2022-11-27T03:30:40.000Z"
    },
    {
        id: 2,
        teamOneId: 7,
        teamTwoId: 62,
        matchedAt: "2022-11-27T03:30:40.000Z",
        updatedAt: "2022-11-27T03:30:40.000Z",
        createdAt: "2022-11-27T03:30:40.000Z"
    }
];

const cromos = [
    {
        id: 5,
        fullName: "John Arzolay",
        teamId: 10,
    },
    {
        id: 7,
        fullName: "John Cena",
        teamId: 10,
    },
    {
        id: 10,
        fullName: "John Freitas",
        teamId: 12,
    }
];

const playersGames = [
    {
        id: 1,
        playerId: 5,
        gameId: 1,
        points: 105
    },
    {
        id: 1,
        playerId: 7,
        gameId: 1,
        points: 200
    },
    {
        id: 1,
        playerId: 10,
        gameId: 1,
        points: -50
    },
];
*/

const gamesFormmated = [
    {
        id: 1,
        teamOne: {
            id: 10,
            name: "Argentina",
            img: "https://picsum.photos/150/75",
        },
        teamTwo: {
            id: 12,
            name: "Venezuela",
            img: "https://picsum.photos/150/75",
        },
        matchedAt: "2022-11-27T03:30:40.000Z",
        updatedAt: "2022-11-27T03:30:40.000Z",
        createdAt: "2022-11-27T03:30:40.000Z",
        players: [
            {
                playerId: 5,
                points: 105,
                fullName: "John Arzolay",
                teamId: 10
            },
            {
                playerId: 7,
                points: 200,
                fullName: "John Cena",
                teamId: 10
            },
            {
                playerId: 10,
                points: -50,
                fullName: "John Freitas",
                teamId: 12
            }
        ]
    }
];

router.get('/', finder.find);

router.get('/all', finder.findAll);

router.get('/:gameId', finder.findById);

router.post('/', csvController.uploadCsv, poster.post);

router.put('/:gameId', csvController.uploadCsv, async (req, res) => {
    if (!req.body.matchedAt) {
        return res.status(400).json({
            "success": false,
            "message": "No se ha enviado fecha de celebracion del partido."
        });
    }

    if (!req.body.teamOneId || !req.body.teamTwoId) {
        return res.status(400).json({
            "success": false,
            "message": "No se ha enviado ID de uno de los equipos del partido."
        });
    }

    if (typeof +req.body.teamTwoId !== 'number' || typeof +req.body.teamTwoId !== 'number') {
        return res.status(400).json({
            "success": false,
            "message": "El tipo de dato de uno de los equipos no es un numero."
        });
    }

    return res.status(200).json({
      "success": true,
      "message": "Partido editado con exito :)",
      "game": gamesFormmated[0],
    });
});

router.delete('/:gameId', deleter.destroy);

module.exports = router;
