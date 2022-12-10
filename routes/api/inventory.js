const router = require('express').Router();

const {
    inventory,
    Item,
    team,
    Op,
    Event
} = require('../../databases/db');

router.get('/public-events/:eventId', async (req, res) => {
    try {
        let existe = await inventory.findOne({
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
                        const player = await Item.findOne({
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
                                    model: Item,
                                    include: {
                                        model: team
                                    }
                                },
                                where: {
                                    [Op.and]: [{
                                        itemId: player.dataValues.id
                                    }, {
                                        eventId: eventId
                                    }, {
                                        userId: req.user.id.id
                                    }]
                                }
                            };
    
                            let obtein = await inventory.findOne({
                                where: {
                                    [Op.and]: [{
                                        itemId: player.dataValues.id
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
                                } = await inventory.findAndCountAll();
                                const {
                                    rows
                                } = await inventory.findAndCountAll(options);
                                const cantPages = Math.round(count/sizeAsNumber);
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
                                model: Item,
                                where: {
                                    teamId: teams.dataValues.id
                                },
                                include: {
                                    model: team
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
                                model: Item,
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
                                message: 'No posees items de este equipo'
                            });
                        } else {
                            const {
                                count
                            } = await inventory.findAndCountAll();
                            const {
                                rows
                            } = await inventory.findAndCountAll(options);
                            const cantPages = Math.round(count/sizeAsNumber);
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
                    const player = await Item.findOne({
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
                                    model: Item,
                                    include: {
                                        model: team
                                    }
                                },
                                     where: {
                                       [Op.and]: [{userId: req.user.id.id},{itemId: player.dataValues.id}, {eventId: eventId}]
                                     }
                                 }
                            const {count} = await inventory.findAndCountAll();
                            const {rows} = await inventory.findAndCountAll(options);
                            const cantPages = Math.round(count/sizeAsNumber);
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
                            model: Item,
                            include: {
                                model: team
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
                    } = await inventory.findAndCountAll();
                    const {
                        rows
                    } = await inventory.findAndCountAll(options);
                    const cantPages = Math.round(count/sizeAsNumber);
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

router.post('/public-events/:eventId/claim-sticker', async (req, res) => {
    try {
        const {
            itemId
        } = req.body;
        const eventId = req.params.eventId;
        const inventorys = await inventory.findOne({
            where: {
                [Op.and]: [{
                    itemId: itemId
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
            const notItem = inventorys.dataValues.isInAlbum
            if (contAct > 0 && notItem == false) {
                const cont = contAct - 1;
                await inventory.update({
                    isInAlbum: true,
                    Quantity: cont
                }, {
                    where: {
                        [Op.and]: [{
                            itemId: itemId
                        }, {
                            eventId: eventId
                        },{
                            userId: req.user.id.id
                        }]
                    }
                });
                res.status(200).json({
                    success: true,
                    message: 'Item pegado con exito'
                });
            } else {
                if (notItem == true) {
                    res.status(409).json({
                        success: false,
                        message: 'Ya tienes ese item pegado en el inventario'
                    });
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'No posees ese item en el inventario'
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
            } = await Item.findAndCountAll();
            const {
                count
            } = await inventory.findAndCountAll({
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
                totalItems: count2,
                claimedItems: count,
                actualProgressPercertage: progress
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
            const teams = await team.findOne({
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
                const inventorys = await inventory.findAll({
                    include: {
                        model: Item,
                        where: {
                            teamId: teamId
                        }
                    },
                    where: {
                        [Op.and]: [{
                            eventId: eventId
                        }, {
                            isInAlbum: true
                        },{
                            userId: req.user.id.id
                        }]
                    }
                });
                res.status(200).json({
                    success: true,
                    album: {
                        currentTeam: {
                            id: teams.dataValues.id,
                            name: teams.dataValues.name
                        }
                    },
                    item: inventorys
                })
            }

        }

    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }

});

module.exports = router;