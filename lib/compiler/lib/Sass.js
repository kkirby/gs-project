var
	spawnSync = require('child_process').spawnSync,
	mPath = require('path');

module.exports = (function(){
	function Sass(){}

	Sass.Compile = function(text){
		var sass = require('node-sass');
		var types = sass.types
		
		var funcs = {};
		Object.getOwnPropertyNames(Math).forEach(function(key){
			var value = Math[key];
			if(typeof value != 'function')return;
			var args = [];
			for(var i = 0; i < value.length; i++){
				args.push('$'+String.fromCharCode(65 + i));
			}
			funcs[key+'('+args.join(',')+')'] = function(){
				var args = Array.prototype.slice.apply(arguments).filter(function(arg){
					return arg instanceof types.Number;
				}).map(function(arg){
					return arg.getValue();
				});
				var result = new types.Number(value.apply(Math,args));
				// Set the result unit to that of the input unit
				// We only do it if there is one argument
				// This is sort-of a lazy thing to do since this
				// may not always be the case. But ooohhh welll.
				if(args.length == 1){
					result.setUnit(arguments[0].getUnit());
				}
				return result;
			}
		});
		funcs['PI()'] = function(){
			return new types.Number(Math.PI);
		}
		
		return sass.renderSync({
			data: text,
			functions: funcs
		}).css;
	};
	
	return Sass;
})();