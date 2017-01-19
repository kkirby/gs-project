var argv = require('minimist')(process.argv.slice(2))
		Server = require('./Server.js');

var staticRelativeDir = argv['_'][0];
var port = argv.port || argv.p;
var corsPort = argv['cors-port'] || argv.c;

var server = new Server(staticRelativeDir, port, corsPort);
server.start()
