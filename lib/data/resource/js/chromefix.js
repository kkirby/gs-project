(function(){
	function Bootstrap(ParentClass){
		if(typeof ParentClass == 'undefined'){
			return ParentClass;
		}
		var Name = ParentClass.name;
		var Obj = null;
		
		var ctor = function(){
			var _this = this instanceof Obj ? this : Object.create(Obj.prototype);
			ParentClass.prototype.constructor.apply(_this, arguments);
			return _this;
		}
		
		eval('Obj = function '+Name+'(){ return ctor.apply(this,arguments); };');
		var e = Obj.prototype = Object.create(ParentClass.prototype);
		e.constructor = Obj;
		return Obj;
	}
	
	window.Map = Bootstrap(Map);
});

Map = undefined;