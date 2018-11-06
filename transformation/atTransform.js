/**
 * Aggregates quantity(q) based on time(T) and buyermaker(m)
 */

module.exports = (trades) => {
    const items = []
    const cache = {}
    for (let item of trades) {

        const itemCopy = {...item} // don't want to alter the underlying trade data
        itemCopy.T = Math.round(itemCopy.T / 1000)

        const key = JSON.stringify({ T: itemCopy.T, m: itemCopy.m })
        if (cache[key]) {
            // aggregate cached quantity
            cache[key][0] = (parseFloat(cache[key][0]) + parseFloat(itemCopy.q)).toFixed(8)
            // update cached item and copy with quantity
            items[cache[key][1]].q = cache[key][0]
            itemCopy.q = cache[key][0]
            // store in cache highest priced item
            const itemPrice = parseFloat(itemCopy.p)
            if (itemPrice > parseFloat(items[cache[key][1]].p)) {
                items[cache[key][1]] = itemCopy
            }
        } else {
            items.push(itemCopy)
            cache[key] = [itemCopy.q, items.length-1]
        }
    }
    return items
}