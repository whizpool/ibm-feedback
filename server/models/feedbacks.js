'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class FeedBack extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
			FeedBack.belongsTo(models.widget, { foreignKey: 'widget_id' });
			FeedBack.hasMany(models.feedback_answer, { foreignKey: 'feedback_id' });
    }
  };
  FeedBack.init({
	  id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
	  },
	  widget_id: {
      type: Sequelize.INTEGER,
      allowNull: false
	  },
		screen_shot: {
      type: Sequelize.STRING,
      allowNull: false
	  },
  }, {
    sequelize,
    modelName: 'feedback',
  });
  return FeedBack;
};