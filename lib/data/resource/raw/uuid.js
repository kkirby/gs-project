Uuid = (function(){
	var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
	return function(){
		var uuid = new Array(36);
		var random = 0;
		for(var i = 0; i <= 35; i++){
			if(i == 8 || i == 13 || i == 18 || i == 23){
				uuid[i] = '-'
			}
			else if(i == 14){
				uuid[i] = 4;
			}
			else {
				if(random <= 0x02){
					random = 0x2000000 + (Math.random()*0x1000000) | 0;
				}
				var r = random & 0xf
				random = random >> 4
				uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
			}
		}
		return uuid.join('');
	};
})();