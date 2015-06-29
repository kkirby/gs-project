var BS = (function(){
	function Bootstrap(ParentClass){
		if(typeof ParentClass == 'undefined'){
			return ParentClass;
		}
		var Name = ParentClass.name;
		var Obj = null;
		
		function CreateParent(args){
			args = Array.prototype.slice.call(args);
			args.unshift(ParentClass);
			return new (
				Function.prototype.bind.apply(
					args[0],
					args
				)
			);
		}
		
		var ctor = function(){
			if(this instanceof Obj){
				this.instance = CreateParent(arguments);
			}
			else {
				return CreateParent(arguments);
			}
		}
		
		eval('Obj = function '+Name+'Asdf(){ return ctor.apply(this,arguments); };');
		Obj.prototype = Object.create(ParentClass.prototype);
		var proto = ParentClass.prototype;
		for(var key in proto){
			console.log(key);
			//if(!proto.hasOwnProperty(key))continue;
			Obj.prototype[key] = function(arg){
				return this.instance[key](arg);
			};
		}
		//e.constructor = Obj;
		return Obj;
	}
	return Bootstrap;
	window.Map = Bootstrap(Map);
});

//Map = undefined;