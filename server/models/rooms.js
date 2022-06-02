'use strict';
module.exports = (sequelize, DataTypes) => {
  const Rooms = sequelize.define('Rooms', {
    id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    maxPlayers: DataTypes.INTEGER,
    currentPlayers: DataTypes.INTEGER,
    privateRoom: DataTypes.BOOLEAN,
    creator: DataTypes.INTEGER,
    nbGame: DataTypes.INTEGER,
  }, {});
  Rooms.associate = function(models) {
    // associations can be defined here
  };
  return Rooms;
};