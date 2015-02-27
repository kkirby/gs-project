var lunrPath = __import(raw,sys.lunr.js);
var hardWorkerPath = __import(raw,sys.HardWorker.js);

importScripts(lunrPath,hardWorkerPath);

(function(){
	var _lunr = null
	var worker = new HardWorker({
		load: function(data){
			_lunr = lunr.Index.load(JSON.parse(data));
		},
		save: function(){
			return JSON.stringify(_lunr.toJSON());
		},
		setup: function(keys){
			_lunr = lunr(function(){
				this.ref(keys.shift());
				while(keys.length > 0){
					this.field(keys.pop());
				}
			});
		},
		search: function(criteria){
			return _lunr.search(criteria);
		},
		add: function(obj){
			_lunr.add(obj);
		},
		remove: function(obj){
			_lunr.remove(obj)
		},
		update: function(obj){
			_lunr.update(obj);
		}
	});
})();