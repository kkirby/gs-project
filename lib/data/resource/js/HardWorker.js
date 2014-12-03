HardWorker = (function(){
	function Uuid(cb){
		OnAppReady(function(){
			var _uuid = __import(src,sys.lib.Uuid);
			cb(_uuid.Fast());
		});
	}
	function HardWorker(uri){
		this.worker = new Worker(uri);
		this.worker.onmessage = this._onMessage.bind(this);
		this._response = {};
	}
	
	HardWorker.Extend = function(){
		var handlers = Array.prototype.slice.apply(arguments);
		var uri = handlers.shift();
		function _(){
			HardWorker.apply(this,[uri]);
		}
		_.prototype = Object.create(HardWorker.prototype);
		while(handlers.length > 0){
			(function(handler){
				_.prototype[handler] = function(){
					var args = Array.prototype.slice.apply(arguments);
					args.splice(0,0,handler,undefined);
					return this.post.apply(this,args);
				};
			})(handlers.pop());
		}
		return _;
	}
	
	HardWorker.prototype = {
		_onMessage: function(e){
			var data = e.data;
			var response = data.response;
			var uuid = data.uuid;
			if(typeof response != 'undefined' && typeof response.refUuid != 'undefined'){
				var reference = response;
				response = {};
				while(reference.functions.length > 0){
					var functionName = reference.functions.pop();
					response[functionName] = this.post.bind(this,functionName,reference.refUuid);
				}
			}
			if(data.success){
				this._response[uuid][0](response);
			}
			else {
				this._response[uuid][1](response)
			}
			delete this._response[uuid];
		},
		refCount: function(){
			return this.post('refCount');
		},
		post: function(handler,refUuid){
			var args = Array.prototype.slice.apply(arguments).slice(2);
			return new Promise(function(resolve,reject){
				Uuid(function(uuid){
					this._response[uuid] = [resolve,reject];
					this.worker.postMessage({
						handler: handler,
						refUuid: refUuid,
						args: args,
						uuid: uuid
					});
				}.bind(this));
			}.bind(this));
		}
	}
	return HardWorker;
})();