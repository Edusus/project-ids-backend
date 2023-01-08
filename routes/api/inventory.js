const router = require('express').Router();

const {
    Inventory,
    Sticker,
    Team,
    Op,
    Event,
    Warehouse
} = require('../../databases/db');

router.get('/public-events/:eventId', async (req, res) => {
    try {
        let existe = await Inventory.findOne({
            where: {
                eventId: req.params.eventId
            }
        });
        if (!existe) {
            res.status(404).json({
                success: false,
                message: 'evento no encontrado'
            });
        } else {
            const {eventId} = req.params;
            let {page = 0, size = 10, teamName = '.*', playerName = '.*' } = req.query;
            const [pageAsNumber, sizeAsNumber] = [Number.parseInt(page), Number.parseInt(size)];
            if (teamName != '.*') {
                const teams = await team.findOne({
                    where: {
                        name: {
                            [Op.regexp]: teamName
                        }
                    }
                })
                if (!teams) {
                    res.status(404).json({
                        success: false,
                        message: 'equipo no encontrado'
                    });
                } else {
                    if ((playerName != '.*') && (teams)) {
                        const player = await Sticker.findOne({
                            where: {
                                [Op.and]: [{
                                    teamId: teams.dataValues.id
                                }, {
                                    playerName: playerName
                                }]
                            }
                        })
                        if (player) {
                            let options = {
                                limit: sizeAsNumber,
                                offset: pageAsNumber * sizeAsNumber,
                                include: {
                                    model: Sticker,
                                    include: {
                                        model: Team
                                    }
                                },
                                where: {
                                    [Op.and]: [{
                                        stickerId: player.dataValues.id
                                    }, {
                                        eventId: eventId
                                    }, {
                                        userId: req.user.id.id
                                    }]
                                }
                            };
    
                            let obtein = await Inventory.findOne({
                                where: {
                                    [Op.and]: [{
                                        stickerId: player.dataValues.id
                                    }, {
                                        userId: req.user.id.id
                                    }]
                                }
                            });
                            if (!obtein) {
                                res.status(404).json({
                                    success: false,
                                    message: 'No posees a este jugador'
                                });
                            } else {
                                const {
                                    count
                                } = await Inventory.findAndCountAll({where:{userId: req.user.id.id}});
                                const {
                                    rows
                                } = await Inventory.findAndCountAll(options);
                                const cantPages = Math.ceil(count/sizeAsNumber);
                                res.status(200).json({
                                    success: true,
                                    paginate: {
                                        total: count,
                                        page: pageAsNumber,
                                        pages: cantPages,
                                        perPage: sizeAsNumber
                                    },
                                    items: rows
                                });
                            }
                        } else {
                            res.status(404).json({
                                success: false,
                                message: "El jugador que busca no existe"
                            });
                        }
                    } else {
                        let options = {
                            limit: sizeAsNumber,
                            offset: pageAsNumber * sizeAsNumber,
                            include: {
                                model: Sticker,
                                where: {
                                    teamId: teams.dataValues.id
                                },
                                include: {
                                    model: Team
                                }
                            },
                            where: {
                                [Op.and]: [{
                                    eventId: eventId
                                }, {
                                    userId: req.user.id.id
                                }]
                            }
                        };
                        let obtein = await inventory.findOne({
                            include: {
                                model: Sticker,
                                where: {
                                    teamId: teams.dataValues.id
                                }
                            },
                            where: {
                                userId: req.user.id.id
                            }
                        });
                        if (!obtein) {
                            res.status(404).json({
                                success: false,
                                message: 'No posees stickers de este equipo'
                            });
                        } else {
                            const {
                                count
                            } = await Inventory.findAndCountAll({where:{userId: req.user.id.id}});
                            const {
                                rows
                            } = await Inventory.findAndCountAll(options);
                            const cantPages = Math.ceil(count/sizeAsNumber);
                            res.status(200).json({
                                success: true,
                                paginate: {
                                    total: count,
                                    page: pageAsNumber,
                                    pages: cantPages,
                                    perPage: sizeAsNumber
                                },
                                items: rows
                            });
                        }
                    }
                }
            } else {
                if (playerName != '.*') {
                    const player = await Sticker.findOne({
                        where: {
                            playerName: playerName
                        }
                    })
                        if (!player) {
                            res.status(404).json({
                                success: false,
                                message: 'jugador no encontrado'
                            });
                        } else {
                            let options = {
                                limit: sizeAsNumber,
                                offset: pageAsNumber * sizeAsNumber,
                                include: {
                                    model: Sticker,
                                    include: {
                                        model: Team
                                    }
                                },
                                     where: {
                                       [Op.and]: [{userId: req.user.id.id},{stickerId: player.dataValues.id}, {eventId: eventId}]
                                     }
                                 }
                            const {count} = await Inventory.findAndCountAll({where:{userId: req.user.id.id}});
                            const {rows} = await Inventory.findAndCountAll(options);
                            const cantPages = Math.ceil(count/sizeAsNumber);
                            res.status(200).json({
                                success: true,
                                paginate: {
                                    total: count,
                                    page: pageAsNumber,
                                    pages: cantPages,
                                    perPage: sizeAsNumber
                                },
                                items: rows
                            });
                        }
                } else {
                    let options = {
                        limit: sizeAsNumber,
                        offset: pageAsNumber * sizeAsNumber,
                        include: {
                            model: Sticker,
                            include: {
                                model: Team
                            }
                        },
                        where: {
                            [Op.and]: [{
                                eventId: eventId
                            }, {
                                userId: req.user.id.id
                            }]
                        }
                    };
                    const {
                        count
                    } = await Inventory.findAndCountAll({where:{userId: req.user.id.id}});
                    const {
                        rows
                    } = await Inventory.findAndCountAll(options);
                    const cantPages = Math.ceil(count/sizeAsNumber);
                    res.status(200).json({
                        success: true,
                        paginate: {
                            total: count,
                            page: pageAsNumber,
                            pages: cantPages,
                            perPage: sizeAsNumber
                        },
                        items: rows
                    });
                }
            }
        }
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);

    }
});

