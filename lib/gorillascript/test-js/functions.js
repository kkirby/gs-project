(function (GLOBAL) {
  "use strict";
  var __cmp, __create, __curry, __genericFunc, __getInstanceof, __isArray,
      __name, __num, __owns, __slice, __strnum, __toArray, __typeof, expect,
      gorilla, stub, WeakMap;
  __cmp = function (left, right) {
    var type;
    if (left === right) {
      return 0;
    } else {
      type = typeof left;
      if (type !== "number" && type !== "string") {
        throw new TypeError("Cannot compare a non-number/string: " + type);
      } else if (type !== typeof right) {
        throw new TypeError("Cannot compare elements of different types: " + type + " vs " + typeof right);
      } else if (left < right) {
        return -1;
      } else {
        return 1;
      }
    }
  };
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
  function q() {
    return "alpha";
  }
  expect(q).to.be.a("function");
  expect(q()).to.equal("alpha");
  stub = require("sinon").stub;
  gorilla = require("../index");
  describe("functions", function () {
    it("simple function", function () {
      function fun() {
        return "bravo";
      }
      expect(fun).to.be.a("function");
      return expect(fun()).to.equal("bravo");
    });
    it("doesn't require a function glyph", function () {
      function fun() {
        return "bravo";
      }
      expect(fun).to.be.a("function");
      return expect(fun()).to.equal("bravo");
    });
    it("function replacement", function () {
      var fun;
      fun = function () {
        return "alpha";
      };
      expect(fun()).to.equal("alpha");
      fun = function () {
        return "bravo";
      };
      return expect(fun()).to.equal("bravo");
    });
    it("function replacement, no initial", function () {
      var fun;
      expect(fun).to.be["undefined"];
      fun = function () {
        return "alpha";
      };
      expect(fun()).to.equal("alpha");
      fun = function () {
        return "bravo";
      };
      return expect(fun()).to.equal("bravo");
    });
    it("function replacement with non-function", function () {
      var fun;
      fun = function () {
        return "alpha";
      };
      expect(fun()).to.equal("alpha");
      fun = "bravo";
      return expect(fun).to.equal("bravo");
    });
    it("method definition and calling", function () {
      var obj, other;
      obj = {};
      obj.x = function () {
        return "charlie";
      };
      expect(obj.x).to.be.a("function");
      expect(obj.x()).to.equal("charlie");
      obj.y = function () {
        return this;
      };
      expect(obj.y()).to.equal(obj);
      other = {};
      return expect(obj.y.call(other)).to.equal(other);
    });
    it("object definition with inline methods", function () {
      var obj, other;
      obj = {
        x: function () {
          return "charlie";
        },
        y: function () {
          return this;
        }
      };
      expect(obj.x()).to.equal("charlie");
      expect(obj.y()).to.equal(obj);
      other = {};
      return expect(obj.y.call(other)).to.equal(other);
    });
    it("bound function", function () {
      var inner, obj, other;
      function outer() {
        var _this;
        _this = this;
        return function () {
          return _this;
        };
      }
      obj = {};
      inner = outer.call(obj);
      other = {};
      expect(inner()).to.equal(obj);
      expect(inner.call(other)).to.equal(obj);
      expect(outer.call(other)()).to.equal(other);
      return expect(outer.call(other).call(obj)).to.equal(other);
    });
    it("nested bound function", function () {
      var inner, obj;
      obj = {};
      function outer() {
        var _this;
        _this = this;
        expect(this).to.equal(obj);
        return function () {
          expect(_this).to.equal(obj);
          return function () {
            expect(_this).to.equal(obj);
            return function () {
              return _this;
            };
          };
        };
      }
      inner = outer.call(obj);
      return expect(inner.call({}).call({}).call({})).to.equal(obj);
    });
    it("bound function doesn't get overly bound", function () {
      var alpha, bravo, ignored;
      alpha = {};
      bravo = {};
      function outer() {
        var _this;
        _this = this;
        expect(this).to.equal(alpha);
        return function () {
          expect(_this).to.equal(alpha);
          return function () {
            var _this;
            _this = this;
            expect(this).to.equal(bravo);
            return function () {
              return _this;
            };
          };
        };
      }
      ignored = {};
      return expect(outer.call(alpha).call(ignored).call(bravo).call(ignored)).to.equal(bravo);
    });
    it("bound method inside object", function () {
      var obj, other;
      function makeObject() {
        var _this;
        _this = this;
        return {
          x: function () {
            return this;
          },
          y: function () {
            return _this;
          }
        };
      }
      other = {};
      obj = makeObject.call(other);
      expect(obj.x()).to.equal(obj);
      return expect(obj.y()).to.equal(other);
    });
    it("function self-redeclaration", function () {
      var fun;
      fun = function () {
        fun = function () {
          return "bravo";
        };
        return "alpha";
      };
      expect(fun()).to.equal("alpha");
      expect(fun()).to.equal("bravo");
      return expect(fun()).to.equal("bravo");
    });
    it("simple arguments", function () {
      var obj;
      obj = {};
      function retObj() {
        return obj;
      }
      function id(i) {
        return i;
      }
      function add(x, y) {
        return __num(x) + __num(y);
      }
      expect(retObj).to.have.length(0);
      expect(id).to.have.length(1);
      expect(add).to.have.length(2);
      expect(retObj()).to.equal(obj);
      expect(id(obj)).to.equal(obj);
      expect(id(obj)).to.equal(obj);
      expect(add(1, 2)).to.equal(3);
      return expect(add(1, 2)).to.equal(3);
    });
    it("unnecessary trailing comma", function () {
      var obj;
      obj = {};
      function retObj() {
        return obj;
      }
      function id(i) {
        return i;
      }
      function add(x, y) {
        return __num(x) + __num(y);
      }
      expect(retObj).to.have.length(0);
      expect(id).to.have.length(1);
      expect(add).to.have.length(2);
      expect(retObj()).to.equal(obj);
      expect(id(obj)).to.equal(obj);
      expect(id(obj)).to.equal(obj);
      expect(add(1, 2)).to.equal(3);
      return expect(add(1, 2)).to.equal(3);
    });
    it("recursive function", function () {
      function factorial(n) {
        if (__num(n) <= 1) {
          return 1;
        } else {
          return __num(n) * factorial(__num(n) - 1);
        }
      }
      expect(factorial(0)).to.equal(1);
      expect(factorial(1)).to.equal(1);
      expect(factorial(2)).to.equal(2);
      expect(factorial(3)).to.equal(6);
      expect(factorial(4)).to.equal(24);
      expect(factorial(5)).to.equal(120);
      expect(factorial(6)).to.equal(720);
      return expect(factorial(7)).to.equal(5040);
    });
    it("simple spread arguments", function () {
      var obj, other;
      function fun() {
        var args;
        args = __slice.call(arguments);
        return args;
      }
      obj = {};
      expect(fun).to.have.length(0);
      expect(fun()).to.be.an("array");
      expect(fun()).to.have.length(0);
      expect(fun(obj)).to.have.length(1);
      expect(fun(obj)[0]).to.equal(obj);
      other = {};
      return expect(fun(obj, other)).to.eql([obj, other]);
    });
    it("spread arguments without a body should return void", function () {
      function fun() {
        var args;
        args = __slice.call(arguments);
      }
      return expect(fun()).to.be["undefined"];
    });
    it("spread arguments with leading arguments", function () {
      var alpha, bravo, charlie;
      function fun(first) {
        var rest;
        rest = __slice.call(arguments, 1);
        return [first, rest];
      }
      expect(fun).to.have.length(1);
      expect(fun()[1]).to.be.an("array");
      expect(fun({})[1]).to.be.an("array");
      expect(fun()).to.eql([void 0, []]);
      alpha = {};
      expect(fun(alpha)).to.eql([alpha, []]);
      bravo = {};
      expect(fun(alpha, bravo)).to.eql([alpha, [bravo]]);
      charlie = {};
      return expect(fun(alpha, bravo, charlie)).to.eql([
        alpha,
        [bravo, charlie]
      ]);
    });
    it("spread arguments with trailing arguments", function () {
      var alpha, bravo, charlie;
      function fun() {
        var _i, last, start;
        _i = __num(arguments.length) - 1;
        if (_i > 0) {
          start = __slice.call(arguments, 0, _i);
        } else {
          _i = 0;
          start = [];
        }
        last = arguments[_i];
        return [start, last];
      }
      expect(fun).to.have.length(0);
      expect(fun()[0]).to.be.an("array");
      expect(fun({})[0]).to.be.an("array");
      expect(fun()).to.eql([[], void 0]);
      alpha = {};
      expect(fun(alpha)).to.eql([[], alpha]);
      bravo = {};
      expect(fun(alpha, bravo)).to.eql([[alpha], bravo]);
      charlie = {};
      return expect(fun(alpha, bravo, charlie)).to.eql([
        [alpha, bravo],
        charlie
      ]);
    });
    it("spread arguments is mutable within function", function () {
      var alpha, bravo, charlie;
      alpha = {};
      function fun() {
        var args;
        args = __slice.call(arguments);
        args.push(alpha);
        return args;
      }
      expect(fun).to.have.length(0);
      expect(fun()).to.eql([alpha]);
      bravo = {};
      expect(fun(bravo)).to.eql([bravo, alpha]);
      charlie = {};
      return expect(fun(bravo, charlie)).to.eql([bravo, charlie, alpha]);
    });
    it("multiple spread arguments is an Error", function () {
      return expect(function () {
        return gorilla.compileSync("let x = 0\nlet f(...a, ...b) ->");
      }).throws(gorilla.ParserError, /Cannot have more than one spread parameter.*?2:12/);
    });
    it("special `arguments` variable is still available", function () {
      var alpha, bravo;
      function fun() {
        return arguments;
      }
      expect(fun).to.have.length(0);
      expect({}.toString.call(fun())).to.equal("[object Arguments]");
      expect(Array.prototype.slice.call(fun())).to.eql([]);
      alpha = {};
      expect(Array.prototype.slice.call(fun(alpha))).to.eql([alpha]);
      bravo = {};
      return expect(Array.prototype.slice.call(fun(alpha, bravo))).to.eql([alpha, bravo]);
    });
    it("calling a function with spread", function () {
      var args, nums;
      function add(x, y) {
        return __num(x) + __num(y);
      }
      expect(add).to.have.length(2);
      expect(add(1, 2)).to.equal(3);
      nums = [1, 2];
      expect(add.apply(void 0, nums)).to.equal(3);
      nums.push(3);
      expect(add.apply(void 0, nums)).to.equal(3);
      function fun() {
        var args;
        args = __slice.call(arguments);
        return args;
      }
      expect(fun).to.have.length(0);
      expect(fun("alpha", "bravo")).to.eql(["alpha", "bravo"]);
      args = ["alpha", "bravo"];
      expect(fun.apply(void 0, args)).to.eql(["alpha", "bravo"]);
      expect(fun.apply(void 0, args)).to.not.equal(args);
      args.push("charlie");
      expect(fun.apply(void 0, args)).to.eql(["alpha", "bravo", "charlie"]);
      args.splice(0, args.length);
      expect(fun()).to.eql([]);
      expect(fun()).to.eql([]);
      expect(fun.apply(void 0, args)).to.eql([]);
      args.push(null);
      expect(fun(null)).to.eql([null]);
      expect(fun(null)).to.eql([null]);
      expect(fun.apply(void 0, args)).to.eql([null]);
      args[0] = void 0;
      expect(fun(void 0)).to.eql([void 0]);
      expect(fun(void 0)).to.eql([void 0]);
      return expect(fun.apply(void 0, args)).to.eql([void 0]);
    });
    it("calling a function with multiple spreads", function () {
      var alpha, bravo;
      function fun() {
        var args;
        args = __slice.call(arguments);
        return args;
      }
      alpha = [1, 2, 3];
      bravo = [4, 5, 6];
      expect(fun.apply(void 0, alpha.concat(bravo))).to.eql([
        1,
        2,
        3,
        4,
        5,
        6
      ]);
      expect(fun.apply(void 0, ["a"].concat(alpha, bravo))).to.eql([
        "a",
        1,
        2,
        3,
        4,
        5,
        6
      ]);
      expect(fun.apply(void 0, alpha.concat(["b"], bravo))).to.eql([
        1,
        2,
        3,
        "b",
        4,
        5,
        6
      ]);
      expect(fun.apply(void 0, alpha.concat(bravo, ["c"]))).to.eql([
        1,
        2,
        3,
        4,
        5,
        6,
        "c"
      ]);
      expect(fun.apply(void 0, ["a"].concat(alpha, ["b"], bravo))).to.eql([
        "a",
        1,
        2,
        3,
        "b",
        4,
        5,
        6
      ]);
      expect(fun.apply(void 0, ["a"].concat(alpha, bravo, ["c"]))).to.eql([
        "a",
        1,
        2,
        3,
        4,
        5,
        6,
        "c"
      ]);
      expect(fun.apply(void 0, alpha.concat(["b"], bravo, ["c"]))).to.eql([
        1,
        2,
        3,
        "b",
        4,
        5,
        6,
        "c"
      ]);
      return expect(fun.apply(void 0, ["a"].concat(alpha, ["b"], bravo, ["c"]))).to.eql([
        "a",
        1,
        2,
        3,
        "b",
        4,
        5,
        6,
        "c"
      ]);
    });
    it("calling a method with spread", function () {
      var _ref, args, obj, other;
      obj = {
        fun: function () {
          var args;
          args = __slice.call(arguments);
          return [this, args];
        }
      };
      other = {};
      expect(obj.fun).to.have.length(0);
      expect(obj.fun("alpha", "bravo")).to.eql([
        obj,
        ["alpha", "bravo"]
      ]);
      args = ["alpha", "bravo"];
      expect(obj.fun.apply(obj, args)).to.eql([
        obj,
        ["alpha", "bravo"]
      ]);
      args.push("charlie");
      expect(obj.fun.apply(obj, args)).to.eql([
        obj,
        ["alpha", "bravo", "charlie"]
      ]);
      expect(obj.fun.call(other, "alpha", "bravo")).to.eql([
        other,
        ["alpha", "bravo"]
      ]);
      expect((_ref = obj.fun).call.apply(_ref, [other].concat(args))).to.eql([
        other,
        ["alpha", "bravo", "charlie"]
      ]);
      args.push("delta");
      return expect((_ref = obj.fun).call.apply(_ref, [other].concat(args))).to.eql([
        other,
        ["alpha", "bravo", "charlie", "delta"]
      ]);
    });
    it(
      "calling a function with spread will only access object once",
      function () {
        var getArgs;
        function fun() {
          var args;
          args = __slice.call(arguments);
          return args;
        }
        getArgs = stub().returns(["alpha", "bravo"]);
        expect(fun.apply(void 0, __toArray(getArgs()))).to.eql(["alpha", "bravo"]);
        return expect(getArgs).to.be.calledOnce;
      }
    );
    it(
      "calling a function with spread will only access function once",
      function () {
        var args, getFun, ran;
        ran = false;
        getFun = stub().returns(function () {
          var args;
          args = __slice.call(arguments);
          expect(ran).to.be["false"];
          ran = true;
          return args;
        });
        args = ["alpha", "bravo"];
        expect(getFun().apply(void 0, args)).to.eql(["alpha", "bravo"]);
        return expect(getFun).to.be.calledOnce;
      }
    );
    it(
      "calling a method with spread will only access object once",
      function () {
        var _ref, args, getObj;
        getObj = stub().returns({
          fun: function () {
            var args;
            args = __slice.call(arguments);
            if (this.methodCalled) {
              fail("method called more than once");
            }
            this.methodCalled = true;
            return args;
          }
        });
        args = ["alpha", "bravo"];
        expect((_ref = getObj()).fun.apply(_ref, args)).to.eql(["alpha", "bravo"]);
        return expect(getObj).to.be.calledOnce;
      }
    );
    it("spread arguments in middle", function () {
      var args;
      function fun(first) {
        var _i, last, middle;
        _i = __num(arguments.length) - 1;
        if (_i > 1) {
          middle = __slice.call(arguments, 1, _i);
        } else {
          _i = 1;
          middle = [];
        }
        last = arguments[_i];
        return [first, middle, last];
      }
      expect(fun).to.have.length(1);
      expect(fun()).to.eql([void 0, [], void 0]);
      expect(fun("alpha")).to.eql(["alpha", [], void 0]);
      expect(fun("alpha", "bravo")).to.eql(["alpha", [], "bravo"]);
      expect(fun("alpha", "bravo", "charlie")).to.eql(["alpha", ["bravo"], "charlie"]);
      expect(fun("alpha", "bravo", "charlie", "delta")).to.eql([
        "alpha",
        ["bravo", "charlie"],
        "delta"
      ]);
      args = [];
      expect(fun.apply(void 0, args)).to.eql([void 0, [], void 0]);
      args.push("alpha");
      expect(fun.apply(void 0, args)).to.eql(["alpha", [], void 0]);
      args.push("bravo");
      expect(fun.apply(void 0, args)).to.eql(["alpha", [], "bravo"]);
      args[0] = "bravo";
      args[1] = "charlie";
      expect(fun.apply(void 0, ["alpha"].concat(args))).to.eql(["alpha", ["bravo"], "charlie"]);
      expect(fun.apply(void 0, ["alpha"].concat(args, ["delta"]))).to.eql([
        "alpha",
        ["bravo", "charlie"],
        "delta"
      ]);
      function fun2(a, b) {
        var _i, c, d, e;
        _i = __num(arguments.length) - 2;
        if (_i > 2) {
          c = __slice.call(arguments, 2, _i);
        } else {
          _i = 2;
          c = [];
        }
        d = arguments[_i];
        e = arguments[_i + 1];
        return [
          a,
          b,
          c,
          d,
          e
        ];
      }
      expect(fun2).to.have.length(2);
      expect(fun2()).to.eql([
        void 0,
        void 0,
        [],
        void 0,
        void 0
      ]);
      expect(fun2("alpha")).to.eql([
        "alpha",
        void 0,
        [],
        void 0,
        void 0
      ]);
      expect(fun2("alpha", "bravo")).to.eql([
        "alpha",
        "bravo",
        [],
        void 0,
        void 0
      ]);
      expect(fun2("alpha", "bravo", "charlie")).to.eql([
        "alpha",
        "bravo",
        [],
        "charlie",
        void 0
      ]);
      expect(fun2("alpha", "bravo", "charlie", "delta")).to.eql([
        "alpha",
        "bravo",
        [],
        "charlie",
        "delta"
      ]);
      expect(fun2(
        "alpha",
        "bravo",
        "charlie",
        "delta",
        "echo"
      )).to.eql([
        "alpha",
        "bravo",
        ["charlie"],
        "delta",
        "echo"
      ]);
      expect(fun2(
        "alpha",
        "bravo",
        "charlie",
        "delta",
        "echo",
        "foxtrot"
      )).to.eql([
        "alpha",
        "bravo",
        ["charlie", "delta"],
        "echo",
        "foxtrot"
      ]);
      args.splice(0, args.length);
      expect(fun2.apply(void 0, args)).to.eql([
        void 0,
        void 0,
        [],
        void 0,
        void 0
      ]);
      args.push("alpha");
      expect(fun2.apply(void 0, args)).to.eql([
        "alpha",
        void 0,
        [],
        void 0,
        void 0
      ]);
      args.push("bravo");
      expect(fun2.apply(void 0, args)).to.eql([
        "alpha",
        "bravo",
        [],
        void 0,
        void 0
      ]);
      args.push("charlie");
      expect(fun2.apply(void 0, args)).to.eql([
        "alpha",
        "bravo",
        [],
        "charlie",
        void 0
      ]);
      args.push("delta");
      expect(fun2.apply(void 0, args)).to.eql([
        "alpha",
        "bravo",
        [],
        "charlie",
        "delta"
      ]);
      args.shift();
      args.push("echo");
      expect(fun2.apply(void 0, ["alpha"].concat(args))).to.eql([
        "alpha",
        "bravo",
        ["charlie"],
        "delta",
        "echo"
      ]);
      expect(fun2.apply(void 0, ["alpha"].concat(args, ["foxtrot"]))).to.eql([
        "alpha",
        "bravo",
        ["charlie", "delta"],
        "echo",
        "foxtrot"
      ]);
      args.shift();
      args.push("foxtrot");
      expect(fun2.apply(void 0, ["alpha", "bravo"].concat(args, ["golf"]))).to.eql([
        "alpha",
        "bravo",
        ["charlie", "delta", "echo"],
        "foxtrot",
        "golf"
      ]);
      return expect(fun2.apply(void 0, ["alpha", "bravo"].concat(args, ["golf", "hotel"]))).to.eql([
        "alpha",
        "bravo",
        ["charlie", "delta", "echo", "foxtrot"],
        "golf",
        "hotel"
      ]);
    });
    it("default values", function () {
      var arr, obj, other;
      obj = {};
      function fun(alpha) {
        if (alpha == null) {
          alpha = obj;
        }
        return alpha;
      }
      expect(fun).to.have.length(1);
      expect(fun()).to.equal(obj);
      expect(fun(null)).to.equal(obj);
      expect(fun(void 0)).to.equal(obj);
      other = {};
      expect(fun(other)).to.equal(other);
      expect(fun(0)).to.equal(0);
      expect(fun(false)).to.be["false"];
      expect(fun("")).to.equal("");
      expect(fun()).to.equal(obj);
      expect(fun(null)).to.equal(obj);
      expect(fun(void 0)).to.equal(obj);
      expect(fun(other)).to.equal(other);
      arr = [other];
      return expect(fun.apply(void 0, arr)).to.equal(other);
    });
    it("default values and spreads", function () {
      function fun(a) {
        var _i, b, c, d;
        if (a == null) {
          a = 2;
        }
        _i = __num(arguments.length) - 2;
        if (_i > 1) {
          b = __slice.call(arguments, 1, _i);
        } else {
          _i = 1;
          b = [];
        }
        c = arguments[_i];
        if (c == null) {
          c = 3;
        }
        d = arguments[_i + 1];
        if (d == null) {
          d = 5;
        }
        return __num(a) * __num(c) * __num(d) * (b.length + 1);
      }
      expect(fun).to.have.length(1);
      expect(fun()).to.equal(30);
      expect(fun(1)).to.equal(15);
      expect(fun(1, 1)).to.equal(5);
      expect(fun(1, 1, 1)).to.equal(1);
      return expect(fun(1, "x", 1, 1)).to.equal(2);
    });
    it("default value create new object each access", function () {
      var a, b;
      function fun(alpha) {
        if (alpha == null) {
          alpha = {};
        }
        return alpha;
      }
      a = fun(null);
      expect(a).to.be.ok;
      b = fun(void 0);
      expect(b).to.be.ok;
      return expect(a).to.not.be.equal(b);
    });
    it("default value call function each access", function () {
      var i;
      i = 0;
      function make() {
        ++i;
        return i;
      }
      function fun(val) {
        if (val == null) {
          val = make();
        }
        return val;
      }
      expect(fun()).to.equal(1);
      expect(fun(null)).to.equal(2);
      expect(fun(5)).to.equal(5);
      expect(fun(void 0)).to.equal(3);
      expect(fun(4)).to.equal(4);
      return expect(fun()).to.equal(4);
    });
    it("function scope", function () {
      var outer;
      outer = 0;
      function inc() {
        var inner;
        ++outer;
        return inner = outer;
      }
      function reset() {
        var inner;
        inner = outer;
        outer = 0;
        return inner;
      }
      expect(inc()).to.equal(1);
      expect(inc()).to.equal(2);
      expect(outer).to.equal(2);
      expect(reset()).to.equal(2);
      return expect(outer).to.equal(0);
    });
    it("function scope with same-named variables", function () {
      var value;
      value = 0;
      function func() {
        var value;
        value = 5;
        ++value;
        return value;
      }
      expect(value).to.equal(0);
      expect(func()).to.equal(6);
      expect(value).to.equal(0);
      expect(func()).to.equal(6);
      expect(value).to.equal(0);
      return expect(func()).to.equal(6);
    });
    it("fancy whitespace", function () {
      function fun(a, b) {
        if (b == null) {
          b = [];
        }
        return [a, b];
      }
      expect(fun("alpha")).to.eql(["alpha", []]);
      return expect(fun("alpha", "bravo")).to.eql(["alpha", "bravo"]);
    });
    it("setting values on this by their parameters", function () {
      var obj;
      function fun(alpha, bravo) {
        this.alpha = alpha;
        this.bravo = bravo;
      }
      obj = {};
      fun.call(obj, "charlie", "delta");
      expect(obj.alpha).to.equal("charlie");
      expect(obj.bravo).to.equal("delta");
      function spread() {
        var args;
        this.args = args = __slice.call(arguments);
      }
      spread.call(obj, "echo", "foxtrot");
      return expect(obj.args).to.eql(["echo", "foxtrot"]);
    });
    it("setting values on @ by their parameters", function () {
      var obj;
      function fun(alpha, bravo) {
        this.alpha = alpha;
        this.bravo = bravo;
      }
      obj = {};
      fun.call(obj, "charlie", "delta");
      expect(obj.alpha).to.equal("charlie");
      expect(obj.bravo).to.equal("delta");
      function spread() {
        var args;
        this.args = args = __slice.call(arguments);
      }
      spread.call(obj, "echo", "foxtrot");
      return expect(obj.args).to.eql(["echo", "foxtrot"]);
    });
    it(
      "setting values on @ by their parameters with defaults",
      function () {
        var obj;
        function fun(alpha, bravo) {
          if (alpha == null) {
            alpha = 0;
          }
          this.alpha = alpha;
          if (bravo == null) {
            bravo = 1;
          }
          this.bravo = bravo;
          return [alpha, bravo];
        }
        obj = {};
        expect(fun.call(obj)).to.eql([0, 1]);
        expect(obj.alpha).to.equal(0);
        expect(obj.bravo).to.equal(1);
        obj = {};
        expect(fun.call(obj, "charlie")).to.eql(["charlie", 1]);
        expect(obj.alpha).to.equal("charlie");
        expect(obj.bravo).to.equal(1);
        obj = {};
        expect(fun.call(obj, "charlie", "delta")).to.eql(["charlie", "delta"]);
        expect(obj.alpha).to.equal("charlie");
        return expect(obj.bravo).to.equal("delta");
      }
    );
    it("reserved word as parameter", function () {
      var _arr, _f, _i, _len;
      for (_arr = __toArray(gorilla.getReservedWords()), _i = 0, _len = _arr.length, _f = function (name) {
        return expect(function () {
          return gorilla.compileSync("let z = 5\nlet fun(x, " + __strnum(name) + ") ->");
        }).throws(gorilla.ParserError, /2:\d+/);
      }; _i < _len; ++_i) {
        _f.call(this, _arr[_i]);
      }
    });
    it(
      "eval is still usable, in case someone wants to use it",
      function () {
        expect(5).to.equal(5);
        function f() {
          return "hello";
        }
        return expect(f()).to.equal("hello");
      }
    );
    it("chained function calls", function () {
      var obj;
      function wrap(x) {
        return function () {
          return x;
        };
      }
      obj = {};
      expect(wrap(wrap(obj))()()).to.equal(obj);
      return expect(wrap(wrap(obj))()()).to.equal(obj);
    });
    it("passing two functions without paren-wrapping", function () {
      function sum(a, b) {
        return __num(a()) + __num(b());
      }
      return expect(sum(
        function () {
          return 3;
        },
        function () {
          return 7;
        }
      )).to.equal(10);
    });
    it("passing two functions with paren-wrapping", function () {
      function sum(a, b) {
        return __num(a()) + __num(b());
      }
      return expect(sum(
        function () {
          return 3;
        },
        function () {
          return 7;
        }
      )).to.equal(10);
    });
    it("method calls with implicit last object", function () {
      function fun() {
        var _i, args, k, opt, options, v;
        _i = __num(arguments.length) - 1;
        if (_i > 0) {
          args = __slice.call(arguments, 0, _i);
        } else {
          _i = 0;
          args = [];
        }
        options = arguments[_i];
        if (options == null) {
          options = {};
        }
        opt = [];
        for (k in options) {
          if (__owns.call(options, k)) {
            v = options[k];
            opt.push([k, v]);
          }
        }
        opt.sort(function (a, b) {
          return __cmp(a[0], b[0]);
        });
        return [args, opt];
      }
      expect(fun("alpha", "bravo", {})).to.eql([
        ["alpha", "bravo"],
        []
      ]);
      expect(fun("alpha", "bravo", { charlie: 1 })).to.eql([
        ["alpha", "bravo"],
        [["charlie", 1]]
      ]);
      expect(fun("alpha", "bravo", { charlie: 1, delta: 2 })).to.eql([
        ["alpha", "bravo"],
        [
          ["charlie", 1],
          ["delta", 2]
        ]
      ]);
      expect(fun("alpha", { charlie: 1, delta: 2, echo: 3 })).to.eql([
        ["alpha"],
        [
          ["charlie", 1],
          ["delta", 2],
          ["echo", 3]
        ]
      ]);
      expect(fun({ charlie: 1, delta: 2, echo: 3, foxtrot: 4 })).to.eql([
        [],
        [
          ["charlie", 1],
          ["delta", 2],
          ["echo", 3],
          ["foxtrot", 4]
        ]
      ]);
      expect(fun("alpha", "bravo", {})).to.eql([
        ["alpha", "bravo"],
        []
      ]);
      expect(fun("alpha", "bravo", { charlie: 1 })).to.eql([
        ["alpha", "bravo"],
        [["charlie", 1]]
      ]);
      expect(fun("alpha", "bravo", { charlie: 1, delta: 2 })).to.eql([
        ["alpha", "bravo"],
        [
          ["charlie", 1],
          ["delta", 2]
        ]
      ]);
      expect(fun("alpha", { charlie: 1, delta: 2, echo: 3 })).to.eql([
        ["alpha"],
        [
          ["charlie", 1],
          ["delta", 2],
          ["echo", 3]
        ]
      ]);
      return expect(fun({ charlie: 1, delta: 2, echo: 3, foxtrot: 4 })).to.eql([
        [],
        [
          ["charlie", 1],
          ["delta", 2],
          ["echo", 3],
          ["foxtrot", 4]
        ]
      ]);
    });
    it("whitespace checks", function () {
      var echo;
      function alpha() {
        var args;
        args = __slice.call(arguments);
        return args;
      }
      function bravo(options) {
        var rest;
        rest = __slice.call(arguments, 1);
        expect(rest).to.have.length(0);
        return (function () {
          var _arr, k, v;
          _arr = [];
          for (k in options) {
            if (__owns.call(options, k)) {
              v = options[k];
              _arr.push([k, v]);
            }
          }
          return _arr;
        }()).sort(function (a, b) {
          return __cmp(a[0], b[0]);
        });
      }
      echo = bravo;
      expect(alpha(bravo({ charlie: "delta" }), echo({ foxtrot: "golf" }))).to.eql([
        [["charlie", "delta"]],
        [["foxtrot", "golf"]]
      ]);
      expect(alpha(bravo({ charlie: "delta" }), echo({ foxtrot: "golf" }))).to.eql([
        [["charlie", "delta"]],
        [["foxtrot", "golf"]]
      ]);
      expect(alpha(bravo({ charlie: "delta" }), echo({ foxtrot: "golf" }))).to.eql([
        [["charlie", "delta"]],
        [["foxtrot", "golf"]]
      ]);
      return expect(alpha(bravo({ charlie: "delta" }), echo({ foxtrot: "golf" }))).to.eql([
        [["charlie", "delta"]],
        [["foxtrot", "golf"]]
      ]);
    });
    it("duplicate parameter name", function () {
      return expect(function () {
        return gorilla.compileSync("let x = 0\nlet fun(a, a) ->");
      }).throws(gorilla.ParserError, /Duplicate parameter name: \'a\'.*2:11/);
    });
    it("duplicate parameter name", function () {
      return expect(function () {
        return gorilla.compileSync("let x = 0\nlet fun(a, [a]) ->");
      }).throws(gorilla.ParserError, /Duplicate parameter name: \'a\'.*2:13/);
    });
    it("duplicate parameter name", function () {
      return expect(function () {
        return gorilla.compileSync("let x = 0\nlet fun([a], [a]) ->");
      }).throws(gorilla.ParserError, /Duplicate parameter name: \'a\'.*2:15/);
    });
    it("duplicate parameter name", function () {
      return expect(function () {
        return gorilla.compileSync("let x = 0\nlet fun([a], {a}) ->");
      }).throws(gorilla.ParserError, /Duplicate parameter name: \'a\'.*2:15/);
    });
    it("typed parameters, Boolean", function () {
      function fun(val) {
        if (val == null) {
          val = false;
        } else if (typeof val !== "boolean") {
          throw new TypeError("Expected val to be a Boolean, got " + __typeof(val));
        }
        return val;
      }
      expect(fun(false)).to.be["false"];
      expect(fun(true)).to.be["true"];
      expect(fun(null)).to.be["false"];
      expect(fun(void 0)).to.be["false"];
      expect(fun()).to.be["false"];
      expect(function () {
        return fun(0);
      }).throws(TypeError, "Expected val to be a Boolean, got Number");
      expect(function () {
        return fun(1);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun("stuff");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(function () {
        return fun([]);
      }).throws(TypeError);
      expect(function () {
        return fun(new Boolean(false));
      }).throws(TypeError);
      return expect(function () {
        return fun(new Boolean(true));
      }).throws(TypeError);
    });
    it("typed parameters, String", function () {
      function fun(val) {
        if (typeof val !== "string") {
          throw new TypeError("Expected val to be a String, got " + __typeof(val));
        }
        return val;
      }
      expect(fun("")).to.equal("");
      expect(fun("hello")).to.equal("hello");
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(0);
      }).throws(TypeError, "Expected val to be a String, got Number");
      expect(function () {
        return fun(0/0);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(function () {
        return fun([]);
      }).throws(TypeError);
      expect(function () {
        return fun(new String(""));
      }).throws(TypeError);
      return expect(function () {
        return fun(new String("hello"));
      }).throws(TypeError);
    });
    it("typed parameters, Number", function () {
      var _ref;
      function fun(val) {
        if (typeof val !== "number") {
          throw new TypeError("Expected val to be a Number, got " + __typeof(val));
        }
        return val;
      }
      expect(fun(0)).to.equal(0);
      expect(fun(1)).to.equal(1);
      expect(fun(-1)).to.equal(-1);
      expect(fun(1/0)).to.equal(1/0);
      expect(fun(-1/0)).to.equal(-1/0);
      expect((_ref = fun(0/0)) !== _ref).to.be["true"];
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError, "Expected val to be a Number, got String");
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(function () {
        return fun([]);
      }).throws(TypeError);
      expect(function () {
        return fun(new Number(0));
      }).throws(TypeError);
      expect(function () {
        return fun(new Number(1));
      }).throws(TypeError);
      expect(function () {
        return fun(new Number(0/0));
      }).throws(TypeError);
      return expect(function () {
        return fun(new Number(1/0));
      }).throws(TypeError);
    });
    it("typed parameters, Function", function () {
      function fun(f) {
        if (typeof f !== "function") {
          throw new TypeError("Expected f to be a Function, got " + __typeof(f));
        }
        return f();
      }
      expect(fun(function () {
        return 0;
      })).to.equal(0);
      expect(fun(function () {
        return "hello";
      })).to.equal("hello");
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(0);
      }).throws(TypeError, "Expected f to be a Function, got Number");
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      return expect(function () {
        return fun([]);
      }).throws(TypeError);
    });
    it("typed parameters, Array", function () {
      function fun(val) {
        if (!__isArray(val)) {
          throw new TypeError("Expected val to be an Array, got " + __typeof(val));
        }
        return val;
      }
      function getArgs() {
        return arguments;
      }
      function FakeArray() {}
      FakeArray.prototype = [];
      expect(fun([])).to.eql([]);
      expect(fun(["hello"])).to.eql(["hello"]);
      expect(fun(["hello", 1, true])).to.eql(["hello", 1, true]);
      expect(function () {
        return fun(0);
      }).throws(TypeError, "Expected val to be an Array, got Number");
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(function () {
        return fun(getArgs("hello"));
      }).throws(TypeError);
      return expect(function () {
        return fun(new FakeArray());
      }).throws(TypeError);
    });
    it("typed parameters, Array as []", function () {
      function fun(val) {
        if (!__isArray(val)) {
          throw new TypeError("Expected val to be an Array, got " + __typeof(val));
        }
        return val;
      }
      function getArgs() {
        return arguments;
      }
      function FakeArray() {}
      FakeArray.prototype = [];
      expect(fun([])).to.eql([]);
      expect(fun(["hello"])).to.eql(["hello"]);
      expect(fun(["hello", 1, true])).to.eql(["hello", 1, true]);
      expect(function () {
        return fun(0);
      }).throws(TypeError, "Expected val to be an Array, got Number");
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(function () {
        return fun(getArgs("hello"));
      }).throws(TypeError);
      return expect(function () {
        return fun(new FakeArray());
      }).throws(TypeError);
    });
    it("typed parameters, Object", function () {
      var obj;
      function fun(val) {
        if (typeof val !== "object" || val === null) {
          throw new TypeError("Expected val to be an Object, got " + __typeof(val));
        }
        return val;
      }
      expect(fun([])).to.eql([]);
      obj = {};
      expect(fun(obj)).to.equal(obj);
      expect(function () {
        return fun(0);
      }).throws(TypeError, "Expected val to be an Object, got Number");
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      return expect(function () {
        return fun(false);
      }).throws(TypeError);
    });
    it("typed parameters, Object as {}", function () {
      var obj;
      function fun(val) {
        if (typeof val !== "object" || val === null) {
          throw new TypeError("Expected val to be an Object, got " + __typeof(val));
        }
        return val;
      }
      expect(fun([])).to.eql([]);
      obj = {};
      expect(fun(obj)).to.equal(obj);
      expect(function () {
        return fun(0);
      }).throws(TypeError, "Expected val to be an Object, got Number");
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      return expect(function () {
        return fun(false);
      }).throws(TypeError);
    });
    it("typed parameters, specific object", function () {
      var obj;
      function fun(val) {
        if (typeof val !== "object" || val === null) {
          throw new TypeError("Expected val to be an Object, got " + __typeof(val));
        } else if (typeof val.x !== "number") {
          throw new TypeError("Expected val.x to be a Number, got " + __typeof(val.x));
        }
        return val.x;
      }
      obj = {};
      expect(function () {
        return fun({});
      }).throws(TypeError, "Expected val.x to be a Number, got Undefined");
      expect(fun({ x: 1 })).to.equal(1);
      expect(fun({ x: 1, y: 2 })).to.equal(1);
      expect(function () {
        return fun([]);
      }).throws(TypeError);
      expect(function () {
        return fun(0);
      }).throws(TypeError, "Expected val to be an Object, got Number");
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      return expect(function () {
        return fun(false);
      }).throws(TypeError);
    });
    it("typed parameters, arbitrary ident", function () {
      var alpha, bravo;
      function Thing() {}
      function fun(val) {
        if (!(val instanceof Thing)) {
          throw new TypeError("Expected val to be a " + __name(Thing) + ", got " + __typeof(val));
        }
        return val;
      }
      alpha = new Thing();
      bravo = new Thing();
      expect(fun(alpha)).to.equal(alpha);
      expect(fun(bravo)).to.equal(bravo);
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError, "Expected val to be a Thing, got String");
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun(0);
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      return expect(function () {
        return fun([]);
      }).throws(TypeError);
    });
    it("typed parameters, Number or String", function () {
      var _ref;
      function fun(val) {
        if (typeof val !== "number" && typeof val !== "string") {
          throw new TypeError("Expected val to be one of Number or String, got " + __typeof(val));
        }
        return val;
      }
      expect(fun(0)).to.equal(0);
      expect(fun(1)).to.equal(1);
      expect(fun(-1)).to.equal(-1);
      expect(fun(1/0)).to.equal(1/0);
      expect(fun(-1/0)).to.equal(-1/0);
      expect((_ref = fun(0/0)) !== _ref).to.be["true"];
      expect(fun("")).to.equal("");
      expect(fun("hello")).to.equal("hello");
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError, "Expected val to be one of Number or String, got Boolean");
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(function () {
        return fun([]);
      }).throws(TypeError);
      expect(function () {
        return fun(new Number(0));
      }).throws(TypeError);
      return expect(function () {
        return fun(new String(""));
      }).throws(TypeError);
    });
    it("typed parameters, Number or Boolean", function () {
      var _ref;
      function fun(val) {
        if (val == null) {
          val = false;
        } else if (typeof val !== "number" && typeof val !== "boolean") {
          throw new TypeError("Expected val to be one of Number or Boolean, got " + __typeof(val));
        }
        return val;
      }
      expect(fun(0)).to.equal(0);
      expect(fun(1)).to.equal(1);
      expect(fun(-1)).to.equal(-1);
      expect(fun(1/0)).to.equal(1/0);
      expect(fun(-1/0)).to.equal(-1/0);
      expect((_ref = fun(0/0)) !== _ref).to.be["true"];
      expect(fun()).to.be["false"];
      expect(fun(void 0)).to.be["false"];
      expect(fun(null)).to.be["false"];
      expect(fun(true)).to.be["true"];
      expect(fun(false)).to.be["false"];
      expect(function () {
        return fun("");
      }).throws(TypeError, "Expected val to be one of Number or Boolean, got String");
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(function () {
        return fun([]);
      }).throws(TypeError);
      expect(function () {
        return fun(new Number(0));
      }).throws(TypeError);
      return expect(function () {
        return fun(new Boolean(false));
      }).throws(TypeError);
    });
    it("typed parameters, Number or null", function () {
      var _ref;
      function fun(val) {
        if (val == null) {
          val = null;
        } else if (typeof val !== "number") {
          throw new TypeError("Expected val to be one of Number or null, got " + __typeof(val));
        }
        return val;
      }
      expect(fun(0)).to.equal(0);
      expect(fun(1)).to.equal(1);
      expect(fun(-1)).to.equal(-1);
      expect(fun(1/0)).to.equal(1/0);
      expect(fun(-1/0)).to.equal(-1/0);
      expect((_ref = fun(0/0)) !== _ref).to.be["true"];
      expect(fun()).to.be["null"];
      expect(fun(void 0)).to.be["null"];
      expect(fun(null)).to.be["null"];
      expect(function () {
        return fun(true);
      }).throws(TypeError, "Expected val to be one of Number or null, got Boolean");
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(function () {
        return fun([]);
      }).throws(TypeError);
      return expect(function () {
        return fun(new Number(0));
      }).throws(TypeError);
    });
    it("typed parameters, Number or void", function () {
      var _ref;
      function fun(val) {
        if (val == null) {
          val = void 0;
        } else if (typeof val !== "number") {
          throw new TypeError("Expected val to be one of Number or undefined, got " + __typeof(val));
        }
        return val;
      }
      expect(fun(0)).to.equal(0);
      expect(fun(1)).to.equal(1);
      expect(fun(-1)).to.equal(-1);
      expect(fun(1/0)).to.equal(1/0);
      expect(fun(-1/0)).to.equal(-1/0);
      expect((_ref = fun(0/0)) !== _ref).to.be["true"];
      expect(fun()).to.be["undefined"];
      expect(fun(void 0)).to.be["undefined"];
      expect(fun(null)).to.be["undefined"];
      expect(function () {
        return fun(true);
      }).throws(TypeError, "Expected val to be one of Number or undefined, got Boolean");
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(function () {
        return fun([]);
      }).throws(TypeError);
      return expect(function () {
        return fun(new Number(0));
      }).throws(TypeError);
    });
    it("typed parameters, Boolean or null", function () {
      function fun(val) {
        if (val == null) {
          val = null;
        } else if (typeof val !== "boolean") {
          throw new TypeError("Expected val to be one of Boolean or null, got " + __typeof(val));
        }
        return val;
      }
      expect(fun()).to.be["null"];
      expect(fun(true)).to.be["true"];
      expect(fun(false)).to.be["false"];
      expect(fun(void 0)).to.be["null"];
      expect(fun(null)).to.be["null"];
      expect(function () {
        return fun(0);
      }).throws(TypeError, "Expected val to be one of Boolean or null, got Number");
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(function () {
        return fun([]);
      }).throws(TypeError);
      return expect(function () {
        return fun(new Boolean(false));
      }).throws(TypeError);
    });
    it("typed parameters, Boolean or void", function () {
      function fun(val) {
        if (val == null) {
          val = void 0;
        } else if (typeof val !== "boolean") {
          throw new TypeError("Expected val to be one of Boolean or undefined, got " + __typeof(val));
        }
        return val;
      }
      expect(fun()).to.be["undefined"];
      expect(fun(true)).to.be["true"];
      expect(fun(false)).to.be["false"];
      expect(fun(void 0)).to.be["undefined"];
      expect(fun(null)).to.be["undefined"];
      expect(function () {
        return fun(0);
      }).throws(TypeError, "Expected val to be one of Boolean or undefined, got Number");
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(function () {
        return fun([]);
      }).throws(TypeError);
      return expect(function () {
        return fun(new Boolean(false));
      }).throws(TypeError);
    });
    it("typed parameters, Boolean or null or void", function () {
      function fun(val) {
        if (val != null && typeof val !== "boolean") {
          throw new TypeError("Expected val to be one of Boolean or null or undefined, got " + __typeof(val));
        }
        return val;
      }
      expect(fun()).to.be["undefined"];
      expect(fun(true)).to.be["true"];
      expect(fun(false)).to.be["false"];
      expect(fun(void 0)).to.be["undefined"];
      expect(fun(null)).to.be["null"];
      expect(function () {
        return fun(0);
      }).throws(TypeError, "Expected val to be one of Boolean or null or undefined, got Number");
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(function () {
        return fun([]);
      }).throws(TypeError);
      return expect(function () {
        return fun(new Boolean(false));
      }).throws(TypeError);
    });
    it("typed parameters, special type or null", function () {
      var x;
      function Thing() {}
      function fun(val) {
        if (val == null) {
          val = null;
        } else if (!(val instanceof Thing)) {
          throw new TypeError("Expected val to be one of " + (__name(Thing) + " or null") + ", got " + __typeof(val));
        }
        return val;
      }
      x = new Thing();
      expect(fun(x)).to.equal(x);
      expect(function () {
        return fun(0);
      }).throws(TypeError, "Expected val to be one of Thing or null, got Number");
      expect(fun()).to.be["null"];
      expect(fun(void 0)).to.be["null"];
      expect(fun(null)).to.be["null"];
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      return expect(function () {
        return fun([]);
      }).throws(TypeError);
    });
    it("typed parameters, special type or String", function () {
      var x;
      function Thing() {}
      function fun(val) {
        if (!(val instanceof Thing) && typeof val !== "string") {
          throw new TypeError("Expected val to be one of " + (__name(Thing) + " or String") + ", got " + __typeof(val));
        }
        return val;
      }
      x = new Thing();
      expect(fun(x)).to.equal(x);
      expect(function () {
        return fun(0);
      }).throws(TypeError);
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError, "Expected val to be one of Thing or String, got Boolean");
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(fun("")).to.equal("");
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(function () {
        return fun([]);
      }).throws(TypeError);
      return expect(function () {
        return fun(new String(""));
      }).throws(TypeError);
    });
    it("typed parameters, special type or String or null", function () {
      var x;
      function Thing() {}
      function fun(val) {
        if (val == null) {
          val = null;
        } else if (!(val instanceof Thing) && typeof val !== "string") {
          throw new TypeError("Expected val to be one of " + (__name(Thing) + " or String or null") + ", got " + __typeof(val));
        }
        return val;
      }
      x = new Thing();
      expect(fun(x)).to.equal(x);
      expect(function () {
        return fun(0);
      }).throws(TypeError);
      expect(fun()).to.be["null"];
      expect(fun(void 0)).to.be["null"];
      expect(fun(null)).to.be["null"];
      expect(function () {
        return fun(true);
      }).throws(TypeError, "Expected val to be one of Thing or String or null, got Boolean");
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(fun("")).to.equal("");
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(function () {
        return fun([]);
      }).throws(TypeError);
      return expect(function () {
        return fun(new String(""));
      }).throws(TypeError);
    });
    it("typed array parameter", function () {
      function fun(val) {
        var _i;
        if (!__isArray(val)) {
          throw new TypeError("Expected val to be an Array, got " + __typeof(val));
        } else {
          for (_i = __num(val.length); _i--; ) {
            if (typeof val[_i] !== "string") {
              throw new TypeError("Expected " + ("val[" + _i + "]") + " to be a String, got " + __typeof(val[_i]));
            }
          }
        }
        return val;
      }
      expect(function () {
        return fun(0);
      }).throws(TypeError, "Expected val to be an Array, got Number");
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(fun([])).to.eql([]);
      expect(fun(["alpha"])).to.eql(["alpha"]);
      expect(fun(["alpha", "bravo"])).to.eql(["alpha", "bravo"]);
      expect(fun(["alpha", "bravo", "charlie"])).to.eql(["alpha", "bravo", "charlie"]);
      expect(function () {
        return fun([1]);
      }).throws(TypeError, "Expected val[0] to be a String, got Number");
      expect(function () {
        return fun([null]);
      }).throws(TypeError);
      expect(function () {
        return fun([void 0]);
      }).throws(TypeError);
      expect(function () {
        return fun([false]);
      }).throws(TypeError);
      expect(function () {
        return fun([{}]);
      }).throws(TypeError);
      return expect(function () {
        return fun([new String("hello")]);
      }).throws(TypeError);
    });
    it("typed array as generic", function () {
      function fun(val) {
        var _i;
        if (!__isArray(val)) {
          throw new TypeError("Expected val to be an Array, got " + __typeof(val));
        } else {
          for (_i = __num(val.length); _i--; ) {
            if (typeof val[_i] !== "string") {
              throw new TypeError("Expected " + ("val[" + _i + "]") + " to be a String, got " + __typeof(val[_i]));
            }
          }
        }
        return val;
      }
      expect(function () {
        return fun(0);
      }).throws(TypeError, "Expected val to be an Array, got Number");
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(fun([])).to.eql([]);
      expect(fun(["alpha"])).to.eql(["alpha"]);
      expect(fun(["alpha", "bravo"])).to.eql(["alpha", "bravo"]);
      expect(fun(["alpha", "bravo", "charlie"])).to.eql(["alpha", "bravo", "charlie"]);
      expect(function () {
        return fun([1]);
      }).throws(TypeError, "Expected val[0] to be a String, got Number");
      expect(function () {
        return fun([null]);
      }).throws(TypeError);
      expect(function () {
        return fun([void 0]);
      }).throws(TypeError);
      expect(function () {
        return fun([false]);
      }).throws(TypeError);
      expect(function () {
        return fun([{}]);
      }).throws(TypeError);
      return expect(function () {
        return fun([new String("hello")]);
      }).throws(TypeError);
    });
    it("typed array parameter of typed array parameter", function () {
      function fun(val) {
        var _i, _i2;
        if (!__isArray(val)) {
          throw new TypeError("Expected val to be an Array, got " + __typeof(val));
        } else {
          for (_i = __num(val.length); _i--; ) {
            if (!__isArray(val[_i])) {
              throw new TypeError("Expected " + ("val[" + _i + "]") + " to be an Array, got " + __typeof(val[_i]));
            } else {
              for (_i2 = __num(val[_i].length); _i2--; ) {
                if (typeof val[_i][_i2] !== "string") {
                  throw new TypeError("Expected " + ("val[" + _i + "][" + _i2 + "]") + " to be a String, got " + __typeof(val[_i][_i2]));
                }
              }
            }
          }
        }
        return val;
      }
      expect(function () {
        return fun(0);
      }).throws(TypeError, "Expected val to be an Array, got Number");
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(fun([])).to.eql([]);
      expect(fun([[]])).to.eql([[]]);
      expect(fun([[], ["alpha"]])).to.eql([[], ["alpha"]]);
      expect(fun([
        [],
        ["alpha"],
        ["bravo", "charlie"]
      ])).to.eql([
        [],
        ["alpha"],
        ["bravo", "charlie"]
      ]);
      expect(function () {
        return fun([1]);
      }).throws(TypeError, "Expected val[0] to be an Array, got Number");
      expect(function () {
        return fun([[1]]);
      }).throws(TypeError, "Expected val[0][0] to be a String, got Number");
      expect(function () {
        return fun([["alpha"], [1]]);
      }).throws(TypeError, "Expected val[1][0] to be a String, got Number");
      expect(function () {
        return fun(["alpha"]);
      }).throws(TypeError);
      expect(function () {
        return fun([null]);
      }).throws(TypeError);
      expect(function () {
        return fun([void 0]);
      }).throws(TypeError);
      expect(function () {
        return fun([false]);
      }).throws(TypeError);
      expect(function () {
        return fun([{}]);
      }).throws(TypeError);
      return expect(function () {
        return fun([new String("hello")]);
      }).throws(TypeError);
    });
    it("typed array parameter of specific objects", function () {
      function fun(val) {
        var _arr, _i, _i2, _len, x;
        if (!__isArray(val)) {
          throw new TypeError("Expected val to be an Array, got " + __typeof(val));
        } else {
          for (_i = __num(val.length); _i--; ) {
            if (typeof val[_i] !== "object" || val[_i] === null) {
              throw new TypeError("Expected " + ("val[" + _i + "]") + " to be an Object, got " + __typeof(val[_i]));
            } else if (typeof val[_i].x !== "string") {
              throw new TypeError("Expected " + ("val[" + _i + "].x") + " to be a String, got " + __typeof(val[_i].x));
            }
          }
        }
        _arr = [];
        for (_i2 = 0, _len = val.length; _i2 < _len; ++_i2) {
          x = val[_i2].x;
          _arr.push(x);
        }
        return _arr;
      }
      expect(function () {
        return fun(0);
      }).throws(TypeError, "Expected val to be an Array, got Number");
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      expect(fun([])).to.eql([]);
      expect(function () {
        return fun(["alpha"]);
      }).throws(TypeError, "Expected val[0] to be an Object, got String");
      expect(function () {
        return fun([{}]);
      }).throws(TypeError);
      expect(fun([{ x: "alpha" }])).to.eql(["alpha"]);
      expect(fun([{ x: "alpha" }, { x: "bravo" }])).to.eql(["alpha", "bravo"]);
      expect(function () {
        return fun([{ x: "alpha" }, { x: 2 }]);
      }).throws(TypeError, "Expected val[1].x to be a String, got Number");
      expect(function () {
        return fun([1]);
      }).throws(TypeError);
      expect(function () {
        return fun([null]);
      }).throws(TypeError);
      expect(function () {
        return fun([void 0]);
      }).throws(TypeError);
      expect(function () {
        return fun([false]);
      }).throws(TypeError);
      return expect(function () {
        return fun([new String("hello")]);
      }).throws(TypeError);
    });
    it(
      "typed array parameter of specific objects with more than one key",
      function () {
        function fun(val) {
          var _arr, _i, _i2, _len, _ref, x, y;
          if (!__isArray(val)) {
            throw new TypeError("Expected val to be an Array, got " + __typeof(val));
          } else {
            for (_i = __num(val.length); _i--; ) {
              if (typeof val[_i] !== "object" || val[_i] === null) {
                throw new TypeError("Expected " + ("val[" + _i + "]") + " to be an Object, got " + __typeof(val[_i]));
              } else {
                if (typeof val[_i].x !== "number") {
                  throw new TypeError("Expected " + ("val[" + _i + "].x") + " to be a Number, got " + __typeof(val[_i].x));
                }
                if (typeof val[_i].y !== "number") {
                  throw new TypeError("Expected " + ("val[" + _i + "].y") + " to be a Number, got " + __typeof(val[_i].y));
                }
              }
            }
          }
          _arr = [];
          for (_i2 = 0, _len = val.length; _i2 < _len; ++_i2) {
            _ref = val[_i2];
            x = _ref.x;
            y = _ref.y;
            _ref = null;
            _arr.push(__num(x) * __num(y));
          }
          return _arr;
        }
        expect(function () {
          return fun(0);
        }).throws(TypeError);
        expect(function () {
          return fun();
        }).throws(TypeError);
        expect(function () {
          return fun(void 0);
        }).throws(TypeError);
        expect(function () {
          return fun(null);
        }).throws(TypeError);
        expect(function () {
          return fun(true);
        }).throws(TypeError);
        expect(function () {
          return fun(false);
        }).throws(TypeError);
        expect(function () {
          return fun("");
        }).throws(TypeError);
        expect(function () {
          return fun({});
        }).throws(TypeError);
        expect(fun([])).to.eql([]);
        expect(function () {
          return fun(["alpha"]);
        }).throws(TypeError);
        expect(function () {
          return fun([{}]);
        }).throws(TypeError);
        expect(fun([{ x: 2, y: 3 }])).to.eql([6]);
        expect(fun([
          { x: 5, y: 2, z: "blah!" },
          { x: 100, y: 10, q: "ignored" }
        ])).to.eql([10, 1000]);
        expect(function () {
          return fun([1]);
        }).throws(TypeError);
        expect(function () {
          return fun([null]);
        }).throws(TypeError);
        expect(function () {
          return fun([void 0]);
        }).throws(TypeError);
        expect(function () {
          return fun([false]);
        }).throws(TypeError);
        return expect(function () {
          return fun([new String("hello")]);
        }).throws(TypeError);
      }
    );
    it("typed function parameter", function () {
      function fun(f) {
        if (typeof f !== "function") {
          throw new TypeError("Expected f to be a Function, got " + __typeof(f));
        }
        return f();
      }
      expect(fun(function () {
        return "hello";
      })).to.equal("hello");
      expect(function () {
        return fun(0);
      }).throws(TypeError);
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      return expect(function () {
        return fun([]);
      }).throws(TypeError);
    });
    it("typed function parameter with argument", function () {
      function fun(f) {
        if (typeof f !== "function") {
          throw new TypeError("Expected f to be a Function, got " + __typeof(f));
        }
        return f(0);
      }
      expect(fun(function (x) {
        return "hello" + __strnum(x);
      })).to.equal("hello0");
      expect(function () {
        return fun(0);
      }).throws(TypeError);
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      return expect(function () {
        return fun([]);
      }).throws(TypeError);
    });
    it("typed function parameter with arguments", function () {
      function fun(f) {
        if (typeof f !== "function") {
          throw new TypeError("Expected f to be a Function, got " + __typeof(f));
        }
        return f(0, 1);
      }
      expect(fun(function (x, y) {
        return "hello " + __strnum(x) + " " + __strnum(y);
      })).to.equal("hello 0 1");
      expect(function () {
        return fun(0);
      }).throws(TypeError);
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      return expect(function () {
        return fun([]);
      }).throws(TypeError);
    });
    it("typed function which returns a typed function", function () {
      function fun(f) {
        if (typeof f !== "function") {
          throw new TypeError("Expected f to be a Function, got " + __typeof(f));
        }
        return f(0)(1);
      }
      expect(fun(function (x) {
        return function (y) {
          return "hello " + __strnum(x) + " " + __strnum(y);
        };
      })).to.equal("hello 0 1");
      expect(function () {
        return fun(0);
      }).throws(TypeError);
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      return expect(function () {
        return fun([]);
      }).throws(TypeError);
    });
    it("typed function which returns any", function () {
      function fun(f) {
        if (typeof f !== "function") {
          throw new TypeError("Expected f to be a Function, got " + __typeof(f));
        }
        return f();
      }
      expect(fun(function () {
        return "hello";
      })).to.equal("hello");
      expect(fun(function () {
        return 10;
      })).to.equal(10);
      expect(function () {
        return fun(0);
      }).throws(TypeError);
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      return expect(function () {
        return fun([]);
      }).throws(TypeError);
    });
    it(
      "typed function which returns any but has a parameter",
      function () {
        function fun(f) {
          if (typeof f !== "function") {
            throw new TypeError("Expected f to be a Function, got " + __typeof(f));
          }
          return f(10);
        }
        expect(fun(function (x) {
          return "hello " + __strnum(x);
        })).to.equal("hello 10");
        expect(fun(function (x) {
          return __num(x) * 10;
        })).to.equal(100);
        expect(function () {
          return fun(0);
        }).throws(TypeError);
        expect(function () {
          return fun();
        }).throws(TypeError);
        expect(function () {
          return fun(void 0);
        }).throws(TypeError);
        expect(function () {
          return fun(null);
        }).throws(TypeError);
        expect(function () {
          return fun(true);
        }).throws(TypeError);
        expect(function () {
          return fun(false);
        }).throws(TypeError);
        expect(function () {
          return fun("");
        }).throws(TypeError);
        expect(function () {
          return fun({});
        }).throws(TypeError);
        return expect(function () {
          return fun([]);
        }).throws(TypeError);
      }
    );
    it("typed object or function", function () {
      var obj;
      function fun(x) {
        if ((typeof x !== "object" || x === null) && typeof x !== "function") {
          throw new TypeError("Expected x to be one of Object or Function, got " + __typeof(x));
        }
        if (typeof x === "function") {
          return x();
        } else {
          return x;
        }
      }
      obj = {};
      expect(fun(obj)).to.equal(obj);
      expect(fun(function () {
        return obj;
      })).to.equal(obj);
      expect(fun(function () {
        return "x";
      })).to.equal("x");
      expect(function () {
        return fun(0);
      }).throws(TypeError);
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      return expect(function () {
        return fun("");
      }).throws(TypeError);
    });
    it("typed function or object", function () {
      var obj;
      function fun(x) {
        if (typeof x !== "function" && (typeof x !== "object" || x === null)) {
          throw new TypeError("Expected x to be one of Function or Object, got " + __typeof(x));
        }
        if (typeof x === "function") {
          return x();
        } else {
          return x;
        }
      }
      obj = {};
      expect(fun(obj)).to.equal(obj);
      expect(fun(function () {
        return obj;
      })).to.equal(obj);
      expect(fun(function () {
        return "x";
      })).to.equal("x");
      expect(function () {
        return fun(0);
      }).throws(TypeError);
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      return expect(function () {
        return fun("");
      }).throws(TypeError);
    });
    it("function with return type", function () {
      function fun() {
        return "hello";
      }
      return expect(fun()).to.equal("hello");
    });
    it("function with return type as a function", function () {
      function fun() {
        return function (i) {
          return String(i);
        };
      }
      return expect(fun()(10)).to.equal("10");
    });
    it("typed parameter as access", function () {
      var alpha, bravo, ns;
      ns = (function () {
        function Thing() {}
        return { Thing: Thing };
      }());
      function fun(value) {
        if (!(value instanceof ns.Thing)) {
          throw new TypeError("Expected value to be a " + __name(ns.Thing) + ", got " + __typeof(value));
        }
        return value;
      }
      alpha = new (ns.Thing)();
      bravo = new (ns.Thing)();
      expect(fun(alpha)).to.equal(alpha);
      expect(fun(bravo)).to.equal(bravo);
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun(0);
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      return expect(function () {
        return fun([]);
      }).throws(TypeError);
    });
    it("Parenthetical access as function", function () {
      function map(array, func) {
        var _arr, _arr2, _i, _len, x;
        _arr = [];
        for (_arr2 = __toArray(array), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          x = _arr2[_i];
          _arr.push(func(x));
        }
        return _arr;
      }
      return expect(map(
        [
          "alpha",
          "bravo",
          "charlie",
          "delta",
          "echo"
        ],
        function (_o) {
          return _o.length;
        }
      )).to.eql([
        5,
        5,
        7,
        5,
        4
      ]);
    });
    it("Parenthetical method call as function", function () {
      function map(array, func) {
        var _arr, _arr2, _i, _len, x;
        _arr = [];
        for (_arr2 = __toArray(array), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
          x = _arr2[_i];
          _arr.push(func(x));
        }
        return _arr;
      }
      return expect(map(
        [
          "alpha",
          "bravo",
          "charlie",
          "delta",
          "echo"
        ],
        function (_o) {
          return _o.substring(2);
        }
      )).to.eql([
        "pha",
        "avo",
        "arlie",
        "lta",
        "ho"
      ]);
    });
    it("Ignored parameter", function () {
      function f(_p, x) {
        return x;
      }
      expect(f()).to.be["undefined"];
      expect(f(5)).to.be["undefined"];
      return expect(f(5, 6)).to.equal(6);
    });
    it("Ignored parameter in array", function () {
      function f(_p) {
        var x;
        x = _p[1];
        return x;
      }
      expect(f([])).to.be["undefined"];
      expect(f([5])).to.be["undefined"];
      return expect(f([5, 6])).to.equal(6);
    });
    it("Ignored middle parameter", function () {
      function f(x, _p, y) {
        return [x, y];
      }
      expect(f()).to.eql([void 0, void 0]);
      expect(f(5)).to.eql([5, void 0]);
      expect(f(5, 6)).to.eql([5, void 0]);
      return expect(f(5, 6, 7)).to.eql([5, 7]);
    });
    it("Ignored middle parameter in array", function () {
      function f(_p) {
        var x, y;
        x = _p[0];
        y = _p[2];
        return [x, y];
      }
      expect(f([])).to.eql([void 0, void 0]);
      expect(f([5])).to.eql([5, void 0]);
      expect(f([5, 6])).to.eql([5, void 0]);
      return expect(f([5, 6, 7])).to.eql([5, 7]);
    });
    it("Curried function", function () {
      var add, plus4, plus5;
      add = __curry(2, function (x, y) {
        return __num(x) + __num(y);
      });
      expect(add(4, 6)).to.equal(10);
      plus5 = add(5);
      expect(plus5(5)).to.equal(10);
      expect(plus5(10)).to.equal(15);
      expect(add()).to.equal(add);
      expect(plus5()).to.equal(plus5);
      plus4 = add(4);
      expect(plus4).to.not.equal(plus5);
      return expect(plus4(6)).to.equal(10);
    });
    it("Curried function takes the last this", function () {
      var getThis, obj;
      getThis = __curry(2, function (x, y) {
        return this;
      });
      obj = {};
      return expect(getThis.call({}, 1).call(obj, 2)).to.equal(obj);
    });
    it("Generic function", function () {
      var arr, f, myObj, obj;
      f = __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return function (val) {
          if (!_instanceof_T(val)) {
            throw new TypeError("Expected val to be a " + __name(T) + ", got " + __typeof(val));
          }
          return val;
        };
      });
      expect(f.generic(String)("Hello")).to.equal("Hello");
      expect(f.generic(Number)(1234)).to.equal(1234);
      expect(f.generic(Boolean)(true)).to.be["true"];
      obj = {};
      expect(f.generic(Object)(obj)).to.equal(obj);
      arr = [];
      expect(f.generic(Array)(arr)).to.equal(arr);
      expect(function () {
        return f.generic(String)(1234);
      }).throws(TypeError, "Expected val to be a String, got Number");
      expect(function () {
        return f.generic(Number)("hello");
      }).throws(TypeError);
      expect(function () {
        return f.generic(Boolean)(0);
      }).throws(TypeError);
      expect(function () {
        return f.generic(Boolean)({});
      }).throws(TypeError);
      expect(function () {
        return f.generic(Object)(true);
      }).throws(TypeError);
      expect(function () {
        return f.generic(Array)({});
      }).throws(TypeError);
      function MyType() {}
      myObj = new MyType();
      expect(f.generic(MyType)(myObj)).to.equal(myObj);
      expect(function () {
        return f.generic(MyType)("hello");
      }).throws(TypeError, "Expected val to be a MyType, got String");
      expect(f("Hello")).to.equal("Hello");
      expect(f.generic(null)("Hello")).to.equal("Hello");
      expect(f.generic(null)).to.equal(f);
      expect(f.generic(Number)).to.equal(f.generic(Number));
      expect(f(1234)).to.equal(1234);
      expect(f(null)).to.be["null"];
      return expect(f(void 0)).to.be["undefined"];
    });
    it("Generic anonymous function", function () {
      function call(arg, type, func) {
        return func.generic(type)(arg);
      }
      expect(call("Hello", String, __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return function (val) {
          if (!_instanceof_T(val)) {
            throw new TypeError("Expected val to be a " + __name(T) + ", got " + __typeof(val));
          }
          return val;
        };
      }))).to.equal("Hello");
      expect(call(1234, Number, __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return function (val) {
          if (!_instanceof_T(val)) {
            throw new TypeError("Expected val to be a " + __name(T) + ", got " + __typeof(val));
          }
          return val;
        };
      }))).to.equal(1234);
      expect(call(true, Boolean, __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return function (val) {
          if (!_instanceof_T(val)) {
            throw new TypeError("Expected val to be a " + __name(T) + ", got " + __typeof(val));
          }
          return val;
        };
      }))).to.be["true"];
      expect(call("Hello", null, __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return function (val) {
          if (!_instanceof_T(val)) {
            throw new TypeError("Expected val to be a " + __name(T) + ", got " + __typeof(val));
          }
          return val;
        };
      }))).to.equal("Hello");
      expect(function () {
        return call(1234, String, __genericFunc(1, function (T) {
          var _instanceof_T;
          _instanceof_T = __getInstanceof(T);
          return function (val) {
            if (!_instanceof_T(val)) {
              throw new TypeError("Expected val to be a " + __name(T) + ", got " + __typeof(val));
            }
            return val;
          };
        }));
      }).throws(TypeError, "Expected val to be a String, got Number");
      expect(function () {
        return call("hello", Number, __genericFunc(1, function (T) {
          var _instanceof_T;
          _instanceof_T = __getInstanceof(T);
          return function (val) {
            if (!_instanceof_T(val)) {
              throw new TypeError("Expected val to be a " + __name(T) + ", got " + __typeof(val));
            }
            return val;
          };
        }));
      }).throws(TypeError);
      function checkEqual(func) {
        expect(func.generic(null)).to.equal(func);
        return expect(func.generic(Number)).to.equal(func.generic(Number));
      }
      return checkEqual(__genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return function (val) {
          if (!_instanceof_T(val)) {
            throw new TypeError("Expected val to be a " + __name(T) + ", got " + __typeof(val));
          }
          return val;
        };
      }));
    });
    it("Generic function as class", function () {
      var Box;
      Box = __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return function (value) {
          var self;
          if (!_instanceof_T(value)) {
            throw new TypeError("Expected value to be a " + __name(T) + ", got " + __typeof(value));
          }
          if (this instanceof Box.generic(T)) {
            self = this;
          } else {
            self = __create(Box.generic(T).prototype);
          }
          self.value = value;
          return self;
        };
      });
      expect(Box.generic(String)("Hello").value).to.equal("Hello");
      expect(new (Box.generic(String))("Hello").value).to.equal("Hello");
      expect(Box.generic(String)("Hello")).to.be.an["instanceof"](Box.generic(String));
      return expect(Box.generic(Box.generic(String))(Box.generic(String)("Hello")).value.value).to.equal("Hello");
    });
    it(
      "Generic function ignores provided generic arguments beyond the declared",
      function () {
        var func;
        func = __genericFunc(2, function (T1, T2) {
          return function () {};
        });
        expect(func.generic(String, String)).to.equal(func.generic(String, String));
        expect(func.generic(String, Number)).to.not.equal(func.generic(String, String));
        expect(func.generic(Number, String)).to.not.equal(func.generic(String, String));
        expect(func.generic(Number, String)).to.not.equal(func.generic(String, Number));
        expect(func.generic(String, Number)).to.equal(func.generic(String, Number));
        expect(func.generic(Number, Number)).to.not.equal(func.generic(String, Number));
        expect(func.generic(Number, Number)).to.not.equal(func.generic(Number, String));
        expect(func.generic(Number, Number)).to.equal(func.generic(Number, Number));
        expect(func.generic(Number, String, Boolean)).to.equal(func.generic(Number, String));
        expect(func.generic(Number, String, null)).to.equal(func.generic(Number, String));
        expect(func.generic(Number, String, void 0)).to.equal(func.generic(Number, String));
        expect(func.generic(Number)).to.equal(func.generic(Number, null));
        expect(func.generic(null, null)).to.equal(func);
        expect(func.generic(void 0, void 0)).to.equal(func);
        expect(func.generic(null)).to.equal(func);
        expect(func.generic(void 0)).to.equal(func);
        expect(func.generic(void 0, Boolean)).to.equal(func.generic(null, Boolean));
        expect(func.generic(null, Boolean, Number)).to.equal(func.generic(null, Boolean));
        expect(func.generic(null, Boolean, String)).to.equal(func.generic(null, Boolean));
        return expect(func.generic(null, Boolean, null)).to.equal(func.generic(null, Boolean));
      }
    );
    it("typed generic", function () {
      var MyType;
      MyType = __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return function (value) {
          if (!_instanceof_T(value)) {
            throw new TypeError("Expected value to be a " + __name(T) + ", got " + __typeof(value));
          }
          this.value = value;
        };
      });
      function fun(x) {
        if (!(x instanceof MyType.generic(Number))) {
          throw new TypeError("Expected x to be a " + __name(MyType.generic(Number)) + ", got " + __typeof(x));
        }
        return x.value;
      }
      expect(new (MyType.generic(Number))(10).value).to.equal(10);
      expect(new (MyType.generic(String))("hello").value).to.equal("hello");
      expect(fun(new (MyType.generic(Number))(10))).to.equal(10);
      expect(function () {
        return fun(new (MyType.generic(String))("hello"));
      }).throws(TypeError);
      expect(function () {
        return fun(0);
      }).throws(TypeError);
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      return expect(function () {
        return fun([]);
      }).throws(TypeError);
    });
    it("typed generic of typed generic", function () {
      var MyType;
      MyType = __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return function (value) {
          if (!_instanceof_T(value)) {
            throw new TypeError("Expected value to be a " + __name(T) + ", got " + __typeof(value));
          }
          this.value = value;
        };
      });
      function fun(x) {
        if (!(x instanceof MyType.generic(MyType.generic(Number)))) {
          throw new TypeError("Expected x to be a " + __name(MyType.generic(MyType.generic(Number))) + ", got " + __typeof(x));
        }
        return x.value.value;
      }
      expect(new (MyType.generic(Number))(10).value).to.equal(10);
      expect(new (MyType.generic(String))("hello").value).to.equal("hello");
      expect(fun(new (MyType.generic(MyType.generic(Number)))(new (MyType.generic(Number))(10)))).to.equal(10);
      expect(function () {
        return fun(new (MyType.generic(Number))(10));
      }).throws(TypeError);
      expect(function () {
        return fun(0);
      }).throws(TypeError);
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      return expect(function () {
        return fun([]);
      }).throws(TypeError);
    });
    it("typed generic of array", function () {
      var MyType;
      MyType = __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return function (value) {
          if (!_instanceof_T(value)) {
            throw new TypeError("Expected value to be a " + __name(T) + ", got " + __typeof(value));
          }
          this.value = value;
        };
      });
      function fun(x) {
        if (!(x instanceof MyType.generic(Array))) {
          throw new TypeError("Expected x to be a " + __name(MyType.generic(Array)) + ", got " + __typeof(x));
        }
        return x.value;
      }
      expect(new (MyType.generic(Number))(10).value).to.equal(10);
      expect(new (MyType.generic(String))("hello").value).to.equal("hello");
      expect(fun(new (MyType.generic(Array))([1, 2]))).to.eql([1, 2]);
      expect(function () {
        return fun(new (MyType.generic(Number))(10));
      }).throws(TypeError);
      expect(function () {
        return fun(0);
      }).throws(TypeError);
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      return expect(function () {
        return fun([]);
      }).throws(TypeError);
    });
    it("typed generic of array as []", function () {
      var MyType;
      MyType = __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return function (value) {
          if (!_instanceof_T(value)) {
            throw new TypeError("Expected value to be a " + __name(T) + ", got " + __typeof(value));
          }
          this.value = value;
        };
      });
      function fun(x) {
        if (!(x instanceof MyType.generic(Array))) {
          throw new TypeError("Expected x to be a " + __name(MyType.generic(Array)) + ", got " + __typeof(x));
        }
        return x.value;
      }
      expect(new (MyType.generic(Number))(10).value).to.equal(10);
      expect(new (MyType.generic(String))("hello").value).to.equal("hello");
      expect(fun(new (MyType.generic(Array))([1, 2]))).to.eql([1, 2]);
      expect(function () {
        return fun(new (MyType.generic(Number))(10));
      }).throws(TypeError);
      expect(function () {
        return fun(0);
      }).throws(TypeError);
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      return expect(function () {
        return fun([]);
      }).throws(TypeError);
    });
    return it("typed generic of typed array", function () {
      var MyType;
      MyType = __genericFunc(1, function (T) {
        var _instanceof_T;
        _instanceof_T = __getInstanceof(T);
        return function (value) {
          if (!_instanceof_T(value)) {
            throw new TypeError("Expected value to be a " + __name(T) + ", got " + __typeof(value));
          }
          this.value = value;
        };
      });
      function fun(x) {
        if (!(x instanceof MyType.generic(Array))) {
          throw new TypeError("Expected x to be a " + __name(MyType.generic(Array)) + ", got " + __typeof(x));
        }
        return x.value;
      }
      expect(new (MyType.generic(Number))(10).value).to.equal(10);
      expect(new (MyType.generic(String))("hello").value).to.equal("hello");
      expect(fun(new (MyType.generic(Array))([1, 2]))).to.eql([1, 2]);
      expect(function () {
        return fun(new (MyType.generic(Number))(10));
      }).throws(TypeError);
      expect(function () {
        return fun(0);
      }).throws(TypeError);
      expect(function () {
        return fun();
      }).throws(TypeError);
      expect(function () {
        return fun(void 0);
      }).throws(TypeError);
      expect(function () {
        return fun(null);
      }).throws(TypeError);
      expect(function () {
        return fun(true);
      }).throws(TypeError);
      expect(function () {
        return fun(false);
      }).throws(TypeError);
      expect(function () {
        return fun("");
      }).throws(TypeError);
      expect(function () {
        return fun({});
      }).throws(TypeError);
      return expect(function () {
        return fun([]);
      }).throws(TypeError);
    });
  });
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
