var Handler = require('./Handler.js'),
	mSass = require('../Sass.js'),
	mPath = require('path'),
	mColors = require('colors'),
	sprintf = require('sprintf').sprintf,
	imageSize = require('image-size'),
	CompileException = require('./Exception.js');

module.exports = (function(){
	function CssHandler(){}
	CssHandler.prototype = Object.create(Handler.prototype);
	
	function MapToScss(map){
		if(typeof map == 'object'){
			var res = [];
			for(var key in map){
				res.push("'"+key+'\': '+MapToScss(map[key]));
			}
			return '('+res.join(',')+')';
		}
		else if(map instanceof Array){
			var res = [];
			for(var i = 0; i < map.length; i++){
				res.push(MapToScss(map[i]));
			}
			return '('+res.join(',')+')';
		}
		else {
			return map;
		}
	}
	
	function preCompileFile(state,file){
		return state.readFile(file).replace(
			/@import\s+\(([^\)]+)\)\s*\(([^\)]+)\)(?:\s*\(([^\)]+)\))?;/g,
			function(full,importType,importAlias,importName){
				var path = state.getPathFromAliasAndType(
					importAlias,
					importType,
					file
				);
				if(path instanceof Array){
					if(!importName){
						throw 'An import name is required on multiple includes.';
					}
					var _importAlias = importAlias.split('.');
					var cuttOff = 0;
					for(var i = 0; i < _importAlias.length; i++){
						if(_importAlias[i].indexOf('*') != -1){
							cuttOff++;
						}
					}
					var data = {};
					for(var i = 0; i < path.length; i++){
						var extras = state.compiler.processFile(
							state,
							path[i]
						)('image');
						var relPath = path[i].split(mPath.sep).slice(-1 * cuttOff);
						var where = relPath.reduce(function(curr,item){
							if(item.indexOf('.') != -1){
								item = item.substr(0,item.indexOf('.'));
							}
							if(typeof curr[item] == 'undefined'){
								curr[item] = {};
							}
							return curr[item];
						},data);
						if(extras){
							var size = imageSize(path[i]);
							where.url = sprintf('url(\'%s\')',extras.webUrl);
							where.width = sprintf('%spx',size.width);
							where.height = sprintf('%spx',size.height);
							where.dims = sprintf('%s %s',where.width,where.height);
						}
						else {
							var pathInfo = state.getFileInfo(path[i]);
							where.url = 'url('+pathInfo.webUrl+')';
							where.path = '\'' + pathInfo.webUrl + '\'';
						}
					}
					return '$'+importName+': '+MapToScss(data)+';';
				}
				else {
					var pathInfo = state.getFileInfo(path);
					importName = importName || pathInfo.name;
					importName = importName.replace(/\\/g,'/');
					if(pathInfo.type == 'css'){
						state.files.push(path);
						return preCompileFile(state,path);
					}
					else {
						var extras = state.compiler.processFile(
							state,
							path
						)('image');
						if(extras){
							var size = imageSize(path);
							return sprintf(
								[
									'$%s: url(\'%s\');',
									'$%1$s_width: %spx;',
									'$%1$s_height: %spx;',
									'$%1$s_dims: %3$spx %4$spx;',
									'$%1$s-info: %5s;'
								].join('\n'),
								importName,
								extras.webUrl,
								size.width,
								size.height,
								MapToScss({
									url: 'url(\'' + extras.webUrl + '\')',
									width: size.width + 'px',
									height: size.height + 'px'
								})
							);
						}
						else {
							return sprintf(
								[
									'$%1$s: url(\'%2$s\');',
									'$%1$s_path: \'%2$s\';'
								].join('\n'),
								importName,
								pathInfo.webUrl
							);
						}
					}
				}
			}
		)
		.replace(/__SYS__/g,state.compiler.config.alias.sys.replace(/\\/g,'/'))
		.replace(/@\s*(?!at-root|debug|each|error|for|function|if|import|include|media|mixin|warn|while|return|else|content|font-face|extend)/g,'@include ')
		.replace(/\$((?:\w|(?!-\$)-)+\.)+(?:\w|(?!-\$)-)+/g,function(match){
			return match.split('.').reduce(function(curr,item,index,arr){
				if(index == 0){
					return item;
				}
				else {
					return 'map-get('+curr+','+item+')';
				}
			},'');
		});
	}
	
	CssHandler.prototype.processFile = function(state,file){
		if(!state.hasDom)return;
		if(state.getFileInfo(file).type != 'css')return;
		if(state.hasLoadedFile(file))return;
		var custom = state.getCustom('cssHandler',{data:[]});
		var css = preCompileFile(state,file);
		try {
			custom.data.push(
				css
			);
		}
		catch(e){
			throw new CompileException('Unable to render CSS file (%s)',file,e);
		}
	};
	CssHandler.prototype.afterProcessed = function(state){
		var data = state.getCustom('cssHandler',{data:[]}).data.join('\n');
		if(data != ''){
			if(state.compiler.config.saveRawScss){
				state.saveFile(
					mPath.join(state.compiler.config.output,'source.scss'),
					data
				);
			}
			try {
				data = mSass.Compile(data);
			}
			catch(e){
				var lineNumber = e.toString().match(/Error: [^:]+:(\d+)/);
				if(lineNumber){
					lineNumber = parseInt(lineNumber[1]);
					var startLine = Math.max(lineNumber-10,0);
					var lines = data.split("\n");
					var errorLines = lines.slice(
						startLine,
						Math.min(
							lineNumber+10,
							lines.length
						)
					).map(function(line,offset){
						var currentLine = offset+startLine-4;
						var res = sprintf('%4s: %s',currentLine,line);
						if(currentLine == lineNumber){
							return res.red;
						}
						else {
							return res;
						}
					});
					throw new CompileException("Unable to render CSS:\n%s",errorLines.join("\n"),e);
				}
				throw new CompileException('Unable to render CSS:',data,e);
			}
			state.saveFile(
				mPath.join(
					state.compiler.config.output,
					'source.css'
				),
				data
			);
			var window = state.domWindow;
			var document = window.document;
			var $ = window.$;
			var link = document.createElement('link');
			link.href = 'source.css';
			link.type = 'text/css';
			link.rel = 'stylesheet';
			$('head').append(link);
		}
	};
	return CssHandler;
})();