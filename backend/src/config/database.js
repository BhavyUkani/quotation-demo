const Sequelize = require('sequelize');
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (isProduction) {
    // Production / Remote Configuration
    sequelize = new Sequelize(
        'u767600617_arth',
        'u767600617_arth',
        'Qbd+oT0fW=',
        {
            host: '82.25.121.2',
            dialect: 'mysql',
            dialectModule: require('mysql2'), // Required for some serverless environments
            logging: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }
    );
    console.log('Connected to Remote Production Database');
} else {
    // Development / Local Configuration
    sequelize = new Sequelize(
        'platinum_luxria',
        'root',
        '',
        {
            host: 'localhost',
            dialect: 'mysql',
            logging: false
        }
    );
    console.log('Connected to Local Development Database');
}

module.exports = sequelize;
