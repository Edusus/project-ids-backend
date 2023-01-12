const { Op, User, DiaryStatus  } = require('../../databases/db');
const responses = require('../../utils/responses/responses');
const moment = require('moment');

const getDiary = async (req, res) => { 
    const userId = req.user.id.id;
    let date = Date.now();
    let timeNow = moment(new Date(date)).format('YYYY-MM-DD');
    const diary = await DiaryStatus.findOne({
        raw: true,
        where: {
            userId: req.user.id.id,
            createdAt: {
                [Op.gte]: timeNow
            }
        }
    })

    if ( (diary === null) || (diary === undefined) || (diary.length === 0) ) {
        await DiaryStatus.create({
            isAvailable: true,
            userId: userId
        });
       return responses.successDTOResponse(res, 200,"Esta disponible tu cromo diario");
    } else {
        if (diary.isAvailable === 1) {
            return responses.successDTOResponse(res, 200,"Esta disponible tu cromo diario");
        } else {
            return responses.errorDTOResponse(res, 200, "No esta disponible tu cromo diario");
        }
    }
}

module.exports = { getDiary }
