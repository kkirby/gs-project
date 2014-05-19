var Handler = require('./Handler.js'),
	CompilerException = require('./Exception.js');

module.exports = (function(){
	function JsHandler(){}
	JsHandler.prototype = Object.create(Handler.prototype);
	JsHandler.prototype.processFile = function(state,file){
		if(state.getFileInfo(file).type != 'js')return;
		if(state.hasLoadedFile(file))return;
		state.raw.push(state.readFile(file))
	};
	return JsHandler;
})();