var Handler = require('./Handler.js'),
	CompilerException = require('./Exception.js');

module.exports = (function(){
	function JsHandler(){}
	JsHandler.prototype = Object.create(Handler.prototype);
	JsHandler.prototype.processFile = function(state,file){
		if(state.getFileInfo(file).type != 'js')return;
		if(state.hasLoadedFile(file))return;
		state.raw.push(
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