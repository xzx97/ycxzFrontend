var https = require("https");
var fs = require("fs");
var express = require("express");

var app = express();

const cfg = {
	port : 10011,
	ssl_key : "./crt/server.key",
	ssl_cert : "./crt/server.crt"
};

app.use(express.static(__dirname));

const httpsServer = https.createServer({
	key : fs.readFileSync(cfg.ssl_key),
	cert : fs.readFileSync(cfg.ssl_cert)
},app).listen(cfg.port);

// app.get('/', (req, res) => {
// 	const loginHTML = "./login/index.html";
// 	res.setHeader("Content-Type", "text/html");
// 	fs.readFile(loginHTML, (err, data) => {
// 		if (!err) {
// 			res.send(data.toString());
// 		} else {
// 			res.send(err);
// 		}
// 	})
// });