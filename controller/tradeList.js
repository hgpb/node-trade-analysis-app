const https = require("https")

const atTransform = require("../transformation/atTransform")

const apiUrl = "https://www.binance.com/api/v1";

function buildSymbol(part1,part2) {
    asset1 = part1.toUpperCase()
    asset2 = part2.toUpperCase()
    return {
        pair: asset1+asset2,
        asset1: asset1,
        asset2: asset2
    }
}

function getStartEndTimeQuery(lookback, hours=1) {
    if (lookback === "true") {
        const date = new Date();
        const now = date.getTime();
        const lookback = date.setHours(date.getHours() - hours)
        return `&startTime=${lookback}&endTime=${now}`
    }
    return '';
}

module.exports.getAggregatedTradeList = (req, myRes, next) => {
    let aggTrades = []
    const symbol = buildSymbol(req.params.asset1,req.params.asset2)
    const lookbackQuery = getStartEndTimeQuery(req.params.lookback);
    const limit = parseInt(req.params.limit) || 1000;
    https.get(`${apiUrl}/aggTrades?symbol=${symbol.pair}&limit=${limit}${lookbackQuery}`, tradesRes => {
        tradesRes
            .on('data', chunk => aggTrades.push(chunk))
            .on('end', () => {
                aggTrades = JSON.parse(Buffer.concat(aggTrades).toString())
                if (aggTrades.code) {
                    return myRes.status(404).json(aggTrades)
                }
                const transAggTrades = atTransform(aggTrades)
                myRes.status(200).json(transAggTrades)
            })
            .on('error', err => {
                myRes.status(500).json(err)
            });
    }).on('error', err => {
        console.error("https",err)
    });
}