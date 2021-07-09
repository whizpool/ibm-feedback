module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('feedbacks', 'referral_url', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t })
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('feedbacks', 'referral_url', { transaction: t }),
      ]);
    });
  }
};