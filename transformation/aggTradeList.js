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
    const tradeQty = parseFloat(trade.q);
    if (acc["dateFrom"] > trade.T || acc["dateFrom"] === 0) {
        acc["dateFrom"] = trade.T;
    }
    if (acc["dateTo"] < trade.T) {
        acc["dateTo"] = trade.T;
    }
    if (!trade.m) { // false == buyer, true == seller
        acc["qtyGroupedByBuyerPriceTotal"] += tradeQty;
        acc["buyerCostTotal"] += tradeQty * parseFloat(trade.p)
        const qtyGroupedByBuyerPrice = acc["qtyGroupedByBuyerPrice"]
        if (trade.p in qtyGroupedByBuyerPrice) {
            qtyGroupedByBuyerPrice[trade.p] += tradeQty
        } else {
            qtyGroupedByBuyerPrice[trade.p] = tradeQty
        }

    } else {
        acc["qtyGroupedBySellerPriceTotal"] += tradeQty;
        acc["sellerCostTotal"] += tradeQty * parseFloat(trade.p)
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
    Object.keys(qtyGroupedByPrice).map(price => {
        const qty = parseFloat(qtyGroupedByPrice[price])
        const pfPrice = parseFloat(price)
        obj.push({
            price: pfPrice,
            qty: qty.toFixed(8),
            cost:  parseFloat(pfPrice * qty).toFixed(8),
            qtyFormatted: numberWithCommas(pfPrice.toFixed(8))
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
            buyerQtyByPrice: formatQtyGroupedByPrice(transformation.qtyGroupedByBuyerPrice),
            buyerQtyByPriceTotal: Number.parseFloat(transformation.qtyGroupedByBuyerPriceTotal).toFixed(8),
            buyerQtyTotalFormatted: numberWithCommas(parseFloat(transformation.qtyGroupedByBuyerPriceTotal).toFixed(8)),
            buyerCostTotalFormatted: numberWithCommas(parseFloat(transformation.buyerCostTotal).toFixed(8)),
            sellerQtyByPrice: formatQtyGroupedByPrice(transformation.qtyGroupedBySellerPrice),
            sellerQtyByPriceTotal: Number.parseFloat(transformation.qtyGroupedBySellerPriceTotal).toFixed(8),
            sellerQtyTotalFormatted: numberWithCommas(parseFloat(transformation.qtyGroupedBySellerPriceTotal).toFixed(8)),
            sellerCostTotalFormatted: numberWithCommas(parseFloat(transformation.sellerCostTotal).toFixed(8))
        }
    }
}