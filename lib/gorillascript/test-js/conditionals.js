(function () {
  "use strict";
  var __num, __typeof, expect, gorilla, stub;
  __num = function (num) {
    if (typeof num !== "number") {
      throw new TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
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
  gorilla = require("../index");
  describe("if statement", function () {
    it("should not enter any bodies with falsy tests", function () {
      var bad, good, x;
      x = false;
      bad = stub();
      good = stub();
      if (x) {
        bad();
      } else if (x) {
        bad();
      } else {
        good();
      }
      expect(bad).to.not.be.called;
      return expect(good).to.be.calledOnce;
    });
    it("should enter the first body with a truthy test", function () {
      var bad, good, x;
      x = true;
      bad = stub();
      good = stub();
      if (x) {
        good();
      } else if (x) {
        bad();
      } else {
        bad();
      }
      expect(bad).to.not.be.called;
      return expect(good).to.be.calledOnce;
    });
    it("should handle logical operators in tests", function () {
      var bad, f, good, t;
      f = false;
      t = true;
      bad = stub();
      good = stub();
      if (f && t) {
        bad();
      } else if (t && f) {
        bad();
      } else if (f || t) {
        good();
      } else {
        bad();
      }
      expect(bad).to.not.be.called;
      return expect(good).to.be.calledOnce;
    });
    it("should handle variables in inner scopes", function () {
      function check(test) {
        var y, z;
        if (test) {
          y = 5;
          expect(y).to.equal(5);
          return y;
        } else {
          z = 6;
          expect(z).to.equal(6);
          return z;
        }
      }
      expect(check(true)).to.equal(5);
      return expect(check(false)).to.equal(6);
    });
    return it(
      "should handle a complex return from an if expression",
      function () {
        function check(test, value) {
          var result, x;
          if (test) {
            x = value;
            result = __num(x) * __num(x);
          } else {
            x = value;
            result = __num(x) * 2;
          }
          return result;
        }
        expect(check(true, 5)).to.equal(25);
        expect(check(true, 6)).to.equal(36);
        expect(check(false, 5)).to.equal(10);
        return expect(check(false, 6)).to.equal(12);
      }
    );
  });
  describe("unless statement", function () {
    it("should not enter any bodies with truthy tests", function () {
      var bad, good, x;
      x = true;
      bad = stub();
      good = stub();
      if (!x) {
        bad();
      } else if (!x) {
        bad();
      } else {
        good();
      }
      expect(bad).to.not.be.called;
      return expect(good).to.be.calledOnce;
    });
    return it("should enter the first body with a falsy test", function () {
      var bad, good, x;
      x = false;
      bad = stub();
      good = stub();
      if (!x) {
        good();
      } else if (!x) {
        bad();
      } else {
        bad();
      }
      expect(bad).to.not.be.called;
      return expect(good).to.be.calledOnce;
    });
  });
  describe("single-line", function () {
    function fail() {
      throw new Error("never reached");
    }
    it("should work with 'then' syntax", function () {
      var f, obj, t;
      obj = {};
      f = false;
      t = true;
      expect(f ? fail() : obj).to.equal(obj);
      return expect(!t ? fail() : obj).to.equal(obj);
    });
    return it("should with with semicolon syntax", function () {
      var f, obj, t, x, y;
      f = false;
      t = true;
      obj = {};
      if (f) {
        x = fail();
      } else {
        x = obj;
      }
      expect(x).to.equal(obj);
      if (!t) {
        y = fail();
      } else {
        y = obj;
      }
      return expect(y).to.equal(obj);
    });
  });
  describe("if statement shouldn't use ternary", function () {
    it("with a normal if", function () {
      return expect(gorilla.compileSync("if Math then String else Object end", { bare: true }).code).not.to.match(/\?/);
    });
    it("with a return if", function () {
      return expect(gorilla.compileSync("return if Math then String else Object end", { bare: true }).code).not.to.match(/\?/);
    });
    return it("with a let if", function () {
      return expect(gorilla.compileSync("let x = if Math then String else Object end", { bare: true }).code).not.to.match(/\?/);
    });
  });
  describe("many conditionals in an inline expression", function () {
    return it("should work", function () {
      function fun(a, b, c, d, e, f, g, h, i) {
        return expect(a() ? b() : c() ? d() ? e() : f() : g() ? h() : i()).to.be["true"];
      }
      function no() {
        return false;
      }
      function yes() {
        return true;
      }
      function fail() {
        throw new Error();
      }
      fun(
        no,
        fail,
        no,
        fail,
        fail,
        fail,
        no,
        fail,
        yes
      );
      return fun(
        yes,
        yes,
        fail,
        yes,
        yes,
        fail,
        fail,
        fail,
        fail
      );
    });
  });
  describe("returnif", function () {
    it("should return the same value if truthy", function () {
      var obj, otherwise;
      otherwise = {};
      function f(getValue) {
        var _ref;
        if (_ref = getValue()) {
          return _ref;
        }
        return otherwise;
      }
      obj = {};
      expect(f(function () {
        return obj;
      })).to.equal(obj);
      expect(f(function () {
        return true;
      })).to.be["true"];
      expect(f(function () {
        return 0;
      })).to.equal(otherwise);
      return expect(f(function () {
        return false;
      })).to.equal(otherwise);
    });
    return it("should return true if working with a known boolean", function () {
      var otherwise;
      otherwise = {};
      function f(x) {
        if (x === "yes") {
          return true;
        }
        return otherwise;
      }
      expect(f("no")).to.equal(otherwise);
      return expect(f("yes")).to.be["true"];
    });
  });
  describe("returnunless", function () {
    it("should return the same value if falsy", function () {
      var obj, otherwise;
      otherwise = {};
      function f(getValue) {
        var _ref;
        if (!(_ref = getValue())) {
          return _ref;
        }
        return otherwise;
      }
      obj = {};
      expect(f(function () {
        return obj;
      })).to.equal(otherwise);
      expect(f(function () {
        return true;
      })).to.equal(otherwise);
      expect(f(function () {
        return 0;
      })).to.equal(0);
      return expect(f(function () {
        return false;
      })).to.be["false"];
    });
    return it(
      "should return false if working with a known boolean",
      function () {
        var otherwise;
        otherwise = {};
        function f(x) {
          if (x !== "yes") {
            return false;
          }
          return otherwise;
        }
        expect(f("no")).to.be["false"];
        return expect(f("yes")).to.equal(otherwise);
      }
    );
  });
}.call(this));
