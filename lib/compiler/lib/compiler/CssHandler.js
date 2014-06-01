var Handler = require('./Handler.js'),
	mSass = require('node-sass'),
	mPath = require('path'),
	mColors = require('colors'),
	sprintf = require('sprintf').sprintf,
	mImages,
	CompileException = require('./Exception.js');

try {
	mImages = require('node-images');
}
catch(e){
	console.log('Cannot load node-images.');
	console.warn(e);
}

module.exports = (function(){
	function CssHandler(){}
	CssHandler.prototype = Object.create(Handler.prototype);
	
	function preCompileFile(state,file){
		return state.readFile(file).replace(
			/@import\s+\(([^\)]+)\)\s*\(([^\)]+)\)(?:\s*\(([^\)]+)\))?;/g,
			function(full,importType,importAlias,importName){
				var path = state.getPathFromAliasAndType(
					importAlias,
					importType,
					file
				);
				var pathInfo = state.getFileInfo(path);
				importName = importName || pathInfo.name;
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
						var size = {
							width: 0,
							height: 0
						};
						if(mImages){
							var img = mImages(path);
							size = img.size();
						}
						return sprintf(
							[
								'$%s: url(\'%s\');',
								'$%1$s_width: %spx;',
								'$%1$s_height: %spx;'
							].join('\n'),
							importName,
							extras,
							size.width,
							size.height
						);
					}
					else {
						return sprintf(
							[
								'$%1$s: url(\'%2$s\');',
								'$%1$s_path: \'%2$s\';'
							].join('\n'),
							importName,
							pathInfo.relative
						);
					}
				}
			}
		);
	}
	
	CssHandler.prototype.processFile = function(state,file){
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
			try {
				data = mSass.renderSync({
				    data: data,
					includePaths: [state.compiler.config.alias.root,mPath.resolve(__dirname,'..','compass')]
				});
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
			link.charset = 'UTF-8';
			$('head').append(link);
		}
	};
	return CssHandler;
})();