const { Op } = require('sequelize');
const { Warehouse, Sticker, team } = require('../../databases/db');
const responses = require('../../utils/responses/responses');

const poster = async (req, res) => {
    try {
        const userId = req.user.id.id;
        const eventId = req.eventId;
        const { playerId } = req.body;
        

        const warehouse = await Warehouse.findOne({
            raw: true,
            where: {
                [Op.and]: [{
                    stickerId: playerId
                }, {
                    eventId: eventId
                },{
                    userId: userId
                }]
            }
        });
        if (!warehouse) {
            responses.errorDTOResponse(res, 404, 'No posees este Sticker')
        } else {
            const isInLineup = warehouse.isInLineup;
            if (isInLineup) {
                responses.errorDTOResponse(res, 403, 'Este sticker ya esta en la alineacion')
            } else {
                const cont = await Warehouse.count({
                    where: {
                        [Op.and]: [{
                            userId: userId
                        }, {
                            eventId: eventId
                        }, {
                            isInLineup: true
                        }]
                    }
                })

                

                if (cont >= 11) {
                    responses.errorDTOResponse(res, 403, 'Ya tienes 11 stickers en la alineacion')
                } else {
                        const updatedWarehouse = await Warehouse.update({
                            isInLineup: true
                        }, {
                            where: {
                                [Op.and]: [{
                                    stickerId: playerId
                                }, {
                                    eventId: eventId
                                },{
                                    userId: userId
                                }]
                            }
                        });

                        const goalkeeper = await Warehouse.count({
                            where: {
                                [Op.and]: [{
                                    userId: userId
                                }, {
                                    eventId: eventId
                                }, {
                                    isInLineup: true
                                }]
                            },
                            include : {
                                model: Sticker,
                                where: {
                                    position: 'arquero'
                                }
                            }
                        });

                        const defender = await Warehouse.count({
                            where: {
                                [Op.and]: [{
                                    userId: userId
                                }, {
                                    eventId: eventId
                                }, {
                                    isInLineup: true
                                }]
                            },
                            include : {
                                model: Sticker,
                                where: {
                                    position: 'arquero'
                                }
                            }
                        });

                        const midfielder = await Warehouse.count({
                            where: {
                                [Op.and]: [{
                                    userId: userId
                                }, {
                                    eventId: eventId
                                }, {
                                    isInLineup: true
                                }]
                            },
                            include : {
                                model: Sticker,
                                where: {
                                    position: 'medio campo'
                                }
                            }
                        });

                        const forward = await Warehouse.count({
                            where: {
                                [Op.and]: [{
                                    userId: userId
                                }, {
                                    eventId: eventId
                                }, {
                                    isInLineup: true
                                }]
                            },
                            include : {
                                model: Sticker,
                                where: {
                                    position: 'delantero'
                                }
                            }
                        });


                         if (goalkeeper > 1) {
                            await Warehouse.update({
                                isInLineup: false
                            }, {
                                where: {
                                    [Op.and]: [{
                                        stickerId: playerId
                                    }, {
                                        eventId: eventId
                                    },{
                                        userId: userId
                                    }]
                                }
                            });
                            responses.errorDTOResponse(res, 403, 'Ya tienes un arquero en la alineacion')
                         } else if (defender > 4) {
                            await Warehouse.update({
                                isInLineup: false
                            }, {
                                where: {
                                    [Op.and]: [{
                                        stickerId: playerId
                                    }, {
                                        eventId: eventId
                                    },{
                                        userId: userId
                                    }]
                                }
                            });
                            responses.errorDTOResponse(res, 403, 'Ya tienes 4 defensas en la alineacion')
                         } else if (midfielder > 3) {
                            await Warehouse.update({
                                isInLineup: false
                            }, {
                                where: {
                                    [Op.and]: [{
                                        stickerId: playerId
                                    }, {
                                        eventId: eventId
                                    },{
                                        userId: userId
                                    }]
                                }
                            });
                            responses.errorDTOResponse(res, 403, 'Ya tienes 3 medio campo en la alineacion')
                         } else if (forward > 3) {
                            await Warehouse.update({
                                isInLineup: false
                            }, {
                                where: {
                                    [Op.and]: [{
                                        stickerId: playerId
                                    }, {
                                        eventId: eventId
                                    },{
                                        userId: userId
                                    }]
                                }
                            });
                            responses.errorDTOResponse(res, 403, 'Ya tienes 3 delantero en la alineacion')
                         } else {
                            responses.successDTOResponse(res, 200, 'Sticker agregado a la alineacion')  
                         }

                    }   
            }
        }
    } catch (error) {
        console.error(error);
        responses.errorDTOResponse(res, 403, error.message);
    }
}

module.exports = {
    poster
};