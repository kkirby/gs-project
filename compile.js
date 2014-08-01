var	path = require('path'),
	Compiler = require('./lib/compiler/lib/Compiler.js'),
	ConfigLoader = require('./lib/compiler/lib/ConfigLoader.js');

module.exports = {
	compile: function(configFile,override,watch,cb){
		var config = ConfigLoader.get(
			path.join(__dirname,'config.default.js'),
			configFile,
			override
		);
		new Compiler(config).compile(watch,cb);
	}
}