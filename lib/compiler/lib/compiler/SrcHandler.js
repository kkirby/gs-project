var	_ = require('underscore'),
	_s = require('underscore.string'),
	Handler = require('./Handler.js'),
	sprintf = require('sprintf').sprintf;
module.exports = (function(){
	var replaceImports = function(data,state,file){
		var importAliases = [];
		var importNames = [];
		data = data.replace(
			/^import (?:(\w+)\s+)?([\w\.\$\#\^\@]+)(?:\s+as\s+(\w+))?\s*$/gm,
			function(full,importType,importAlias,importName){
				importType = importType || 'src';
				var importFile = state.getPathFromAliasAndType(
					importAlias,
					importType,
					file
				);
				var importFileInfo = state.getFileInfo(importFile)
				importAlias = importFileInfo.alias;
				importName = importName || importFileInfo.name;
				var extras = state.compiler.processFile(
					state,
					importFile
				)('src');
				if(extras){
					importAliases.push(extras);
					importNames.push(importName);
				}
				if(importType == 'src' && extras !== false && importName !== 'empty'){
					importAliases.push(importAlias);
					importNames.push(importName);
				}
				return '';
			}
		);
		return {
			importAliases: importAliases,
			importNames: importNames,
			body: data
		};
	}
	
	var buildNamespaces = function(state,file){
		var fileInfo = state.getFileInfo(file);
		var stateContent = state.getCustom('srcHandler',{namespaces:[]});
		var namespaceText = [];
		if(fileInfo.namespace == ''){
			return 'GLOBAL.App.'+fileInfo.name+' := '+fileInfo.name;
		}
		else {
			_.reduce(
				fileInfo.namespace.split('.'),
				function(a,b){
					var namespace = [];
					if(a != null){
						namespace.push(a);
					}
					if(b != null){
						namespace.push(b);
					}
					namespace = namespace.join('.');
					if(namespace){
						if(stateContent.namespaces.indexOf(namespace) == -1){
							if(namespace.indexOf('.') != -1){
								namespaceText.push(namespace+' := {}');
							}
							else {
								namespaceText.push('let '+namespace+' = {}');
								namespaceText.push('GLOBAL.App.'+namespace+' := '+namespace);
							}
							stateContent.namespaces.push(namespace);
						}
					}
					return namespace;
				},
				null
			);
		}
		return namespaceText.join('\n');
	}
	
	var indentAll = function(data,count){
		if(typeof count == 'undefined'){
			count = 1;
		}
		var tab = '';
		for(var i = 0; i < count; i++){
			tab += '\t';
		}
		return data.split('\n').map(function(line){
			return tab + line;
		}).join('\n');
	}
	
	var compile = function(state,file){
		var parsedFileContents = replaceImports(state.readFile(file),state,file);
		var fileInfo = state.getFileInfo(file);
		if(parsedFileContents.body.replace(/\s*/g,'') == ''){
			return false;
		}
		parsedFileContents.body = _s.trim(parsedFileContents.body);
		var parts = {
			top: '',
			content: '',
			contentIndent: 0,
			bottom: ''
		};
		
		//if(parsedFileContents.importNames.length == 0 && fileInfo.alias.indexOf('.') == -1){
		//	parts.content = parsedFileContents.body;
		//}
		//else {
			var topSprintf = 'let %s = do %s';
			if(fileInfo.alias.indexOf('.') != -1){
				topSprintf = '%s := do %s';
			}
			if(_s.startsWith(parsedFileContents.body,'do ')){
				topSprintf = topSprintf.replace('do ','');
			}
			parts.top = sprintf(
				topSprintf,
				fileInfo.alias,
				parsedFileContents.importNames.map(function(name,index){
					return sprintf('%s = %s',name,parsedFileContents.importAliases[index]);
				}).join(',')
			);
			parts.content = indentAll(parsedFileContents.body);
			parts.contentIndent = 1;
		//}
		var namespaces = buildNamespaces(state,file);
		if(namespaces != ''){
			if(fileInfo.namespace == ''){
				parts.bottom = namespaces;
			}
			else {
				parts.top = [
					namespaces,
					parts.top
				].join('\n');
			}
		}
		parts.top = [
			sprintf(
				'//startfile %s:%s %s',
				parts.top.split('\n').length+1,
				parts.contentIndent,
				file
			),
			parts.top
		].join('\n');
		var wholeBody = [];
		if(parts.top != ''){
			wholeBody.push(parts.top);
		}
		wholeBody.push(indentAll('const __CLASS__  = \''+fileInfo.name+'\'',parts.contentIndent));
		wholeBody.push(parts.content);
		if(parts.bottom){
			wholeBody.push(parts.bottom);
		}
		state.contents.push(wholeBody.join('\n'));
	};
	function SrcHandler(){}
	SrcHandler.prototype = Object.create(Handler.prototype);
	SrcHandler.prototype.processFile = function(state,file){
		if(state.getFileInfo(file).type != 'src')return;
		if(state.hasLoadedFile(file))return;
		return {
			src: compile(state,file)
		};
	};
	return SrcHandler;
})();