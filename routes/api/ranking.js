const router= require('express').Router();
const  responses =require('../../utils/responses/responses');
const { User, PlayerFantasy } = require('../../databases/db');

router.get('/', async (req,res)=>{
    const { page = 0, size = 10 } = req.query;

    let options = {
        limit: +size,
        offset: (+page) * (+size),
        raw:true,
        order: [
            ['points', 'DESC']
        ],
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'id','eventId','money']
        },
        where: { 
            eventId:req.params.eventId 
        },
        include : {
            model: User,
            attributes: ['name']
        }
    };

    const { count, rows } = await PlayerFantasy.findAndCountAll(options);
    return responses.paginatedDTOsResponse(res, 200, 'Ranking global', rows, count, page, size);
});

module.exports = router;