var sprintf = require('sprintf').sprintf;
module.exports = (function(){
	function Exception(){
		var args = Array.prototype.slice.apply(arguments);
		this.message = sprintf.apply(sprintf,args.slice(0,-1));
		this.previous = args[args.length-1];
	}
	Exception.prototype = {
		toString: function(){
			return this.message + "\n" + this.previous;
		}
	}
	return Exception;
})();
	