var uuidPath = __import(raw,sys.uuid.js);
importScripts(uuidPath);

HardWorker = (function(){
	function HardWorker(delegate){
		onmessage = this.onMessage.bind(this);
		this.delegate = delegate;
		this.objectStorage = {};
	}
	
	HardWorker.prototype = {
		respond: function(uuid,success,response){
			postMessage({
				uuid: uuid,
				success: success,
				response: response
			});
		},
		storeObject: function(object,functions){
			var uuid = Uuid();
			object.allProperties = function(){
				var properties = [];
				for(var key in this){
					properties.push(key);
				}
				return properties;
			}
			object.getProperty = function(key){
				return this[key];
			};
			functions.splice(0,0,'allProperties','getProperty')
			this.objectStorage[uuid] = {
				clear: function(){
					delete this.objectStorage[uuid];
				}.bind(this),
				timeout: null,
				renew: function(){
					if(this.timeout){
						clearTimeout(this.timeout);
					}
					this.timeout = setTimeout(this.clear,5000);
				},
				object: object
			};
			this.objectStorage[uuid].renew();
			return {
				refUuid: uuid,
				functions: functions
			};
		},
		onMessage: function(e){
			var data = e.data;
			var respond = this.respond.bind(this,data.uuid);
			var handler = null;
			if(typeof data.refUuid != 'undefined'){
				var reference = this.objectStorage[data.refUuid];
				reference.renew()
				handler = reference.object[data.handler].bind(reference.object);
			}
			else if(data.handler == 'refCount'){
				handler = function(){
					var i = 0;
					for(var key in this.objectStorage){
						i++;
					}
					return i;
				}.bind(this);
			}
			else {
				handler = this.delegate[data.handler].bind(this.delegate);
			}
			try {
				var result = handler.apply(void 0,data.args);
				if(typeof result == 'object' && typeof result.then == 'function'){
					result.then(
						respond.bind(null,true),
						respond.bind(null,false)
					);
				}
				else {
					var functions = [];
					if(typeof result == 'object' && !(result instanceof Array)){
						var isLiteral = result.constructor.name == 'Object';
						for(property in result){
							if(typeof result[property] == 'function'){
								if(!isLiteral || result.hasOwnProperty(property)){
									functions.push(property);
								}
							}
						}
					}
					if(functions.length > 0){
						respond(true,this.storeObject(result,functions));
					}
					else {
						respond(true,result);
					}
				}
			}
			catch(err){
				respond(false,String(err));
			}
		}
	}
	return HardWorker;
})();