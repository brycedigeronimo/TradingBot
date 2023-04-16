const API_KEY=process.env.API_KEY;
const PRIVATE_KEY=process.env.PRIVATE_KEY;
require('dotenv').config();

const binance = new Binance().options( {
  APIKEY: API_KEY,
  APISECRET: PRIVATE_KEY
});

/*
Fill orders will be an array of objects returned from a successful marketBuy. Array will have length of 1 
if entire market buy order was filled off of one maker order. 
Otherwise, if multiple orders were needed to fill, then the this function will average the fill price 
to calculate the price used to set the stop loss.
*/
const getStopLossPrice = (fillOrders, stopLossPercentage) => {
  let purchasePrice;
  if(fillOrders.length === 1) {
    purchasePrice = parseFloat(fillOrders[0].price);
  }
  else {
    let sum = 0;
    fillOrders.forEach((fill) => {
      sum += parseFloat(fill.price);
    })
    purchasePrice = (sum/fillOrders.length).toFixed(4); //avg fill order price
  }

  return parseFloat((purchasePrice * (1- stopLossPercentage)).toFixed(1)) // setting to 1 decimal as this is the max for BTC on certain exchanges
}


const postBuy = async (req, res, next) => {
  const { tradingPair, percentOfBalance, stopLossPercentage } = req.body;
  stopLossPercentage = parseFloat(stopLossPercentage);
  try {
    const balance = await binance.balance();
    let usd = balance.USD.available;
    let purchaseAmount = usd * percentOfBalance * 0.99; // get purchase amt and * by .99 to account for fees and create buffer to make sure quantity can be covered by current USD value
    const quantity = parseFloat((purchaseAmount/price).toFixed(2)); // This will be quantity of coins purchased
    console.log(`purchse amount: ${purchaseAmount} at price: $${price}`);
    console.log(`quantity for marketBuy: ${quantity}`);
    const result = await binance.marketBuy(tradingPair, quantity);
    console.log('Markey Buy order was successful ', result);
    const executedQty = result.executedQty; //actual quantity purchased from Market Order
    const fills = result.fills;
    console.log(`orderId: ${result.orderId}`);
    console.log(fills);
    const stopLossPrice = getStopLossPrice(fills, stopLossPercentage);
    const stopLossResult = await binance.sell(tradingPair, executedQty, stopLossPrice, {stopPrice: stopLossPrice, type: "STOP_LOSS_LIMIT"});
    console.log('Markey Buy Stop Loss order was successful ', stopLossResult);
    return res.sendStatus(200);
  } catch (err) {
    console.log(`Error trying to buy ${tradingPair} : ${err}`)
  }
}

const postSell = async (req, res, next) => {
  const { coin, tradingPair, percentOfBalance } = req.body;
  percentOfBalance = parseFloat(percentOfBalance);
  try {
    const openOrders = await binance.openOrders(tradingPair);
    if(openOrders.length) {
      const result = await binance.cancelAll(tradingPair); // delete any current sell requests at this will prevent the ability to sell
      console.log(`Cancelling all previous sell orders: ${result}`)
    }
    let quantity = (parseFloat((await binance.balance())[coin].available) * percentOfBalance * 0.99);
    quantity = parseFloat(quantity.toFixed(2))
    console.log(`quantity: ${quantity}`);
    const sellOrder = await binance.marketSell(tradingPair, quantity);
    console.log('Market Sell order was successful ', sellOrder);
    return res.sendStatus(200);
  } catch (err) {
    console.log(`Error trying to sell  ${tradingPair} : ${err}`)
    return res.sendStatus(422);
  }
}

module.exports = {
  postBuy,
  postSell
}
