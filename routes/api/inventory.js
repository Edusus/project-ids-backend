const router= require('express').Router();

const { inventory, Sticker, User }= require('../../databases/db');

router.get('/public-events', async (req,res)=>{
    try {
     const inventorys = await inventory.findAll({
        include: [
         {
            model: User,
            attributes: ['name', 'role', 'email', 'createdAt', "updatedAt"]
         },
         {
            model: Sticker
         }
     ]   
     });
      res.status(200).json(inventorys);  
    } catch(error) {
        console.error(error);
        res.status(400).send(error.message);
      }
});

router.post('/public-events', async (req,res)=>{
    try{
        const {isInAlbum, quantity, userId, stickerId} = req.body;
        const inventorys = await inventory.create({
            isInAlbum: isInAlbum,
            Quantity: quantity,
            userId: userId,
            stickerId: stickerId
        });
        res.status(200).json(inventorys);
    } catch(error) {
       console.log(error);
       res.status(400).json({succese: false, message: error});
    }
});

module.exports = router;