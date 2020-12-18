'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Widget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
			//Widget.belongsTo(models.widget_connection, { foreignKey: 'widget_id', targetKey:'id' });
    }
  };
  Widget.init({
	  id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
	  },
	  name: {
        type: Sequelize.STRING,
				allowNull: false
	  },		
	  creater_name: {
        type: Sequelize.STRING,
        allowNull: false
	  },
	  url: {
        type: Sequelize.STRING,
        allowNull: false
	  },
	  status: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
	  },
  }, {
    sequelize,
    modelName: 'widget',
  });
  return Widget;
};