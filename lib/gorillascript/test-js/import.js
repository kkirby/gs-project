(function () {
  "use strict";
  var expect;
  expect = require("chai").expect;
  describe("importing from another file", function () {
    it(
      "should make macros defined in the other file usable",
      function () {
        return expect("Hello!").to.equal("Hello!");
      }
    );
    return it(
      "should make consts defined in the other file accessible",
      function () {
        return expect("some value").to.equal("some value");
      }
    );
  });
}.call(this));
