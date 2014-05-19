var Handler = require('./Handler.js'),
	CompilerException = require('./Exception.js'),
	sprintf = require('sprintf').sprintf;

module.exports = (function(){
	function MacroHandler(){}
	MacroHandler.prototype = Object.create(Handler.prototype);
	MacroHandler.prototype.processFile = function(state,file){
		if(state.getFileInfo(file).type != 'macro')return;
		if(state.hasLoadedFile(file))return;
		var fileContents = state.readFile(file);
		state.contents.push(
			sprintf(
				'//startfile %s:%s %s\n%s',
				1,
				0,
				file,
				state.readFile(file)
			)
		);
	};
	return MacroHandler;
})();