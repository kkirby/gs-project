var Handler = require('./Handler.js'),
	sprintf = require('sprintf').sprintf;

module.exports = (function(){
	function HtmlHandler(){}
	HtmlHandler.prototype = Object.create(Handler.prototype);
	HtmlHandler.prototype.processFile = function(state,file){
		var fileInfo = state.getFileInfo(file);
		if(fileInfo.type != 'html')return;
		if(state.hasLoadedFile(file))return;
		var window = state.domWindow;
		var document = window.document;
		var $ = window.$;
		var node = document.body;
		/*var namespaces = fileInfo.namespace.split('.');
		for(var i = 0; i < namespaces.length; i++){
			var namespace = namespaces[i];
			if(namespace != ''){
				var nextNode = $(node).find('> .'+namespace).get(0);
				if(nextNode){
					node = nextNode;
				}
				else {
					var nextNode = document.createElement('div');
					$(nextNode).addClass(namespace).appendTo(node);
					node = nextNode;
				}
			}
		}*/
		var container = document.createElement('div');
		var id = fileInfo.alias.replace(/\./g,'_');
		$(container)
			.prop('id',id)
			.appendTo(node);
		container.innerHTML = state.readFile(file).replace(/&/g,'&amp;');
		var imports = {};
		$(container).find('import').each(function(){
			var $this = $(this);
			var importAlias = $this.attr('alias');
			var importType = $this.attr('type');
			if(!importAlias){
				throw 'Alias is required in import tag: ' + file;
			}
			if(!importAlias){
				throw 'Type is required in import tag: ' + file;
			}
			var path = state.getPathFromAliasAndType(
				importAlias,
				importType,
				file
			);
			var fileInfo = state.getFileInfo(path);
			var importName = $this.attr('as') || fileInfo.name;
			imports[importName] = fileInfo.relative.replace(/\\/g,'/');
			// TODO: Get rid of this, or something. End up using a compiler to handle raw files.
			state.saveFile(path);
			$this.remove();
		});
		$(container).find('*').each(function(){
			var attributes = this.attributes;
			for(var i = 0; i < attributes.length; i++){
				if(attributes[i].name.indexOf('data-import-') == 0){
					$(this)
						.attr(attributes[i].name.substr(12),imports[attributes[i].value])
						.removeAttr(attributes[i].name);
				}
			}
		});
		state.contents.push(
			[
				'let ' + id + ' = document.getElementById(\'' + id + '\').firstElementChild',
				id + '.parentNode.parentNode.removeChild ' + id + '.parentNode'
			].join('\n')
		);
		return {
			src: id
		};
	};
	return HtmlHandler;
})();