const express = require('express');
const { StatusCodes } = require('http-status-codes');

const categoriesService = require('../services/categories');

const categoriesRouter = express.Router();

categoriesRouter
  .route('/')

  .get(async (req, res) => {
    const result = await categoriesService.readAll();

    if (!result) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        reasons: ['server : internal server error'],
      });
    }

    return res.status(StatusCodes.OK).json(result);
  });

module.exports = categoriesRouter;
