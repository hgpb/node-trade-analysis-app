const express = require("express");

const tlController = require("../controller/tradeList");

const router = express.Router();

router.get("/aggregated/:asset1/:asset2/:lookback/:limit?", tlController.getAggregatedTradeList);

module.exports = router;