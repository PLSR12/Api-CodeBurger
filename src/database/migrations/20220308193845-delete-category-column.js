'use strict';

module.exports = {
  up:async (queryInterface, Sequelize) => {
     await queryInterface.removeColumn('products', 'category')
  },

 down:async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('users');
     
  }
};
