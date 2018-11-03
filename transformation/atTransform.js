/**
 * Aggregates quantity(q) based on price (p) time(T) and buyermaker(m)
 */

module.exports = (data) => {
    const result = []
    const cache = {}
    for (let item of data) {
        const qty = parseFloat(item.q)
        const key = JSON.stringify({ p: item.p, T: item.t, m: item.m })
        if (cache[key]) {
            cache[key][0] = (parseFloat(cache[key][0]) + qty).toFixed(8)
            result[cache[key][1]].q = (parseFloat(result[cache[key][1]].q) + qty).toFixed(8)
        } else {
            result.push(item)
            cache[key] = [qty.toFixed(8), result.length-1]
        }
    }
    return result
}