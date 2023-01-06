const schedule = require('node-schedule');
const { Market, Warehouse } = require('../../databases/db');
const responses = require('../../utils/responses/responses');

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

function formatDate(date) {
    return (
      [
        date.getFullYear(),
        padTo2Digits(date.getMonth() + 1),
        padTo2Digits(date.getDate()),
      ].join('-') +
      ' ' +
      [
        padTo2Digits(date.getHours()),
        padTo2Digits(date.getMinutes()),
        padTo2Digits(date.getSeconds()),
      ].join(':')
    );
  }

const poster = async (req, res) => {
    const userId = req.user.id.id;
    const eventId = req.eventId;
    const timeNow = new Date(Date.now());
    const endTime = new Date(timeNow.getTime() + 60000);
    let { initialValue, directPurchase, playerId } = req.body;
    
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
        return responses.errorDTOResponse(res, 404, 'No posees este Sticker')
    }
    const isInLineup = warehouse.isInLineup;
    if (isInLineup) {
        return responses.errorDTOResponse(res, 403, 'Este sticker ya esta en la alineacion')
    }

    if (initialValue == null || directPurchase == null) {
      return responses.errorDTOResponse(res, 400, 'Debe proporcionar un valor inicial y un valor de compra directa');
    }
        const market = await Market.create({
            raw: true,
            initialValue: initialValue,
            directPurchase : directPurchase,
            stickerId: playerId,
            userId : userId,
            eventId : eventId,
            finishDate: formatDate(endTime),
            isFinished: false
        });
        res.status(200).json({
            success: true,
            message: 'Subasta creada con exito',
            item: market
        });
        const job = schedule.scheduleJob({ start: timeNow, end: endTime}, async function(){
            console.log('Subasta finalizada');
            market.isFinished = true;
            await market.update({
                isFinished: true
            });
            schedule.cancelJob(job);
        });
}

module.exports = {
    poster
}