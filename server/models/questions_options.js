'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class QuestionOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  QuestionOption.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    question_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },	
    //Option Label 
    label: {
      type: Sequelize.STRING,
      allowNull: false
    },
    //Option Value 
    value: {
      type: Sequelize.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'question_option',
  });
  return QuestionOption;
};