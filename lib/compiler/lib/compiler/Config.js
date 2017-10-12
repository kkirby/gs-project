var	mFs = require('fs'),
	mPath = require('path');

module.exports = (function(){
	function Config(userConfig){
		this.userConfig = userConfig;
		this.processUserConfig();
	}
	
	Config.prototype = {
		userConfig: null,
		domWindow: null,
		alias: null,
		dir: null,
		applicationName: null,
		html: null,
		main: null,
		build: null,
		saveRawGs: false,
		saveRawScss: false,
		handlers: null,
		encodings: null,
		noHelper: false,
		sourceFileName: 'source.js',
		clean: true,
		macros: [],
		checkForUnusedImports: false,
		defines: {},
		getPathUsingAliases: function(path,aliases,ignore){
			ignore = ignore || [];
			var pathParts = path.split(mPath.sep);
			for(var i = 0; i < pathParts.length; i++){
				var pathPartParts = pathParts[i].split('.');
				for(var pI = 0; pI < pathPartParts.length; pI++){
					pathParts.splice(i+pI,pI==0?1:0,pathPartParts[pI]);
				}
				i += pathPartParts.length-1;
			}
			ignore.push(pathParts[pathParts.length-1]);
			pathParts = pathParts.map(function(pathPart){
				if(typeof aliases[pathPart] != 'undefined' && ignore.indexOf(pathPart) == -1){
					return this.getPathUsingAliases(aliases[pathPart],aliases,ignore);
				}
				else {
					return pathPart;
				}
			}.bind(this));
			return pathParts.join(mPath.sep);
		},
		resolveAlias: function(alias){
			return this.getPathUsingAliases(alias,this.alias);
		},
		processDirsWithAlias: function(dirs,alias){
			for(var key in dirs){
				dirs[key].path = this.getPathUsingAliases(dirs[key].path,alias);
			}
			return dirs;
		},
		processUserConfig: function(){
			var userConfig = this.userConfig;
			this.saveRawGs = userConfig.saveRawGs;
			this.alias = userConfig.alias;
			this.main = userConfig.main;
			this.handlers = userConfig.handlers;
			this.saveRawScss = userConfig.saveRawScss;
			this.encodings = userConfig.encodings;
			this.macros = userConfig.macros || [];
			this.checkForUnusedImports = userConfig.checkForUnusedImports === true;
			this.defines = userConfig.defines || {};
			if(userConfig.sourceFileName){
				this.sourceFileName = userConfig.sourceFileName;
			}
			if(userConfig.noHelper){
				this.noHelper = userConfig.noHelper;
			}
			if(typeof userConfig.clean == 'boolean'){
				this.clean = userConfig.clean;
			}
			if(userConfig.output.indexOf('file://') == 0){
				this.output = userConfig.output.substr(7);
			}
			else {
				this.output = this.getPathUsingAliases(userConfig.output,userConfig.alias);
			}
			//this.dir = this.processDirsWithAlias(userConfig.dir,userConfig.alias);
			this.dir = userConfig.dir;
			this.applicationName = userConfig.applicationName;
			if(userConfig.html !== false){
				this.html = userConfig.html.indexOf('file://') == 0 ?
						function(){
							return mFs.readFileSync(userConfig.html.substr(7),'utf8')
						} :
						userConfig.html
			}
			else {
				this.html = false;
			}
					
		},
		emitEvent: function(event,data){
			if(this.handlers && this.handlers[event]){
				this.handlers[event](data);
			}
		}
	};
	return Config;
})();
