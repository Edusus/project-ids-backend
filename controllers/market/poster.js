const schedule = require('node-schedule');
const { Market } = require('../../databases/db');

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
    
    if (initialValue == null || directPurchase == null) {
        res.status(400).json({
            success: false,
            message: 'Error: Debe proporcionar un valor inicial y un valor de compra directa'
        });
    } else {
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
        const job = schedule.scheduleJob({ start: timeNow, end: endTime}, function(){
            console.log('Subasta finalizada');
            market.isFinished = true;
            schedule.cancelJob(job);
        });
    }

   
}

module.exports = {
    poster
}