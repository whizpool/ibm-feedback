var config = require('./config.global');

config.env = 'development';
config.hostname = 'localhost';
config.db = {
    database: 'inappfeedback',
    username: 'postgres',
    password: '12345',
    host: "localhost",
    sequelizeParams: {
        dialect: 'postgres',
        host: "localhost",
        operatorsAliases: false,
        logging:true
    }
}
config.sessionDb = {
    database: 'inappfeedback',
    username: 'postgres',
    password: '12345',
    host: "localhost",
    sequelizeParams: {
        dialect: 'postgres',
        host: "localhost",
        operatorsAliases: false,
        logging:true
    }
}

module.exports = config;

