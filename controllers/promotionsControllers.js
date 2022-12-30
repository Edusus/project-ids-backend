const finder = require('./promotions/finder');
const poster = require('./promotions/poster');
const updater = require('./promotions/updater');
const deleter = require('./promotions/deleter');

module.exports = {
  finder, poster, updater, deleter
}