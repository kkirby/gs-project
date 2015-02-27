(function () {
  "use strict";
  var _ref, expect, spy, stub;
  expect = require("chai").expect;
  _ref = require("sinon");
  stub = _ref.stub;
  spy = _ref.spy;
  _ref = null;
  describe("cascades", function () {
    describe("can work on an ident", function () {
      it("single-line with paren-wrapping", function () {
        var obj, x;
        obj = { alpha: spy().withArgs("charlie"), bravo: spy().withArgs("delta") };
        obj.alpha("charlie");
        obj.bravo("delta");
        x = obj;
        expect(x).to.equal(obj);
        expect(obj.alpha.withArgs("charlie")).to.be.calledOnce;
        return expect(obj.bravo.withArgs("delta")).to.be.calledOnce;
      });
      it("single-line without paren-wrapping", function () {
        var obj, x;
        obj = { alpha: spy().withArgs("charlie"), bravo: spy().withArgs("delta") };
        obj.alpha("charlie");
        obj.bravo("delta");
        x = obj;
        expect(x).to.equal(obj);
        expect(obj.alpha.withArgs("charlie")).to.be.calledOnce;
        return expect(obj.bravo.withArgs("delta")).to.be.calledOnce;
      });
      it("multi-line with paren-wrapping", function () {
        var obj, x;
        obj = { alpha: spy().withArgs("charlie"), bravo: spy().withArgs("delta") };
        obj.alpha("charlie");
        obj.bravo("delta");
        x = obj;
        expect(x).to.equal(obj);
        expect(obj.alpha.withArgs("charlie")).to.be.calledOnce;
        return expect(obj.bravo.withArgs("delta")).to.be.calledOnce;
      });
      return it("multi-line without paren-wrapping", function () {
        var obj, x;
        obj = { alpha: spy().withArgs("charlie"), bravo: spy().withArgs("delta") };
        obj.alpha("charlie");
        obj.bravo("delta");
        x = obj;
        expect(x).to.equal(obj);
        expect(obj.alpha.withArgs("charlie")).to.be.calledOnce;
        return expect(obj.bravo.withArgs("delta")).to.be.calledOnce;
      });
    });
    describe("can work on an expression", function () {
      it("single-line with paren-wrapping", function () {
        var _ref, getObj, obj, x;
        obj = { alpha: spy().withArgs("charlie"), bravo: spy().withArgs("delta") };
        getObj = stub().returns(obj);
        _ref = getObj();
        _ref.alpha("charlie");
        _ref.bravo("delta");
        x = _ref;
        expect(getObj).to.be.calledOnce;
        expect(x).to.equal(obj);
        expect(obj.alpha.withArgs("charlie")).to.be.calledOnce;
        return expect(obj.bravo.withArgs("delta")).to.be.calledOnce;
      });
      it("single-line without paren-wrapping", function () {
        var _ref, getObj, obj, x;
        obj = { alpha: spy().withArgs("charlie"), bravo: spy().withArgs("delta") };
        getObj = stub().returns(obj);
        _ref = getObj();
        _ref.alpha("charlie");
        _ref.bravo("delta");
        x = _ref;
        expect(getObj).to.be.calledOnce;
        expect(x).to.equal(obj);
        expect(obj.alpha.withArgs("charlie")).to.be.calledOnce;
        return expect(obj.bravo.withArgs("delta")).to.be.calledOnce;
      });
      it("multi-line with paren-wrapping", function () {
        var _ref, getObj, obj, x;
        obj = { alpha: spy().withArgs("charlie"), bravo: spy().withArgs("delta") };
        getObj = stub().returns(obj);
        _ref = getObj();
        _ref.alpha("charlie");
        _ref.bravo("delta");
        x = _ref;
        expect(getObj).to.be.calledOnce;
        expect(x).to.equal(obj);
        expect(obj.alpha.withArgs("charlie")).to.be.calledOnce;
        return expect(obj.bravo.withArgs("delta")).to.be.calledOnce;
      });
      return it("multi-line without paren-wrapping", function () {
        var _ref, getObj, obj, x;
        obj = { alpha: spy().withArgs("charlie"), bravo: spy().withArgs("delta") };
        getObj = stub().returns(obj);
        _ref = getObj();
        _ref.alpha("charlie");
        _ref.bravo("delta");
        x = _ref;
        expect(getObj).to.be.calledOnce;
        expect(x).to.equal(obj);
        expect(obj.alpha.withArgs("charlie")).to.be.calledOnce;
        return expect(obj.bravo.withArgs("delta")).to.be.calledOnce;
      });
    });
    describe("can work on an invocation with argument", function () {
      it("single-line with paren-wrapping", function () {
        var _ref, getObj, obj, x;
        obj = { alpha: spy().withArgs("charlie"), bravo: spy().withArgs("delta") };
        getObj = stub().withArgs("echo").returns(obj);
        _ref = getObj("echo");
        _ref.alpha("charlie");
        _ref.bravo("delta");
        x = _ref;
        expect(getObj).to.be.calledOnce;
        expect(x).to.equal(obj);
        expect(obj.alpha.withArgs("charlie")).to.be.calledOnce;
        return expect(obj.bravo.withArgs("delta")).to.be.calledOnce;
      });
      it("single-line without paren-wrapping", function () {
        var _ref, getObj, obj, x;
        obj = { alpha: spy().withArgs("charlie"), bravo: spy().withArgs("delta") };
        getObj = stub().withArgs("echo").returns(obj);
        _ref = getObj("echo");
        _ref.alpha("charlie");
        _ref.bravo("delta");
        x = _ref;
        expect(getObj).to.be.calledOnce;
        expect(x).to.equal(obj);
        expect(obj.alpha.withArgs("charlie")).to.be.calledOnce;
        return expect(obj.bravo.withArgs("delta")).to.be.calledOnce;
      });
      it("multi-line with paren-wrapping", function () {
        var _ref, getObj, obj, x;
        obj = { alpha: spy().withArgs("charlie"), bravo: spy().withArgs("delta") };
        getObj = stub().withArgs("echo").returns(obj);
        _ref = getObj("echo");
        _ref.alpha("charlie");
        _ref.bravo("delta");
        x = _ref;
        expect(getObj).to.be.calledOnce;
        expect(x).to.equal(obj);
        expect(obj.alpha.withArgs("charlie")).to.be.calledOnce;
        return expect(obj.bravo.withArgs("delta")).to.be.calledOnce;
      });
      return it("multi-line without paren-wrapping", function () {
        var _ref, getObj, obj, x;
        obj = { alpha: spy().withArgs("charlie"), bravo: spy().withArgs("delta") };
        getObj = stub().withArgs("echo").returns(obj);
        _ref = getObj("echo");
        _ref.alpha("charlie");
        _ref.bravo("delta");
        x = _ref;
        expect(getObj).to.be.calledOnce;
        expect(x).to.equal(obj);
        expect(obj.alpha.withArgs("charlie")).to.be.calledOnce;
        return expect(obj.bravo.withArgs("delta")).to.be.calledOnce;
      });
    });
    it("can contain an assignment", function () {
      var obj, x;
      obj = {};
      obj.alpha = "bravo";
      obj.charlie = "delta";
      x = obj;
      expect(x).to.equal(obj);
      expect(x.alpha).to.equal("bravo");
      return expect(x.charlie).to.equal("delta");
    });
    return it("can have multiple levels", function () {
      var _ref, _ref2, _ref3, delta, getObj, obj, x;
      delta = {};
      obj = {
        alpha: { bravo: spy().withArgs("charlie"), delta: stub().withArgs("echo").returns(delta) },
        foxtrot: spy().withArgs("golf")
      };
      getObj = stub().returns(obj);
      _ref = getObj();
      _ref2 = _ref.alpha;
      _ref2.bravo("charlie");
      _ref2.hotel = "india";
      _ref3 = _ref2.delta("echo");
      _ref3.lima = "mike";
      _ref.foxtrot("golf");
      _ref.juliet = "kilo";
      x = _ref;
      expect(x).to.equal(obj);
      expect(x.juliet).to.equal("kilo");
      expect(x.alpha.hotel).to.equal("india");
      expect(obj.alpha.bravo.withArgs("charlie")).to.be.calledOnce;
      expect(obj.alpha.delta.withArgs("echo")).to.be.calledOnce;
      expect(obj.foxtrot.withArgs("golf")).to.be.calledOnce;
      return expect(delta.lima).to.equal("mike");
    });
  });
}.call(this));
