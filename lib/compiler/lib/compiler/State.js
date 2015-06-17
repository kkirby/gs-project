var	mFs = require('fs'),
	mPath = require('path'),
	CompileException = require('./Exception.js'),
	mJsdom = require('jsdom'),
	mGlob = require('glob'),
	mJsdom = require('jsdom'),
	mCptable = require('codepage');

module.exports = (function(){
	var State = function(compiler,callback){
		this.compiler = compiler;
		this.loadableFiles = [];
		this.files = [];
		this.contents = [];
		this.raw = [];
		this.custom = {};
		var html = this.compiler.config.html;
		if(typeof html == 'function'){
			html = html();
		}
		if(html === false){
			setTimeout(callback,1);
		}
		else {
			mJsdom.env(
				html.replace(/&/g,'&amp;'),
				[mPath.join(__dirname,'..','..','jquery.js')],
				function(err,window){
					this.hasDom = true;
					this.domWindow = window;
					callback();
				}.bind(this)
			);
		}
	}
	State.prototype = {
		domWindow: null,
		hasDom: false,
		compiler: null,
		loadableFiles: null,
		files: null,
		contents: null,
		raw: null,
		custom: null,
		fileInfoCache: {
		
		},
		hasLoadedFile: function(file){
			return this.files.indexOf(file.toLowerCase()) != -1;
		},
		getCustom: function(name,defaultValue){
			defaultValue = defaultValue || {};
			if(typeof this.custom[name] == 'undefined'){
				this.custom[name] = defaultValue;
			}
			return this.custom[name];
		},
		parseAlias: function(alias,relative,type){
			var newAlias = [];
			var relativeAlias = [];
			if(typeof relative != 'undefined'){
				var info = this.getFileInfo(relative);
				relativeAlias = (info.root + '.' + info.fullAlias).split('.');
			}
			alias = alias.split('.');
			for(var i = 0; i < alias.length; i++){
				var part = alias[i];
				if(part == '@' || part == ''){
					if(relativeAlias.length > 0){
						for(var x = 0; x < relativeAlias.length - 1; x++){
							newAlias.push(relativeAlias[x]);
						}
					}
				}
				else if(part == '^'){
					newAlias.pop();
					relativeAlias = newAlias.concat();
				}
				else {
					if(part.substr(0,1) == '#'){
						if(relativeAlias.length > 0){
							part = relativeAlias[relativeAlias.length - 1] + part.substr(1);
							if(i == alias.length - 1 && type == 'src'){
								part = part.substr(0,1).toUpperCase() + part.substr(1);
							}
							else {
								part = part.substr(0,1).toLowerCase() + part.substr(1);
							}
						}
					}
					else if(part.substr(0,1) == '$'){
						if(relativeAlias.length > 1){
							part = relativeAlias[relativeAlias.length - 2] + part.substr(1);
							if(i == alias.length - 1 && type == 'src'){
								part = part.substr(0,1).toUpperCase() + part.substr(1);
							}
							else {
								part = part.substr(0,1).toLowerCase() + part.substr(1);
							}
						}
					}
					newAlias.push(part);
					relativeAlias = newAlias.concat();
				}
			}
			return newAlias.join('.');
		},
		// TODO: Move to Config.js
		getPathFromAliasAndType: function(alias,type,relativeTo){
			alias = this.parseAlias(alias,relativeTo,type).split('.');
			var rootKey = alias.shift();
			var root = null;
			if(typeof this.compiler.config.alias[rootKey] != 'undefined'){
				root = this.compiler.config.alias[rootKey];
			}
			else {
				root = this.compiler.config.alias['root'];
				alias.unshift(rootKey);
			}
			var dir = this.compiler.config.dir[type];
			var extensions = dir.extensions || []
			if(dir.extension){
				extensions.push(dir.extension);
			}
			if(extensions.length == 0){
				if(alias[alias.length - 1].substr(0,1) === '*'){
					extensions.push(null);
				}
				else {
					extensions.push(alias.pop());
				}
			}
			var path = dir.path;
			if(typeof path == 'string'){
				path = [path];
			}
			if(alias[alias.length - 1].substr(0,1) == '*'){
				var ret = [];
				for(var eI = 0; eI < extensions.length; eI++){
					for(var pI = 0; pI < path.length; pI++){
						var extension = extensions[eI];
						if(extension !== null){
							extension = '.' + extension;
						}
						else {
							extension = '';
						}
						var matches = mGlob.sync(
							mPath.join(
								root,
								path[pI].replace(/\./g,mPath.sep),
								alias.join(mPath.sep)
							)+extension
						);
						for(var mI = 0; mI < matches.length; mI++){
							ret.push(matches[mI]);
						}
					}
				}
				return ret;
			}
			else {
				var ret = null;
				baseLoop:
				for(var eI = 0; eI < extensions.length; eI++){
					for(var pI = 0; pI < path.length; pI++){
						ret = mPath.join(
							root,
							path[pI].replace(/\./g,mPath.sep),
							alias.join(mPath.sep)
						)+'.'+extensions[eI];
						if(mFs.existsSync(ret)){
							break baseLoop;
						}
					}
				}
				return ret;
			}
		},
		getFileInfo: function(file){
			if(file instanceof Array){
				var ret = [];
				for(var i = 0; i < file.length; i++){
					ret.push(this.getFileInfo(file[i]));
				}
				return ret;
			}
			var originalFile = file;
			if(typeof this.fileInfoCache[file] == 'undefined'){
				var info = {
					root: null,
					type: null,
					name: null,
					extension: null,
					namespace: null,
					alias: null,
					fullAlias: null
				};
				var root = {
					dir: null,
					key: null
				};
				for(var rootKey in this.compiler.config.alias){
					var rootDir = this.compiler.config.alias[rootKey];
					if(
						file.indexOf(rootDir) == 0 &&
						rootDir.length > (root.key ? root.dir.length : 0)
					){
						root.dir = rootDir;
						root.key = rootKey;
					}
				}
				info.root = root.key;
				file = file.substr(root.dir.length+1);
				var type = {
					dir: null,
					key: null
				};
				var extension = file.substr(file.lastIndexOf('.')+1);
				for(var typeKey in this.compiler.config.dir){
					var typeDir = this.compiler.config.dir[typeKey];
					var path = typeDir.path;
					if(typeof path == 'string'){
						path = [path];
					}
					for(var pI = 0; pI < path.length; pI++){
						var _path = path[pI];
						if(
							file.indexOf(this.compiler.config.resolveAlias(_path)) == 0 &&
							_path.length > (type.dir ? type.dir.path.length : 0)
						){
							if(typeDir.extension && typeDir.extension != extension)continue;
							type.dir = typeDir;
							type.key = typeKey;
						}
					}
				}
				info.type = type.key;
				file = file.substr(type.dir.path.length+1);
				var fileName = file.split(mPath.sep).pop();
				info.extension = fileName.substr(fileName.lastIndexOf('.')+1);
				info.name = fileName.slice(0,-1 * info.extension.length-1);
				var regex = mPath.sep == '/' ? /\//g : /\\/g;
				info.alias = file.slice(0,-1 * info.extension.length-1).replace(regex,'.');
				info.namespace = file.split(mPath.sep).slice(0,-1).join('.');
				info.relative = originalFile.substr(root.dir.length+1);
				info.webUrl = info.relative.replace(/\\/g,'/')
				info.fullAlias = info.alias
				this.fileInfoCache[originalFile] = info;
			}
			return this.fileInfoCache[originalFile];
		},
		readFile: function(file){
			try {
				return mFs.readFileSync(file,{
					encoding: 'binary'
				});
			}
			catch(e){
				throw new CompileException(
					'Unable to read file (%s).',
					file,
					e
				);
			}
		},
		getEncodingForExtension: function(extension){
			var encoding = null;
			var codepage = null;
			var encodings = this.compiler.config.encodings;
			var bom = null
			if(encodings){
				for(var i = 0; i < encodings.length; i++){
					var encodingSpec = encodings[i];
					if(encodingSpec.extensions.indexOf(extension) == -1)continue;
					encoding = encodingSpec.encoding;
					codepage = encodingSpec.codepage;
					bom = encodingSpec.bom;
					break;
				}
			}
			return {encoding:encoding,codepage:codepage,bom:bom};
		},
		saveFile: function(file,contents,saveToLocal){
			if(typeof contents == 'undefined' || saveToLocal == true){
				if(typeof contents == 'undefined'){
					try {
						contents = this.readFile(file);
					}
					catch(e){
						throw new CompileException('Unable to read file.',file,e);
					}
				}
				var fileInfo = this.getFileInfo(file);
				file = mPath.join(this.compiler.config.output,fileInfo.relative);
			}
			var dir = file.substr(0,file.lastIndexOf(mPath.sep));
			try {
				require('wrench').mkdirSyncRecursive(dir);
			}
			catch(e){
				throw new CompileException('Unable to make directory (%s).',dir,e);
			}
			var encodingSpec = this.getEncodingForExtension(file.substr(file.lastIndexOf('.')+1));
			if(encodingSpec.codepage){
				contents = mCptable.utils.encode(encodingSpec.codepage,contents);
			}
			if(encodingSpec.encoding){
				contents = new Buffer(contents,encodingSpec.encoding);
			}
			if(encodingSpec.bom){
				var bom = encodingSpec.bom
				var bomBuff = new Buffer(bom.length);
				for(var i = 0; i < bom.length; i++){
					bomBuff.writeUInt8(bom[i],i);
				}
				contents = Buffer.concat([bomBuff,contents]);
			}
			try {
				mFs.writeFileSync(file,contents,{flag:'w+',encoding:'binary'});
			}
			catch(e){
				throw new CompileException('Unable to save file (%s).',file,e);
			}
		}
	};
	return State;
})();
