var OnAppReady = (function(){
	var list = [];
	var ready = false;
	var onLoad = function(callback){
		if(ready){
			callback();
		}
		else {
			list.push(callback);
		}
	}
	onLoad.Ready = function(){
		ready = true;
		while(list.length > 0){
			list.pop()();
		}
	}
	onLoad.IsReady = function(){
		return ready;
	};
	return onLoad;
})();