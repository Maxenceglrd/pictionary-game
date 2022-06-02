'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      maxPlayers: {
        type: Sequelize.INTEGER
      },
      currentPlayers: {
        type: Sequelize.INTEGER
      },
      privateRoom: {
        type: Sequelize.BOOLEAN
      },
      creator: {
        type: Sequelize.INTEGER
      },
      nbGame: {
        type: Sequelize.INTEGER
      },
      
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Rooms');
  }
};