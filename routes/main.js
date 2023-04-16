const express = require('express');
const router = express.Router();
const mainController = require('../controllers/main');
const { requestValidationRules, validate } = require('../middleware/isValid')

router.post('/buy', 
  body('stopLossPercentage').isLength({min: 1, max:undefined}).trim().escape().withMessage("stopLossPercentage is required"),
  requestValidationRules(), validate, mainController.postBuy);
router.post('/sell', 
  body('coin').isLength({min: 1, max:undefined}).trim().escape().withMessage("coin is required"),
  requestValidationRules(), validate, mainController.postSell);

