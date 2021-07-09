'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
			Question.hasMany(models.widget_question, { foreignKey: 'question_id' ,tragetKey:'id'});
    }
  };
  Question.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    // name of the field for identification.
    name: { 
      type: Sequelize.STRING,
      allowNull: false
    },
    //place holer or display_text
    display_text: { 
      type: Sequelize.STRING,
      allowNull: true
    },	
    //Display tooltip if null than no tooltip will be displayed
    tooltip: {
      type: Sequelize.STRING,
      allowNull: true
    },	
    //Type of the field like InputBox , Textarea, Select or Checkbox	
    type: {
      type: Sequelize.ENUM('string', 'singleline','multiline','number','select','choice'),
      defaultValue: 'singleline' 
    },
		//Type of the widget like feedback or rating
    widget_type: {
      type: Sequelize.ENUM('feedback', 'rating'),
      defaultValue: 'feedback' 
    },		
		//Editable or not in the backend 
    is_editable: {
			 type: Sequelize.BOOLEAN,
			defaultValue: true
    },
		//this key is used if we need to search question based on the form keys 
    form_key: {
			type: Sequelize.STRING,
      allowNull: true
    },
    // 0 value means no limit apply for the field
    limit:{
      type: Sequelize.INTEGER,
      defaultValue: 0 
    }
  }, {
    sequelize,
    modelName: 'question',
  });
  return Question;
};