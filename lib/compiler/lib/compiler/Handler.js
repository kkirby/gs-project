module.exports = (function(){
	function Handler(){
		
	}
	Handler.prototype = {
		processFile: function(){},
		afterProcessed: function(){},
		reset: function(){},
		beforeCompile: function(){}
	};
	return Handler;
})();
