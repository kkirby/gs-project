(function () {
  "use strict";
  var expect, gorilla;
  expect = require("chai").expect;
  gorilla = require("../index");
  describe("Decimal numbers", function () {
    it("can be represented in scientific notation", function () {
      expect(1, "1e0").to.equal(1);
      expect(10, "1e1").to.equal(10);
      expect(1, "10e-1").to.equal(1);
      expect(1000000000, "1e9").to.equal(1000000000);
      return expect(123456789, "1.23456789e8").to.equal(123456789);
    });
    it("can be represented by decimal notation", function () {
      expect(1234.5678).to.equal(1234.5678);
      expect(String(1234.5678)).to.equal("1234.5678");
      expect(0.43).to.equal(0.43);
      expect(String(0.43)).to.equal("0.43");
      expect(-5).to.equal(-5);
      expect(-1.5).to.equal(-1.5);
      return expect(-0.5).to.equal(-0.5);
    });
    it("can have a trailing comment", function () {
      return expect(525600).to.equal(525600);
    });
    it("can include ignored underscores", function () {
      expect(1000000).to.equal(1000000);
      expect(1000000).to.equal(1000000);
      return expect(1234.5678).to.equal(1234.5678);
    });
    it("should be indexable", function () {
      expect(42..toString).to.equal(Number.prototype.toString);
      expect((-42).toString).to.equal(Number.prototype.toString);
      expect(1000..toString).to.equal(Number.prototype.toString);
      expect(42..toString).to.equal(Number.prototype.toString);
      expect((-42).toString).to.equal(Number.prototype.toString);
      return expect(1000..toString).to.equal(Number.prototype.toString);
    });
    return it("can have a method passed a spread parameter", function () {
      var arr;
      arr = [16];
      expect(4660..toString.apply(4660, arr)).to.equal("1234");
      arr[0] = 10;
      return expect(4660..toString.apply(4660, arr)).to.equal("4660");
    });
  });
  describe("Infinity", function () {
    it("should not be finite", function () {
      return expect(isFinite(1/0)).to.be["false"];
    });
    it("should be 1 / 0", function () {
      return expect(1/0).to.equal(1/0);
    });
    return it("should be indexable", function () {
      expect((1/0).toString).to.equal(Number.prototype.toString);
      expect((-1/0).toString).to.equal(Number.prototype.toString);
      expect((1/0).toString).to.equal(Number.prototype.toString);
      return expect((-1/0).toString).to.equal(Number.prototype.toString);
    });
  });
  describe("NaN", function () {
    it("should not be finite", function () {
      return expect(isFinite(0/0)).to.be["false"];
    });
    it("should not equal itself", function () {
      var x;
      x = 0/0;
      return expect(0/0 === x).to.be["false"];
    });
    return it("is indexable", function () {
      expect((0/0).toString).to.equal(Number.prototype.toString);
      return expect((0/0).toString).to.equal(Number.prototype.toString);
    });
  });
  describe("Negative zero", function () {
    it("should equal positive zero", function () {
      return expect(true).to.be["true"];
    });
    it("should not be positive zero", function () {
      return expect(false).to.be["false"];
    });
    return it("should form -Infinity when the divisor of 1", function () {
      var x;
      expect(-1/0).to.equal(-1/0);
      x = -0;
      return expect(1 / x).to.equal(-1/0);
    });
  });
  describe("Positive zero", function () {
    return it("should form Infinity when the divisor of 1", function () {
      var x;
      expect(1/0).to.equal(1/0);
      x = 0;
      return expect(1 / x).to.equal(1/0);
    });
  });
  describe("Hex numbers", function () {
    it("has literal representation", function () {
      expect(255).to.equal(255);
      expect(10).to.equal(10);
      expect(0).to.equal(0);
      expect(0).to.equal(0);
      return expect(3735928559).to.equal(3735928559);
    });
    it("can include ignored underscores", function () {
      return expect(3735928559).to.equal(3735928559);
    });
    it("can have a fractional component", function () {
      expect(0.0625).to.equal(0.0625);
      expect(-0.1875).to.equal(-0.1875);
      return expect(4660.3377685546875).to.equal(4660.3377685546875);
    });
    return it("should be indexable", function () {
      expect(4660..toString).to.equal(Number.prototype.toString);
      expect(3735928559..toString).to.equal(Number.prototype.toString);
      expect(4660..toString).to.equal(Number.prototype.toString);
      return expect(3735928559..toString).to.equal(Number.prototype.toString);
    });
  });
  describe("Octal numbers", function () {
    it("has literal representation", function () {
      expect(255).to.equal(255);
      expect(0).to.equal(0);
      expect(0).to.equal(0);
      return expect(15).to.equal(15);
    });
    it("can include ignored underscores", function () {
      return expect(2739128).to.equal(2739128);
    });
    it("can have a fractional component", function () {
      expect(0.125).to.equal(0.125);
      expect(-0.375).to.equal(-0.375);
      return expect(668.732421875).to.equal(668.732421875);
    });
    return it("should be indexable", function () {
      expect(127..toString).to.equal(Number.prototype.toString);
      return expect(127..toString).to.equal(Number.prototype.toString);
    });
  });
  describe("Binary numbers", function () {
    it("has literal representation", function () {
      expect(123456).to.equal(123456);
      expect(0).to.equal(0);
      expect(0).to.equal(0);
      return expect(69).to.equal(69);
    });
    it("can include ignored underscores", function () {
      return expect(4660).to.equal(4660);
    });
    it("can have a fractional component", function () {
      expect(0.5).to.equal(0.5);
      expect(0.25).to.equal(0.25);
      expect(0.75).to.equal(0.75);
      return expect(85.328125).to.equal(85.328125);
    });
    return it("should be indexable", function () {
      expect(69..toString).to.equal(Number.prototype.toString);
      return expect(69..toString).to.equal(Number.prototype.toString);
    });
  });
  describe("Arbitrary-radix numbers", function () {
    it("has literal representation", function () {
      expect(69).to.equal(69);
      expect(123456).to.equal(123456);
      expect(123456).to.equal(123456);
      return expect(1395584131931951600).to.equal(1395584131931951600);
    });
    it("can include ignored underscores", function () {
      return expect(4660).to.equal(4660);
    });
    it("can have a fractional component", function () {
      expect(4660.3377685546875).to.equal(4660.3377685546875);
      expect(668.732421875).to.equal(668.732421875);
      expect(85.328125).to.equal(85.328125);
      expect(830894759237.797).to.equal(830894759237.797);
      return expect(34916.16233062744).to.equal(34916.16233062744);
    });
    it("should error if a radix is too small", function () {
      return expect(function () {
        return gorilla.compileSync("let x = 0\nlet y = 1r00000");
      }).throws(gorilla.ParserError, /Radix must be at least 2, got 1.*2:9/);
    });
    return it("should error if a radix is too large", function () {
      return expect(function () {
        return gorilla.compileSync("let x = 0\nlet y = 37r12345");
      }).throws(gorilla.ParserError, /Radix must be at most 36, got 37.*2:9/);
    });
  });
  describe("Numbers too large", function () {
    return it("should error if a number too large is encountered", function () {
      expect(function () {
        return gorilla.compileSync("let x = 0\nlet y = 1e1000");
      }).throws(gorilla.ParserError, /Unable to parse number '1e1000'.*2:9/);
      expect(function () {
        return gorilla.compileSync("let x = 0\nlet y = " + Number.MAX_VALUE.toString(9));
      }).throws(gorilla.ParserError, new RegExp("Unable to parse number '" + Number.MAX_VALUE.toString(9) + "'.*2:9", ""));
      expect(function () {
        return gorilla.compileSync("let x = 0\nlet y = 0b" + Number.MAX_VALUE.toString(2) + "0");
      }).throws(gorilla.ParserError, new RegExp("Unable to parse number '0b" + Number.MAX_VALUE.toString(2) + "0'.*2:9", ""));
      expect(function () {
        return gorilla.compileSync("let x = 0\nlet y = 0o" + Number.MAX_VALUE.toString(8) + "0");
      }).throws(gorilla.ParserError, new RegExp("Unable to parse number '0o" + Number.MAX_VALUE.toString(8) + "0'.*2:9", ""));
      expect(function () {
        return gorilla.compileSync("let x = 0\nlet y = 0x" + Number.MAX_VALUE.toString(16) + "0");
      }).throws(gorilla.ParserError, new RegExp("Unable to parse number '0x" + Number.MAX_VALUE.toString(16) + "0'.*2:9", ""));
      return expect(function () {
        return gorilla.compileSync("let x = 0\nlet y = 36r" + Number.MAX_VALUE.toString(36) + "0");
      }).throws(gorilla.ParserError, new RegExp("Unable to parse number '36r" + Number.MAX_VALUE.toString(36) + "0'.*2:9", ""));
    });
  });
}.call(this));
