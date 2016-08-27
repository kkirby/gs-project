var	mPath = require('path'),
	mFs = require('fs'),
	Handler = require('./Handler.js'),
	imageSize = require('image-size'),
	sprintf = require('sprintf').sprintf,
	gs = require('gorillascript-community'),
	regenerator = require('regenerator'),
	mGlob = require('glob')
	MacroHandler = require('./MacroHandler'),
	JsHandler = require('./JsHandler'),
	CompileException = require('./Exception');

	
module.exports = (function(){
	
	var customDefault = {
		namespaces:[],
		data: []
	};
	
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
		var stateContent = state.getCustom('srcHandler',customDefault);
		var namespaceText = [];
		if(fileInfo.namespace == ''){
			return 'GLOBAL.App.'+fileInfo.name+' := '+fileInfo.name;
		}
		else {
			fileInfo.namespace.split('.').reduce(
				function(previus,next){
					var namespace = [];
					if(previus != null){
						namespace.push(previus);
					}
					if(next != null){
						namespace.push(next);
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
		parsedFileContents.body = parsedFileContents.body.replace(/^\s+|\s+$/g,'')
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
			if(parsedFileContents.body,substr(0,3) == 'do '){
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
		return wholeBody.join('\n');
	};
	function SrcHandler(){}
	SrcHandler.prototype = Object.create(Handler.prototype);
	SrcHandler.prototype.processFile = function(state,file){
		var fileInfo = state.getFileInfo(file);
		if(fileInfo.type != 'src')return;
		if(!state.hasLoadedFile(file)){
			var custom = state.getCustom('srcHandler',customDefault);
			try {
				custom.data.push(
					compile(state,file)
				);
			}
			catch(e){
				throw e;
			}
		}
		return {
			namespace: 'App.'+fileInfo.alias
		};
	};
	SrcHandler.prototype.afterProcessed = function(state){
		var gsSource = state.getCustom('srcHandler',customDefault).data.join('\n');
		
		gsSource = MacroHandler.getMacros(state) + '\n' + gsSource;
		gsSource = 'GLOBAL.App := {}\n' + 'let GS_SCOPE = {}\nGLOBAL.GS_SCOPE := GS_SCOPE\n' + gsSource;
		
		if(state.compiler.config.saveRawGs){
			state.saveFile(
				mPath.join(state.compiler.config.output,'source.gs'),
				gsSource
			);
		}
		var outputSource = gs.compile(gsSource).code;
		
		state.saveFile(
			mPath.join(
				state.compiler.config.output,
				state.compiler.config.sourceFileName
			),
			outputSource
		);
		
		outputSource = regenerator.compile(
			outputSource,
			{includeRuntime:true}
		).code;
		
		outputSource = JsHandler.getScripts(state) + '\n' + outputSource;
		
		if(!state.compiler.config.noHelper){
			outputSource = mFs.readFileSync(
				mPath.join(__dirname,'..','_appReady.js')
			) + "\n" + outputSource + "\nOnAppReady.Ready();";
			if(state.hasDom){
				var images = mGlob.sync(
					mPath.join(
						'**',
						'*.png'
					),
					{
						cwd: state.compiler.config.output
					}
				);
				var preloadScript = [
					'var GsLoadableFiles = ' + JSON.stringify(state.loadableFiles) + ';'
				].join("\n");
				outputSource = preloadScript + "\n" + outputSource;
			}
		}

		state.saveFile(
			mPath.join(
				state.compiler.config.output,
				state.compiler.config.sourceFileName
			),
			outputSource
		);
		
		state.js.push(state.compiler.config.sourceFileName);
	}
	return SrcHandler;
})();