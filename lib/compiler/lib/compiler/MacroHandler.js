var Handler = require('./Handler.js'),
	CompilerException = require('./Exception.js'),
	sprintf = require('sprintf').sprintf,
	path = require('path'),
	fs = require('fs'),
	gsParser = require('gorillascript-community/lib/parser');

function fileExists(path){
	try {
		return fs.statSync(path).isFile();
	}
    catch (e){
		return false;
	}
}

module.exports = (function(){
	
	var cache = {
		id: null,
		contents: null,
		restore: function(cacheFile){
			if(this.id == null && fileExists(cacheFile)){
				try {
					var cacheJson = JSON.parse(
						fs.readFileSync(cacheFile).toString()
					);
					this.id = cacheJson.id;
					this.contents = gsParser.deserializePrelude(
						cacheJson.contents
					);
				}
				catch(e){}
			}
		},
		save: function(cacheFile){
			var cacheJson = {
				id: this.id,
				contents: this.contents.serialize()
			};
			fs.writeFileSync(
				cacheFile,
				JSON.stringify(
					cacheJson
				)
			);
		}
	};
	
	function MacroHandler(){}
	MacroHandler.prototype = Object.create(Handler.prototype);
	MacroHandler.getMacros = function(state){
		return state.getCustom('macroHandler',getDefaultState()).contents;
	}
	
	MacroHandler.getHelpers = function(state){
		return state.getCustom('macroHandler',getDefaultState()).helpers;
	}
	
	function getDefaultState(){
		return {
			contents: null,
			helpers: ''
		};
	}
	
	MacroHandler.prototype.beforeCompile = function(state){
		var cacheFile = path.join(
			state.compiler.config.alias.root,
			'.gs_macro_cache'
		);
		
		cache.restore(cacheFile);
		
		var macros = state.compiler.config.macros.map(function(macroFile){
			return state.getPathFromAliasAndType(macroFile,'macro');
		});
		
		var hash = macros.map(function(macroFile){
			return fs.statSync(macroFile).mtime.valueOf();
		}).join(',');
		
		if(hash !== cache.id){
			macros.unshift(
				require.resolve('gorillascript-community/src/jsprelude.gs')
			);
			var macroContents = macros.map(function(macroFile){
				return fs.readFileSync(macroFile).toString();
			});
			
			var compilationResult = gsParser(
				macroContents.join("\n\n"),
				null,
				{
					serializeMacros: true,
					filename: 'asdf.gs'
				}
			);
			
			cache.contents = compilationResult.macros;
			cache.id = hash;
			
			cache.save(cacheFile);
		}
		
		var helpers = macros.map(function(macroFile){
			var pathInfo = path.parse(macroFile);
			var helperFile = path.join(
				pathInfo.dir,
				pathInfo.name + '_helper' + pathInfo.ext
			);
			if(fileExists(helperFile)){
				return fs.readFileSync(helperFile).toString();
			}
			else {
				return '';
			}
		}).join('\n');
		
		var context = state.getCustom('macroHandler',getDefaultState());
		context.contents = cache.contents;
		context.helpers = helpers;
	}
	return MacroHandler;
})();