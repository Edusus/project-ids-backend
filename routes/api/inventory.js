const router= require('express').Router();

const { inventory, Sticker, team, Op, Event}= require('../../databases/db');

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

router.post('/public-events/:eventId/claim-sticker', async (req,res) => {
    try {
     const {stickerId} = req.body;
     const eventId = req.params.eventId;
     const inventorys = await inventory.findOne({
        where: {
            [Op.and]: [{stickerId: stickerId},{eventId: eventId}]
        }
      });
        if (!inventorys) {
            res.status(404).json({success: false, message: 'No posees este sticker en el inventario'});
        } else {
            const contAct = inventorys.dataValues.Quantity
            const notSticker = inventorys.dataValues.isInAlbum
            if (contAct > 0 && notSticker == false) {
                const cont = contAct - 1;
                await inventory.update({
                    isInAlbum : true,
                    Quantity: cont
                }, {
                    where: {
                        [Op.and]: [{stickerId: stickerId},{eventId: eventId}]
                    }
                });
                res.status(200).json({success: true, message: 'Sticker pegado con exito'});
            } else {
                 if (notSticker == true) {
                    res.status(409).json({success: false, message: 'Ya tienes ese sticker pegado en el inventario'});
                 } else {
                   res.status(404).json({success: false, message: 'No posees ese sticker en el inventario'});
                 }
              }  
            }

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

router.get('/public-events/:eventId/album', async (req,res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findOne({
        where: {
            id: eventId
        }
    });
     if (!event) {
        res.status(404).json({success: false, message: 'Evento no encontrado'});
     } else {
        const {count: count2} = await Sticker.findAndCountAll();
        const {count} = await inventory.findAndCountAll({
            where: {
                [Op.and]: [{eventId: eventId},{isInAlbum: true}]
            }
        });        
       const progress = (count/count2)*100;
        
        res.status(200).json({
            success: true,
            event: {
                name: event.dataValues.eventName
            },
            totalStickers: count2,
            claimedStickers: count,
            actualProgressPercertage : progress 
        });
     }

  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});


module.exports = router;