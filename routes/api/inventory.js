const router= require('express').Router();

const { inventory, Sticker, team, Op }= require('../../databases/db');

router.get('/public-events/:eventId', async (req,res)=>{
    try { 
         let existe = await inventory.findOne({
              where: {
                eventId: req.params.eventId
              }
            });
               if (!existe)  {
                res.status(404).json({success: false, message: 'evento no encontrado'});   
              } else {
                const {eventId} = req.params;
                let { page = 0, size = 10, teamName = '.*', playerName = '.*' } = req.query;
                const [ pageAsNumber, sizeAsNumber ] = [ Number.parseInt(page), Number.parseInt(size) ];
                 if (teamName != '.*') {
                   const teams = await team.findOne({
                      where: {
                          name: {
                              [Op.regexp]: teamName
                          }
                      }
                   })
                       if (!teams) {
                        res.status(404).json({success: false, message: 'equipo no encontrado'});
                       }
                     if ((playerName != '.*') && (teams)) {
                        const player = await Sticker.findOne({
                          where: {
                             [Op.and]: [{teamId: teams.dataValues.id},{playerName: playerName}]
                          }
                       })
                          if (player) {
                            let options = {
                            limit: sizeAsNumber,
                            offset: pageAsNumber * sizeAsNumber,
                             where: {
                              [Op.and]: [{stickerId: player.dataValues.id},{eventId : eventId}]
                            }
                           };

                             let obtein = await inventory.findOne({
                              where: {
                                stickerId: player.dataValues.id
                              }
                             });
                               if (!obtein) {
                                 res.status(404).json({success: false, message: 'No posees a este jugador'});
                               } else {
                                 const {count} = await inventory.findAndCountAll();
                                 const {rows} = await inventory.findAndCountAll(options);
                                 res.status(200).json({
                                   success: true,
                                   totalStickers: count,
                                   pageNumber: pageAsNumber,
                                   pageSize: sizeAsNumber,
                                   stickers: rows
                                 }); 
                               }
                      } else {
                           res.status(404).json({
                              success: false,
                              message: "El jugador que busca no existe"
                            });
                       }  
                     }
                 } else {
                       let options = {
                       limit: sizeAsNumber,
                       offset: pageAsNumber * sizeAsNumber,
                       where: {
                          eventId : eventId
                      }
                    }    
                  const {count} = await inventory.findAndCountAll();
                  const {rows} = await inventory.findAndCountAll(options);
                  res.status(200).json({
                     success: true,
                     totalStickers: count,
                     pageNumber: pageAsNumber,
                     pageSize: sizeAsNumber,
                     stickers: rows
                   });
                }
          }
     }
    catch (err) {
        console.error(err);
        res.status(400).send(err.message);

    }
});

module.exports = router;