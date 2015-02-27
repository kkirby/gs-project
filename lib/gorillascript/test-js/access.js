(function () {
  "use strict";
  var __bind, __create, __defProp, __isArray, __num, __owns, __slice, __toArray,
      __typeof, expect, stub;
  __bind = function (parent, child) {
    var func;
    if (parent == null) {
      throw new TypeError("Expected parent to be an object, got " + __typeof(parent));
    }
    func = parent[child];
    if (typeof func !== "function") {
      throw new Error("Trying to bind child '" + String(child) + "' which is not a function");
    }
    return function () {
      return func.apply(parent, arguments);
    };
  };
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __defProp = (function () {
    var defineGetter, defineSetter, fallback, lookupGetter, lookupSetter,
        supportsAccessors;
    fallback = Object.defineProperty;
    if (typeof fallback === "function" && (function () {
      var o;
      try {
        o = {};
        fallback(o, "sentinel", {});
        return "sentinel" in o;
      } catch (e) {
        return false;
      }
    }())) {
      return fallback;
    } else {
      supportsAccessors = __owns.call(Object.prototype, "__defineGetter__");
      lookupGetter = supportsAccessors && Object.prototype.__lookupGetter__;
      lookupSetter = supportsAccessors && Object.prototype.__lookupSetter__;
      defineGetter = supportsAccessors && Object.prototype.__defineGetter__;
      defineSetter = supportsAccessors && Object.prototype.__defineSetter__;
      return function (object, property, descriptor) {
        var proto;
        if ((typeof object !== "object" || object === null) && typeof object !== "function") {
          throw new TypeError("Expected object to be one of Object or Function, got " + __typeof(object));
        }
        if (typeof property !== "string") {
          throw new TypeError("Expected property to be a String, got " + __typeof(property));
        }
        if (typeof descriptor !== "object" || descriptor === null) {
          throw new TypeError("Expected descriptor to be an Object, got " + __typeof(descriptor));
        }
        if (typeof fallback === "function") {
          try {
            return fallback(object, property, descriptor);
          } catch (e) {}
        }
        if (__owns.call(descriptor, "value")) {
          if (supportsAccessors && lookupGetter.call(object, property || lookupSetter.call(object, property))) {
            proto = object.__proto__;
            object.__proto__ = Object.prototype;
            delete object[property];
            object[property] = descriptor.value;
            object.__proto__ = proto;
          } else {
            object[property] = descriptor.value;
          }
        } else {
          if (!supportsAccessors) {
            throw new Error("Getters and setters cannot be defined on this Javascript engine");
          }
          if (__owns.call(descriptor, "get")) {
            defineGetter.call(object, property, descriptor.get);
          }
          if (__owns.call(descriptor, "set")) {
            defineSetter.call(object, property, descriptor.set);
          }
        }
        return object;
      };
    }
  }());
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
  __owns = Object.prototype.hasOwnProperty;
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
  expect = require("chai").expect;
  stub = require("sinon").stub;
  describe("dot access", function () {
    it("can access on idents", function () {
      var x;
      x = { key: "value" };
      return expect(x.key).to.equal("value");
    });
    it("can access on literal objects", function () {
      return expect("value").to.equal("value");
    });
    it("can assign to an object", function () {
      var x;
      x = {};
      x.other = "blah";
      return expect(x.other).to.equal("blah");
    });
    it("can be used on arrays", function () {
      var y;
      y = ["value"];
      return expect(y[0]).to.equal("value");
    });
    it("can be used on literal arrays", function () {
      return expect("value").to.equal("value");
    });
    it("can be used to assign on arrays", function () {
      var y;
      y = [];
      y[0] = "blah";
      return expect(y[0]).to.equal("blah");
    });
    return it("can be used with a dashed-name", function () {
      var obj;
      obj = {};
      obj.dashedName = "hello";
      expect(obj.dashedName).to.equal("hello");
      return expect(obj.dashedName).to.equal("hello");
    });
  });
  describe("bracket access", function () {
    it("can access on idents", function () {
      var x;
      x = { key: "value" };
      return expect(x.key).to.equal("value");
    });
    it("can access on literal objects", function () {
      return expect("value").to.equal("value");
    });
    it("can assign to an object", function () {
      var x;
      x = {};
      x.other = "blah";
      return expect(x.other).to.equal("blah");
    });
    it("can be used on arrays", function () {
      var y;
      y = ["value"];
      return expect(y[0]).to.equal("value");
    });
    it("can be used on literal arrays", function () {
      return expect("value").to.equal("value");
    });
    return it("can assign to arrays", function () {
      var y;
      y = [];
      y[0] = "value";
      return expect(y[0]).to.equal("value");
    });
  });
  describe("prototypal access", function () {
    it("can access on idents", function () {
      var x;
      x = { prototype: { key: "value" } };
      return expect(x.prototype.key).to.equal("value");
    });
    it("can access on literal objects", function () {
      return expect("value").to.equal("value");
    });
    it("can assign to an object", function () {
      var x;
      x = { prototype: {} };
      x.prototype.other = "value";
      expect(x.prototype.other).to.equal("value");
      return expect(x.prototype.other).to.equal("value");
    });
    it("can access a prototype which is an array", function () {
      var y;
      y = { prototype: ["value"] };
      return expect(y.prototype[0]).to.equal("value");
    });
    it(
      "can access a literal object with prototype which is an array",
      function () {
        return expect("value").to.equal("value");
      }
    );
    return it("can assign a to a prototype which is an array", function () {
      var y;
      y = { prototype: [] };
      y.prototype[0] = "value";
      expect(y.prototype[0]).to.equal("value");
      return expect(y.prototype[0]).to.equal("value");
    });
  });
  describe("prototypal bracket access", function () {
    it("can access on idents", function () {
      var x;
      x = { prototype: { key: "value" } };
      return expect(x.prototype.key).to.equal("value");
    });
    it("can access on literal objects", function () {
      return expect("value").to.equal("value");
    });
    it("can assign to an object", function () {
      var x;
      x = { prototype: {} };
      x.prototype.other = "value";
      expect(x.prototype.other).to.equal("value");
      return expect(x.prototype.other).to.equal("value");
    });
    it("can access a prototype which is an array", function () {
      var y;
      y = { prototype: ["value"] };
      return expect(y.prototype[0]).to.equal("value");
    });
    it(
      "can access a literal object with prototype which is an array",
      function () {
        return expect("value").to.equal("value");
      }
    );
    return it("can assign a to a prototype which is an array", function () {
      var y;
      y = { prototype: [] };
      y.prototype[0] = "value";
      expect(y.prototype[0]).to.equal("value");
      return expect(y.prototype[0]).to.equal("value");
    });
  });
  describe("access on this", function () {
    it("works with dot access", function () {
      var obj;
      function get() {
        return this.key;
      }
      function set(value) {
        return this.key = value;
      }
      obj = {};
      expect(get.call(obj)).to.be["undefined"];
      set.call(obj, "value");
      return expect(get.call(obj)).to.equal("value");
    });
    it("works with bracket access", function () {
      var obj;
      function get(key) {
        return this[key];
      }
      function set(key, value) {
        return this[key] = value;
      }
      obj = {};
      expect(get.call(obj, "key")).to.be["undefined"];
      set.call(obj, "key", "value");
      return expect(get.call(obj, "key")).to.equal("value");
    });
    it("works with prototypal access", function () {
      var obj;
      function get() {
        return this.prototype.key;
      }
      function set(value) {
        return this.prototype.key = value;
      }
      obj = { prototype: {} };
      expect(get.call(obj)).to.be["undefined"];
      set.call(obj, "value");
      return expect(get.call(obj)).to.equal("value");
    });
    return it("works with prototypal bracket access", function () {
      var obj;
      function get(key) {
        return this.prototype[key];
      }
      function set(key, value) {
        return this.prototype[key] = value;
      }
      obj = { prototype: {} };
      expect(get.call(obj, "key")).to.be["undefined"];
      set.call(obj, "key", "value");
      return expect(get.call(obj, "key")).to.equal("value");
    });
  });
  describe("@ access", function () {
    it("works without a dot", function () {
      var obj;
      function get() {
        return this.key;
      }
      function set(value) {
        return this.key = value;
      }
      obj = {};
      expect(get.call(obj)).to.be["undefined"];
      set.call(obj, "value");
      return expect(get.call(obj)).to.equal("value");
    });
    it("works with a dot", function () {
      var obj;
      function get() {
        return this.key;
      }
      function set(value) {
        return this.key = value;
      }
      obj = {};
      expect(get.call(obj)).to.be["undefined"];
      set.call(obj, "value");
      return expect(get.call(obj)).to.equal("value");
    });
    it("works with bracket access", function () {
      var obj;
      function get(key) {
        return this[key];
      }
      function set(key, value) {
        return this[key] = value;
      }
      obj = {};
      expect(get.call(obj, "key")).to.be["undefined"];
      set.call(obj, "key", "value");
      return expect(get.call(obj, "key")).to.equal("value");
    });
    it("works with prototypal access", function () {
      var obj;
      function get() {
        return this.prototype.key;
      }
      function set(value) {
        return this.prototype.key = value;
      }
      obj = { prototype: {} };
      expect(get.call(obj)).to.be["undefined"];
      set.call(obj, "value");
      return expect(get.call(obj)).to.equal("value");
    });
    return it("works with prototypal bracket access", function () {
      var obj;
      function get(key) {
        return this.prototype[key];
      }
      function set(key, value) {
        return this.prototype[key] = value;
      }
      obj = { prototype: {} };
      expect(get.call(obj, "key")).to.be["undefined"];
      set.call(obj, "key", "value");
      return expect(get.call(obj, "key")).to.equal("value");
    });
  });
  describe("chained access", function () {
    it("works all one one line", function () {
      var result, str;
      str = "abc";
      result = str.split("").reverse().reverse().reverse();
      expect(result).to.eql(["c", "b", "a"]);
      return expect(str.split("").reverse().reverse().reverse()).to.eql(["c", "b", "a"]);
    });
    return it("allows splitting across lines", function () {
      var result, str;
      str = "abc";
      result = str.split("").reverse().reverse().reverse();
      expect(result).to.eql(["c", "b", "a"]);
      return expect(str.split("").reverse().reverse().reverse()).to.eql(["c", "b", "a"]);
    });
  });
  describe("access with ownership", function () {
    it("works as expected", function () {
      var x, y;
      x = { key: "value" };
      expect(__owns.call(x, "key") ? x.key : void 0).to.equal("value");
      y = __create(x);
      expect(y.key).to.equal("value");
      return expect(__owns.call(y, "key") ? y.key : void 0).to.be["undefined"];
    });
    it("doesn't fail with access after-the-fact", function () {
      var x, y;
      x = { key: "value" };
      y = __create(x);
      expect(y.key).to.equal("value");
      return expect(__owns.call(y, "key") ? y.key.wont.be.checked : void 0).to.be["undefined"];
    });
    return it("works with existential check", function () {
      var x, y, z;
      x = { key: "value" };
      expect(x != null && __owns.call(x, "key") ? x.key : void 0).to.equal("value");
      y = __create(x);
      expect(y.key).to.equal("value");
      expect(y != null && __owns.call(y, "key") ? y.key : void 0).to.be["undefined"];
      z = null;
      return expect(z != null && __owns.call(z, "key") ? z.key : void 0).to.be["undefined"];
    });
  });
  describe("* represents length in bracket access", function () {
    it("works with subtraction", function () {
      var _ref, array, getArray;
      array = ["a", "b", "c"];
      expect(array[array.length - 1]).to.equal("c");
      expect(array[array.length - 2]).to.equal("b");
      getArray = stub().returns(array);
      expect((_ref = getArray())[__num(_ref.length) - 3]).to.equal("a");
      return expect(getArray).to.be.calledOnce;
    });
    it("works multiple times in a row", function () {
      var _ref, _ref2, array, getArray;
      array = [
        "a",
        "b",
        ["c", "d"]
      ];
      expect((_ref = array[array.length - 1])[__num(_ref.length) - 1]).to.equal("d");
      getArray = stub().returns(array);
      expect((_ref = (_ref2 = getArray())[__num(_ref2.length) - 1])[__num(_ref.length) - 1]).to.equal("d");
      return expect(getArray).to.be.calledOnce;
    });
    it("works within another index", function () {
      var _ref, alpha, bravo, getAlpha, getBravo;
      alpha = ["a", "b", "c"];
      bravo = [1, 2];
      expect(alpha[bravo[bravo.length - 1]]).to.equal("c");
      getAlpha = stub().returns(alpha);
      getBravo = stub().returns(bravo);
      expect(getAlpha()[(_ref = getBravo())[__num(_ref.length) - 1]]).to.equal("c");
      expect(getAlpha).to.be.calledOnce;
      return expect(getBravo).to.be.calledOnce;
    });
    it("works within another index that also has *", function () {
      var _ref, _ref2, alpha, bravo, getAlpha, getBravo;
      alpha = ["a", "b", "c"];
      bravo = [1, 2];
      expect(alpha[alpha.length - __num(bravo[bravo.length - 1])]).to.equal("b");
      getAlpha = stub().returns(alpha);
      getBravo = stub().returns(bravo);
      expect((_ref = getAlpha())[__num(_ref.length) - __num((_ref2 = getBravo())[__num(_ref2.length) - 1])]).to.equal("b");
      expect(getAlpha).to.be.calledOnce;
      return expect(getBravo).to.be.calledOnce;
    });
    return it("can be used for assignment", function () {
      var array;
      array = [];
      array[array.length] = "a";
      array[array.length] = "b";
      array[array.length - 1] = "c";
      array[array.length] = "d";
      return expect(array).to.eql(["a", "c", "d"]);
    });
  });
  describe("Binding access", function () {
    it("works", function () {
      var alpha, bravo, f, x;
      function makeX() {
        return {
          key: function () {
            return this;
          }
        };
      }
      alpha = {};
      bravo = {};
      x = makeX.call(alpha);
      expect(x.key.call(bravo)).to.equal(bravo);
      expect(x.key()).to.equal(x);
      f = __bind(x, "key");
      expect(f()).to.equal(x);
      return expect(f.call(bravo)).to.equal(x);
    });
    return it("works with arguments", function () {
      var alpha, bravo, f, x;
      function makeX() {
        return {
          key: function () {
            return [this].concat(__toArray(arguments));
          }
        };
      }
      alpha = {};
      bravo = {};
      x = makeX.call(alpha);
      expect(x.key.call(bravo)).to.eql([bravo]);
      expect(x.key.call(bravo, alpha)).to.eql([bravo, alpha]);
      expect(x.key()).to.eql([x]);
      expect(x.key(alpha)).to.eql([x, alpha]);
      f = __bind(x, "key");
      expect(f()).to.eql([x]);
      expect(f(alpha)).to.eql([x, alpha]);
      expect(f.call(bravo)).to.eql([x]);
      return expect(f.call(bravo, alpha)).to.eql([x, alpha]);
    });
  });
  describe("Access as a statement", function () {
    return it("should not be optimized away, in case of getters", function () {
      var _o, called, o, obj, ran;
      try {
        called = false;
        _o = {};
        __defProp(_o, "x", {
          get: function () {
            return called = true;
          },
          configurable: true,
          enumerable: true
        });
        o = _o;
        if (o.x !== true) {
          return;
        }
      } catch (e) {}
      ran = stub().returns("hello");
      _o = {};
      __defProp(_o, "value", {
        get: function () {
          return ran();
        },
        configurable: true,
        enumerable: true
      });
      obj = _o;
      obj.value;
      return expect(ran).to.be.calledOnce;
    });
  });
}.call(this));
