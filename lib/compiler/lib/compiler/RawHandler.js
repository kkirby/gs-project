var Handler = require('./Handler.js')

module.exports = (function(){
	function RawHandler(){}
	RawHandler.prototype = Object.create(Handler.prototype);
	RawHandler.prototype.processFile = function(state,file){
		if(state.getFileInfo(file).type != 'raw')return;
		var pathInfo = state.getFileInfo(file);
		if(!state.hasLoadedFile(file)){
			state.saveFile(file);
			state.loadableFiles.push(pathInfo.webUrl);
		}
		return {
			webUrl: pathInfo.webUrl,
			src: '\''+pathInfo.webUrl+'\''
		}
	};
	return RawHandler;
})();