-04/15/2023 Author: Bryce Di Geronimo
-This package is used to automate cryptocurrency trading done through the Binance.us exchange.

-Create API key: https://www.binance.com/en-NG/support/faq/360002502072

-The two main endpoints are your_url/buy and your_url/sell. 

-Request parameters

-Shared parameters between the two endpoints:
 @param {string} tradingPair - the symbol used to trade, i.e. LINKUSD
 @param {int} percentOfBalance - percentage of balance to buy or sell
 @param {string} secretKey - user generated key for an additional layer of security on top of whitelisting IP addresses for inbound webhook requests


/buy will also require 
@param {int} stopLossPercentage which will be percent below the current price to set the stop loss. i.e. 5 percent stop loss.

/sell will also require
@param {string} coin - the name of the crypto currency, i.e. LINK

-ENV variables required
API_KEY=YOUR_API_KEY
PRIVATE_KEY=YOUR_PRIVATE_KEY
SECRET_KEY=YOUR_SECRET_KEY

-These api endpoints can be run via webhooks from the charting platform of your choice, i.e. TradingView and allows algorithmic trading to buy and sell any crypto asset based on the trading technique