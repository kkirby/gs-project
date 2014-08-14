var	path = require('path'),
	optimist = require('optimist'),
	Compiler = require('./lib/compiler/lib/Compiler.js'),
	ConfigLoader = require('./lib/compiler/lib/ConfigLoader.js');

/*var gs = require('gorillascript');

rootRequire = require;
gs.getSerializedPrelude().then(function(){
	console.log(arguments);
	process.exit();
},function(){
	console.log(arguments);
});
/*var macrosFile = '/Users/kkirby/Projects/GsScriptProject/lib/data/resource/macro/macros.gs';
var res = gs.parser(
	require('fs').readFileSync(macrosFile,'utf8'),null,
	{
		serializeMacros: true, filename: macrosFile
	}
).then(function(parsed){
	require('fs').writeFileSync(
		'/Users/kkirby/Projects/GsScriptProject/lib/data/resource/macro/macrosCompiled.gs',
		parsed.macros.serialize()
	);
	console.log('done');
},function(){
	console.log(arguments);
});*/

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