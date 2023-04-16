const Binance = require('./node-binance-api');
const express = require("express");
const bodyParser = require("body-parser");

const app = express()
const PORT = process.env.port || 8080;

app.use(bodyParser.json());

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
