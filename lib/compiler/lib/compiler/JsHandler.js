var Handler = require('./Handler.js'),
	CompilerException = require('./Exception.js');

module.exports = (function(){
	function JsHandler(){}
	JsHandler.prototype = Object.create(Handler.prototype);
	JsHandler.getScripts = function(state){
		return state.getCustom('jsHandler',{data:[]}).data.join('\n');
	}
	JsHandler.prototype.processFile = function(state,file){
		if(state.getFileInfo(file).type != 'js')return;
		if(state.hasLoadedFile(file))return;
		var custom = state.getCustom('jsHandler',{data:[]});
		custom.data.push(
			state.readFile(file).replace(
				/__import\(([^\,]+),([^\)]+)\)(;)?/g,
				function(whole,type,alias,ending){
					var path = state.getPathFromAliasAndType(
						alias,
						type,
						file
					);
					var extras = state.compiler.processFile(
						state,
						path
					);
					var extra = extras('src');
					if(!extra){
						extra = extras('namespace');
					}
					if(extra){
						return extra + (ending ? ending : '');
					}
					else {
						return '';
					}
				}
			)
		);
	};
	return JsHandler;
})();