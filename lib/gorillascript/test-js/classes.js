(function (GLOBAL) {
  "use strict";
  var __create, __curry, __genericFunc, __getInstanceof, __isArray, __name,
      __new, __num, __owns, __slice, __strnum, __toArray, __typeof, expect,
      hasName, WeakMap;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __curry = function (numArgs, f) {
    var currier;
    if (typeof numArgs !== "number") {
      throw new TypeError("Expected numArgs to be a Number, got " + __typeof(numArgs));
    }
    if (typeof f !== "function") {
      throw new TypeError("Expected f to be a Function, got " + __typeof(f));
    }
    if (numArgs > 1) {
      currier = function (args) {
        var ret;
        if (args.length >= numArgs) {
          return f.apply(this, args);
        } else {
          ret = function () {
            if (arguments.length === 0) {
              return ret;
            } else {
              return currier.call(this, args.concat(__slice.call(arguments)));
            }
          };
          return ret;
        }
      };
      return currier([]);
    } else {
      return f;
    }
  };
  __genericFunc = function (numArgs, make) {
    var any, cache, result;
    cache = new WeakMap();
    any = {};
    function generic() {
      var _ref, current, i, item, type;
      current = cache;
      for (i = numArgs - 1; i >= 0; --i) {
        if ((_ref = arguments[i]) != null) {
          type = _ref;
        } else {
          type = any;
        }
        item = current.get(type);
        if (item == null) {
          if (i === 0) {
            item = make.apply(this, arguments);
          } else {
            item = new WeakMap();
          }
          current.set(type, item);
        }
        current = item;
      }
      return current;
    }
    result = generic();
    result.generic = generic;
    return result;
  };
  __getInstanceof = (function () {
    function isAny() {
      return true;
    }
    function isStr(x) {
      return typeof x === "string";
    }
    function isNum(x) {
      return typeof x === "number";
    }
    function isFunc(x) {
      return typeof x === "function";
    }
    function isBool(x) {
      return typeof x === "boolean";
    }
    function isObject(x) {
      return typeof x === "object" && x !== null;
    }
    return function (ctor) {
      if (ctor == null) {
        return isAny;
      } else {
        switch (ctor) {
        case String: return isStr;
        case Number: return isNum;
        case Function: return isFunc;
        case Boolean: return isBool;
        case Array: return __isArray;
        case Object: return isObject;
        default:
          return function (_x) {
            return _x instanceof ctor;
          };
        }
      }
    };
  }());
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function (_toString) {
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }(Object.prototype.toString));
  __name = function (func) {
    if (typeof func !== "function") {
      throw new TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    return func.displayName || func.name || "";
  };
  __new = (function () {
    var newCreators;
    newCreators = [];
    return function () {
      var creator, func, i, length;
      if (typeof this !== "function") {
        throw new Error("Expected this to be a Function, got " + (typeof this === "undefined" ? "Undefined" : __typeof(this)));
      }
      length = arguments.length;
      creator = newCreators[length];
      if (!creator) {
        func = ["return new C("];
        for (i = 0, __num(length); i < length; ++i) {
          if (i > 0) {
            func.push(", ");
          }
          func.push("a[", i, "]");
        }
        func.push(");");
        newCreators[length] = creator = Function("C", "a", func.join(""));
      }
      return creator(this, arguments);
    };
  }());
  __num = function (num) {
    if (typeof num !== "number") {
      throw new TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
  };
  __owns = Object.prototype.hasOwnProperty;
  __slice = Array.prototype.slice;
  __strnum = function (strnum) {
    var type;
    type = typeof strnum;
    if (type === "string") {
      return strnum;
    } else if (type === "number") {
      return String(strnum);
    } else {
      throw new TypeError("Expected a string or number, got " + __typeof(strnum));
    }
  };
  __toArray = function (x) {
    if (x == null) {
      throw new TypeError("Expected an object, got " + __typeof(x));
    } else if (__isArray(x)) {
      return x;
    } else if (typeof x === "string") {
      return x.split("");
    } else if (typeof x.length === "number") {
      return __slice.call(x);
    } else {
      throw new TypeError("Expected an object with a length property, got " + __typeof(x));
    }
  };
  __typeof = (function () {
    var _toString;
    _toString = Object.prototype.toString;
    return function (o) {
      if (o === void 0) {
        return "Undefined";
      } else if (o === null) {
        return "Null";
      } else {
        return o.constructor && o.constructor.name || _toString.call(o).slice(8, -1);
      }
    };
  }());
  WeakMap = typeof GLOBAL.WeakMap === "function" ? GLOBAL.WeakMap
    : (WeakMap = (function () {
      var _WeakMap_prototype, defProp, isExtensible;
      function WeakMap() {
        var _this;
        _this = this instanceof WeakMap ? this : __create(_WeakMap_prototype);
        _this._keys = [];
        _this._values = [];
        _this._chilly = [];
        _this._uid = createUid();
        return _this;
      }
      _WeakMap_prototype = WeakMap.prototype;
      WeakMap.displayName = "WeakMap";
      function uidRand() {
        return Math.random().toString(36).slice(2);
      }
      function createUid() {
        return uidRand() + "-" + new Date().getTime() + "-" + uidRand() + "-" + uidRand();
      }
      isExtensible = Object.isExtensible || function () {
        return true;
      };
      function check(key) {
        var chilly, uid;
        uid = this._uid;
        if (__owns.call(key, uid)) {
          chilly = this._chilly;
          if (chilly.indexOf(key) === -1) {
            chilly.push(key);
            this._keys.push(key);
            this._values.push(key[uid]);
          }
        }
      }
      _WeakMap_prototype.get = function (key) {
        var _ref, index;
        if (Object(key) !== key) {
          throw new TypeError("Invalid value used as weak map key");
        }
        if (isExtensible(key)) {
          if (__owns.call(key, _ref = this._uid)) {
            return key[_ref];
          }
        } else {
          check.call(this, key);
          index = this._keys.indexOf(key);
          if (index !== -1) {
            return this._values[index];
          }
        }
      };
      _WeakMap_prototype.has = function (key) {
        if (Object(key) !== key) {
          throw new TypeError("Invalid value used as weak map key");
        }
        if (isExtensible(key)) {
          return __owns.call(key, this._uid);
        } else {
          check.call(this, key);
          return this._keys.indexOf(key) !== -1;
        }
      };
      if (typeof Object.defineProperty === "function") {
        defProp = Object.defineProperty;
      } else {
        defProp = function (o, k, d) {
          o[k] = d.value;
        };
      }
      _WeakMap_prototype.set = function (key, value) {
        var index, keys;
        if (Object(key) !== key) {
          throw new TypeError("Invalid value used as weak map key");
        }
        if (isExtensible(key)) {
          defProp(key, this._uid, { configurable: true, writable: true, enumerable: false, value: value });
        } else {
          check.call(this, key);
          keys = this._keys;
          index = keys.indexOf(key);
          if (index === -1) {
            index = keys.length;
            keys[index] = key;
          }
          this._values[index] = value;
        }
      };
      _WeakMap_prototype["delete"] = function (key) {
        var index, keys;
        if (Object(key) !== key) {
          throw new TypeError("Invalid value used as weak map key");
        }
        if (isExtensible(key)) {
          delete key[this._uid];
        } else {
          check.call(this, key);
          keys = this._keys;
          index = keys.indexOf(key);
          if (index !== -1) {
            keys.splice(index, 1);
            this._values.splice(index, 1);
          }
        }
      };
      return WeakMap;
    }()));
  expect = require("chai").expect;
  hasName = (function () {
    function func() {}
    return func.name === "func";
  }());
  describe("classes", function () {
    it("empty class", function () {
      var Class;
      Class = (function () {
        var _prototype;
        _prototype = _class.prototype;
        function _class() {
          if (this instanceof _class) {
            return this;
          } else {
            return __create(_prototype);
          }
        }
        return _class;
      }());
      expect(Class).to.be.a("function");
      expect(Class).to.have.length(0);
      expect(new Class()).to.be.an["instanceof"](Class);
      return expect(Class()).to.be.an["instanceof"](Class);
    });
    it("empty class, two-level inheritance", function () {
      var Base, Child;
      Base = (function () {
        var _prototype;
        _prototype = _class.prototype;
        function _class() {
          if (this instanceof _class) {
            return this;
          } else {
            return __create(_prototype);
          }
        }
        return _class;
      }());
      Child = (function (Base) {
        var _Base_prototype, _prototype;
        _Base_prototype = Base.prototype;
        _prototype = _class.prototype = __create(_Base_prototype);
        _prototype.constructor = _class;
        if (typeof Base.extended === "function") {
          Base.extended(_class);
        }
        function _class() {
          var _ref, _this;
          if (this instanceof _class) {
            _this = this;
          } else {
            _this = __create(_prototype);
          }
          _ref = Base.apply(_this, arguments);
          if (Object(_ref) === _ref) {
            return _ref;
          } else {
            return _this;
          }
        }
        return _class;
      }(Base));
      expect(Child).to.be.a("function");
      expect(Child).to.have.length(0);
      expect(new Child()).to.be.an["instanceof"](Child);
      expect(Child()).to.be.an["instanceof"](Child);
      expect(new Child()).to.be.an["instanceof"](Base);
      return expect(Child()).to.be.an["instanceof"](Base);
    });
    it("simple class, empty constructor", function () {
      var Class;
      Class = (function () {
        var _prototype;
        function _class() {
          var _this;
          _this = this instanceof _class ? this : __create(_prototype);
          return _this;
        }
        _prototype = _class.prototype;
        return _class;
      }());
      expect(Class).to.be.a("function");
      return expect(new Class()).to.be.an["instanceof"](Class);
    });
    it("simple class, simple constructor", function () {
      var Class, hitConstructor;
      hitConstructor = false;
      Class = (function () {
        var _prototype;
        function _class() {
          var _this;
          _this = this instanceof _class ? this : __create(_prototype);
          hitConstructor = true;
          return _this;
        }
        _prototype = _class.prototype;
        return _class;
      }());
      expect(Class).to.be.a("function");
      expect(hitConstructor).to.be["false"];
      expect(new Class()).to.be.an["instanceof"](Class);
      return expect(hitConstructor).to.be["true"];
    });
    it(
      "empty class, two-level inheritance, base constructor is hit",
      function () {
        var Base, Child, hitConstructor;
        hitConstructor = false;
        Base = (function () {
          var _prototype;
          function _class() {
            var _this;
            _this = this instanceof _class ? this : __create(_prototype);
            hitConstructor = true;
            return _this;
          }
          _prototype = _class.prototype;
          return _class;
        }());
        Child = (function (Base) {
          var _Base_prototype, _prototype;
          _Base_prototype = Base.prototype;
          _prototype = _class.prototype = __create(_Base_prototype);
          _prototype.constructor = _class;
          if (typeof Base.extended === "function") {
            Base.extended(_class);
          }
          function _class() {
            var _ref, _this;
            if (this instanceof _class) {
              _this = this;
            } else {
              _this = __create(_prototype);
            }
            _ref = Base.apply(_this, arguments);
            if (Object(_ref) === _ref) {
              return _ref;
            } else {
              return _this;
            }
          }
          return _class;
        }(Base));
        expect(Child).to.be.a("function");
        expect(Child).to.have.length(0);
        expect(hitConstructor).to.be["false"];
        expect(new Child()).to.be.an["instanceof"](Child);
        expect(hitConstructor).to.be["true"];
        return expect(new Child()).to.be.an["instanceof"](Base);
      }
    );
    it("calling super from child constructor", function () {
      var Base, Child, hitConstructor;
      hitConstructor = false;
      Base = (function () {
        var _prototype;
        function _class() {
          var _this;
          _this = this instanceof _class ? this : __create(_prototype);
          hitConstructor = true;
          return _this;
        }
        _prototype = _class.prototype;
        return _class;
      }());
      Child = (function (Base) {
        var _Base_prototype, _prototype;
        function _class() {
          var _this;
          _this = this instanceof _class ? this : __create(_prototype);
          Base.call(_this);
          return _this;
        }
        _Base_prototype = Base.prototype;
        _prototype = _class.prototype = __create(_Base_prototype);
        _prototype.constructor = _class;
        if (typeof Base.extended === "function") {
          Base.extended(_class);
        }
        return _class;
      }(Base));
      expect(Child).to.be.a("function");
      expect(Child).to.have.length(0);
      expect(hitConstructor).to.equal(false);
      new Child();
      return expect(hitConstructor).to.equal(true);
    });
    it("simple class with members", function () {
      var Class, obj;
      Class = (function () {
        var _prototype;
        _prototype = _class.prototype;
        function _class() {
          if (this instanceof _class) {
            return this;
          } else {
            return __create(_prototype);
          }
        }
        _prototype.method = function () {
          var args;
          args = __slice.call(arguments);
          return [this, args];
        };
        return _class;
      }());
      obj = new Class();
      expect(obj).to.be.an["instanceof"](Class);
      expect(obj.method()).to.eql([obj, []]);
      expect(obj.method("alpha")).to.eql([obj, ["alpha"]]);
      return expect(obj.method("alpha", "bravo")).to.eql([
        obj,
        ["alpha", "bravo"]
      ]);
    });
    it("calling super from a child method", function () {
      var Base, base, Child, child;
      Base = (function () {
        var _prototype;
        _prototype = _class.prototype;
        function _class() {
          if (this instanceof _class) {
            return this;
          } else {
            return __create(_prototype);
          }
        }
        _prototype.method = function () {
          var args;
          args = __slice.call(arguments);
          return [this, args];
        };
        _prototype.other = function (value) {
          return __num(value) + 1;
        };
        return _class;
      }());
      expect(Base).to.be.a("function");
      base = new Base();
      expect(base.method()).to.eql([base, []]);
      expect(base.method("alpha")).to.eql([base, ["alpha"]]);
      expect(base.method("alpha", "bravo")).to.eql([
        base,
        ["alpha", "bravo"]
      ]);
      expect(base.other(4)).to.equal(5);
      Child = (function (Base) {
        var _Base_prototype, _prototype;
        _Base_prototype = Base.prototype;
        _prototype = _class.prototype = __create(_Base_prototype);
        _prototype.constructor = _class;
        if (typeof Base.extended === "function") {
          Base.extended(_class);
        }
        function _class() {
          var _ref, _this;
          if (this instanceof _class) {
            _this = this;
          } else {
            _this = __create(_prototype);
          }
          _ref = Base.apply(_this, arguments);
          if (Object(_ref) === _ref) {
            return _ref;
          } else {
            return _this;
          }
        }
        _prototype.other = function (value) {
          return __num(_Base_prototype.other.call(this, value)) + 1;
        };
        return _class;
      }(Base));
      expect(Child).to.be.a("function");
      child = new Child();
      expect(child.method()).to.eql([child, []]);
      expect(child.method("alpha")).to.eql([child, ["alpha"]]);
      expect(child.method("alpha", "bravo")).to.eql([
        child,
        ["alpha", "bravo"]
      ]);
      return expect(child.other(3)).to.equal(5);
    });
    it("class can have private static variables", function () {
      var calls, Class;
      calls = 5;
      Class = (function () {
        var _prototype, calls;
        _prototype = _class.prototype;
        function _class() {
          if (this instanceof _class) {
            return this;
          } else {
            return __create(_prototype);
          }
        }
        calls = 0;
        _prototype.hello = function () {
          ++calls;
          return "Hello: " + calls;
        };
        return _class;
      }());
      expect(new Class().hello()).to.equal("Hello: 1");
      expect(new Class().hello()).to.equal("Hello: 2");
      return expect(calls).to.equal(5);
    });
    it("class with logic in declaration", function () {
      var Alpha, Bravo;
      function make(value) {
        var Class;
        Class = (function () {
          var _prototype;
          _prototype = _class.prototype;
          function _class() {
            if (this instanceof _class) {
              return this;
            } else {
              return __create(_prototype);
            }
          }
          if (value) {
            _prototype.name = function () {
              return "alpha";
            };
          } else {
            _prototype.name = function () {
              return "bravo";
            };
          }
          return _class;
        }());
        return Class;
      }
      Alpha = make(true);
      Bravo = make(false);
      expect(new Alpha().name()).to.equal("alpha");
      return expect(new Bravo().name()).to.equal("bravo");
    });
    it("calling super and passing along all arguments", function () {
      var Base, Child, child;
      Base = (function () {
        var _prototype;
        _prototype = _class.prototype;
        function _class() {
          if (this instanceof _class) {
            return this;
          } else {
            return __create(_prototype);
          }
        }
        _prototype.thing = function () {
          var args;
          args = __slice.call(arguments);
          return [this, args];
        };
        return _class;
      }());
      Child = (function (Base) {
        var _Base_prototype, _prototype;
        _Base_prototype = Base.prototype;
        _prototype = _class.prototype = __create(_Base_prototype);
        _prototype.constructor = _class;
        if (typeof Base.extended === "function") {
          Base.extended(_class);
        }
        function _class() {
          var _ref, _this;
          if (this instanceof _class) {
            _this = this;
          } else {
            _this = __create(_prototype);
          }
          _ref = Base.apply(_this, arguments);
          if (Object(_ref) === _ref) {
            return _ref;
          } else {
            return _this;
          }
        }
        _prototype.thing = function () {
          var args;
          args = __slice.call(arguments);
          return [
            this,
            args,
            _Base_prototype.thing.apply(this, args)
          ];
        };
        return _class;
      }(Base));
      child = new Child();
      expect(child.thing()).to.eql([
        child,
        [],
        [child, []]
      ]);
      expect(child.thing("alpha")).to.eql([
        child,
        ["alpha"],
        [child, ["alpha"]]
      ]);
      return expect(child.thing("alpha", "bravo")).to.eql([
        child,
        ["alpha", "bravo"],
        [
          child,
          ["alpha", "bravo"]
        ]
      ]);
    });
    it("public static members", function () {
      var NoCtor, WithCtor, WithLateCtor;
      NoCtor = (function () {
        var _prototype;
        _prototype = _class.prototype;
        function _class() {
          if (this instanceof _class) {
            return this;
          } else {
            return __create(_prototype);
          }
        }
        _class["static"] = "alpha";
        return _class;
      }());
      expect(NoCtor["static"]).to.equal("alpha");
      expect(new NoCtor()["static"]).to.equal(void 0);
      WithCtor = (function () {
        var _prototype;
        function _class() {
          var _this;
          _this = this instanceof _class ? this : __create(_prototype);
          return _this;
        }
        _prototype = _class.prototype;
        _class["static"] = "bravo";
        return _class;
      }());
      expect(WithCtor["static"]).to.equal("bravo");
      expect(new WithCtor()["static"]).to.equal(void 0);
      WithLateCtor = (function () {
        var _prototype;
        function _class() {
          var _this;
          _this = this instanceof _class ? this : __create(_prototype);
          return _this;
        }
        _prototype = _class.prototype;
        _class["static"] = "charlie";
        return _class;
      }());
      expect(WithLateCtor["static"]).to.equal("charlie");
      return expect(new WithLateCtor()["static"]).to.equal(void 0);
    });
    it("nested classes", function () {
      var Outer;
      Outer = (function () {
        var _prototype;
        function _class() {
          var _this;
          _this = this instanceof _class ? this : __create(_prototype);
          _this.label = "Outer";
          return _this;
        }
        _prototype = _class.prototype;
        _prototype.method = function () {
          return "from outer";
        };
        _class.Inner = (function () {
          var _prototype2;
          function _class2() {
            var _this;
            _this = this instanceof _class2 ? this : __create(_prototype2);
            _this.label = "Inner";
            return _this;
          }
          _prototype2 = _class2.prototype;
          _prototype2.method = function () {
            return "from inner";
          };
          return _class2;
        }());
        return _class;
      }());
      expect(new Outer().label).to.equal("Outer");
      expect(new Outer().label).to.equal("Outer");
      expect(new Outer().method()).to.equal("from outer");
      expect(new Outer().method()).to.equal("from outer");
      expect(new (Outer.Inner)().label).to.equal("Inner");
      expect(new (Outer.Inner)().label).to.equal("Inner");
      expect(new (Outer.Inner)().method()).to.equal("from inner");
      return expect(new (Outer.Inner)().method()).to.equal("from inner");
    });
    it("named nested classes", function () {
      var Outer;
      Outer = (function () {
        var _Outer_prototype;
        function Outer() {
          var _this;
          _this = this instanceof Outer ? this : __create(_Outer_prototype);
          _this.label = "Outer";
          return _this;
        }
        _Outer_prototype = Outer.prototype;
        Outer.displayName = "Outer";
        _Outer_prototype.method = function () {
          return "from outer";
        };
        Outer.Inner = (function () {
          var _Inner_prototype;
          function Inner() {
            var _this;
            _this = this instanceof Inner ? this : __create(_Inner_prototype);
            _this.label = "Inner";
            return _this;
          }
          _Inner_prototype = Inner.prototype;
          Inner.displayName = "Inner";
          _Inner_prototype.method = function () {
            return "from inner";
          };
          return Inner;
        }());
        return Outer;
      }());
      expect(new Outer().label).to.equal("Outer");
      expect(new Outer().label).to.equal("Outer");
      expect(new Outer().method()).to.equal("from outer");
      expect(new Outer().method()).to.equal("from outer");
      expect(new (Outer.Inner)().label).to.equal("Inner");
      expect(new (Outer.Inner)().label).to.equal("Inner");
      expect(new (Outer.Inner)().method()).to.equal("from inner");
      expect(new (Outer.Inner)().method()).to.equal("from inner");
      if (hasName) {
        expect(Outer.name).to.equal("Outer");
        return expect(Outer.Inner.name).to.equal("Inner");
      }
    });
    it("Nested inheritance", function () {
      var Outer;
      Outer = (function () {
        var _prototype;
        function _class() {
          var _this;
          _this = this instanceof _class ? this : __create(_prototype);
          _this.label = "Outer";
          return _this;
        }
        _prototype = _class.prototype;
        _prototype.outer = function () {
          return "outer";
        };
        _prototype.method = function () {
          return "from outer";
        };
        _class.Inner = (function (_class) {
          var _prototype2, _this_prototype;
          function _class2() {
            var _this;
            _this = this instanceof _class2 ? this : __create(_prototype2);
            _this.label = "Inner";
            return _this;
          }
          _this_prototype = _class.prototype;
          _prototype2 = _class2.prototype = __create(_this_prototype);
          _prototype2.constructor = _class2;
          if (typeof _class.extended === "function") {
            _class.extended(_class2);
          }
          _prototype2.method = function () {
            return "from inner";
          };
          return _class2;
        }(_class));
        return _class;
      }());
      expect(new Outer().label).to.equal("Outer");
      expect(new Outer().label).to.equal("Outer");
      expect(new Outer().method()).to.equal("from outer");
      expect(new Outer().method()).to.equal("from outer");
      expect(new Outer().outer()).to.equal("outer");
      expect(new Outer().outer()).to.equal("outer");
      expect(new (Outer.Inner)().label).to.equal("Inner");
      expect(new (Outer.Inner)().label).to.equal("Inner");
      expect(new (Outer.Inner)().method()).to.equal("from inner");
      expect(new (Outer.Inner)().method()).to.equal("from inner");
      expect(new (Outer.Inner)().outer()).to.equal("outer");
      expect(new (Outer.Inner)().outer()).to.equal("outer");
      expect(new (Outer.Inner)()).to.be.an["instanceof"](Outer.Inner);
      expect(new (Outer.Inner)()).to.be.an["instanceof"](Outer);
      expect(new Outer()).to.be.an["instanceof"](Outer);
      return expect(new Outer()).to.not.be.an["instanceof"](Outer.Inner);
    });
    it("a four-level inheritance chain", function () {
      var Base, FirstChild, SecondChild, ThirdChild;
      Base = (function () {
        var _prototype;
        function _class(name) {
          var _this;
          _this = this instanceof _class ? this : __create(_prototype);
          _this.name = name;
          return _this;
        }
        _prototype = _class.prototype;
        _prototype.bark = function () {
          return "arf";
        };
        _class["static"] = "static";
        return _class;
      }());
      expect(Base).to.have.length(1);
      expect(Base["static"]).to.equal("static");
      expect(new Base("name").name).to.equal("name");
      expect(new Base("name").bark()).to.equal("arf");
      FirstChild = (function (Base) {
        var _Base_prototype, _prototype;
        _Base_prototype = Base.prototype;
        _prototype = _class.prototype = __create(_Base_prototype);
        _prototype.constructor = _class;
        if (typeof Base.extended === "function") {
          Base.extended(_class);
        }
        function _class() {
          var _ref, _this;
          if (this instanceof _class) {
            _this = this;
          } else {
            _this = __create(_prototype);
          }
          _ref = Base.apply(_this, arguments);
          if (Object(_ref) === _ref) {
            return _ref;
          } else {
            return _this;
          }
        }
        _prototype.bark = function () {
          return "woof";
        };
        return _class;
      }(Base));
      expect(new FirstChild("name").name).to.equal("name");
      expect(new FirstChild("name").bark()).to.equal("woof");
      SecondChild = (function (FirstChild) {
        var _FirstChild_prototype, _prototype;
        function _class(name, sign) {
          var _this;
          _this = this instanceof _class ? this : __create(_prototype);
          FirstChild.call(_this, name);
          _this.sign = sign;
          return _this;
        }
        _FirstChild_prototype = FirstChild.prototype;
        _prototype = _class.prototype = __create(_FirstChild_prototype);
        _prototype.constructor = _class;
        if (typeof FirstChild.extended === "function") {
          FirstChild.extended(_class);
        }
        return _class;
      }(FirstChild));
      expect(SecondChild).to.have.length(2);
      expect(new SecondChild("name", "taurus").name).to.equal("name");
      expect(new SecondChild("name", "taurus").sign).to.equal("taurus");
      expect(new SecondChild("name", "taurus").bark()).to.equal("woof");
      ThirdChild = (function (SecondChild) {
        var _prototype, _SecondChild_prototype;
        _SecondChild_prototype = SecondChild.prototype;
        _prototype = _class.prototype = __create(_SecondChild_prototype);
        _prototype.constructor = _class;
        if (typeof SecondChild.extended === "function") {
          SecondChild.extended(_class);
        }
        function _class() {
          var _ref, _this;
          if (this instanceof _class) {
            _this = this;
          } else {
            _this = __create(_prototype);
          }
          _ref = SecondChild.apply(_this, arguments);
          if (Object(_ref) === _ref) {
            return _ref;
          } else {
            return _this;
          }
        }
        _prototype.bark = function (name) {
          return __strnum(_SecondChild_prototype.bark.call(this)) + ", " + __strnum(name);
        };
        return _class;
      }(SecondChild));
      expect(new ThirdChild("name", "taurus").name).to.equal("name");
      expect(new ThirdChild("name", "taurus").sign).to.equal("taurus");
      return expect(new ThirdChild("name", "taurus").bark("sammy")).to.equal("woof, sammy");
    });
    it("spread constructor", function () {
      var arr, Class;
      Class = (function () {
        var _prototype;
        function _class() {
          var _this, args;
          _this = this instanceof _class ? this : __create(_prototype);
          args = __slice.call(arguments);
          _this.args = args;
          return _this;
        }
        _prototype = _class.prototype;
        return _class;
      }());
      expect(Class).to.have.length(0);
      expect(new Class("alpha", "bravo", "charlie").args).to.eql(["alpha", "bravo", "charlie"]);
      arr = [1, 2, 3];
      expect(__new.apply(Class, arr)).to.be.an["instanceof"](Class);
      return expect(__new.apply(Class, arr).args).to.eql(arr);
    });
    it("class with JS-keyword properties as method names", function () {
      var Class;
      Class = (function () {
        var _prototype;
        _prototype = _class.prototype;
        function _class() {
          if (this instanceof _class) {
            return this;
          } else {
            return __create(_prototype);
          }
        }
        _prototype["if"] = function () {
          return true;
        };
        _prototype["while"] = true;
        return _class;
      }());
      expect(new Class()["if"]()).to.equal(true);
      return expect(new Class()["while"]).to.equal(true);
    });
    it("class with literal string names", function () {
      var Class, obj;
      Class = (function () {
        var _prototype;
        _prototype = _class.prototype;
        function _class() {
          if (this instanceof _class) {
            return this;
          } else {
            return __create(_prototype);
          }
        }
        _prototype.method = function () {
          return "method";
        };
        _prototype["other method"] = function () {
          return "other method";
        };
        return _class;
      }());
      obj = new Class();
      expect(obj).to.be.an["instanceof"](Class);
      expect(obj.method()).to.equal("method");
      return expect(obj["other method"]()).to.equal("other method");
    });
    it(
      "namespaced classes don't reserve their name outside their scope",
      function () {
        var alpha, bravo;
        alpha = {};
        bravo = {};
        alpha.Monkey = (function () {
          var _prototype;
          _prototype = _class.prototype;
          function _class() {
            if (this instanceof _class) {
              return this;
            } else {
              return __create(_prototype);
            }
          }
          _class.label = "alpha";
          return _class;
        }());
        bravo.Monkey = (function () {
          var _prototype;
          _prototype = _class.prototype;
          function _class() {
            if (this instanceof _class) {
              return this;
            } else {
              return __create(_prototype);
            }
          }
          _class.label = "bravo";
          return _class;
        }());
        expect(typeof Monkey).to.equal("undefined");
        expect(alpha.Monkey.label).to.equal("alpha");
        return expect(bravo.Monkey.label).to.equal("bravo");
      }
    );
    it("class factory", function () {
      var Base, Child;
      function makeClass(superClass) {
        return (function (superClass) {
          var _prototype, _superClass_prototype;
          _superClass_prototype = superClass.prototype;
          _prototype = _class.prototype = __create(_superClass_prototype);
          _prototype.constructor = _class;
          if (typeof superClass.extended === "function") {
            superClass.extended(_class);
          }
          function _class() {
            var _ref, _this;
            if (this instanceof _class) {
              _this = this;
            } else {
              _this = __create(_prototype);
            }
            _ref = superClass.apply(_this, arguments);
            if (Object(_ref) === _ref) {
              return _ref;
            } else {
              return _this;
            }
          }
          _prototype.fun = function () {
            return __strnum(_superClass_prototype.fun.call(this)) + " B";
          };
          return _class;
        }(superClass));
      }
      Base = (function () {
        var _prototype;
        _prototype = _class.prototype;
        function _class() {
          if (this instanceof _class) {
            return this;
          } else {
            return __create(_prototype);
          }
        }
        _prototype.fun = function () {
          return "A";
        };
        return _class;
      }());
      Child = makeClass(Base);
      return expect(new Child().fun()).to.equal("A B");
    });
    it("named class", function () {
      var Class;
      Class = (function () {
        var _Class_prototype;
        _Class_prototype = Class.prototype;
        Class.displayName = "Class";
        function Class() {
          if (this instanceof Class) {
            return this;
          } else {
            return __create(_Class_prototype);
          }
        }
        _Class_prototype.method = function () {
          return "result";
        };
        Class["static"] = "hello";
        return Class;
      }());
      expect(Class).to.be.a("function");
      expect(Class).to.have.length(0);
      expect(Class.displayName).to.equal("Class");
      expect(new Class()).to.be.an["instanceof"](Class);
      expect(new Class().method()).to.equal("result");
      expect(Class["static"]).to.equal("hello");
      if (hasName) {
        return expect(Class.name).to.equal("Class");
      }
    });
    it("namespaced named classes", function () {
      var alpha, bravo;
      alpha = {};
      bravo = {};
      alpha.Monkey = (function () {
        var _Monkey_prototype;
        _Monkey_prototype = Monkey.prototype;
        Monkey.displayName = "Monkey";
        function Monkey() {
          if (this instanceof Monkey) {
            return this;
          } else {
            return __create(_Monkey_prototype);
          }
        }
        Monkey.label = "alpha";
        return Monkey;
      }());
      bravo.Monkey = (function () {
        var _Monkey_prototype;
        _Monkey_prototype = Monkey.prototype;
        Monkey.displayName = "Monkey";
        function Monkey() {
          if (this instanceof Monkey) {
            return this;
          } else {
            return __create(_Monkey_prototype);
          }
        }
        Monkey.label = "bravo";
        return Monkey;
      }());
      expect(typeof Monkey).to.equal("undefined");
      expect(alpha.Monkey.label).to.equal("alpha");
      expect(bravo.Monkey.label).to.equal("bravo");
      expect(alpha.Monkey.displayName).to.equal("Monkey");
      expect(bravo.Monkey.displayName).to.equal("Monkey");
      if (hasName) {
        expect(alpha.Monkey.name).to.equal("Monkey");
        return expect(bravo.Monkey.name).to.equal("Monkey");
      }
    });
    it(
      "named class as an expression rather than a statement",
      function () {
        var Alpha, Bravo;
        Alpha = Bravo = (function () {
          var _Bravo_prototype;
          _Bravo_prototype = Bravo.prototype;
          Bravo.displayName = "Bravo";
          function Bravo() {
            if (this instanceof Bravo) {
              return this;
            } else {
              return __create(_Bravo_prototype);
            }
          }
          _Bravo_prototype.method = function () {
            return "blah";
          };
          return Bravo;
        }());
        expect(Bravo).to.equal(Alpha);
        expect(Alpha.displayName).to.equal("Bravo");
        expect(new Alpha()).to.be.an["instanceof"](Bravo);
        expect(new Bravo()).to.be.an["instanceof"](Alpha);
        if (hasName) {
          return expect(Alpha.name).to.equal("Bravo");
        }
      }
    );
    it("named class with inheritance", function () {
      var Alpha, Bravo;
      Alpha = (function () {
        var _Alpha_prototype;
        _Alpha_prototype = Alpha.prototype;
        Alpha.displayName = "Alpha";
        function Alpha() {
          if (this instanceof Alpha) {
            return this;
          } else {
            return __create(_Alpha_prototype);
          }
        }
        _Alpha_prototype.method = function () {
          return "alpha";
        };
        return Alpha;
      }());
      Bravo = (function (Alpha) {
        var _Alpha_prototype, _Bravo_prototype;
        _Alpha_prototype = Alpha.prototype;
        _Bravo_prototype = Bravo.prototype = __create(_Alpha_prototype);
        _Bravo_prototype.constructor = Bravo;
        Bravo.displayName = "Bravo";
        if (typeof Alpha.extended === "function") {
          Alpha.extended(Bravo);
        }
        function Bravo() {
          var _ref, _this;
          if (this instanceof Bravo) {
            _this = this;
          } else {
            _this = __create(_Bravo_prototype);
          }
          _ref = Alpha.apply(_this, arguments);
          if (Object(_ref) === _ref) {
            return _ref;
          } else {
            return _this;
          }
        }
        _Bravo_prototype.method = function () {
          return __strnum(_Alpha_prototype.method.call(this)) + " bravo";
        };
        return Bravo;
      }(Alpha));
      expect(new Alpha().method()).to.equal("alpha");
      expect(new Bravo().method()).to.equal("alpha bravo");
      if (hasName) {
        expect(Alpha.name).to.equal("Alpha");
        return expect(Bravo.name).to.equal("Bravo");
      }
    });
    it("namespaced named class with inheritance", function () {
      var alpha, Base, bravo;
      Base = (function () {
        var _Base_prototype;
        _Base_prototype = Base.prototype;
        Base.displayName = "Base";
        function Base() {
          if (this instanceof Base) {
            return this;
          } else {
            return __create(_Base_prototype);
          }
        }
        _Base_prototype.method = function () {
          return "base";
        };
        return Base;
      }());
      alpha = {};
      bravo = {};
      alpha.Child = (function (Base) {
        var _Base_prototype, _Child_prototype;
        _Base_prototype = Base.prototype;
        _Child_prototype = Child.prototype = __create(_Base_prototype);
        _Child_prototype.constructor = Child;
        Child.displayName = "Child";
        if (typeof Base.extended === "function") {
          Base.extended(Child);
        }
        function Child() {
          var _ref, _this;
          if (this instanceof Child) {
            _this = this;
          } else {
            _this = __create(_Child_prototype);
          }
          _ref = Base.apply(_this, arguments);
          if (Object(_ref) === _ref) {
            return _ref;
          } else {
            return _this;
          }
        }
        _Child_prototype.method = function () {
          return __strnum(_Base_prototype.method.call(this)) + " alpha";
        };
        return Child;
      }(Base));
      bravo.Child = (function (Base) {
        var _Base_prototype, _Child_prototype;
        _Base_prototype = Base.prototype;
        _Child_prototype = Child.prototype = __create(_Base_prototype);
        _Child_prototype.constructor = Child;
        Child.displayName = "Child";
        if (typeof Base.extended === "function") {
          Base.extended(Child);
        }
        function Child() {
          var _ref, _this;
          if (this instanceof Child) {
            _this = this;
          } else {
            _this = __create(_Child_prototype);
          }
          _ref = Base.apply(_this, arguments);
          if (Object(_ref) === _ref) {
            return _ref;
          } else {
            return _this;
          }
        }
        _Child_prototype.method = function () {
          return __strnum(_Base_prototype.method.call(this)) + " bravo";
        };
        return Child;
      }(Base));
      expect(new (alpha.Child)().method()).to.equal("base alpha");
      expect(new (bravo.Child)().method()).to.equal("base bravo");
      if (hasName) {
        expect(Base.name).to.equal("Base");
        expect(alpha.Child.name).to.equal("Child");
        return expect(bravo.Child.name).to.equal("Child");
      }
    });
    it("class with calculated method names", function () {
      var Class, obj;
      Class = (function () {
        var _Class_prototype, _f, i;
        _Class_prototype = Class.prototype;
        Class.displayName = "Class";
        function Class() {
          if (this instanceof Class) {
            return this;
          } else {
            return __create(_Class_prototype);
          }
        }
        for (i = 1, _f = function (i) {
          return _Class_prototype["method" + i] = function () {
            return i;
          };
        }; i < 4; ++i) {
          _f.call(Class, i);
        }
        return Class;
      }());
      obj = new Class();
      expect(obj.method1()).to.equal(1);
      expect(obj.method2()).to.equal(2);
      return expect(obj.method3()).to.equal(3);
    });
    it("class with interpolated method names", function () {
      var Class, obj;
      Class = (function () {
        var _Class_prototype, _f, i;
        _Class_prototype = Class.prototype;
        Class.displayName = "Class";
        function Class() {
          if (this instanceof Class) {
            return this;
          } else {
            return __create(_Class_prototype);
          }
        }
        for (i = 1, _f = function (i) {
          return _Class_prototype["method" + i] = function () {
            return i;
          };
        }; i < 4; ++i) {
          _f.call(Class, i);
        }
        return Class;
      }());
      obj = new Class();
      expect(obj.method1()).to.equal(1);
      expect(obj.method2()).to.equal(2);
      return expect(obj.method3()).to.equal(3);
    });
    it("calling class without new returns correct class", function () {
      var anon, Class;
      Class = (function () {
        var _Class_prototype;
        _Class_prototype = Class.prototype;
        Class.displayName = "Class";
        function Class() {
          if (this instanceof Class) {
            return this;
          } else {
            return __create(_Class_prototype);
          }
        }
        return Class;
      }());
      expect(Class()).to.be.an["instanceof"](Class);
      anon = (function () {
        var _prototype;
        _prototype = _class.prototype;
        function _class() {
          if (this instanceof _class) {
            return this;
          } else {
            return __create(_prototype);
          }
        }
        return _class;
      }());
      return expect(anon()).to.be.an["instanceof"](anon);
    });
    it(
      "calling class without new doesn't throw an error with constructor",
      function () {
        var anon, Class;
        Class = (function () {
          var _Class_prototype;
          function Class() {
            var _this;
            _this = this instanceof Class ? this : __create(_Class_prototype);
            return _this;
          }
          _Class_prototype = Class.prototype;
          Class.displayName = "Class";
          return Class;
        }());
        expect(Class()).to.be.an["instanceof"](Class);
        expect(new Class()).to.be.an["instanceof"](Class);
        anon = (function () {
          var _prototype;
          function _class() {
            var _this;
            _this = this instanceof _class ? this : __create(_prototype);
            return _this;
          }
          _prototype = _class.prototype;
          return _class;
        }());
        expect(anon()).to.be.an["instanceof"](anon);
        return expect(new anon()).to.be.an["instanceof"](anon);
      }
    );
    it("multiple constructors", function () {
      var falsy, truthy;
      function makeClass(value) {
        var Class;
        return Class = (function () {
          var _Class_prototype, _ctor;
          _Class_prototype = Class.prototype;
          Class.displayName = "Class";
          _ctor = void 0;
          function Class() {
            var _ref, _this;
            if (this instanceof Class) {
              _this = this;
            } else {
              _this = __create(_Class_prototype);
            }
            if (typeof _ctor === "function") {
              _ref = _ctor.apply(_this, arguments);
              if (Object(_ref) === _ref) {
                return _ref;
              }
            }
            return _this;
          }
          Class["static"] = value;
          if (value) {
            _ctor = function () {
              var _this;
              _this = this instanceof Class ? this : __create(_Class_prototype);
              _this.value = true;
              return _this;
            };
          } else {
            _ctor = function () {
              var _this;
              _this = this instanceof Class ? this : __create(_Class_prototype);
              _this.value = false;
              return _this;
            };
          }
          return Class;
        }());
      }
      truthy = makeClass(true);
      falsy = makeClass(false);
      expect(new truthy().value).to.be["true"];
      expect(new falsy().value).to.be["false"];
      expect(truthy.displayName).to.equal("Class");
      expect(falsy.displayName).to.equal("Class");
      expect(truthy["static"]).to.be["true"];
      return expect(falsy["static"]).to.be["false"];
    });
    it("bound constructors", function () {
      var Class;
      Class = (function () {
        var _Class_prototype;
        function Class(value) {
          var _this;
          _this = this instanceof Class ? this : __create(_Class_prototype);
          _this.value = value;
          return _this;
        }
        _Class_prototype = Class.prototype;
        Class.displayName = "Class";
        return Class;
      }());
      expect(Class("alpha")).to.be.an["instanceof"](Class);
      expect(new Class("bravo")).to.be.an["instanceof"](Class);
      expect(Class("charlie").value).to.equal("charlie");
      return expect(new Class("delta").value).to.equal("delta");
    });
    it("constructor set to other function", function () {
      var Class;
      Class = (function () {
        var _Class_prototype, _ctor;
        _Class_prototype = Class.prototype;
        Class.displayName = "Class";
        _ctor = void 0;
        function Class() {
          var _ref, _this;
          if (this instanceof Class) {
            _this = this;
          } else {
            _this = __create(_Class_prototype);
          }
          if (typeof _ctor === "function") {
            _ref = _ctor.apply(_this, arguments);
            if (Object(_ref) === _ref) {
              return _ref;
            }
          }
          return _this;
        }
        function ctor(value) {
          this.value = value;
        }
        _ctor = ctor;
        return Class;
      }());
      expect(new Class()).to.be.an["instanceof"](Class);
      return expect(new Class("alpha").value).to.equal("alpha");
    });
    it(
      "constructor set to mutable function, later changed.",
      function () {
        var Class;
        Class = (function () {
          var _Class_prototype, _ctor, ctor;
          _Class_prototype = Class.prototype;
          Class.displayName = "Class";
          _ctor = void 0;
          function Class() {
            var _ref, _this;
            if (this instanceof Class) {
              _this = this;
            } else {
              _this = __create(_Class_prototype);
            }
            if (typeof _ctor === "function") {
              _ref = _ctor.apply(_this, arguments);
              if (Object(_ref) === _ref) {
                return _ref;
              }
            }
            return _this;
          }
          _ctor = ctor = function (value) {
            this.value = value;
          };
          ctor = null;
          return Class;
        }());
        expect(new Class()).to.be.an["instanceof"](Class);
        return expect(new Class("alpha").value).to.equal("alpha");
      }
    );
    it("constructor set to provided function", function () {
      var Class;
      function make(ctor) {
        return (function () {
          var _ctor, _prototype;
          _prototype = _class.prototype;
          _ctor = void 0;
          function _class() {
            var _ref, _this;
            if (this instanceof _class) {
              _this = this;
            } else {
              _this = __create(_prototype);
            }
            if (typeof _ctor === "function") {
              _ref = _ctor.apply(_this, arguments);
              if (Object(_ref) === _ref) {
                return _ref;
              }
            }
            return _this;
          }
          _ctor = ctor;
          return _class;
        }());
      }
      Class = make(function (value) {
        var _this;
        _this = this;
        return (function () {
          _this.value = value;
        }());
      });
      expect(new Class()).to.be.an["instanceof"](Class);
      return expect(new Class("alpha").value).to.equal("alpha");
    });
    it("bound static methods", function () {
      var Class, obj;
      obj = {};
      Class = (function () {
        var _Class_prototype;
        function Class(id) {
          var _this;
          _this = this instanceof Class ? this : __create(_Class_prototype);
          _this.id = id;
          return _this;
        }
        _Class_prototype = Class.prototype;
        Class.displayName = "Class";
        Class["new"] = function () {
          return new Class(obj);
        };
        return Class;
      }());
      expect(Class["new"]()).to.be.an["instanceof"](Class);
      return expect(Class["new"]().id).to.equal(obj);
    });
    it("extending expressions rather than simple accesses", function () {
      var Base, Child;
      Base = (function () {
        var _Base_prototype;
        _Base_prototype = Base.prototype;
        Base.displayName = "Base";
        function Base() {
          if (this instanceof Base) {
            return this;
          } else {
            return __create(_Base_prototype);
          }
        }
        return Base;
      }());
      function id(x) {
        return x;
      }
      Child = (function (_super) {
        var _Child_prototype, _super_prototype;
        _super_prototype = _super.prototype;
        _Child_prototype = Child.prototype = __create(_super_prototype);
        _Child_prototype.constructor = Child;
        Child.displayName = "Child";
        if (typeof _super.extended === "function") {
          _super.extended(Child);
        }
        function Child() {
          var _ref, _this;
          if (this instanceof Child) {
            _this = this;
          } else {
            _this = __create(_Child_prototype);
          }
          _ref = _super.apply(_this, arguments);
          if (Object(_ref) === _ref) {
            return _ref;
          } else {
            return _this;
          }
        }
        return Child;
      }(id(Base)));
      expect(new Child()).to.be.an["instanceof"](Child);
      return expect(new Child()).to.be.an["instanceof"](Base);
    });
    it("Named class that is a reserved word", function () {
      var obj;
      obj = {};
      obj["if"] = (function () {
        var _prototype;
        _prototype = _class.prototype;
        function _class() {
          if (this instanceof _class) {
            return this;
          } else {
            return __create(_prototype);
          }
        }
        return _class;
      }());
      return expect(new (obj["if"])()).to.be.an["instanceof"](obj["if"]);
    });
    it("constructor with this setters", function () {
      var Class;
      Class = (function () {
        var _Class_prototype;
        function Class(alpha, bravo) {
          var _this;
          _this = this instanceof Class ? this : __create(_Class_prototype);
          _this.alpha = alpha;
          _this.bravo = bravo;
          return _this;
        }
        _Class_prototype = Class.prototype;
        Class.displayName = "Class";
        return Class;
      }());
      expect(new Class("charlie", "delta")).to.be.an["instanceof"](Class);
      expect(new Class("charlie", "delta").alpha).to.equal("charlie");
      return expect(new Class("charlie", "delta").bravo).to.equal("delta");
    });
    it("bound constructor with this setters", function () {
      var Class;
      Class = (function () {
        var _Class_prototype;
        function Class(alpha, bravo) {
          var _this;
          _this = this instanceof Class ? this : __create(_Class_prototype);
          _this.alpha = alpha;
          _this.bravo = bravo;
          return _this;
        }
        _Class_prototype = Class.prototype;
        Class.displayName = "Class";
        return Class;
      }());
      delete GLOBAL.alpha;
      expect(Class("charlie", "delta")).to.be.an["instanceof"](Class);
      expect(!__owns.call(GLOBAL, "alpha")).to.be["true"];
      expect(Class("charlie", "delta").alpha).to.equal("charlie");
      return expect(Class("charlie", "delta").bravo).to.equal("delta");
    });
    it(
      "using super without having a superclass should direct to Object",
      function () {
        var Class;
        Class = (function () {
          var _Class_prototype;
          function Class(value) {
            var _this;
            _this = this instanceof Class ? this : __create(_Class_prototype);
            _this.value = value;
            return _this;
          }
          _Class_prototype = Class.prototype;
          Class.displayName = "Class";
          _Class_prototype.has = function (key) {
            return Object.prototype.hasOwnProperty.call(this, key);
          };
          return Class;
        }());
        expect(new Class()).to.be.an["instanceof"](Class);
        expect(new Class()).to.be.an["instanceof"](Object);
        return expect(new Class().has("value")).to.be["true"];
      }
    );
    it("default value on method", function () {
      var Class;
      Class = (function () {
        var _Class_prototype;
        _Class_prototype = Class.prototype;
        Class.displayName = "Class";
        function Class() {
          if (this instanceof Class) {
            return this;
          } else {
            return __create(_Class_prototype);
          }
        }
        _Class_prototype.method = function (value) {
          if (value == null) {
            value = "hello";
          }
          return value;
        };
        return Class;
      }());
      expect(new Class()).to.be.an["instanceof"](Class);
      expect(new Class().method()).to.equal("hello");
      return expect(new Class().method("there")).to.equal("there");
    });
    it("type checking on method", function () {
      var Class;
      Class = (function () {
        var _Class_prototype;
        _Class_prototype = Class.prototype;
        Class.displayName = "Class";
        function Class() {
          if (this instanceof Class) {
            return this;
          } else {
            return __create(_Class_prototype);
          }
        }
        _Class_prototype.method = function (value) {
          if (typeof value !== "string") {
            throw new TypeError("Expected value to be a String, got " + __typeof(value));
          }
          return value;
        };
        return Class;
      }());
      expect(new Class()).to.be.an["instanceof"](Class);
      expect(new Class().method("hello")).to.equal("hello");
      expect(new Class().method("there")).to.equal("there");
      expect(function () {
        return new Class().method();
      }).throws(TypeError);
      expect(function () {
        return new Class().method(void 0);
      }).throws(TypeError);
      expect(function () {
        return new Class().method(null);
      }).throws(TypeError);
      expect(function () {
        return new Class().method(0);
      }).throws(TypeError);
      expect(function () {
        return new Class().method({});
      }).throws(TypeError);
      return expect(function () {
        return new Class().method([]);
      }).throws(TypeError);
    });
    it("Empty definition turns into not implemented", function () {
      var Class;
      Class = (function () {
        var _Class_prototype;
        _Class_prototype = Class.prototype;
        Class.displayName = "Class";
        function Class() {
          if (this instanceof Class) {
            return this;
          } else {
            return __create(_Class_prototype);
          }
        }
        _Class_prototype.method = function () {
          throw new Error("Not implemented: " + __name(this.constructor) + ".method()");
        };
        return Class;
      }());
      return expect(function () {
        return new Class().method();
      }).throws(Error, "Not implemented: Class.method()");
    });
    it("Immediate new call of a class", function () {
      var object;
      object = new (function () {
        var _prototype;
        _prototype = _class.prototype;
        function _class() {
          if (this instanceof _class) {
            return this;
          } else {
            return __create(_prototype);
          }
        }
        return _class;
      }())();
      return expect(object).to.be.an("object");
    });
    it("Class with a curried constructor", function () {
      var Class, f, g, obj;
      Class = (function () {
        var _Class_prototype, _ctor;
        _Class_prototype = Class.prototype;
        Class.displayName = "Class";
        _ctor = void 0;
        function Class() {
          var _ref, _this;
          if (this instanceof Class) {
            _this = this;
          } else {
            _this = __create(_Class_prototype);
          }
          if (typeof _ctor === "function") {
            _ref = _ctor.apply(_this, arguments);
            if (Object(_ref) === _ref) {
              return _ref;
            }
          }
          return _this;
        }
        _ctor = __curry(3, function (a, b, c) {
          var _this;
          _this = this instanceof Class ? this : __create(_Class_prototype);
          _this.a = a;
          _this.b = b;
          _this.c = c;
          return _this;
        });
        return Class;
      }());
      expect(Class.displayName).to.equal("Class");
      if (hasName) {
        expect(Class.name).to.equal("Class");
      }
      expect(Class(1, 2, 3)).to.be.an["instanceof"](Class);
      expect(new Class(1, 2, 3)).to.be.an["instanceof"](Class);
      expect(Class(1, 2, 3).a).to.equal(1);
      expect(Class(1, 2, 3).b).to.equal(2);
      expect(Class(1, 2, 3).c).to.equal(3);
      f = Class(1);
      expect(f).to.be.a("function");
      expect(f(2, 3)).to.be.an["instanceof"](Class);
      expect(new f(2, 3)).to.be.an["instanceof"](Class);
      obj = __create(Class.prototype);
      expect(f.call(obj, 2, 3)).to.equal(obj);
      expect(obj.a).to.equal(1);
      expect(obj.b).to.equal(2);
      expect(obj.c).to.equal(3);
      g = f(2);
      expect(g).to.be.a("function");
      expect(g(3)).to.be.an["instanceof"](Class);
      expect(new g(3)).to.be.an["instanceof"](Class);
      expect(g(3).a).to.equal(1);
      expect(g(3).b).to.equal(2);
      expect(g(3).c).to.equal(3);
      return expect(g(4).c).to.equal(4);
    });
    it("Generic class", function () {
      var Class, x;
      Class = __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return (function () {
          var _Class_prototype;
          function Class(value) {
            var _this;
            _this = this instanceof Class ? this : __create(_Class_prototype);
            if (!_instanceof_T(value)) {
              throw new TypeError("Expected value to be a " + __name(T) + ", got " + __typeof(value));
            }
            _this.value = value;
            return _this;
          }
          _Class_prototype = Class.prototype;
          Class.displayName = "Class<" + (T != null ? __name(T) : "") + ">";
          return Class;
        }());
      });
      x = { Class: Class };
      expect(Class.generic(String)("hello")).to.be.an["instanceof"](Class.generic(String));
      expect(Class.generic(String)("hello")).to.not.be.an["instanceof"](Class);
      expect(x.Class.generic(String)("hello")).to.be.an["instanceof"](x.Class.generic(String));
      expect(new (Class.generic(String))("hello")).to.be.an["instanceof"](Class.generic(String));
      expect(new (x.Class.generic(String))("hello")).to.be.an["instanceof"](x.Class.generic(String));
      expect(Class.generic(String)("hello").value).to.equal("hello");
      expect(Class.generic(String).displayName).to.equal("Class<String>");
      expect(Class.generic(Number).displayName).to.equal("Class<Number>");
      expect(Class("hello")).to.be.an["instanceof"](Class);
      expect(Class("hello")).to.not.be.an["instanceof"](Class.generic(String));
      expect(Class(1234)).to.be.an["instanceof"](Class);
      expect(Class({})).to.be.an["instanceof"](Class);
      expect(Class("hello").value).to.equal("hello");
      expect(Class(1234).value).to.equal(1234);
      expect(Class(x).value).to.equal(x);
      expect(Class.generic(null)).to.equal(Class);
      expect(Class.generic(void 0)).to.equal(Class);
      return expect(Class.displayName).to.equal("Class<>");
    });
    it("Generic class extending normal class", function () {
      var Base, Child, x;
      Base = (function () {
        var _Base_prototype;
        _Base_prototype = Base.prototype;
        Base.displayName = "Base";
        function Base() {
          if (this instanceof Base) {
            return this;
          } else {
            return __create(_Base_prototype);
          }
        }
        _Base_prototype.alpha = function () {
          return "Base.alpha()";
        };
        _Base_prototype.bravo = function () {
          return "Base.bravo()";
        };
        return Base;
      }());
      Child = __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return (function (Base) {
          var _Base_prototype, _Child_prototype;
          _Base_prototype = Base.prototype;
          _Child_prototype = Child.prototype = __create(_Base_prototype);
          _Child_prototype.constructor = Child;
          Child.displayName = "Child<" + (T != null ? __name(T) : "") + ">";
          if (typeof Base.extended === "function") {
            Base.extended(Child);
          }
          function Child() {
            var _ref, _this;
            if (this instanceof Child) {
              _this = this;
            } else {
              _this = __create(_Child_prototype);
            }
            _ref = Base.apply(_this, arguments);
            if (Object(_ref) === _ref) {
              return _ref;
            } else {
              return _this;
            }
          }
          _Child_prototype.bravo = function () {
            return "Child.bravo(), not " + __strnum(_Base_prototype.bravo.call(this));
          };
          _Child_prototype.charlie = function (value) {
            if (!_instanceof_T(value)) {
              throw new TypeError("Expected value to be a " + __name(T) + ", got " + __typeof(value));
            }
            return "Child.charlie(" + String(value) + ")";
          };
          return Child;
        }(Base));
      });
      x = Child.generic(Number)();
      expect(x).to.be.an["instanceof"](Base);
      expect(x).to.be.an["instanceof"](Child.generic(Number));
      expect(x.alpha()).to.equal("Base.alpha()");
      expect(x.bravo()).to.equal("Child.bravo(), not Base.bravo()");
      expect(x.charlie(1234)).to.equal("Child.charlie(1234)");
      return expect(function () {
        return x.charlie("hello");
      }).throws(TypeError);
    });
    it("Generic class extending generic class", function () {
      var Base, Child, x;
      Base = __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return (function () {
          var _Base_prototype;
          _Base_prototype = Base.prototype;
          Base.displayName = "Base<" + (T != null ? __name(T) : "") + ">";
          function Base() {
            if (this instanceof Base) {
              return this;
            } else {
              return __create(_Base_prototype);
            }
          }
          _Base_prototype.alpha = function (value) {
            if (!_instanceof_T(value)) {
              throw new TypeError("Expected value to be a " + __name(T) + ", got " + __typeof(value));
            }
            return "Base.alpha(" + String(value) + ")";
          };
          _Base_prototype.bravo = function (value) {
            if (!_instanceof_T(value)) {
              throw new TypeError("Expected value to be a " + __name(T) + ", got " + __typeof(value));
            }
            return "Base.bravo(" + String(value) + ")";
          };
          return Base;
        }());
      });
      Child = __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return (function (_super) {
          var _Child_prototype, _super_prototype;
          _super_prototype = _super.prototype;
          _Child_prototype = Child.prototype = __create(_super_prototype);
          _Child_prototype.constructor = Child;
          Child.displayName = "Child<" + (T != null ? __name(T) : "") + ">";
          if (typeof _super.extended === "function") {
            _super.extended(Child);
          }
          function Child() {
            var _ref, _this;
            if (this instanceof Child) {
              _this = this;
            } else {
              _this = __create(_Child_prototype);
            }
            _ref = _super.apply(_this, arguments);
            if (Object(_ref) === _ref) {
              return _ref;
            } else {
              return _this;
            }
          }
          _Child_prototype.bravo = function (value) {
            if (!_instanceof_T(value)) {
              throw new TypeError("Expected value to be a " + __name(T) + ", got " + __typeof(value));
            }
            return "Child.bravo(" + String(value) + "), not " + __strnum(_super_prototype.bravo.call(this, value));
          };
          _Child_prototype.charlie = function (value) {
            if (!_instanceof_T(value)) {
              throw new TypeError("Expected value to be a " + __name(T) + ", got " + __typeof(value));
            }
            return "Child.charlie(" + String(value) + ")";
          };
          return Child;
        }(Base.generic(T)));
      });
      x = Child.generic(Number)();
      expect(x).to.be.an["instanceof"](Base.generic(Number));
      expect(x).to.be.an["instanceof"](Child.generic(Number));
      expect(x.alpha(1234)).to.equal("Base.alpha(1234)");
      expect(function () {
        return x.alpha("hello");
      }).throws(TypeError);
      expect(x.bravo(1234)).to.equal("Child.bravo(1234), not Base.bravo(1234)");
      expect(function () {
        return x.bravo("hello");
      }).throws(TypeError);
      expect(x.charlie(1234)).to.equal("Child.charlie(1234)");
      return expect(function () {
        return x.charlie("hello");
      }).throws(TypeError);
    });
    it("Normal class extending generic class", function () {
      var Base, Child, x;
      Base = __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return (function () {
          var _Base_prototype;
          _Base_prototype = Base.prototype;
          Base.displayName = "Base<" + (T != null ? __name(T) : "") + ">";
          function Base() {
            if (this instanceof Base) {
              return this;
            } else {
              return __create(_Base_prototype);
            }
          }
          _Base_prototype.alpha = function (value) {
            if (!_instanceof_T(value)) {
              throw new TypeError("Expected value to be a " + __name(T) + ", got " + __typeof(value));
            }
            return "Base.alpha(" + String(value) + ")";
          };
          _Base_prototype.bravo = function (value) {
            if (!_instanceof_T(value)) {
              throw new TypeError("Expected value to be a " + __name(T) + ", got " + __typeof(value));
            }
            return "Base.bravo(" + String(value) + ")";
          };
          return Base;
        }());
      });
      Child = (function (_super) {
        var _Child_prototype, _super_prototype;
        _super_prototype = _super.prototype;
        _Child_prototype = Child.prototype = __create(_super_prototype);
        _Child_prototype.constructor = Child;
        Child.displayName = "Child";
        if (typeof _super.extended === "function") {
          _super.extended(Child);
        }
        function Child() {
          var _ref, _this;
          if (this instanceof Child) {
            _this = this;
          } else {
            _this = __create(_Child_prototype);
          }
          _ref = _super.apply(_this, arguments);
          if (Object(_ref) === _ref) {
            return _ref;
          } else {
            return _this;
          }
        }
        _Child_prototype.bravo = function (value) {
          if (typeof value !== "number") {
            throw new TypeError("Expected value to be a Number, got " + __typeof(value));
          }
          return "Child.bravo(" + String(value) + "), not " + __strnum(_super_prototype.bravo.call(this, value));
        };
        _Child_prototype.charlie = function (value) {
          if (typeof value !== "number") {
            throw new TypeError("Expected value to be a Number, got " + __typeof(value));
          }
          return "Child.charlie(" + String(value) + ")";
        };
        return Child;
      }(Base.generic(Number)));
      x = Child();
      expect(x).to.be.an["instanceof"](Base.generic(Number));
      expect(x).to.be.an["instanceof"](Child);
      expect(x.alpha(1234)).to.equal("Base.alpha(1234)");
      expect(function () {
        return x.alpha("hello");
      }).throws(TypeError);
      expect(x.bravo(1234)).to.equal("Child.bravo(1234), not Base.bravo(1234)");
      expect(function () {
        return x.bravo("hello");
      }).throws(TypeError);
      expect(x.charlie(1234)).to.equal("Child.charlie(1234)");
      return expect(function () {
        return x.charlie("hello");
      }).throws(TypeError);
    });
    it("Generic class with two arguments", function () {
      var booleanToAny, Dict, numberToString;
      Dict = __genericFunc(2, function (TKey, TValue) {
        var _instanceof_TKey, _instanceof_TValue;
        _instanceof_TKey = __getInstanceof(TKey);
        _instanceof_TValue = __getInstanceof(TValue);
        return (function () {
          var _Dict_prototype;
          function Dict() {
            var _this;
            _this = this instanceof Dict ? this : __create(_Dict_prototype);
            _this.keys = [];
            _this.values = [];
            return _this;
          }
          _Dict_prototype = Dict.prototype;
          Dict.displayName = "Dict<" + (TKey != null ? __name(TKey) : "") + ", " + (TValue != null ? __name(TValue) : "") + ">";
          _Dict_prototype.get = function (key, fallback) {
            var index;
            if (!_instanceof_TKey(key)) {
              throw new TypeError("Expected key to be a " + __name(TKey) + ", got " + __typeof(key));
            }
            if (fallback == null) {
              fallback = void 0;
            } else if (!_instanceof_TValue(fallback)) {
              throw new TypeError("Expected fallback to be one of " + (__name(TValue) + " or undefined") + ", got " + __typeof(fallback));
            }
            index = this.keys.indexOf(key);
            if (index === -1) {
              return fallback;
            } else {
              return this.values[index];
            }
          };
          _Dict_prototype.set = function (key, value) {
            var index, keys;
            if (!_instanceof_TKey(key)) {
              throw new TypeError("Expected key to be a " + __name(TKey) + ", got " + __typeof(key));
            }
            if (!_instanceof_TValue(value)) {
              throw new TypeError("Expected value to be a " + __name(TValue) + ", got " + __typeof(value));
            }
            keys = this.keys;
            index = keys.indexOf(key);
            if (index === -1) {
              index = keys.length;
              keys[index] = key;
            }
            this.values[index] = value;
          };
          _Dict_prototype.has = function (key) {
            if (!_instanceof_TKey(key)) {
              throw new TypeError("Expected key to be a " + __name(TKey) + ", got " + __typeof(key));
            }
            return this.keys.indexOf(key) !== -1;
          };
          _Dict_prototype["delete"] = function (key) {
            var index, keys;
            if (!_instanceof_TKey(key)) {
              throw new TypeError("Expected key to be a " + __name(TKey) + ", got " + __typeof(key));
            }
            keys = this.keys;
            index = keys.indexOf(key);
            if (index === -1) {
              return false;
            } else {
              this.keys.splice(index, 1);
              this.values.splice(index, 1);
              return true;
            }
          };
          return Dict;
        }());
      });
      numberToString = Dict.generic(Number, String)();
      expect(numberToString.get(10)).to.equal(void 0);
      expect(function () {
        return numberToString.get("hello");
      }).throws(TypeError);
      expect(function () {
        return numberToString.get(10, true);
      }).throws(TypeError);
      numberToString.set(1, "one");
      numberToString.set(2, "two");
      numberToString.set(3, "three");
      expect(function () {
        return numberToString.set(4, false);
      }).throws(TypeError);
      expect(numberToString.get(1)).to.equal("one");
      expect(numberToString.get(2)).to.equal("two");
      expect(numberToString.get(3)).to.equal("three");
      expect(numberToString.get(4, "unknown")).to.equal("unknown");
      expect(numberToString.has(1)).to.be["true"];
      expect(numberToString.has(10)).to.be["false"];
      expect(function () {
        return numberToString.has(true);
      }).throws(TypeError);
      expect(numberToString["delete"](1)).to.be["true"];
      expect(function () {
        return numberToString["delete"](true);
      }).throws(TypeError);
      expect(numberToString.has(1)).to.be["false"];
      expect(numberToString["delete"](1)).to.be["false"];
      expect(Dict.generic(Number, String).displayName).to.equal("Dict<Number, String>");
      booleanToAny = Dict.generic(Boolean, null)();
      booleanToAny.set(true, "yes");
      booleanToAny.set(false, 0);
      expect(booleanToAny.get(true)).to.equal("yes");
      expect(booleanToAny.get(false)).to.equal(0);
      booleanToAny.set(true, numberToString);
      expect(booleanToAny.get(true)).to.equal(numberToString);
      return expect(Dict.generic(Boolean, null).displayName).to.equal("Dict<Boolean, >");
    });
    it("Generic class with generic class as arg", function () {
      var Class, x, y, z;
      Class = __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return (function () {
          var _Class_prototype;
          function Class(value) {
            var _this;
            _this = this instanceof Class ? this : __create(_Class_prototype);
            if (!_instanceof_T(value)) {
              throw new TypeError("Expected value to be a " + __name(T) + ", got " + __typeof(value));
            }
            _this.value = value;
            return _this;
          }
          _Class_prototype = Class.prototype;
          Class.displayName = "Class<" + (T != null ? __name(T) : "") + ">";
          return Class;
        }());
      });
      x = Class.generic(String)("hello");
      expect(x.value).to.equal("hello");
      y = Class.generic(Class.generic(String))(x);
      expect(y.value).to.equal(x);
      z = Class(y);
      expect(z.value).to.equal(y);
      expect(Class.generic(String).displayName).to.equal("Class<String>");
      expect(Class.generic(Class.generic(String)).displayName).to.equal("Class<Class<String>>");
      return expect(Class.displayName).to.equal("Class<>");
    });
    it("Class with generic method", function () {
      var Class, o;
      Class = (function () {
        var _Class_prototype;
        _Class_prototype = Class.prototype;
        Class.displayName = "Class";
        function Class() {
          if (this instanceof Class) {
            return this;
          } else {
            return __create(_Class_prototype);
          }
        }
        _Class_prototype.run = __genericFunc(1, function (T) {
          var _instanceof_T;
          _instanceof_T = __getInstanceof(T);
          return function (val) {
            if (!_instanceof_T(val)) {
              throw new TypeError("Expected val to be a " + __name(T) + ", got " + __typeof(val));
            }
            return val;
          };
        });
        return Class;
      }());
      o = Class();
      expect(o.run("Hello")).to.equal("Hello");
      expect(o.run(1234)).to.equal(1234);
      expect(o.run.generic(String)("Hello")).to.equal("Hello");
      expect(o.run.generic(Number)(1234)).to.equal(1234);
      return expect(function () {
        return o.run.generic(String)(1234);
      }).throws(TypeError, "Expected val to be a String, got Number");
    });
    it("Generic class with generic method", function () {
      var Class;
      Class = __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return (function () {
          var _Class_prototype;
          _Class_prototype = Class.prototype;
          Class.displayName = "Class<" + (T != null ? __name(T) : "") + ">";
          function Class() {
            if (this instanceof Class) {
              return this;
            } else {
              return __create(_Class_prototype);
            }
          }
          _Class_prototype.run = __genericFunc(1, function (U) {
            var _instanceof_U;
            _instanceof_U = __getInstanceof(U);
            return function (x, y) {
              if (!_instanceof_T(x)) {
                throw new TypeError("Expected x to be a " + __name(T) + ", got " + __typeof(x));
              }
              if (!_instanceof_U(y)) {
                throw new TypeError("Expected y to be a " + __name(U) + ", got " + __typeof(y));
              }
              return { x: x, y: y };
            };
          });
          return Class;
        }());
      });
      function check(expectedX, expectedY, actual) {
        expect(actual.x).to.equal(expectedX);
        return expect(actual.y).to.equal(expectedY);
      }
      check("one", 1, Class.generic(String)().run.generic(Number)("one", 1));
      check("yes", true, Class.generic(String)().run.generic(Boolean)("yes", true));
      check(check, Class, Class.generic(Function)().run.generic(Function)(check, Class));
      expect(function () {
        return Class.generic(String)().run.generic(Number)(1234, 1234);
      }).throws(TypeError, "Expected x to be a String, got Number");
      return expect(function () {
        return Class.generic(String)().run.generic(Number)("Hello", "There");
      }).throws(TypeError, "Expected y to be a Number, got String");
    });
    return it("calls .extended on its superclass", function () {
      var Base, Child, OtherChild;
      Base = (function () {
        var _Base_prototype;
        _Base_prototype = Base.prototype;
        Base.displayName = "Base";
        function Base() {
          if (this instanceof Base) {
            return this;
          } else {
            return __create(_Base_prototype);
          }
        }
        Base.children = [];
        Base.extended = function (child) {
          if (typeof child !== "function") {
            throw new TypeError("Expected child to be a Function, got " + __typeof(child));
          }
          expect(child.prototype).to.be.an["instanceof"](Base);
          expect(child.prototype.constructor).to.equal(child);
          return this.children.push(child);
        };
        return Base;
      }());
      expect(Base.children).to.eql([]);
      Child = (function (Base) {
        var _Base_prototype, _Child_prototype;
        _Base_prototype = Base.prototype;
        _Child_prototype = Child.prototype = __create(_Base_prototype);
        _Child_prototype.constructor = Child;
        Child.displayName = "Child";
        if (typeof Base.extended === "function") {
          Base.extended(Child);
        }
        function Child() {
          var _ref, _this;
          if (this instanceof Child) {
            _this = this;
          } else {
            _this = __create(_Child_prototype);
          }
          _ref = Base.apply(_this, arguments);
          if (Object(_ref) === _ref) {
            return _ref;
          } else {
            return _this;
          }
        }
        expect(Base.children).to.eql([Child]);
        return Child;
      }(Base));
      expect(Base.children).to.eql([Child]);
      OtherChild = (function (Base) {
        var _Base_prototype, _OtherChild_prototype;
        _Base_prototype = Base.prototype;
        _OtherChild_prototype = OtherChild.prototype = __create(_Base_prototype);
        _OtherChild_prototype.constructor = OtherChild;
        OtherChild.displayName = "OtherChild";
        if (typeof Base.extended === "function") {
          Base.extended(OtherChild);
        }
        function OtherChild() {
          var _ref, _this;
          if (this instanceof OtherChild) {
            _this = this;
          } else {
            _this = __create(_OtherChild_prototype);
          }
          _ref = Base.apply(_this, arguments);
          if (Object(_ref) === _ref) {
            return _ref;
          } else {
            return _this;
          }
        }
        expect(Base.children).to.eql([Child, OtherChild]);
        return OtherChild;
      }(Base));
      return expect(Base.children).to.eql([Child, OtherChild]);
    });
  });
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
