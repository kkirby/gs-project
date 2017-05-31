var fs = require('fs'),
		path = require('path'),
		express = require('express'),
		app = express();

module.exports = (function(){
	function Server(webDirectory, webPort, corsPort){
		this.webDirectory = webDirectory,
		this.webPort = webPort;
		this.corsPort = corsPort;
	}

	Server.prototype = {
		webDirectory: null,
		webPort: null,
		corsPort: null,
		started: false,
		start: function() {
			if(!this.webDirectory) {
				throw new Error("Web directory is required");
			}

			var staticRelativeDir = this.webDirectory;
			this.webPort = this.webPort || 8080;

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

			app.use(express.static(staticDir));
			app.listen(this.webPort, function () {
				console.log('Serving ' + staticDir + ' at ' + this.webPort + '!');
			}.bind(this));

			if (this.corsPort) {
				var host = '0.0.0.0';
				var corsPort = this.corsPort;
				if (corsPort) {
					var cors_proxy = require('cors-anywhere');
					cors_proxy.createServer({
							originWhitelist: [], // Allow all origins
							redirectSameOrigin: true
						}).listen(corsPort, host, function() {
						console.log('Started API proxy: ' + host + ':' + corsPort);
					}.bind(this));
				}
			}
			this.started = true;
		},

		isStarted: function() {
			return this.started;
		}
	};
	return Server;
})();
