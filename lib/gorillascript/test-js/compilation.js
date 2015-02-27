(function () {
  "use strict";
  var expect, gorilla;
  expect = require("chai").expect;
  gorilla = require("../index");
  describe("newlines", function () {
    var code;
    code = 'class Hello\n  def constructor(@name) ->\n  def print()\n    console.log "Hello, $name!"';
    it("should normally use \\n", function () {
      return expect(gorilla.compileSync(code).code).to.not.match(/\r/);
    });
    it("should not have newlines if minified", function () {
      return expect(gorilla.compileSync(code, { minify: true }).code).to.not.match(/[\r\n]/);
    });
    return it("should use a custom linefeed if requested", function () {
      var windows;
      expect(gorilla.compileSync(code, { linefeed: "\r" }).code).to.not.match(/\n/);
      windows = gorilla.compileSync(code, {
        linefeed: "\r\n"
      }).code;
      expect(windows).to.not.match(/\r(?!\n)/);
      return expect(windows.replace(/\r\n/g, ";")).to.not.match(/[\r\n]/);
    });
  });
}.call(this));
