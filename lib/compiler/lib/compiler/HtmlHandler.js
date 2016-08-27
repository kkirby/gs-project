var Handler = require('./Handler.js'),
	mPath = require('path'),
	gs = require('gorillascript-community'),
	tmpl = require('../tmpl'),
	sprintf = require('sprintf').sprintf;
module.exports = (function(){
	function HtmlHandler(){}
	HtmlHandler.prototype = Object.create(Handler.prototype);
	HtmlHandler.prototype.processFile = function(state,file){
		if(!state.hasDom)return;
		var fileInfo = state.getFileInfo(file);
		if(fileInfo.type != 'html')return;
		if(state.hasLoadedFile(file))return;
		var custom = state.getCustom('htmlHandler',{data:[]});
		var id = fileInfo.alias.replace(/\./g,'_');
		var html = '<div id="' + id + '">';
		
		var contents = state.readFile(file);
		
		var script = {};
		if(contents.substr(0,2) == '<%'){
			var index = contents.match(/^%>$/m).index
			script = contents.substr(2,index - 2);
			contents = contents.substr(index + 2);
			script = eval('(function(){' + gs.compile(script,{'return':true}).code + '})()');
			script = script || {};
		}
		
		try {
			html += tmpl(
				contents,
				script,
				{
					_import_: function(importType,importAlias){
						var path = state.getPathFromAliasAndType(
							importAlias,
							importType,
							file
						);
						var fileInfo = state.getFileInfo(path);
						// TODO: Get rid of this, or something. End up using a compiler to handle raw files.
						state.saveFile(path);
						return fileInfo.relative.replace(/\\/g,'/');
					}
				}
			);
		}
		catch(e){
			console.log('Unable to process ' + file + '.');
			throw e;
		}
		
		html += '</div>';
		
		custom.data.push(html);
		
		var srcResult = "eval('(GS_SCOPE.$id || ((GS_SCOPE.$id = document.getElementById(\\'$id\\').firstElementChild), GS_SCOPE.$id.parentNode.parentNode.removeChild(GS_SCOPE.$id.parentNode), GS_SCOPE.$id))')";
		srcResult = srcResult.replace(/\$id/g,id);
		return {
			src: srcResult
		};
	};
	HtmlHandler.prototype.afterProcessed = function(state){
		var html = state.getCustom('htmlHandler',{data:[]}).data.join('\n');
		var data = {
			title: state.compiler.config.applicationName,
			js: state.js,
			css: state.css,
			body: html
		}
		var template = state.compiler.config.html;
		if(template){
			if(typeof template == 'function'){
				template = template();
			}
			html = tmpl(template,data);
			state.saveFile(
				mPath.join(state.compiler.config.output,'index.html'),
				html
			);
		}
	};
	return HtmlHandler;
})();