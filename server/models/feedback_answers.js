'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class FeedBackAnswer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
			FeedBackAnswer.belongsTo(models.feedback, { foreignKey: 'feedback_id' });
			//FeedBackAnswer.belongsTo(models.widget_question_option, { foreignKey: 'widget_question_id', targetKey: 'id' });
			FeedBackAnswer.belongsTo(models.widget_question, {foreignKey: 'widget_question_id'});
    }
  };
  FeedBackAnswer.init({
	  id: {
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
	  },
	  feedback_id: {
        type: Sequelize.INTEGER,
				allowNull: false
	  },		
	  widget_question_id: {
        type: Sequelize.INTEGER,
        allowNull: false
	  },
	  answer: {
        type: Sequelize.STRING,
        allowNull: false
	  },
  }, {
    sequelize,
    modelName: 'feedback_answer',
  });
  return FeedBackAnswer;
};