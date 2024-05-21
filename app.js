const express = require('express');

const envConfig = require('./config/env');

const app = express();

app.listen(envConfig.express.port);
