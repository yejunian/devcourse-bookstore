const mysql = require('mysql2');

const envConfig = require('../../config/env');

const connection = mysql.createConnection({
  ...envConfig.mariadb,
  dateStrings: true,
});

module.exports = connection;
