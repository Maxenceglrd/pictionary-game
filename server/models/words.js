'use strict';
module.exports = (sequelize, DataTypes) => {
  const Words = sequelize.define('Words', {
    id: {
    	allowNull: false,
      	autoIncrement: true,
      	type :DataTypes.INTEGER,
      	primaryKey: true
    },
    value: DataTypes.STRING
  }, {});
  Words.associate = function(models) {
    // associations can be defined here
  };
  return Words;
};