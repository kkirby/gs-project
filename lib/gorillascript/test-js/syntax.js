(function () {
  "use strict";
  var __first, __strnum, __typeof, expect, gorilla;
  __first = function (x) {
    return x;
  };
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
  gorilla = require("../index");
  describe("semicolon-separated statements", function () {
    return it("act as if they were on newlines", function () {
      var x, y;
      x = 5;
      y = 6;
      expect(x + 1).to.equal(y);
      expect(x).to.equal(y - 1);
      function f(a) {
        return a;
      }
      expect(f(x)).to.equal(x);
      return expect(f(y)).to.equal(y);
    });
  });
  describe("first!", function () {
    return it("returns the first value, but executes all in-order", function () {
      var orderList;
      orderList = [];
      function order(value) {
        orderList.push(value);
        return value;
      }
      expect(__first(order(1), (order(2), order(3), void 0))).to.equal(1);
      return expect(orderList).to.eql([1, 2, 3]);
    });
  });
  describe("last!", function () {
    return it(
      "returns the last value, executing all arguments in-order",
      function () {
        var orderList;
        orderList = [];
        function order(value) {
          orderList.push(value);
          return value;
        }
        expect((order(1), order(2), order(3))).to.equal(3);
        return expect(orderList).to.eql([1, 2, 3]);
      }
    );
  });
  describe("let", function () {
    describe("as a function", function () {
      return it("does not allow primordials to be declared", function () {
        var _arr, _f, _i, _len;
        for (_arr = ["Object", "Math", "Function"], _i = 0, _len = _arr.length, _f = function (prim) {
          return expect(function () {
            return gorilla.compileSync("let x = 0\nlet " + __strnum(prim) + "() ->");
          }).throws(gorilla.MacroError, new RegExp("^Cannot declare primordial '" + __strnum(prim) + "'.*2:\\d+$", ""));
        }; _i < _len; ++_i) {
          _f.call(this, _arr[_i]);
        }
      });
    });
    return describe("as an assignment", function () {
      return it("does not allow primordials to be declared", function () {
        var _arr, _f, _i, _len;
        for (_arr = ["Object", "Math", "Function"], _i = 0, _len = _arr.length, _f = function (prim) {
          return expect(function () {
            return gorilla.compileSync("let x = 0\nlet " + __strnum(prim) + " = 0");
          }).throws(gorilla.MacroError);
        }; _i < _len; ++_i) {
          _f.call(this, _arr[_i]);
        }
      });
    });
  });
}.call(this));
