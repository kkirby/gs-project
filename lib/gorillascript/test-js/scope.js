(function (GLOBAL) {
  "use strict";
  var __create, __isArray, __num, __slice, __toArray, __typeof, expect,
      setImmediate;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function (_toString) {
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }(Object.prototype.toString));
  __num = function (num) {
    if (typeof num !== "number") {
      throw new TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
  };
  __slice = Array.prototype.slice;
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
  setImmediate = typeof GLOBAL.setImmediate === "function" ? GLOBAL.setImmediate
    : typeof process !== "undefined" && typeof process.nextTick === "function"
    ? (function (nextTick) {
      return function (func) {
        var args;
        if (typeof func !== "function") {
          throw new TypeError("Expected func to be a Function, got " + __typeof(func));
        }
        args = __slice.call(arguments, 1);
        if (args.length) {
          return nextTick(function () {
            func.apply(void 0, __toArray(args));
          });
        } else {
          return nextTick(func);
        }
      };
    }(process.nextTick))
    : function (func) {
      var args;
      if (typeof func !== "function") {
        throw new TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      args = __slice.call(arguments, 1);
      if (args.length) {
        return setTimeout(
          function () {
            func.apply(void 0, args);
          },
          0
        );
      } else {
        return setTimeout(func, 0);
      }
    };
  expect = require("chai").expect;
  describe("scope", function () {
    it(
      "should handle types of shadowed variables gracefully",
      function () {
        var value;
        value = 1;
        function f() {
          var value;
          value = "hello";
          function g() {
            expect("string").to.equal("string");
            return value;
          }
          return g();
        }
        return expect(f()).to.equal("hello");
      }
    );
    it("should handle a parameter shadowing a variable", function () {
      var value;
      value = 1;
      function f() {
        function g(value) {
          expect(typeof value).to.equal("string");
          return value;
        }
        return g("hello");
      }
      return expect(f()).to.equal("hello");
    });
    it(
      "should handle a parameter with type info shadowing a variable",
      function () {
        var value;
        value = 1;
        function f() {
          function g(value) {
            if (typeof value !== "string") {
              throw new TypeError("Expected value to be a String, got " + __typeof(value));
            }
            expect("string").to.equal("string");
            return value;
          }
          return g("hello");
        }
        return expect(f()).to.equal("hello");
      }
    );
    it(
      "should allow mutation of a variable declared outside of a for loop",
      function () {
        function f() {
          var _arr, _i, _len, sum, x;
          sum = 0;
          for (_arr = [1, 2, 3, 4], _i = 0, _len = _arr.length; _i < _len; ++_i) {
            x = _arr[_i];
            sum += __num(x);
          }
          return sum;
        }
        return expect(f()).to.equal(10);
      }
    );
    it(
      "should allow mutation of a variable declared as a parameter",
      function () {
        function f(sum) {
          var _arr, _i, _len, x;
          for (_arr = [1, 2, 3, 4], _i = 0, _len = _arr.length; _i < _len; ++_i) {
            x = _arr[_i];
            sum = __num(sum) + __num(x);
          }
          return sum;
        }
        return expect(f(10)).to.equal(20);
      }
    );
    it("should allow mutation within an async block", function () {
      var _once;
      return setImmediate((_once = false, function () {
        if (_once) {
          throw new Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        function f() {
          var _arr, _i, _len, sum, x;
          sum = 0;
          for (_arr = [1, 2, 3, 4], _i = 0, _len = _arr.length; _i < _len; ++_i) {
            x = _arr[_i];
            sum += __num(x);
          }
          return sum;
        }
        return expect(f()).to.equal(10);
      }));
    });
    it(
      "should allow mutation of a shadowed immutable variable",
      function () {
        var value;
        value = 0;
        function f() {
          var value;
          value = 10;
          value *= 2;
          return value;
        }
        return expect(f()).to.equal(20);
      }
    );
    it(
      "should allow mutation of a shadowed immutable variable in another function",
      function () {
        var value;
        value = 0;
        function f() {
          var value;
          value = 10;
          function g() {
            value *= 2;
            return value;
          }
          return g();
        }
        return expect(f()).to.equal(20);
      }
    );
    return it(
      "should allow mutation of a shadowed immutable variable in a class",
      function () {
        var c, Class, value;
        value = 0;
        Class = (function () {
          var _Class_prototype, value;
          _Class_prototype = Class.prototype;
          Class.displayName = "Class";
          function Class() {
            if (this instanceof Class) {
              return this;
            } else {
              return __create(_Class_prototype);
            }
          }
          value = 1;
          _Class_prototype.f = function () {
            value *= 2;
            return value;
          };
          return Class;
        }());
        c = Class();
        expect(c.f()).to.equal(2);
        expect(c.f()).to.equal(4);
        return expect(c.f()).to.equal(8);
      }
    );
  });
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
