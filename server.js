const http = require("http")

const onError = require("./serverError")
const app = require("./app")

const onListening = () => {
  console.log("Listening on port %d", server.address().port)
};

const server = http.createServer(app)
server.on("listening", onListening)
server.on("error", onError)
server.listen(app.get('port'))