router.get('/public-events/:eventId/', async (req,res) => {
    try {
        const eventId = req.params.eventId;
        let {isAlbum = false} = req.query;
        const event = await Event.findOne({
            where: {
                id: eventId
            }
        });
        if (!event) {
            res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        } else {
            let options = {
                include: {
                    model: Sticker,
                    include: {
                        model: Team
                    },
                },
                where: {
                    [Op.and]: [{
                        eventId: eventId
                    }, {
                        userId: req.user.id.id
                    }, {
                        isInAlbum : isAlbum
                    }]
                }
            };
            const {count} = await Inventory.findAndCountAll({where:{userId: req.user.id.id}});
            const {rows} = await Inventory.findAndCountAll(options);
            res.status(200).json({
                success: true,
                total : count,
                items: rows
            });
        }
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});

router.get('/public-events/:eventId/carousel', async (req,res) => {
    try {
        const eventId = req.params.eventId;
        let {isAlbum = false} = req.query;
        const event = await Event.findOne({
            where: {
                id: eventId
            }
        });
        if (!event) {
            res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        } else {
            let options = {
                include: {
                    model: Sticker,
                    include: {
                        model: Team
                    },
                },
                where: {
                    [Op.and]: [{
                        eventId: eventId
                    }, {
                        userId: req.user.id.id
                    }, {
                        isInAlbum : isAlbum
                    }]
                }
            };
            const {count} = await Inventory.findAndCountAll({where:{userId: req.user.id.id}});
            const {rows} = await Inventory.findAndCountAll(options);
            res.status(200).json({
                success: true,
                total : count,
                items: rows
            });
        }
    } catch (err) {
        console.error(err);
        res.status(400).send(err.message);
    }
});


router.post('/public-events/:eventId/claim-sticker', async (req, res) => {
    try {
        const {
            stickerId
        } = req.body;
        const eventId = req.params.eventId; 
        const inventorys = await Inventory.findOne({
            where: {
                [Op.and]: [{
                    stickerId: stickerId
                }, {
                    eventId: eventId
                },{
                    userId: req.user.id.id
                }]
            }
        });
        if (!inventorys) {
            res.status(404).json({
                success: false,
                message: 'No posees este sticker en el inventario'
            });
        } else {
            const contAct = inventorys.dataValues.Quantity
            const notSticker = inventorys.dataValues.isInAlbum
            if (contAct > 0 && notSticker == false) {
                const cont = contAct - 1;
                await Inventory.update({
                    isInAlbum: true,
                    Quantity: cont
                }, {
                    where: {
                        [Op.and]: [{
                            stickerId: stickerId
                        }, {
                            eventId: eventId
                        },{
                            userId: req.user.id.id
                        }]
                    }
                });

                await Warehouse.findOne({
                    where: {
                       [Op.and]: [{stickerId: stickerId},{eventId : eventId},{userId: req.user.id.id}]
                    }
                  }).then(async warehouse => {
                     if (!warehouse) {
                       await Warehouse.create({
                           isInLineup: false,
                           userId: req.user.id.id,
                           stickerId: stickerId,
                           eventId: eventId
                       });
                     }
               });  

                res.status(200).json({
                    success: true,
                    message: 'Sticker pegado con exito'
                });
            } else {
                if (notSticker == true) {
                    res.status(409).json({
                        success: false,
                        message: 'Ya tienes ese sticker pegado en el inventario'
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'No posees ese sticker en el inventario'
                    });
                }
            }
        }

    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

router.get('/public-events/:eventId/album', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findOne({
            where: {
                id: eventId
            }
        });
        if (!event) {
            res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        } else {
            const {
                count: count2
            } = await Sticker.findAndCountAll();
            const {
                count
            } = await Inventory.findAndCountAll({
                where: {
                    [Op.and]: [{
                        eventId: eventId
                    }, {
                        isInAlbum: true
                    }, {
                        userId: req.user.id.id
                    }]
                }
            });
            const progress = (count / count2) * 100;

            res.status(200).json({
                success: true,
                event: {
                    name: event.dataValues.eventName
                },
                totalStickers: count2,
                claimedStickers: count,
                actualProgressPercentage: progress
            });
        }

    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

router.get('/public-events/:eventId/album/:teamId', async (req, res) => {
    try {
        const {
            eventId,
            teamId
        } = req.params;
        const event = await Event.findOne({
            where: {
                id: eventId
            }
        });
        if (!event) {
            res.status(404).json({
                success: false,
                message: 'Evento no encontrado'
            });
        } else {
            const teams = await Team.findOne({
                include: {
                    model: Sticker,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'appearanceRate']
                    },
                    include: {
                        model: Team,
                        attributes: {
                            exclude: ['createdAt', 'updatedAt', 'name', 'id','idEvents']
                        }
                    }
                },
                where: {
                    [Op.and]: [{
                        idEvents: eventId
                    }, {
                        id: teamId
                    }]
                }
            });
            if (!teams) {
                res.status(404).json({
                    success: false,
                    message: 'Equipo no encontrado'
                });
            } else {
                 const stickers = teams.dataValues.stickers
                 const stickersAlbum = stickers.map(async function(element) {
                     const inventorys = await Inventory.findOne({
                            where: {
                                [Op.and]: [{
                                    stickerId: element.dataValues.id
                                },
                                {
                                    userId: req.user.id.id
                                }]
                            }
                        });
                        if (!inventorys) {
                            element.dataValues.isAttached = false;
                        } else {
                            if (inventorys.dataValues.isInAlbum == true) {
                                element.dataValues.isAttached = true;
                            } else {
                                element.dataValues.isAttached = false;
                            } 
                        }
                    return element;
                 });
                    const stickersAlbum2 = await Promise.all(stickersAlbum);
                    res.status(200).json({
                        success: true,
                    item: {
                        album: {
                            currentTeam: {  
                                id: teams.dataValues.id,
                                name: teams.dataValues.name
                            }
                        },
                       stickers: stickersAlbum2
                    }
                });
            }

        }

    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }

});

module.exports = router;