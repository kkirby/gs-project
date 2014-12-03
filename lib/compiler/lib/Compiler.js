var	mPath = require('path'),
	mFs = require('fs'),
	mWrench = require('wrench'),
	mTidy = require('htmltidy').tidy,
	mGlob = require('glob'),
	_ = require('underscore'),
	colors = require('colors'),
	gs = require('gorillascript'),
	sprintf = require('sprintf').sprintf,
	CompilerConfig = require('./compiler/Config.js'),
	CompilerException = require('./compiler/Exception.js'),
	CompilerState = require('./compiler/State.js'),
	SrcHandler = require('./compiler/SrcHandler.js'),
	JsHandler = require('./compiler/JsHandler.js'),
	MacroHandler = require('./compiler/MacroHandler.js'),
	HtmlHandler = require('./compiler/HtmlHandler.js'),
	CssHandler = require('./compiler/CssHandler.js'),
	ImageHandler = require('./compiler/ImageHandler.js');
	RawHandler = require('./compiler/RawHandler.js');

rootRequire = function(path){
	return require(path);
}

module.exports = (function(){
	function Compiler(userConfig){
		this.config = new CompilerConfig(userConfig);
	}
	
	Compiler.prototype = {
		config: null,
		compiling: false,
		oldFiles: [],
		handlers: [
			new SrcHandler,
			new JsHandler,
			new MacroHandler,
			new HtmlHandler,
			new CssHandler,
			new ImageHandler,
			new RawHandler
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
			var ret = this.iterateHandlers('processFile',[state,file]);
			if(!state.hasLoadedFile(file)){
				state.files.push(file);
			}
			return ret;
		},
		onChange: null,
		watchFiles: function(state){
			if(!this.onChange){
				this.onChange = function(current,previous){
					if(current.mtime > previous.mtime){
						/*_(this.oldFiles).each(function(file){
							mFs.unwatchFile(file,this.onChange);
						}.bind(this));*/
						this.compile();
					}
				}.bind(this);
			}
			if(this.oldFiles){
				_(this.oldFiles).each(function(file){
					mFs.unwatchFile(file,this.onChange);
				}.bind(this));
			}
			this.oldFiles = state.files.concat();
			_(this.oldFiles).each(function(file){
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
			var state = new CompilerState(this,function(){
				try {
					this.clean();
					this.processFile(
						state,
						state.getPathFromAliasAndType(
							this.config.main,
							'src'
						)
					);
					if(watch){
						this.watchFiles(state);
					}
					state.contents = state.contents.join('\n');
					this.iterateHandlers('afterProcessed',[state]);
					this.iterateHandlers('reset',[]);
					var outputFileCompiled = mPath.join(this.config.output,'source.js');
					if(this.config.saveRawGs){
						state.saveFile(
							mPath.join(this.config.output,'source.gs'),
							state.contents
						);
					}
					gs.compile(
						'GLOBAL.App := {}\n'+state.contents
					).then(
						function(result){
							var contents = result.code;
							contents = mFs.readFileSync(mPath.join(__dirname,'_appReady.js')) + "\n" + state.raw.join('\n') + "\n" + contents + "\nOnAppReady.Ready();";
							if(state.hasDom){
								var images = mGlob.sync(
									mPath.join(
										'**',
										'*.png'
									),
									{
										cwd: this.config.output
									}
								);
								var preloadScript = [
									'var GsLoadableFiles = ' + JSON.stringify(state.loadableFiles) + ';'
								].join("\n");
								contents = preloadScript + "\n" + contents;
							}
							state.saveFile(outputFileCompiled,contents);
							
							/*state.contents = result.code;
							state.saveFile(
								mPath.join(this.config.output,'source.js'),
								state.contents
							);*/
							// Save src
							// Save HTML
							if(state.hasDom){
								var $ = state.domWindow.$;
								$('.jsdom').remove();
								$('head title').text(this.config.applicationName);
								$('body')[0].appendChild(
									$('<script/>').prop('src','source.js').prop('type','text/javascript').prop('charset','UTF-8')[0]
								);
								var html = state.domWindow.document.innerHTML;
							
								mTidy(
									html,
									{
										doctype: 'html5',
										indent: true,
										'drop-empty-elements': false,
										'indent-spaces': 4,
										'tab-size': 4,
										'wrap': 0,
										'new-blocklevel-tags': 'svg, g',
										'new-inline-tags': 'path, circle'
									},
									function(err,html){
										if(html){
											state.saveFile(
												mPath.join(this.config.output,'index.html'),
												html.replace(/&amp;/g,'&')
											);
											this.compiling = false;
											this.config.emitEvent('compiled');
											if(watch)console.log('Done.');
											cb();
										}
									}.bind(this)
								);
							}
							else {
								this.compiling = false;
								this.config.emitEvent('compiled');
								if(watch)console.log('Done.');
								cb();
							}
						}.bind(this),
						this.handleGsCompileError.bind(this,state,watch)
					);
				}
				catch(e){
					this.compiling = false;
					if(watch){
						console.log("\007");
						if(e instanceof CompilerException){
							console.log(
								'Unable to compile:'.underline.red.bold
							);
							console.log(e.toString().red);
						}
						else {
							throw e;
						}
					}
					else {
						throw e;
					}
				}
			}.bind(this));
		}
	};
	return Compiler;
})();