const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  express: {
    port: parseInt(process.env.EXPRESS_PORT) || 3000,
  },

  jwt: {
    secret: process.env.JWT_SECRET || '',
  },

  mariadb: {
    host: process.env.MARIADB_HOST || 'localhost',
    port: parseInt(process.env.MARIADB_PORT) || 3306,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
  },
};
