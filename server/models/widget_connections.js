	'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, Sequelize) => {
  class WidgetConnection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //define association here
			WidgetConnection.belongsTo(models.widget, { foreignKey: 'id',tragetKey:"widget_id" });
    }
  };
  WidgetConnection.init({
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    widget_id: {
      type: Sequelize.INTEGER,
      allowNull: false
    },	
    //Github API URL
    github_api_url: {
      type: Sequelize.STRING,
      allowNull: true
    },
    //is Github connected
    is_github_connected: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    //Github Personal Access Token
    personal_access_token: {
      type: Sequelize.STRING,
      allowNull: true
    },
    //API Response Data
    github_response: {
      type: Sequelize.TEXT,
      allowNull: true
    },
    repo_id: {
      type: Sequelize.STRING,
      allowNull: true
    },
    repo_name: {
      type: Sequelize.STRING,
      allowNull: true
    },
    repo_owner: {
      type: Sequelize.STRING,
      allowNull: true
    },
    repo_url: {
      type: Sequelize.STRING,
      allowNull: true
    },
    //is slack connected
    is_slack_connected: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    },
    //Slack webhook
    webhook: {
      type: Sequelize.STRING,
      allowNull: true
    },
    //Slack channel name
    channel_name: {
      type: Sequelize.STRING,
      allowNull: true
    },			
  }, {
    sequelize,
    modelName: 'widget_connection',
  });
  return WidgetConnection;
};