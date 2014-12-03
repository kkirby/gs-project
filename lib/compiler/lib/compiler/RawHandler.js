var Handler = require('./Handler.js')

module.exports = (function(){
	function RawHandler(){}
	RawHandler.prototype = Object.create(Handler.prototype);
	RawHandler.prototype.processFile = function(state,file){
		if(state.getFileInfo(file).type != 'raw')return;
		var pathInfo = state.getFileInfo(file);
		if(!state.hasLoadedFile(file)){
			if(file.indexOf('js') !== -1){
				var relativeDir = pathInfo.webUrl.substr(0,pathInfo.webUrl.lastIndexOf('/')+1);
				var contents = state.readFile(file).replace(/__import\(([^\,]+),([^\)]+)\)/g,function(whole,type,alias){
					var path = state.getPathFromAliasAndType(
						alias,
						type,
						file
					);
					return JSON.stringify(
						state.compiler.processFile(
							state,
							path
						)('webUrl').replace(relativeDir,'')
					);
				})
				state.saveFile(file,contents,true);
			}
			else {
				state.saveFile(file);
			}
			state.loadableFiles.push(pathInfo.webUrl);
		}
		return {
			webUrl: pathInfo.webUrl,
			src: '\''+pathInfo.webUrl+'\''
		}
	};
	return RawHandler;
})();