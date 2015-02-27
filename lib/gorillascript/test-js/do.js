(function () {
  "use strict";
  var expect, stub;
  expect = require("chai").expect;
  stub = require("sinon").stub;
  describe("do", function () {
    it("preserves this", function (cb) {
      var _this, self;
      _this = this;
      self = this;
      return (function () {
        expect(_this).to.equal(self);
        return cb();
      }());
    });
    it("shadows variables", function () {
      var alpha, charlie;
      alpha = "bravo";
      charlie = "delta";
      expect(charlie).to.equal("delta");
      (function () {
        var charlie;
        charlie = "echo";
        expect(alpha).to.equal("bravo");
        return expect(charlie).to.equal("echo");
      }());
      return expect(charlie).to.equal("delta");
    });
    it("can have a local passed in", function () {
      var getValue;
      getValue = stub().returns("alpha");
      (function (x) {
        return expect(x).to.equal("alpha");
      }(getValue()));
      return expect(getValue).to.be.calledOnce;
    });
    it("can have multiple locals passed in", function () {
      var getValue1, getValue2, getValue3;
      getValue1 = stub().returns("alpha");
      getValue2 = stub().returns("bravo");
      getValue3 = stub().returns("charlie");
      (function (x, y, z) {
        expect(x).to.equal("alpha");
        expect(y).to.equal("bravo");
        return expect(z).to.equal("charlie");
      }(getValue1(), getValue2(), getValue3()));
      expect(getValue1).to.be.calledOnce;
      expect(getValue2).to.be.calledOnce;
      return expect(getValue3).to.be.calledOnce;
    });
    return it("can be used as an expression", function () {
      var alpha, charlie;
      alpha = "bravo";
      charlie = (function () {
        var delta;
        delta = "echo";
        return alpha + delta;
      }());
      return expect(charlie).to.equal("bravoecho");
    });
  });
}.call(this));
