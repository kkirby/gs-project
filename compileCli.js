var	path = require('path'),
	optimist = require('optimist'),
	Compiler = require('./lib/compiler/lib/Compiler.js'),
	ConfigLoader = require('./lib/compiler/lib/ConfigLoader.js');

var cwd = __dirname;
var defaultConfigFile = path.join(cwd,'config.default.js');

var argv = optimist.usage(
	'JS Compiler',
	{
		help: {
			description: 'Shows this info page.',
			short: 'h',
			boolean: true
		},
		once: {
			description: 'Compile only once',
			short: 'o',
			boolean: true,
			default: false
		},
		config: {
			description: 'The path to the application configuration file.',
			short: 'c',
			default: path.join(process.cwd(),'config.js')
		},
		override: {
			description: 'An override object to use.',
			default: null
		}
	}
).argv;

if(argv.help || argv.h){
	optimist.showHelp();
}
else {
	var config = ConfigLoader.get(
		path.join(cwd,'config.default.js'),
		argv.config,
		argv.override
	);
	new Compiler(config).compile(!argv.once);
}