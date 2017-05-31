var	mPath = require('path'),
	mFs = require('fs'),
	mWrench = require('wrench'),
	mGlob = require('glob'),
	colors = require('colors'),
	sprintf = require('sprintf').sprintf,
	CompilerConfig = require('./compiler/Config.js'),
	CompilerException = require('./compiler/Exception.js'),
	CompilerState = require('./compiler/State.js'),
	SrcHandler = require('./compiler/SrcHandler.js'),
	JsHandler = require('./compiler/JsHandler.js'),
	MacroHandler = require('./compiler/MacroHandler.js'),
	HtmlHandler = require('./compiler/HtmlHandler.js'),
	CssHandler = require('./compiler/CssHandler.js'),
	ImageHandler = require('./compiler/ImageHandler.js'),
RawHandler = require('./compiler/RawHandler.js');

rootRequire = function(path){
	if(path.indexOf('/') != -1){
		path = mPath.resolve(__dirname + '/../../../' + path);
	}
	return require(path);
}

var Server = rootRequire('server/Server.js');

var arrayUnique = function(a) {
    return a.reduce(function(p, c) {
        if (p.indexOf(c) < 0) p.push(c);
        return p;
    }, []);
};

module.exports = (function(){
	function Compiler(userConfig){
		this.config = new CompilerConfig(userConfig);
	}
	
	Compiler.prototype = {
		config: null,
		compiling: false,
		oldFiles: [],
		allFiles: [],
		webServer: null,
		handlers: [
			new MacroHandler,
			new SrcHandler,
			new JsHandler,
			new CssHandler,
			new ImageHandler,
			new RawHandler,
			new HtmlHandler
		],
		iterateHandlers: function(method,args){
			var ret = [];
			for(var i = 0; i < this.handlers.length; i++){
				var _ret = this.handlers[i][method].apply(this.handlers[i],args);
				if(_ret){
					ret.push(
						_ret
					);
				}
			}
			return function(name){
				for(var i = 0; i < ret.length; i++){
					if(typeof ret[i][name] != 'undefined'){
						return ret[i][name];
					}
				}
			};
		},
		processFile: function(state,file){
			this.allFiles.push(file);
			var ret = this.iterateHandlers('processFile',[state,file]);
			if(!state.hasLoadedFile(file)){
				state.files.push(file.toLowerCase());
			}
			return ret;
		},
		onChange: null,
		watchFiles: function(state){
			if(!this.onChange){
				this.onChange = function(current,previous){
					if(current.mtime > previous.mtime){
						this.compile();
					}
				}.bind(this);
			}
			if(this.oldFiles){
				this.oldFiles.forEach(function(file){
					mFs.unwatchFile(file,this.onChange);
				}.bind(this));
			}
			this.oldFiles = state.files.concat();
			this.oldFiles.push.apply(this.oldFiles,this.allFiles);
			this.oldFiles = arrayUnique(this.oldFiles);
			this.oldFiles.forEach(function(file){
				mFs.watchFile(
					file,
					{
						interval: 500
					},
					this.onChange
				);
			}.bind(this));
		},
		clean: function(){
			try {
				mWrench.rmdirSyncRecursive(this.config.output,true);
			}
			catch(e){
				throw new CompilerException('Unable to remove directory contents (%s).',this.config.output,e);
			}
			try {
				mWrench.mkdirSyncRecursive(this.config.output,0777);
			}
			catch(e){
				throw new CompilerException('Unable to create directory (%s).',this.config.output,e);
			}
		},
		
		handleGsCompileError: function(state,watch,error){
			this.compiling = false;
			var output = '';
			if(watch)output += "\007";
			output += error.message;
			if(watch)console.log(output);
			else throw output;
			return;
			/**
			 * The code below was to decode a compile error and show where the error happened.
			 * It sometimes doesn't work and I haven't had a chance to figure out why.
			 */
			try {
				var scriptLines = state.contents.split('\n');
				var offendingFile = {
					name: null,
					contents: null,
					line: null
				};
				for(var scriptLineNumber = error.line; scriptLineNumber >= 1; scriptLineNumber--){
					var scriptLineMatches = scriptLines[scriptLineNumber-1].match(/^\/\/startfile (\d+):(\d+) ([^$]+)$/);
					if(scriptLineMatches){
						offendingFile.name = scriptLineMatches[3];
						offendingFile.contents = mFs.readFileSync(offendingFile.name).toString().split('\n');
						error.line -= scriptLineNumber + parseInt(scriptLineMatches[1],10) - 1;
						error.column -= parseInt(scriptLineMatches[2],10);
						break;
					}
				}
				
				var offendingLine = offendingFile.contents[error.line-1];
				offendingLine = [
					offendingLine.substr(0,error.column-1).yellow,
					offendingLine.substr(error.column-1,1).red.bold,
					offendingLine.substr(error.column).yellow
				].join('');
				offendingFile.contents[error.line-1] = offendingLine;
				offendingFile.contents = offendingFile.contents.map(function(offendingFileLine,offendingFileLineIndex){
					var lineNumberText = sprintf('%3s',offendingFileLineIndex+1);
					if(offendingFileLineIndex+1 == error.line){
						lineNumberText = lineNumberText.redBG.white;
					}
					return sprintf(
						'%s: %s',
						lineNumberText,
						offendingFileLine
					)
				});
				var offendingFileSource = offendingFile.contents.slice(
					Math.max(
						0,
						error.line-6
					),
					Math.min(
						offendingFile.contents.length,
						error.line+4
					)
				);
				output += [
					'Unable to compile:'.underline.red.bold,
					(error.toString().split(' at ')[0]+'.').red,
					offendingFile.name.red,
					offendingFileSource.join('\n')
				].join('\n');
				if(watch)console.log(output);
				else throw outout;
			}
			catch(e){
				output += [
					'Unable to compile. Got an error while trying to pretty-print error.',
					e,
					error.message
				].join('\n');
				if(watch)console.log(output);
				else throw output;
			}
		},
		compile: function(watch,cb){
			if(typeof watch == 'undefined')watch = true;
			cb = cb || function(){};
			if(this.compiling)return;
			if(watch)console.log('Compiling.');
			this.compiling = true;
			var didDoWatch = false;
			var state = new CompilerState(this,function(){
				if(watch && this.config.userConfig.webServer) {
					if(this.config.userConfig.webServer instanceof Object && this.config.userConfig.webServer.corsPort) {
						state.apiProxyUrl = "http://localhost:" + this.config.userConfig.webServer.corsPort + "/";
					}
				}
						
				try {
					if(this.config.clean){
						this.clean();
					}
					
					this.iterateHandlers('beforeCompile',[state]);
					
					this.processFile(
						state,
						state.getPathFromAliasAndType(
							this.config.main,
							'src'
						)
					);
					if(watch){
						this.watchFiles(state);
						didDoWatch = true;
					}
					
					this.iterateHandlers('afterProcessed',[state]);
					this.iterateHandlers('reset',[]);
					this.compiling = false;
					this.config.emitEvent('compiled');
					if(watch) {
						console.log('Done.');

						if(this.config.userConfig.webServer && !this.webServer) {
							this.webServer = new Server();
							this.webServer.webDirectory = this.config.output;

							if(this.config.userConfig.webServer instanceof Object) {
								this.webServer.webPort = this.config.userConfig.webServer.port;
								this.webServer.corsPort = this.config.userConfig.webServer.corsPort;
							}

							this.webServer.start();
						}
					}
					cb();
				}
				catch(e){
					this.compiling = false;
					if(watch){
						console.log("\007");
						console.log(
							'Unable to compile:'.underline.red.bold
						);
						if(e.stack){
							console.log(e.stack.red);
						}
						else {
							console.log(e.toString().red);
						}
						if(!didDoWatch){
							try {
								this.watchFiles(state);
							}
							catch(e){
								console.log(
									'Unable to start watching of file. Exiting now.'
								);
								throw e;
							}
						}
					}
					else {
						throw e;
					}
				}
			}.bind(this),watch);
		}
	};
	return Compiler;
})();