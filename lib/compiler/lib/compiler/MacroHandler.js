var Handler = require('./Handler.js'),
	CompilerException = require('./Exception.js'),
	sprintf = require('sprintf').sprintf;

module.exports = (function(){
	function MacroHandler(){}
	MacroHandler.prototype = Object.create(Handler.prototype);
	MacroHandler.getMacros = function(state){
		return state.getCustom('macroHandler',{data:[]}).data.join('\n');
	}
	MacroHandler.prototype.processFile = function(state,file){
		if(state.getFileInfo(file).type != 'macro')return;
		if(state.hasLoadedFile(file))return;
		var fileContents = state.readFile(file);
		var custom = state.getCustom('macroHandler',{data:[]});
		custom.data.push(
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