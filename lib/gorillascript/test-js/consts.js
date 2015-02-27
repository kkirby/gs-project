(function () {
  "use strict";
  var __strnum, __typeof, expect, gorilla;
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
  describe("consts", function () {
    it("work from the top scope", function () {
      expect(true).to.be["true"];
      return expect(false).to.be["false"];
    });
    it("converts directly to constant value", function () {
      function makeCode(debugValue) {
        return gorilla.compileSync("const DEBUG = " + __strnum(debugValue) + '\n\nif DEBUG\n  throw Error "EVIL"\nelse\n  hello()').code;
      }
      expect(makeCode("false")).to.contain("hello");
      expect(makeCode("false")).to.not.contain("EVIL");
      expect(makeCode("true")).to.not.contain("hello");
      return expect(makeCode("true")).to.contain("EVIL");
    });
    it("can exist in a lower scope", function () {
      function f() {
        return 10;
      }
      expect(f()).to.equal(10);
      return expect(typeof MY_CONST).to.equal("undefined");
    });
    it("can shadow a higher-scoped variable", function () {
      var MY_VALUE;
      MY_VALUE = 0;
      function f() {
        return 10;
      }
      expect(f()).to.equal(10);
      return expect(MY_VALUE).to.equal(0);
    });
    it("can be redefined", function () {
      expect(false).to.be["false"];
      return expect(true).to.be["true"];
    });
    it("can be redefined in a lower scope", function () {
      expect(false).to.be["false"];
      function f() {
        return true;
      }
      expect(f()).to.be["true"];
      return expect(false).to.be["false"];
    });
    return it("is accessed dynamically within a macro's AST", function () {
      expect(false).to.be["false"];
      function f() {
        return true;
      }
      return expect(f()).to.be["true"];
    });
  });
  describe("object consts", function () {
    it("work from the top scope", function () {
      expect(1).to.equal(1);
      return expect(2).to.equal(2);
    });
    return it(
      "converts directly to a constant value when accessing a const object's key",
      function () {
        function makeCode(key) {
          return gorilla.compileSync("const VALUES = { alpha: 1, bravo: 2, charlie: 3 }\n\nlet value = VALUES." + __strnum(key)).code;
        }
        expect(makeCode("alpha")).to.not.contain("alpha");
        expect(makeCode("bravo")).to.not.contain("bravo");
        return expect(makeCode("charlie")).to.not.contain("charlie");
      }
    );
  });
  describe("array consts", function () {
    it("work from the top scope", function () {
      expect("alpha").to.equal("alpha");
      expect("bravo").to.equal("bravo");
      expect("charlie").to.equal("charlie");
      return expect(3).to.equal(3);
    });
    return it(
      "converts directly to a constant value when accessing a const array's key",
      function () {
        function makeCode(key) {
          return gorilla.compileSync('const VALUES = ["alpha", "bravo", "charlie"]\n\nlet value = VALUES.' + __strnum(key)).code;
        }
        expect(makeCode(0)).to.contain("alpha");
        expect(makeCode(1)).to.contain("bravo");
        expect(makeCode(2)).to.contain("charlie");
        return expect(makeCode("length")).to.contain("3");
      }
    );
  });
  describe("string consts", function () {
    it("can be used in a concat expression", function () {
      return expect("hello, world").to.equal("hello, world");
    });
    it("can be interpolated with parentheses", function () {
      return expect("hello, world").to.equal("hello, world");
    });
    return it("can be interpolated without parentheses", function () {
      return expect("hello, world").to.equal("hello, world");
    });
  });
}.call(this));
