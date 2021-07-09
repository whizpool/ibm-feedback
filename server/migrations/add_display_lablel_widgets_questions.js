module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('widget_questions', 'display_lablel', {
          type: Sequelize.DataTypes.Boolean
        }, { transaction: t })
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('widget_questions', 'display_lablel', { transaction: t }),
      ]);
    });
  }
};