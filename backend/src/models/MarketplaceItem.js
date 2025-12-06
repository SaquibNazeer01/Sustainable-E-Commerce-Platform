const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MarketplaceItem = sequelize.define('MarketplaceItem', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  type: {
    type: DataTypes.ENUM('packaging', 'household', 'electronics'),
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  item_condition: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('available', 'claimed'),
    defaultValue: 'available',
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  claimedById: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  claimedContact: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = MarketplaceItem;
