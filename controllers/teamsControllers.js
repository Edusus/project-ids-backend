const finder = require('./teams/finder');
const poster = require('./teams/poster');
const updater = require('./teams/updater');
const deleter = require('./teams/deleter');

module.exports = { 
  finder, poster, updater, deleter
}