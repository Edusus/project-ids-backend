const { Op, User, DiaryStatus  } = require('../../databases/db');
const responses = require('../../utils/responses/responses');

const getDiary = async (req, res) => { 
    const userId = req.user.id.id;
    const day = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate();
    const diary = await DiaryStatus.findAll({
        where: {
            userId: req.user.id.id,
            createdAt: {
                [Op.gte]: day
            }
        }
    })
    console.log(day)
}

module.exports = {
    getDiary
}