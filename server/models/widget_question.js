'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class WidgetQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //define association here
			WidgetQuestion.belongsTo(models.widget, { targetKey:'id', foreignKey: 'widget_id' });
			WidgetQuestion.belongsTo(models.question, { foreignKey: 'question_id' });
    }
  };
  WidgetQuestion.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    widget_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },	
    question_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },	
    //Order of display fiel in the widget
    order: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    //Label for the widget field.
    display_text: {
      type: Sequelize.STRING,
      allowNull: false
    },
    is_required: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },
    //is_active mean show this feild or not in the widget
    is_active: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    },	
    // 0 value means no limit apply for the field	
    limit:{
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    //Null or 0 mean no Options for this field
    option_id:{
      type: Sequelize.INTEGER,
      allowNull: true
    }	,		
		//Null or 0 mean no Options for this field
    display_label:{
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }			
  }, {
    sequelize,
    modelName: 'widget_question',
  });
  return WidgetQuestion;
};