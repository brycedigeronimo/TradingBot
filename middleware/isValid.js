/*Shared validation rules between buy and sell routes */
require('dotenv').config();
const { body, validationResult } = require('express-validator');
const SECRET_KEY = process.env.SECRET_KEY;


const requestValidationRules = () => {
  return [
    body('tradingPair').isLength({min: 1, max:undefined}).trim().escape().withMessage("tradingPair is required"),
    body('percentOfBalance').isLength({min: 1, max:undefined}).trim().escape().withMessage("percentOfBalance is required"),
    body('secretKey').isLength({min: 1, max:undefined}).trim().escape().withMessage("secretKey is required").custom(val => {
      if (val !== SECRET_KEY) {
        throw new Error('Secret Key does not match');
      }

      return true;
    })
  ]
}

const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }

  console.log(`Incorrect data parameters: ${errors}`);
  return res.status(422);
}

module.exports = {
  requestValidationRules,
  validate,
}