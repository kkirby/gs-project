var fs = require('fs'),
		path = require('path'),
		express = require('express'),
		app = express(),
		argv = require('minimist')(process.argv.slice(2));

var staticRelativeDir = argv['_'][0];
if (!staticRelativeDir) {
	throw new Error("First parameter must exist and be a relative path to where the static content is");
}

// First treat it as an absolute path
var staticDir = path.resolve(staticRelativeDir);
if(!fs.existsSync(path.resolve(staticDir, "index.html"))) {
	staticDir = path.resolve(__dirname, staticRelativeDir); //No?  Change to checking relative
}

// Then relative
staticDir = path.resolve(__dirname, staticRelativeDir);
if(!fs.existsSync(path.resolve(staticDir, "index.html"))) {
	staticDir = path.resolve(staticDir, "build"); //No? Change to the build directory and see if it's there
}

if(!fs.existsSync(path.resolve(staticDir, "index.html"))) {
	throw new Error("Could not find index file to serve");
}

var defaultPort = 8080;
var port = argv.port || argv.p || defaultPort;
console.dir(argv);
console.log(port);
if (!argv.port && !argv.p) {
	console.log("Port not specified, defaulting to " + defaultPort);
}

//app.get('/', function (req, res) {
//	res.send('Hello World!');
//});
app.use(express.static(staticDir))
app.listen(port, function () {
	console.log('App listening on port ' + port + '!');
});

var host = '127.0.0.1';
var corsPort = argv['cors-port'];
if (corsPort) {
	var cors_proxy = require('cors-anywhere');
	cors_proxy.createServer({
			originWhitelist: [], // Allow all origins
			redirectSameOrigin: true
		}).listen(corsPort, host, function() {
		console.log('Running CORS Anywhere on ' + host + ':' + corsPort);
	});
}

