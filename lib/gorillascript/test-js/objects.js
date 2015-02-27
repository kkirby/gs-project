(function () {
  "use strict";
  var __create, __defProp, __isArray, __owns, __slice, __typeof, expect,
      gorilla, stub;
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
  __owns = Object.prototype.hasOwnProperty;
  __slice = Array.prototype.slice;
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
  gorilla = require("../index");
  describe("single-line objects", function () {
    var accessorSupport;
    it("can be empty", function () {
      var obj;
      obj = {};
      return expect(obj.toString()).to.equal("[object Object]");
    });
    it("single-line", function () {
      var obj;
      obj = { a: 1, b: 2, c: 3 };
      expect(obj.a).to.equal(1);
      expect(obj.b).to.equal(2);
      return expect(obj.c).to.equal(3);
    });
    it("single-line, trailing comma", function () {
      var obj;
      obj = { a: 1, b: 2, c: 3 };
      expect(obj.a).to.equal(1);
      expect(obj.b).to.equal(2);
      return expect(obj.c).to.equal(3);
    });
    it("single-line, quoted keys", function () {
      var obj;
      obj = { a: 1, b: 2, c: 3 };
      expect(obj.a).to.equal(1);
      expect(obj.b).to.equal(2);
      return expect(obj.c).to.equal(3);
    });
    it("single-line, quoted keys, trailing comma", function () {
      var obj;
      obj = { a: 1, b: 2, c: 3 };
      expect(obj.a).to.equal(1);
      expect(obj.b).to.equal(2);
      return expect(obj.c).to.equal(3);
    });
    it("single-line, parenthesized keys", function () {
      var _o, key, obj;
      key = "hello";
      _o = { a: 1, b: 2, c: 3, key: 4 };
      _o[key] = 5;
      obj = _o;
      expect(obj.a).to.equal(1);
      expect(obj.b).to.equal(2);
      expect(obj.c).to.equal(3);
      expect(obj.key).to.equal(4);
      return expect(obj.hello).to.equal(5);
    });
    it("single-line, parenthesized keys get overwritten", function () {
      var _o, key, obj;
      key = "hello";
      _o = { a: 1, b: 2, c: 3 };
      _o[key] = 5;
      _o.hello = 4;
      obj = _o;
      expect(obj.a).to.equal(1);
      expect(obj.b).to.equal(2);
      expect(obj.c).to.equal(3);
      return expect(obj.hello).to.equal(4);
    });
    it("single-line, interpolated keys", function () {
      var _o, obj, value;
      value = 3;
      _o = { key1: 1, key2: 2 };
      _o["key" + value] = value;
      obj = _o;
      expect(obj.key1).to.equal(1);
      expect(obj.key2).to.equal(2);
      return expect(obj.key3).to.equal(3);
    });
    it("single-line, numeric keys", function () {
      var obj;
      obj = {
        1: "a",
        2: "b",
        3: "c",
        "-1": "d",
        0: "e",
        "-0": "f"
      };
      expect(obj[1]).to.equal("a");
      expect(obj[2]).to.equal("b");
      expect(obj[3]).to.equal("c");
      expect(obj[-1]).to.equal("d");
      expect(obj[0]).to.equal("e");
      return expect(obj["-0"]).to.equal("f");
    });
    it(
      "single-line, numeric keys that aren't their string equivalents",
      function () {
        var obj;
        obj = { "01234": "a", 1234: "b", 1000: "c" };
        expect(obj["01234"]).to.equal("a");
        expect(obj["1234"]).to.equal("b");
        expect(obj[1234]).to.equal("b");
        expect(obj[1234]).to.equal("b");
        expect(obj[1000]).to.equal("c");
        expect(obj[1000]).to.equal("c");
        expect(obj["1000"]).to.equal("c");
        expect(obj["1e3"]).to.equal(void 0);
        return expect(obj[1000]).to.equal("c");
      }
    );
    it("multi-line", function () {
      var obj;
      obj = { a: 1, b: 2, c: 3 };
      expect(obj.a).to.equal(1);
      expect(obj.b).to.equal(2);
      return expect(obj.c).to.equal(3);
    });
    it("multi-line, no commas", function () {
      var obj;
      obj = { a: 1, b: 2, c: 3 };
      expect(obj.a).to.equal(1);
      expect(obj.b).to.equal(2);
      return expect(obj.c).to.equal(3);
    });
    it("multi-line, with functions", function () {
      var obj;
      obj = {
        a: function () {
          return 1;
        },
        b: function () {
          return 2;
        },
        c: function () {
          return 3;
        }
      };
      expect(obj.a()).to.equal(1);
      expect(obj.b()).to.equal(2);
      return expect(obj.c()).to.equal(3);
    });
    it("keywords as literal keys", function () {
      var obj;
      obj = { "if": "woo", "true": false, "false": true };
      expect(obj["if"]).to.equal("woo");
      expect(obj["true"]).to.equal(false);
      return expect(obj["false"]).to.equal(true);
    });
    it("keywords as string keys", function () {
      var obj;
      obj = { "if": "woo", "true": false, "false": true };
      expect(obj["if"]).to.equal("woo");
      expect(obj["true"]).to.equal(false);
      return expect(obj["false"]).to.equal(true);
    });
    it("setting keywords as strings", function () {
      var obj;
      obj = {};
      obj["if"] = "woo";
      obj["true"] = false;
      obj["false"] = true;
      expect(obj["if"]).to.equal("woo");
      expect(obj["true"]).to.equal(false);
      return expect(obj["false"]).to.equal(true);
    });
    it("setting keywords", function () {
      var obj;
      obj = {};
      obj["if"] = "woo";
      obj["true"] = false;
      obj["false"] = true;
      expect(obj["if"]).to.equal("woo");
      expect(obj["true"]).to.equal(false);
      return expect(obj["false"]).to.equal(true);
    });
    it("inline objects with this references", function () {
      var obj;
      obj = {
        value: 1,
        get: function () {
          return this.value;
        }
      };
      expect(obj.get()).to.equal(1);
      obj.value = 2;
      return expect(obj.get()).to.equal(2);
    });
    it("inline objects with method calls as values", function () {
      var obj;
      function third(a, b, c) {
        return c;
      }
      obj = {
        one: "one",
        two: third("one", "two", "three")
      };
      expect(obj.one).to.equal("one");
      return expect(obj.two).to.equal("three");
    });
    it("setting fields of fields", function () {
      var obj, obj2, obj3;
      obj = {};
      obj2 = {};
      obj3 = {};
      obj.alpha = obj2;
      obj.alpha.bravo = obj3;
      expect(obj.alpha).to.equal(obj2);
      expect(obj2.bravo).to.equal(obj3);
      return expect(obj.alpha.bravo).to.equal(obj3);
    });
    it("object key existence", function () {
      var obj;
      obj = { alpha: "bravo" };
      expect("alpha" in obj).to.be["true"];
      expect("charlie" in obj).to.be["false"];
      return expect(!("charlie" in obj)).to.be["true"];
    });
    it("object key ownership", function () {
      var obj;
      function Class() {
        this.charlie = "delta";
      }
      Class.prototype.alpha = "bravo";
      obj = new Class();
      expect("alpha" in obj).to.be["true"];
      expect(__owns.call(obj, "alpha")).to.be["false"];
      expect(!__owns.call(obj, "alpha")).to.be["true"];
      expect("charlie" in obj).to.be["true"];
      expect(__owns.call(obj, "charlie")).to.be["true"];
      expect("echo" in obj).to.be["false"];
      expect(!("echo" in obj)).to.be["true"];
      expect(__owns.call(obj, "echo")).to.be["false"];
      return expect(!__owns.call(obj, "echo")).to.be["true"];
    });
    it("object with the same key twice", function () {
      return expect(function () {
        return gorilla.compileSync("let x = {\n  alpha: 'bravo'\n  alpha: 'charlie'\n}");
      }).throws(gorilla.ParserError, /Duplicate key 'alpha' in object.*3:3/);
    });
    it("multiple access", function () {
      var obj;
      obj = { alpha: "bravo", charlie: "delta", echo: "foxtrot" };
      return expect([obj.alpha, obj.charlie]).to.eql(["bravo", "delta"]);
    });
    it("multiple access only accesses object once", function () {
      var _ref, getObj;
      getObj = stub().returns({ alpha: "bravo", charlie: "delta", echo: "foxtrot" });
      expect([(_ref = getObj()).alpha, _ref.charlie]).to.eql(["bravo", "delta"]);
      return expect(getObj).to.be.calledOnce;
    });
    it("access on literal", function () {
      expect("bravo").to.equal("bravo");
      return expect("bravo").to.equal("bravo");
    });
    it("implicit values", function () {
      var alpha, charlie, obj, other, strange;
      alpha = "bravo";
      charlie = "delta";
      obj = { alpha: alpha, charlie: charlie };
      expect(obj.alpha).to.equal("bravo");
      expect(obj.charlie).to.equal("delta");
      other = { alpha: "alpha", charlie: "charlie" };
      expect(other.alpha).to.equal("alpha");
      expect(other.charlie).to.equal("charlie");
      function fun() {
        return {
          "undefined": void 0,
          "this": this,
          "arguments": arguments,
          "true": true,
          "false": false,
          0: 0,
          Infinity: 1/0,
          "NaN": 0/0,
          1: 1
        };
      }
      strange = fun.call(obj, "alpha", "bravo", "charlie");
      expect(__owns.call(strange, "undefined")).to.be["true"];
      expect(__owns.call(strange, "this")).to.be["true"];
      expect(__owns.call(strange, "arguments")).to.be["true"];
      expect(__owns.call(strange, "true")).to.be["true"];
      expect(__owns.call(strange, "false")).to.be["true"];
      expect(__owns.call(strange, "0")).to.be["true"];
      expect(__owns.call(strange, "Infinity")).to.be["true"];
      expect(__owns.call(strange, "NaN")).to.be["true"];
      expect(__owns.call(strange, "1")).to.be["true"];
      expect(strange["undefined"]).to.equal(void 0);
      expect(strange["this"]).to.equal(obj);
      expect(__isArray(strange["arguments"])).to.be["false"];
      expect(__slice.call(strange["arguments"])).to.eql(["alpha", "bravo", "charlie"]);
      expect(strange["true"]).to.equal(true);
      expect(strange["false"]).to.equal(false);
      expect(strange["0"]).to.equal(0);
      expect(strange["Infinity"]).to.equal(1/0);
      expect(typeof strange["NaN"] === "number" && isNaN(strange["NaN"])).to.be["true"];
      return expect(strange["1"]).to.equal(1);
    });
    it("implicit values as accesses", function () {
      var obj;
      function fun(obj) {
        return {
          alpha: obj.alpha,
          bravo: this.bravo,
          charlie: this.charlie,
          india: obj.golf.hotel.india,
          kilo: obj.prototype.kilo
        };
      }
      obj = fun.call(
        { bravo: "echo", charlie: "foxtrot" },
        { alpha: "delta", golf: { hotel: { india: "juliet" } }, prototype: { kilo: "lima" } }
      );
      expect(obj.alpha).to.equal("delta");
      expect(obj.bravo).to.equal("echo");
      expect(obj.charlie).to.equal("foxtrot");
      expect(obj.india).to.equal("juliet");
      return expect(obj.kilo).to.equal("lima");
    });
    it("dashed-keys", function () {
      var obj;
      obj = { dashedKey: "hello", normalKey: "there" };
      expect(obj.dashedKey).to.equal("hello");
      expect(obj.dashedKey).to.equal("hello");
      expect(obj.normalKey).to.equal("there");
      return expect(obj.normalKey).to.equal("there");
    });
    it("object with prototype", function () {
      var _o, child, parent;
      parent = { alpha: "bravo" };
      _o = __create(parent);
      _o.charlie = "delta";
      child = _o;
      expect(parent.alpha).to.equal("bravo");
      expect(child.alpha).to.equal("bravo");
      expect(parent.charlie).to.equal(void 0);
      return expect(child.charlie).to.equal("delta");
    });
    it("object with protoype, multi-line", function () {
      var _o, child, parent;
      parent = { alpha: "bravo" };
      _o = __create(parent);
      _o.charlie = "delta";
      child = _o;
      expect(parent.alpha).to.equal("bravo");
      expect(child.alpha).to.equal("bravo");
      expect(parent.charlie).to.equal(void 0);
      return expect(child.charlie).to.equal("delta");
    });
    it("object with prototype, no members", function () {
      var child, parent;
      parent = { alpha: "bravo" };
      child = __create(parent);
      expect(parent.alpha).to.equal("bravo");
      expect(child.alpha).to.equal("bravo");
      child.charlie = "delta";
      expect(parent.charlie).to.equal(void 0);
      return expect(child.charlie).to.equal("delta");
    });
    it("object inheriting from literal object", function () {
      var _o, obj;
      _o = __create({ alpha: "bravo" });
      _o.charlie = "delta";
      obj = _o;
      expect(obj.alpha).to.equal("bravo");
      expect(obj.charlie).to.equal("delta");
      expect(__owns.call(obj, "charlie")).to.be["true"];
      return expect(__owns.call(obj, "alpha")).to.be["false"];
    });
    it("object with boolean value syntax", function () {
      var _o, obj, x;
      x = 5;
      _o = { alpha: true, bravo: false, charlie: true };
      _o["delta" + x] = false;
      _o[x] = true;
      obj = _o;
      expect(obj.alpha).to.equal(true);
      expect(obj.bravo).to.equal(false);
      expect(obj.charlie).to.equal(true);
      expect(obj.delta5).to.equal(false);
      return expect(obj[5]).to.equal(true);
    });
    it("unclosed object syntax, single-line", function () {
      var obj;
      obj = { alpha: true, bravo: false, charlie: "delta" };
      expect(obj).to.be.an("object");
      expect(obj.alpha).to.equal(true);
      expect(obj.bravo).to.equal(false);
      return expect(obj.charlie).to.equal("delta");
    });
    it("unclosed object syntax in invocation", function () {
      var obj;
      function f(o) {
        return o;
      }
      obj = f({ alpha: true, bravo: false, charlie: "delta" });
      expect(obj).to.be.an("object");
      expect(obj.alpha).to.equal(true);
      expect(obj.bravo).to.equal(false);
      return expect(obj.charlie).to.equal("delta");
    });
    it(
      "unclosed object syntax in invocation with leading args",
      function () {
        var arr;
        function f(a, b, o) {
          return [a, b, o];
        }
        arr = f(1, 2, { alpha: true, bravo: false, charlie: "delta" });
        expect(arr[0]).to.equal(1);
        expect(arr[1]).to.equal(2);
        expect(arr[2].alpha).to.equal(true);
        expect(arr[2].bravo).to.equal(false);
        return expect(arr[2].charlie).to.equal("delta");
      }
    );
    it("unclosed object syntax as function return", function () {
      var obj;
      function f() {
        return { alpha: true, bravo: false, charlie: "delta" };
      }
      obj = f();
      expect(obj).to.be.an("object");
      expect(obj.alpha).to.equal(true);
      expect(obj.bravo).to.equal(false);
      return expect(obj.charlie).to.equal("delta");
    });
    it("unclosed object syntax, multi-line", function () {
      var obj;
      obj = { alpha: true, bravo: false, charlie: "delta" };
      expect(obj).to.be.an("object");
      expect(obj.alpha).to.equal(true);
      expect(obj.bravo).to.equal(false);
      return expect(obj.charlie).to.equal("delta");
    });
    it(
      "unclosed object syntax, multi-line with some pairs on same line",
      function () {
        var obj;
        obj = { alpha: true, bravo: false, charlie: "delta", echo: "foxtrot" };
        expect(obj).to.be.an("object");
        expect(obj.alpha).to.equal(true);
        expect(obj.bravo).to.equal(false);
        expect(obj.charlie).to.equal("delta");
        return expect(obj.echo).to.equal("foxtrot");
      }
    );
    it("unclosed object syntax in invocation, multi-line", function () {
      var obj;
      function f(o) {
        return o;
      }
      obj = f({ alpha: true, bravo: false, charlie: "delta" });
      expect(obj).to.be.an("object");
      expect(obj.alpha).to.equal(true);
      expect(obj.bravo).to.equal(false);
      return expect(obj.charlie).to.equal("delta");
    });
    it(
      "unclosed object syntax in invocation with leading args, multi-line",
      function () {
        var arr;
        function f(a, b, o) {
          return [a, b, o];
        }
        arr = f(1, 2, { alpha: true, bravo: false, charlie: "delta" });
        expect(arr[0]).to.equal(1);
        expect(arr[1]).to.equal(2);
        expect(arr[2].alpha).to.equal(true);
        expect(arr[2].bravo).to.equal(false);
        return expect(arr[2].charlie).to.equal("delta");
      }
    );
    it("unclosed object syntax as function return", function () {
      var obj;
      function f() {
        return { alpha: true, bravo: false, charlie: "delta" };
      }
      obj = f();
      expect(obj).to.be.an("object");
      expect(obj.alpha).to.equal(true);
      expect(obj.bravo).to.equal(false);
      return expect(obj.charlie).to.equal("delta");
    });
    it("multi-level unclosed object syntax", function () {
      var x;
      x = {
        alpha: "bravo",
        charlie: { delta: "echo", foxtrot: { golf: { hotel: "india" } }, juliet: "kilo" }
      };
      expect(x.alpha).to.equal("bravo");
      expect(x.charlie.delta).to.equal("echo");
      expect(x.charlie.foxtrot.golf.hotel).to.equal("india");
      return expect(x.charlie.juliet).to.equal("kilo");
    });
    it("multi-level unclosed array and object syntax", function () {
      var x;
      x = [
        { alpha: "bravo", charlie: "delta" },
        { echo: "foxtrot", golf: "hotel" },
        {
          juliet: [
            { kilo: "lima", mike: "november" },
            { oscar: "papa" }
          ]
        }
      ];
      expect(x[0].alpha).to.equal("bravo");
      expect(x[0].charlie).to.equal("delta");
      expect(x[1].echo).to.equal("foxtrot");
      expect(x[1].golf).to.equal("hotel");
      expect(x[2].juliet[0].kilo).to.equal("lima");
      expect(x[2].juliet[0].mike).to.equal("november");
      return expect(x[2].juliet[1].oscar).to.equal("papa");
    });
    it(
      "multi-level closed array and unclosed object syntax",
      function () {
        var x;
        x = [
          {
            alpha: { bravo: "charlie", delta: "echo" },
            foxtrot: ["golf", "hotel"]
          }
        ];
        expect(x[0].alpha.bravo).to.equal("charlie");
        expect(x[0].alpha.delta).to.equal("echo");
        return expect(x[0].foxtrot).to.eql(["golf", "hotel"]);
      }
    );
    it("unclosed object syntax inside closed object", function () {
      var x;
      x = {
        alpha: "bravo",
        charlie: { delta: "echo", foxtrot: "golf" },
        hotel: "india"
      };
      expect(x.alpha).to.equal("bravo");
      expect(x.charlie.delta).to.equal("echo");
      expect(x.charlie.foxtrot).to.equal("golf");
      return expect(x.hotel).to.equal("india");
    });
    it("unclosed array syntax inside closed object", function () {
      var x;
      x = {
        alpha: "bravo",
        charlie: ["delta", "echo"],
        foxtrot: "golf"
      };
      expect(x.alpha).to.equal("bravo");
      expect(x.charlie[0]).to.equal("delta");
      expect(x.charlie[1]).to.equal("echo");
      return expect(x.foxtrot).to.equal("golf");
    });
    it("unclosed object syntax in if statement", function () {
      var a, b;
      function f(x) {
        if (x) {
          return { alpha: "bravo", charlie: "delta" };
        } else {
          return { echo: "foxtrot", golf: "hotel" };
        }
      }
      a = f(true);
      expect(a.alpha).to.equal("bravo");
      expect(a.charlie).to.equal("delta");
      b = f(false);
      expect(b.echo).to.equal("foxtrot");
      return expect(b.golf).to.equal("hotel");
    });
    it("unclosed object syntax in for statement", function () {
      var _arr, _len, arr, i, result, x;
      arr = ["alpha", "bravo", "charlie"];
      _arr = [];
      for (i = 0, _len = arr.length; i < _len; ++i) {
        x = arr[i];
        _arr.push({ index: i, value: x });
      }
      result = _arr;
      expect(result.length).to.equal(3);
      expect(result[0].index).to.equal(0);
      expect(result[0].value).to.equal("alpha");
      expect(result[1].index).to.equal(1);
      expect(result[1].value).to.equal("bravo");
      expect(result[2].index).to.equal(2);
      return expect(result[2].value).to.equal("charlie");
    });
    it("Can have a key of property, get, and set", function () {
      var obj;
      obj = { property: 5, get: 6, set: 7 };
      expect(obj.property).to.equal(5);
      expect(obj.get).to.equal(6);
      return expect(obj.set).to.equal(7);
    });
    it("Property syntax with value", function () {
      var _o, configurableWorks, enumerableWorks, writableWorks;
      if (typeof Object.defineProperty !== "function") {
        return;
      }
      function makeKey() {
        return Math.random().toFixed(15);
      }
      (function (randomKey) {
        var _o, obj;
        _o = {};
        __defProp(_o, "x", { value: 5 });
        __defProp(_o, randomKey, { value: 6 });
        obj = _o;
        expect(obj.x).to.equal(5);
        return expect(obj[randomKey]).to.equal(6);
      }(makeKey()));
      expect((_o = {}, __defProp(_o, "x", { value: 5 }), _o).x).to.equal(5);
      enumerableWorks = (function (randomKey) {
        var o;
        o = {};
        Object.defineProperty(o, randomKey, { value: true, enumerable: false });
        return (function () {
          var k;
          for (k in o) {
            if (k === randomKey) {
              return false;
            }
          }
          return true;
        }());
      }(makeKey()));
      if (enumerableWorks) {
        (function (randomKey) {
          var _o, k;
          for (k in _o = {}, __defProp(_o, randomKey, { value: true, enumerable: false }), _o) {
            if (k === randomKey) {
              fail();
            }
          }
        }(makeKey()));
      }
      (function (randomKey) {
        return expect((function () {
          var _o, k;
          for (k in _o = {}, __defProp(_o, randomKey, { value: true, enumerable: true }), _o) {
            if (k === randomKey) {
              return true;
            }
          }
          return false;
        }())).to.be["true"];
      }(makeKey()));
      configurableWorks = (function (randomKey) {
        var o;
        o = {};
        Object.defineProperty(o, randomKey, { value: true, configurable: false });
        expect(__owns.call(o, randomKey)).to.be["true"];
        try {
          delete o[randomKey];
        } catch (e) {}
        return o[randomKey];
      }(makeKey()));
      if (configurableWorks) {
        (function (randomKey) {
          var _o, o;
          _o = {};
          __defProp(_o, randomKey, { value: true, configurable: false });
          o = _o;
          try {
            delete o[randomKey];
          } catch (e) {}
          expect(__owns.call(o, randomKey)).to.be["true"];
          return expect(o[randomKey]).to.be["true"];
        }(makeKey()));
      }
      (function (randomKey) {
        var _o, o;
        _o = {};
        __defProp(_o, randomKey, { value: true, configurable: true });
        o = _o;
        expect(__owns.call(o, randomKey)).to.be["true"];
        delete o[randomKey];
        return expect(!__owns.call(o, randomKey)).to.be["true"];
      }(makeKey()));
      writableWorks = (function (randomKey) {
        var o;
        o = {};
        Object.defineProperty(o, randomKey, { value: true, writable: false });
        try {
          o[randomKey] = false;
        } catch (e) {}
        return o[randomKey];
      }(makeKey()));
      if (writableWorks) {
        (function (randomKey) {
          var _o, o;
          _o = {};
          __defProp(_o, randomKey, { value: true, writable: false });
          o = _o;
          try {
            o[randomKey] = false;
          } catch (e) {}
          return expect(o[randomKey]).to.be["true"];
        }(makeKey()));
      }
      return (function (randomKey) {
        var _o, o;
        _o = {};
        __defProp(_o, randomKey, { value: true, writable: true });
        o = _o;
        expect(o[randomKey]).to.equal(true);
        o[randomKey] = false;
        return expect(o[randomKey]).to.equal(false);
      }(makeKey()));
    });
    accessorSupport = (function () {
      var gets, obj, sets;
      if (typeof Object.defineProperty !== "function") {
        return false;
      }
      function read(x) {
        return x;
      }
      obj = {};
      gets = 0;
      sets = 0;
      try {
        Object.defineProperty(obj, "x", {
          get: function () {
            return ++gets;
          },
          set: function () {
            return ++sets;
          }
        });
      } catch (e) {
        return false;
      }
      expect(gets).to.equal(0);
      expect(sets).to.equal(0);
      if (obj.x !== 1 || gets !== 1 || sets !== 0) {
        return false;
      }
      obj.x = true;
      return gets === 1 && sets === 1;
    }());
    it("Property syntax with get/set", function () {
      var _o, gets, lastValue, o, obj, sets;
      if (!accessorSupport) {
        return;
      }
      gets = 0;
      sets = 0;
      obj = {};
      lastValue = obj;
      _o = {
        getX: function () {
          expect(this).to.equal(o);
          return ++gets;
        },
        setX: function (value) {
          expect(this).to.equal(o);
          ++sets;
          lastValue = value;
        }
      };
      __defProp(_o, "x", {
        get: function () {
          return this.getX();
        },
        set: function (value) {
          return this.setX(value);
        }
      });
      o = _o;
      expect(lastValue).to.equal(obj);
      expect(gets).to.equal(0);
      expect(sets).to.equal(0);
      expect(o.x).to.equal(1);
      expect(gets).to.equal(1);
      expect(sets).to.equal(0);
      expect(lastValue).to.equal(obj);
      o.x = "hello";
      expect(gets).to.equal(1);
      expect(sets).to.equal(1);
      return expect(lastValue).to.equal("hello");
    });
    it("get syntax", function () {
      var _o, gets, o;
      if (!accessorSupport) {
        return;
      }
      gets = 0;
      _o = {
        getX: function () {
          expect(this).to.equal(o);
          return ++gets;
        }
      };
      __defProp(_o, "x", {
        get: function () {
          return this.getX();
        },
        configurable: true,
        enumerable: true
      });
      o = _o;
      expect(gets).to.equal(0);
      expect(o.x).to.equal(1);
      return expect(gets).to.equal(1);
    });
    it("set syntax", function () {
      var _o, lastValue, o, sets;
      if (!accessorSupport) {
        return;
      }
      lastValue = {};
      sets = 0;
      _o = {
        setX: function (value) {
          expect(this).to.equal(o);
          lastValue = value;
          ++sets;
        }
      };
      __defProp(_o, "x", {
        set: function (value) {
          return this.setX(value);
        },
        configurable: true,
        enumerable: true
      });
      o = _o;
      expect(lastValue).to.be.an("object");
      expect(sets).to.equal(0);
      o.x = "hello";
      expect(sets).to.equal(1);
      return expect(lastValue).to.equal("hello");
    });
    it("get/set syntax", function () {
      var _o, gets, lastValue, o, obj, sets;
      if (!accessorSupport) {
        return;
      }
      gets = 0;
      sets = 0;
      obj = {};
      lastValue = obj;
      _o = {
        getX: function () {
          expect(this).to.equal(o);
          return ++gets;
        },
        setX: function (value) {
          expect(this).to.equal(o);
          ++sets;
          lastValue = value;
        }
      };
      __defProp(_o, "x", {
        get: function () {
          return this.getX();
        },
        set: function (value) {
          return this.setX(value);
        },
        configurable: true,
        enumerable: true
      });
      o = _o;
      expect(lastValue).to.equal(obj);
      expect(gets).to.equal(0);
      expect(sets).to.equal(0);
      expect(o.x).to.equal(1);
      expect(gets).to.equal(1);
      expect(sets).to.equal(0);
      expect(lastValue).to.equal(obj);
      o.x = "hello";
      expect(gets).to.equal(1);
      expect(sets).to.equal(1);
      return expect(lastValue).to.equal("hello");
    });
    it("get/set executes in the right order", function () {
      var _o, getIdedFunc, o, p;
      if (!accessorSupport || typeof Object.getOwnPropertyDescriptor !== "function") {
        return;
      }
      getIdedFunc = (function () {
        var id;
        id = 0;
        return function (f) {
          f.id = ++id;
          return f;
        };
      }());
      _o = { value: void 0 };
      __defProp(_o, "x", {
        get: getIdedFunc(function () {
          expect(this).to.equal(o);
          return this.value;
        }),
        set: getIdedFunc(function (value) {
          expect(this).to.equal(o);
          return this.value = value;
        }),
        configurable: true,
        enumerable: true
      });
      o = _o;
      expect(Object.getOwnPropertyDescriptor(o, "x").get.id).to.equal(1);
      expect(Object.getOwnPropertyDescriptor(o, "x").set.id).to.equal(2);
      expect(o.x).to.equal(void 0);
      o.x = "hello";
      expect(o.x).to.equal("hello");
      _o = { value: void 0 };
      __defProp(_o, "x", {
        set: getIdedFunc(function (value) {
          expect(this).to.equal(p);
          return this.value = value;
        }),
        get: getIdedFunc(function () {
          expect(this).to.equal(p);
          return this.value;
        }),
        configurable: true,
        enumerable: true
      });
      p = _o;
      expect(Object.getOwnPropertyDescriptor(p, "x").get.id).to.equal(4);
      expect(Object.getOwnPropertyDescriptor(p, "x").set.id).to.equal(3);
      expect(p.x).to.equal(void 0);
      p.x = "hello";
      return expect(p.x).to.equal("hello");
    });
    it("get and set not next to each other", function () {
      expect(function () {
        return gorilla.compileSync("let x = {\n  get alpha: 'bravo'\n  bravo: 'charlie'\n  set alpha: 'delta'\n  echo: 'foxtrot'\n}");
      }).throws(gorilla.ParserError, /Duplicate key 'alpha' in object.*4:7/);
      return expect(function () {
        return gorilla.compileSync("let x = {\n  set alpha: 'bravo'\n  bravo: 'charlie'\n  get alpha: 'delta'\n  echo: 'foxtrot'\n}");
      }).throws(gorilla.ParserError, /Duplicate key 'alpha' in object.*4:7/);
    });
    it("Multiple gets of the same key", function () {
      expect(function () {
        return gorilla.compileSync("let x = {\n  get alpha: 'bravo'\n  get alpha: 'charlie'\n  delta: 'echo'\n}");
      }).throws(gorilla.ParserError, /Duplicate key 'alpha' in object.*3:7/);
      expect(function () {
        return gorilla.compileSync("let x = {\n  get alpha: 'bravo'\n  set bravo: 'charlie'\n  get alpha: 'delta'\n  echo: 'foxtrot'\n}");
      }).throws(gorilla.ParserError, /Duplicate key 'alpha' in object.*4:7/);
      return expect(function () {
        return gorilla.compileSync("let x = {\n  get alpha: 'bravo'\n  set alpha: 'charlie'\n  get alpha: 'delta'\n  echo: 'foxtrot'\n}");
      }).throws(gorilla.ParserError, /Duplicate key 'alpha' in object.*4:7/);
    });
    it("Multiple sets of the same key", function () {
      expect(function () {
        return gorilla.compileSync("let x = {\n  set alpha: 'bravo'\n  set alpha: 'charlie'\n  echo: 'foxtrot'\n}");
      }).throws(gorilla.ParserError, /Duplicate key 'alpha' in object.*3:7/);
      expect(function () {
        return gorilla.compileSync("let x = {\n  get alpha: 'bravo'\n  set alpha: 'charlie'\n  set alpha: 'delta'\n  echo: 'foxtrot'\n}");
      }).throws(gorilla.ParserError, /Duplicate key 'alpha' in object.*4:7/);
      return expect(function () {
        return gorilla.compileSync("let x = {\n  set alpha: 'bravo'\n  get alpha: 'charlie'\n  set alpha: 'delta'\n  echo: 'foxtrot'\n}");
      }).throws(gorilla.ParserError, /Duplicate key 'alpha' in object.*4:7/);
    });
    it("Method declaration in object", function () {
      var x;
      x = {
        f: function () {
          return "g";
        }
      };
      return expect(x.f()).to.equal("g");
    });
    it("Extending an object with get/set", function () {
      var obj;
      if (!accessorSupport) {
        return;
      }
      obj = { value: "hello" };
      __defProp(obj, "x", {
        get: function () {
          return this.value;
        },
        enumerable: true,
        configurable: true
      });
      __defProp(obj, "x", {
        get: function () {
          return this.value;
        },
        set: function (value) {
          this.value = value;
        },
        enumerable: true,
        configurable: true
      });
      expect(obj.x).to.equal("hello");
      obj.x = "there";
      return expect(obj.x).to.equal("there");
    });
    it("Extending an object with get", function () {
      var obj;
      if (!accessorSupport) {
        return;
      }
      obj = { value: "hello" };
      __defProp(obj, "x", {
        get: function () {
          return this.value;
        },
        enumerable: true,
        configurable: true
      });
      expect(obj.x).to.equal("hello");
      obj.value = "there";
      return expect(obj.x).to.equal("there");
    });
    it("Extending an object with set", function () {
      var obj;
      if (!accessorSupport) {
        return;
      }
      obj = { value: "hello" };
      __defProp(obj, "x", {
        set: function (value) {
          this.value = value;
        },
        enumerable: true,
        configurable: true
      });
      expect(obj.value).to.equal("hello");
      obj.x = "there";
      return expect(obj.value).to.equal("there");
    });
    it("Extending an object with accessor property", function () {
      var obj;
      if (!accessorSupport) {
        return;
      }
      obj = { value: "hello" };
      __defProp(obj, "x", {
        get: function () {
          return this.value;
        },
        set: function (value) {
          this.value = value;
        }
      });
      expect(obj.x).to.equal("hello");
      obj.x = "there";
      return expect(obj.x).to.equal("there");
    });
    it("Extending an object with getter property", function () {
      var obj;
      if (!accessorSupport) {
        return;
      }
      obj = { value: "hello" };
      __defProp(obj, "x", {
        get: function () {
          return this.value;
        }
      });
      expect(obj.x).to.equal("hello");
      obj.value = "there";
      return expect(obj.x).to.equal("there");
    });
    it("Extending an object with setter property", function () {
      var obj;
      if (!accessorSupport) {
        return;
      }
      obj = { value: "hello" };
      __defProp(obj, "x", {
        set: function (value) {
          this.value = value;
        }
      });
      expect(obj.value).to.equal("hello");
      obj.x = "there";
      return expect(obj.value).to.equal("there");
    });
    it("Extending an object with value property", function () {
      var obj;
      obj = {};
      __defProp(obj, "x", { value: "hello", writable: true });
      expect(obj.x).to.equal("hello");
      obj.x = "there";
      return expect(obj.x).to.equal("there");
    });
    return it(
      "should be able to set a property on itself referencing itself",
      function () {
        var obj;
        obj = {};
        obj.obj = obj;
        return expect(obj.obj).to.equal(obj);
      }
    );
  });
}.call(this));
