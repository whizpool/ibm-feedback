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
			Widget.hasMany(models.widget_question, { foreignKey: 'widget_id' ,tragetKey:"id"});
			Widget.hasMany(models.widget_connection, { foreignKey: 'widget_id' ,tragetKey:"id"});
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
		type: {
      type: Sequelize.STRING,
      allowNull: false
	  },
		rating_option: {
      type: Sequelize.STRING,
      allowNull: true
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