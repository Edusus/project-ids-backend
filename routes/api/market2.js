const { Router } = require('express');
const responses = require('../../utils/responses/responses');

const marketRouter = Router();

const market = [
  {
    id: 1,
    immediatePurchaseValue: 100,
    initialPurchaseValue: 20,
    auctioneer: {
      id: 1,
      name: 'Daikone'
    },
    player: {
      id: 10,
      name: 'Leo Messi',
      img: 'https://www.bigmanoo.it/69765-large_default/pop-football-psg-lionel-messi.jpg'
    },
    event: {
      id: 1,
      name: 'Mundial Qatar 2022'
    },
    highestBid: {
      id: 1,
      value: 50,
      buyer: {
        id: 5,
        name: 'Salcedihno'
      }
    }
  },
  {
    id: 2,
    immediatePurchaseValue: 220,
    initialPurchaseValue: 57,
    auctioneer: {
      id: 9,
      name: 'Noratadina'
    },
    player: {
      id: 10,
      name: 'Mbappe',
      img: 'https://pbs.twimg.com/media/EuYSWqUWYAQNSba.png'
    },
    event: {
      id: 1,
      name: 'Mundial Qatar 2022'
    },
    highestBid: {
      id: 317,
      value: 128,
      buyer: {
        id: 87,
        name: 'HectorXD'
      }
    }
  },
  {
    id: 3,
    immediatePurchaseValue: 1000,
    initialPurchaseValue: 132,
    auctioneer: {
      id: 5,
      name: 'MaMen'
    },
    player: {
      id: 33,
      name: 'Lewandowski',
      img: 'https://i.pinimg.com/originals/b6/58/1b/b6581b6f2e26d6bf4adb012048f974fb.png'
    },
    event: {
      id: 3,
      name: 'LaLiga 2022'
    },
    highestBid: {
      id: 12,
      value: 238,
      buyer: {
        id: 43,
        name: 'wenaimechainasama123'
      }
    }
  }
];

const bid = {
  id: 3,
  value: 200,
  auctionId: 3,
  buyer: {
    id: 44,
    name: 'Senko-San uwu'
  },
};

marketRouter.get('/', async (req, res) => {
  responses.paginatedDTOsResponse(res, 200, 'Subastas recuperadas con exito', market, market.length, 0, market.length);
});

marketRouter.get('/:auctionId', async (req, res) => {
  const auctionId = req.params.auctionId - 1;
  if (auctionId >= market.length || Number.isNaN(auctionId))
    return responses.errorDTOResponse(res, 404, 'Subasta no encontrada');

  const myLastBid = {
    id: 1000,
    value: 30
  }
  const item = structuredClone(market[auctionId]);
  item.myLastBid = myLastBid;

  return responses.singleDTOResponse(res, 200, 'Subasta recuperada con exito', item);
});

marketRouter.post('/auction', async (req, res) => {
  return responses.singleDTOResponse(res, 201, 'Subasta creada con exito', market[2]);
});

marketRouter.post('/bid', async (req, res) => {
  return responses.singleDTOResponse(res, 201, 'Puja creada con exito', bid);
});

marketRouter.put('/bid/:bidId', async (req, res) => {
  bid.value += 10;
  return responses.singleDTOResponse(res, 200, 'Puja actualizada con exito', bid);
});

module.exports = marketRouter;