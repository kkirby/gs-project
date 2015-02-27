(function () {
  "use strict";
  var coverage, expect, gorilla;
  expect = require("chai").expect;
  gorilla = require("../index");
  coverage = require(process.env.GORILLA_COV ? "../lib-cov/coverage" : "../lib/coverage");
  describe("coverage", function () {
    it("adds _$jscoverage transforms", function () {
      var x;
      x = gorilla.compileSync(
        'console.log "Hello, world!"\nconsole.log "I hope you\'re well today."\nlet f()\n  let x = 0\n  if x\n    "good"\n  else\n    "bad"\nf()',
        { coverage: true, filename: "blah.gs" }
      );
      return expect(x.code).to.match(/\+\+_\$jscoverage\["blah.gs"\]\[\d+\]/);
    });
    return it("adds custom coverage transforms", function () {
      var x;
      x = gorilla.compileSync(
        'console.log "Hello, world!"\nconsole.log "I hope you\'re well today."\nlet f()\n  let x = 0\n  if x\n    "good"\n  else\n    "bad"\nf()',
        { coverage: "myCoverage", filename: "blah.gs" }
      );
      return expect(x.code).to.match(/\+\+myCoverage\["blah.gs"\]\[\d+\]/);
    });
  });
}.call(this));
