const express = require("express")
const bodyParser = require("body-parser")

const recentTradeListRouter = require("./routes/recentTradeList")

const app = express()

app.set("port", process.env.port || 3000)

app.use("/assets", express.static(__dirname + "/public"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Request-With, Content-Type, Accept, Authorisation')
    res.setHeader('Access-Control-Allow-Methods', 'GET')
    next()
})
app.use("/api/trades", recentTradeListRouter)

module.exports = app