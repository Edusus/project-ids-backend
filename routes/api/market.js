const router = require('express').Router();
const { poster } = require('../../controllers/market/poster');
const { Market } = require('../../databases/db');

router.get('/actives', async(req,res)=>{
    const marketActives= await Market.findAll({where:{ "isFinished":false}});
    if (marketActives==''){
        res.json({error: 'No hay ninguna subasta en linea'});
    }else{
        res.status(200).json({
            success: true,
            items : marketActives
        });
    }
});

router.post('/add', poster);

module.exports = router;
