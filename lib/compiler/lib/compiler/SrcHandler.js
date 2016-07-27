var	_ = require('underscore'),
	_s = require('underscore.string'),
	mPath = require('path'),
	Handler = require('./Handler.js'),
	imageSize = require('image-size'),
	sprintf = require('sprintf').sprintf;
module.exports = (function(){
	var replaceImports = function(data,state,file){
		var importAliases = [];
		var importNames = [];
		data = data.replace(
			/^import (?:(\w+)[ \t]+)?([\w\.\$\#\^\@\*]+)(?:[ \t]+as[ \t]+(\w+))?[ \t]*$/gm,
			function(full,importType,importAlias,importName){
				importType = importType || 'src';
				try {
					var importFile = state.getPathFromAliasAndType(
						importAlias,
						importType,
						file
					);
					if(importFile instanceof Array){
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
						for(var i = 0; i < importFile.length; i++){
							var extras = state.compiler.processFile(
								state,
								importFile[i]
							)('image');
							if(extras){
								var relPath = importFile[i].split(mPath.sep).slice(-1 * cuttOff);
								var where = relPath.reduce(function(curr,item){
									if(item.indexOf('.') != -1){
										item = item.substr(0,item.indexOf('.'));
									}
									if(typeof curr[item] == 'undefined'){
										curr[item] = {};
									}
									return curr[item];
								},data);
								var size = imageSize(importFile[i]);
								where.url = sprintf('url(\'%s\')',extras.webUrl);
								where.src = extras.webUrl;
								where.width = sprintf('%spx',size.width);
								where.height = sprintf('%spx',size.height);
								where.dims = sprintf('%s %s',where.width,where.height);
							}
						}
						importAliases.push(JSON.stringify(data));
						importNames.push(importName);
					}
					else {
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
				}
				catch(e){
					console.log(e.stack);
					throw (e ? e.toString() : ' : ') + ' at ' + file + '\n' + data;
					return '';
				}
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
		var fileInfo = state.getFileInfo(file);
		if(fileInfo.type != 'src')return;
		if(!state.hasLoadedFile(file))compile(state,file);
		return {
			namespace: 'App.'+fileInfo.alias
		};
	};
	return SrcHandler;
})();