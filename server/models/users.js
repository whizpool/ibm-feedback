'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
			//Activity.belongsTo(models.categories, { foreignKey: 'category_id' });
    }
  };
  User.init({
	  id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
	  },
	  name: {
        type: Sequelize.STRING,
				allowNull: false
	  },
		email: {
        type: Sequelize.STRING,
				allowNull: false
	  },		
	  role: {
        type: Sequelize.STRING,
        allowNull: false
	  },
	api_key: {
        type: Sequelize.STRING,
        allowNull: false
	  },
	account_id: {
        type: Sequelize.STRING,
        allowNull: false
	  },
		status: {
        type: Sequelize.ENUM('invited', 'accepted'),
        defaultValue: 'invited'
      },
		}, {
    sequelize,
    modelName: 'user',
  });
  return User;
};