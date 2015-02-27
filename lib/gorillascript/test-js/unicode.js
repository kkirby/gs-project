(function () {
  "use strict";
  var expect;
  expect = require("chai").expect;
  describe("Unicode characters in source", function () {
    it("can be used as identifiers", function () {
      var \u00b5;
      \u00b5 = "mu";
      return expect(\u00b5).to.equal("mu");
    });
    return it("can be used as properties", function () {
      var x;
      x = { "\u00b5": "mu" };
      return expect(x["\u00b5"]).to.equal("mu");
    });
  });
}.call(this));
