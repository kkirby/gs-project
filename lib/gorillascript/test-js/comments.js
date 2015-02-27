(function () {
  "use strict";
  var expect, gorilla;
  expect = require("chai").expect;
  gorilla = require("../index");
  describe("License comments", function () {
    it("should appear in result code", function () {
      return expect(gorilla.compileSync("/*!\n  This is my license\n*/").code).to.contain("This is my license");
    });
    return it("should error if it never ends", function () {
      return expect(function () {
        return gorilla.compileSync("let x = 0\n/*!\n  This is my license");
      }).throws(gorilla.ParserError, /Multi-line license comment never ends at.*2:1/);
    });
  });
  describe("Multi-line comments", function () {
    return it("should error if it never ends", function () {
      return expect(function () {
        return gorilla.compileSync("let x = 0\n/*\n  This is a comment");
      }).throws(gorilla.ParserError, /Multi-line comment never ends at.*2:1/);
    });
  });
}.call(this));
