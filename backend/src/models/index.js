const sequelize = require('../config/database');
const User = require('./User');
const MarketplaceItem = require('./MarketplaceItem');
const Notification = require('./Notification');

// Associations
User.hasMany(MarketplaceItem, { foreignKey: 'ownerId', as: 'items' });
MarketplaceItem.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ClaimedBy association
User.hasMany(MarketplaceItem, { foreignKey: 'claimedById', as: 'claimedItems' });
MarketplaceItem.belongsTo(User, { foreignKey: 'claimedById', as: 'claimedBy' });

module.exports = {
  sequelize,
  User,
  MarketplaceItem,
  Notification,
};
