module.exports = (function(){
	var isEqual = function(a,b){
		if(typeof a == 'string'){
			return a == b;
		}
		else if(a instanceof Array){
			if(b instanceof Array){
				if(a.length != b.length)return false;
				for(var i = 0; i < a.length; i++){
					if(isEqual(a[i],b[i]))return false;
				}
				return true;
			}
			else {
				return false;
			}
		}
		else if(typeof a == 'object'){
			if(typeof b == 'object'){
				for(var key in a){
					if(!isEqual(a[key],b[key])){
						return false;
					}
				}
				return true;
			}
			else {
				return false;
			}
		}
		else {
			return a == b;
		}
	}
	var contains = function(list,needle){
		for(var i = 0; i < list.length; i++){
			if(isEqual(list[i],needle))return true;
		}
		return false;
	}
	var mergeRecursive = function(defaults,users,mergeArray){
		if(typeof mergeArray == 'undefined')mergeArray = false;
		if(mergeArray && users instanceof Array && defaults instanceof Array){
			for(var i = 0; i < users.length; i++){
				if(!contains(defaults,users[i])){
					defaults.push(users[i]);
				}
			}
			return defaults;
		}
		else if(typeof users == 'object' && typeof defaults == 'object'){
			for(var key in users){
				defaults[key] = mergeRecursive(defaults[key],users[key],mergeArray);
			}
			return defaults;
		}
		else {
			if(typeof users != 'undefined'){
				return users;
			}
			else {
				return defaults;
			}
		}
	}
	
	return {
		get: function(defaults,users,override){
			var res = mergeRecursive(
				require(defaults),
				require(users),
				true
			);
			if(override && typeof res.overrides[override] == 'object'){
				res = mergeRecursive(
					res,
					res.overrides[override]
				);
			}
			return res;
		}
	};
})();