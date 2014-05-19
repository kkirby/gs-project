var	path = require('path'),
	optimist = require('optimist'),
	Compiler = require('./lib/Compiler.js'),
	ConfigLoader = require('./lib/ConfigLoader.js');

var cwd = __dirname;
var defaultConfigFile = path.join(cwd,'config.default.js');

/*
$$_getType = function(input){
	var type = null;
	if(input.isIdent){
		var vars = input.scope.top().children[0].variables[input.name];
		if(vars != null){
			type = vars.type().toString();
		}
		else {
			type = 'any';
		}
	}
	else {
		if(input.nodeType == 'macroAccess'){
			type = input.nodeType;
		}
		else {
			type = input.type().toString();
		}
	}
	return type.toLowerCase()
};

$$_reduce = function(args,isMultiple){
	if(isMultiple === null){
		isMultiple = false;
	}
	var macroData = args[0].macroData;
	var __wrap = args[1];
	var __const = args[2];
	var __value = args[3];
	var __symbol = args[4];
	var __call = args[5];
	var __macro = args[6];
	var data = macroData.selector;
	var _getContextQuery = function(context,multiple){
		if(context !== null){
			var type = $$_getType(context);
			if(type == 'string'){
				if(context.value !== null && context.value == 'body'){
					return __call(
						void 0,
						__symbol(void 0,'internal','access'),
						__symbol(void 0,'ident','document'),
						__value(void 0,'body')
					);
				}
				else {
					return __call(
						void 0,
						__call(
							void 0,
							__symbol(void 0,'internal','access'),
							__symbol(void 0,'ident','document'),
							multiple ? __value(void 0,'querySelectorAll') : __value(void 0,'querySelector')
						),
						__wrap(context)
					);
				}
			}
			else {
				return __wrap(context);
			}
		}
		else {
			return __symbol(void 0,'ident','document');
		}
	}
	
	if(data.length == 1){
		return _getContextQuery(data[0],isMultiple);
	}
	else if(data.length == 2){
		return __call(
			void 0,
			__call(
				void 0,
				__symbol(void 0,'internal','access'),
				_getContextQuery(data[1]),
				isMultiple ? __value(void 0,'querySelectorAll') : __value(void 0,'querySelector')
			),
			__wrap(data[0])
		);
	}
	throw 'unable to parse!';
}*/

var argv = optimist.usage(
	'JS Compiler',
	{
		'help': {
			'description': 'Shows this info page.',
			'short': 'h',
			'boolean': true
		},
		config: {
			'description': 'The path to the application configuration file.',
			'short': 'c',
			'default': path.join(process.cwd(),'config.js')
		}
	}
).argv;

if(argv.help || argv.h){
	optimist.showHelp();
}
else {
	var config = ConfigLoader.get(
		path.join(cwd,'config.default.js'),
		argv.config
	);
	var a = new Compiler(config);
	a.compile();
}