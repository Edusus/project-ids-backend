var DataTypes = require("sequelize").DataTypes;
var _ads = require("./ads");
var _bids = require("./bids");
var _diarystatuses = require("./diarystatuses");
var _events = require("./events");
var _games = require("./games");
var _inventories = require("./inventories");
var _markets = require("./markets");
var _playerfantasies = require("./playerfantasies");
var _playersgames = require("./playersgames");
var _promotions = require("./promotions");
var _sequelizemeta = require("./sequelizemeta");
var _stickers = require("./stickers");
var _teams = require("./teams");
var _users = require("./users");
var _warehouses = require("./warehouses");

function initModels(sequelize) {
  var ads = _ads(sequelize, DataTypes);
  var bids = _bids(sequelize, DataTypes);
  var diarystatuses = _diarystatuses(sequelize, DataTypes);
  var events = _events(sequelize, DataTypes);
  var games = _games(sequelize, DataTypes);
  var inventories = _inventories(sequelize, DataTypes);
  var markets = _markets(sequelize, DataTypes);
  var playerfantasies = _playerfantasies(sequelize, DataTypes);
  var playersgames = _playersgames(sequelize, DataTypes);
  var promotions = _promotions(sequelize, DataTypes);
  var sequelizemeta = _sequelizemeta(sequelize, DataTypes);
  var stickers = _stickers(sequelize, DataTypes);
  var teams = _teams(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);
  var warehouses = _warehouses(sequelize, DataTypes);

  games.belongsTo(events, { as: "event", foreignKey: "eventId"});
  events.hasMany(games, { as: "games", foreignKey: "eventId"});
  inventories.belongsTo(events, { as: "event", foreignKey: "eventId"});
  events.hasMany(inventories, { as: "inventories", foreignKey: "eventId"});
  markets.belongsTo(events, { as: "event", foreignKey: "eventId"});
  events.hasMany(markets, { as: "markets", foreignKey: "eventId"});
  playerfantasies.belongsTo(events, { as: "event", foreignKey: "eventId"});
  events.hasMany(playerfantasies, { as: "playerfantasies", foreignKey: "eventId"});
  teams.belongsTo(events, { as: "idEvents_event", foreignKey: "idEvents"});
  events.hasMany(teams, { as: "teams", foreignKey: "idEvents"});
  warehouses.belongsTo(events, { as: "event", foreignKey: "eventId"});
  events.hasMany(warehouses, { as: "warehouses", foreignKey: "eventId"});
  playersgames.belongsTo(games, { as: "game", foreignKey: "gameId"});
  games.hasMany(playersgames, { as: "playersgames", foreignKey: "gameId"});
  bids.belongsTo(markets, { as: "market", foreignKey: "marketId"});
  markets.hasMany(bids, { as: "bids", foreignKey: "marketId"});
  inventories.belongsTo(stickers, { as: "sticker", foreignKey: "stickerId"});
  stickers.hasMany(inventories, { as: "inventories", foreignKey: "stickerId"});
  markets.belongsTo(stickers, { as: "sticker", foreignKey: "stickerId"});
  stickers.hasMany(markets, { as: "markets", foreignKey: "stickerId"});
  playersgames.belongsTo(stickers, { as: "player", foreignKey: "playerId"});
  stickers.hasMany(playersgames, { as: "playersgames", foreignKey: "playerId"});
  warehouses.belongsTo(stickers, { as: "sticker", foreignKey: "stickerId"});
  stickers.hasMany(warehouses, { as: "warehouses", foreignKey: "stickerId"});
  games.belongsTo(teams, { as: "team", foreignKey: "teamId"});
  teams.hasMany(games, { as: "games", foreignKey: "teamId"});
  games.belongsTo(teams, { as: "teamOne", foreignKey: "teamOneId"});
  teams.hasMany(games, { as: "teamOne_games", foreignKey: "teamOneId"});
  games.belongsTo(teams, { as: "teamTwo", foreignKey: "teamTwoId"});
  teams.hasMany(games, { as: "teamTwo_games", foreignKey: "teamTwoId"});
  stickers.belongsTo(teams, { as: "team", foreignKey: "teamId"});
  teams.hasMany(stickers, { as: "stickers", foreignKey: "teamId"});
  bids.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(bids, { as: "bids", foreignKey: "userId"});
  diarystatuses.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(diarystatuses, { as: "diarystatuses", foreignKey: "userId"});
  inventories.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(inventories, { as: "inventories", foreignKey: "userId"});
  markets.belongsTo(users, { as: "undefined_user", foreignKey: "undefined"});
  users.hasOne(markets, { as: "market", foreignKey: "undefined"});
  markets.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(markets, { as: "user_markets", foreignKey: "userId"});
  playerfantasies.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(playerfantasies, { as: "playerfantasies", foreignKey: "userId"});
  warehouses.belongsTo(users, { as: "user", foreignKey: "userId"});
  users.hasMany(warehouses, { as: "warehouses", foreignKey: "userId"});

  return {
    ads,
    bids,
    diarystatuses,
    events,
    games,
    inventories,
    markets,
    playerfantasies,
    playersgames,
    promotions,
    sequelizemeta,
    stickers,
    teams,
    users,
    warehouses,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
