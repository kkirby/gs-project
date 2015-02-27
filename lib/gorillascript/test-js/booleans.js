(function () {
  "use strict";
  var expect;
  expect = require("chai").expect;
  describe("literals", function () {
    it("include true", function () {
      return expect(true).to.be["true"];
    });
    it("include false", function () {
      return expect(false).to.be["false"];
    });
    return it("can be directly indexed", function () {
      expect(true.toString).to.equal(Boolean.prototype.toString);
      expect(false.toString).to.equal(Boolean.prototype.toString);
      expect(true.toString).to.equal(Boolean.prototype.toString);
      return expect(false.toString).to.equal(Boolean.prototype.toString);
    });
  });
}.call(this));
