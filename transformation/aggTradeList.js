/*
Response:
[
  {
    "a": 26129,         // Aggregate tradeId
    "p": "0.01633102",  // Price
    "q": "4.70443515",  // Quantity
    "f": 27781,         // First tradeId
    "l": 27781,         // Last tradeId
    "T": 1498793709153, // Timestamp
    "m": true,          // Was the buyer the maker?
    "M": true           // Was the trade the best price match?
  }
]
 */
const qtyGroupedByPriceReducer = (acc, trade) => {
    const tradeQty = Number.parseFloat(trade.q);
    if (acc["dateFrom"] > trade.T || acc["dateFrom"] === 0) {
        acc["dateFrom"] = trade.T;
    }
    if (acc["dateTo"] < trade.T) {
        acc["dateTo"] = trade.T;
    }
    if (!trade.m) { // false == buyer, true == seller
        acc["qtyGroupedByBuyerPriceTotal"] += tradeQty;
        acc["buyerCostTotal"] += tradeQty * Number.parseFloat(trade.p)
        const qtyGroupedByBuyerPrice = acc["qtyGroupedByBuyerPrice"]
        if (trade.p in qtyGroupedByBuyerPrice) {
            qtyGroupedByBuyerPrice[trade.p] += tradeQty
        } else {
            qtyGroupedByBuyerPrice[trade.p] = tradeQty
        }

    } else {
        acc["qtyGroupedBySellerPriceTotal"] += tradeQty;
        acc["sellerCostTotal"] += tradeQty * Number.parseFloat(trade.p)
        const qtyGroupedBySellerPrice = acc["qtyGroupedBySellerPrice"]
        if (trade.p in qtyGroupedBySellerPrice) {
            qtyGroupedBySellerPrice[trade.p] += tradeQty
        } else {
            qtyGroupedBySellerPrice[trade.p] = tradeQty
        }
    }
    return acc
}

const numberWithCommas = (x) => {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

const formatQtyGroupedByPrice = (qtyGroupedByPrice) => {
    const obj = []
    Object.keys(qtyGroupedByPrice).map(function (objectKey) {
        const price = qtyGroupedByPrice[objectKey]
        obj.push({
            price: objectKey,
            qty: Number.parseFloat(price).toFixed(8),
            cost: Number.parseFloat(price) * Number.parseFloat(objectKey),
            qtyFormatted: numberWithCommas(Number.parseFloat(price).toFixed(8))
        })
    });
    return obj
}

module.exports = {
    aggTradeList: function(data) {
        const accInitialState = {
            dateFrom: 0,
            dateTo: 0,
            qtyGroupedByBuyerPrice: {},
            qtyGroupedByBuyerPriceTotal: 0,
            buyerCostTotal: 0,
            qtyGroupedBySellerPrice: {},
            qtyGroupedBySellerPriceTotal: 0,
            sellerCostTotal: 0
        };
        const transformation = data.reduce(qtyGroupedByPriceReducer, accInitialState);
        return {
            dateFrom: transformation.dateFrom,
            dateTo: transformation.dateTo,
            qtyGroupedByBuyerPrice: formatQtyGroupedByPrice(transformation.qtyGroupedByBuyerPrice),
            qtyGroupedByBuyerPriceTotal: Number.parseFloat(transformation.qtyGroupedByBuyerPriceTotal).toFixed(8),
            buyerQtyTotalFormatted: numberWithCommas(Number.parseFloat(transformation.qtyGroupedByBuyerPriceTotal).toFixed(8)),
            buyerCostTotalFormatted: numberWithCommas(Number.parseFloat(transformation.buyerCostTotal).toFixed(8)),
            qtyGroupedBySellerPrice: formatQtyGroupedByPrice(transformation.qtyGroupedBySellerPrice),
            qtyGroupedBySellerPriceTotal: Number.parseFloat(transformation.qtyGroupedBySellerPriceTotal).toFixed(8),
            sellerQtyTotalFormatted: numberWithCommas(Number.parseFloat(transformation.qtyGroupedBySellerPriceTotal).toFixed(8)),
            sellerCostTotalFormatted: numberWithCommas(Number.parseFloat(transformation.sellerCostTotal).toFixed(8))
        }
    }
}