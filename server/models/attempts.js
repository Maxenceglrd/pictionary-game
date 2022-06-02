'use strict';
module.exports = (sequelize, DataTypes) => {
  const Attempts = sequelize.define('Attempts', {
    id: {
      allowNull: false,
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    word: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    roomId: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {});
  Attempts.associate = function(models) {
    // associations can be defined here
  };
  return Attempts;
};