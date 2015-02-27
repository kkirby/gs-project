(function () {
  "use strict";
  var ast, expect, gorilla;
  expect = require("chai").expect;
  gorilla = require("../index");
  ast = require(process.env.GORILLA_COV ? "../lib-cov/jsast" : "../lib/jsast");
  describe("ast-pipe", function () {
    return it("can alter the AST of the JavaScript", function () {
      var x;
      x = gorilla.compileSync('console.log "Hello, world!"', {
        astPipe: function (node) {
          return node.walk(function (subnode) {
            if (subnode.isConst() && subnode.constValue() === "Hello, world!") {
              return ast.Const(subnode.pos, "Goodbye, world!");
            }
          });
        }
      });
      expect(x.code).to.match(/Goodbye, world!/);
      return expect(x.code).to.not.match(/Hello, world!/);
    });
  });
}.call(this));
