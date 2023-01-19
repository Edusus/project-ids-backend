const router = require('express').Router();
const { User, Sticker, Event, Promotion, Team, Game} = require('../../databases/db');
const responses = require('../../utils/responses/responses');

router.get('/countAll', async (req, res) => {
    try {
        let {count} = await User.findAndCountAll();
        let {count: count2} = await Sticker.findAndCountAll();
        let {count: count3} = await Event.findAndCountAll();
        let {count: count4} = await Promotion.findAndCountAll();
        let {count: count5} = await Team.findAndCountAll();
        let {count: count6} = await Game.count();
        let data = {
            User:count,
            Sticker:count2,
            Event:count3,
            Promotion:count4,
            Team:count5,
            Game:count6
        }
        console.log(data);
        return responses.singleDTOResponse(res,200,'Cantidad total', data);  
    } catch (error) {
        return responses.errorDTOResponse(res,500,'Ha ocurrido un problema', error);  
    }
});



module.exports = router