(function () {
  "use strict";
  var __new, __num, __slice, __typeof, _ref, expect, spy, stub;
  __new = (function () {
    var newCreators;
    newCreators = [];
    return function () {
      var creator, func, i, length;
      if (typeof this !== "function") {
        throw new Error("Expected this to be a Function, got " + (typeof this === "undefined" ? "Undefined" : __typeof(this)));
      }
      length = arguments.length;
      creator = newCreators[length];
      if (!creator) {
        func = ["return new C("];
        for (i = 0, __num(length); i < length; ++i) {
          if (i > 0) {
            func.push(", ");
          }
          func.push("a[", i, "]");
        }
        func.push(");");
        newCreators[length] = creator = Function("C", "a", func.join(""));
      }
      return creator(this, arguments);
    };
  }());
  __num = function (num) {
    if (typeof num !== "number") {
      throw new TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
  };
  __slice = Array.prototype.slice;
  __typeof = (function () {
    var _toString;
    _toString = Object.prototype.toString;
    return function (o) {
      if (o === void 0) {
        return "Undefined";
      } else if (o === null) {
        return "Null";
      } else {
        return o.constructor && o.constructor.name || _toString.call(o).slice(8, -1);
      }
    };
  }());
  expect = require("chai").expect;
  expect(true).to.be.ok;
  expect(true).to.be["true"];
  expect(true).to.equal(true);
  expect(true).to.equal(true);
  expect(false).to.not.be.ok;
  expect(false).to.be["false"];
  expect(false).to.equal(false);
  expect(false).to.equal(false);
  _ref = require("sinon");
  stub = _ref.stub;
  spy = _ref.spy;
  _ref = null;
  function getTrue() {
    return true;
  }
  function id(x) {
    return x;
  }
  function add(x, y) {
    return __num(x) + __num(y);
  }
  function getArgs() {
    return [].slice.call(arguments);
  }
  function getThisAndArgs() {
    return [this].concat([].slice.call(arguments));
  }
  describe("function invocation", function () {
    describe("with zero arguments", function () {
      return it("works with parentheses", function () {
        var value;
        value = getTrue();
        return expect(value).to.be["true"];
      });
    });
    describe("with one argument", function () {
      it("works with parentheses", function () {
        var obj, value;
        obj = {};
        value = id(obj);
        return expect(value).to.equal(obj);
      });
      return it("does not require parentheses", function () {
        var obj, value;
        obj = {};
        value = id(obj);
        return expect(value).to.equal(obj);
      });
    });
    describe("with two arguments", function () {
      it("works with parentheses", function () {
        var value;
        value = add(5, 6);
        return expect(value).to.equal(11);
      });
      return it("does not require parentheses", function () {
        var value;
        value = add(5, 6);
        return expect(value).to.equal(11);
      });
    });
    describe("spread invocation", function () {
      it("works with parentheses", function () {
        var arr;
        expect(getArgs()).to.eql([]);
        expect(getArgs(1, 2, 3)).to.eql([1, 2, 3]);
        arr = [1, 2, 3];
        return expect(getArgs.apply(void 0, arr)).to.eql([1, 2, 3]);
      });
      return it("does not require parentheses", function () {
        var arr;
        expect(getArgs(1, 2, 3)).to.eql([1, 2, 3]);
        arr = [1, 2, 3];
        return expect(getArgs.apply(void 0, arr)).to.eql([1, 2, 3]);
      });
    });
    describe("multi-line", function () {
      it(
        "does not require commas if each argument is on its own line, with parentheses",
        function () {
          expect(getArgs(1, 2, 3, 4)).to.eql([1, 2, 3, 4]);
          expect(getArgs(1, 2, 3, 4)).to.eql([1, 2, 3, 4]);
          expect(getArgs(1, 2, 3, 4)).to.eql([1, 2, 3, 4]);
          expect(getArgs(1, 2, 3, 4)).to.eql([1, 2, 3, 4]);
          return expect(getArgs(1, 2, 3, 4)).to.eql([1, 2, 3, 4]);
        }
      );
      return it(
        "does not require commas if each argument is on its own line, no parentheses",
        function () {
          expect(getArgs(1, 2, 3, 4)).to.eql([1, 2, 3, 4]);
          return expect(getArgs(1, 2, 3, 4)).to.eql([1, 2, 3, 4]);
        }
      );
    });
    return describe("paren-free chaining", function () {
      it("works on a single line", function () {
        var alpha, bravo, charlie, delta, echo, foxtrot, x;
        bravo = spy();
        delta = spy();
        foxtrot = spy();
        echo = stub().withArgs(foxtrot).returns("golf");
        charlie = stub().withArgs(delta).returns({ echo: echo });
        alpha = stub().withArgs(bravo).returns({ charlie: charlie });
        x = alpha(bravo).charlie(delta).echo(foxtrot);
        expect(x).to.equal("golf");
        expect(alpha).to.be.calledOnce;
        expect(charlie).to.be.calledOnce;
        return expect(echo).to.be.calledOnce;
      });
      it("works on multiple lines", function () {
        var alpha, bravo, charlie, delta, echo, foxtrot, x;
        bravo = spy();
        delta = spy();
        foxtrot = spy();
        echo = stub().withArgs(foxtrot).returns("golf");
        charlie = stub().withArgs(delta).returns({ echo: echo });
        alpha = stub().withArgs(bravo).returns({ charlie: charlie });
        x = alpha(bravo).charlie(delta).echo(foxtrot);
        expect(x).to.equal("golf");
        expect(alpha).to.be.calledOnce;
        expect(charlie).to.be.calledOnce;
        return expect(echo).to.be.calledOnce;
      });
      it("respects indentation", function () {
        var alpha, bravo, charlie, delta, foxtrot, golf, x;
        bravo = spy();
        golf = spy();
        delta = { echo: stub().withArgs(foxtrot).returns(golf) };
        foxtrot = spy();
        charlie = stub().withArgs(golf).returns("hotel");
        alpha = stub().withArgs(bravo).returns({ charlie: charlie });
        x = alpha(bravo).charlie(delta.echo(foxtrot));
        expect(x).to.equal("hotel");
        expect(alpha).to.be.calledOnce;
        expect(charlie).to.be.calledOnce;
        return expect(delta.echo).to.be.calledOnce;
      });
      return it(
        "respects indentation and still allows unclosed calls",
        function () {
          var alpha, bravo, charlie, delta, echo, foxtrot, golf, hotel, x;
          bravo = spy();
          golf = spy();
          echo = spy();
          hotel = spy();
          delta = stub().withArgs(echo).returns({ foxtrot: stub().withArgs(golf).returns(hotel) });
          foxtrot = spy();
          charlie = stub().withArgs(hotel).returns("india");
          alpha = stub().withArgs(bravo).returns({ charlie: charlie });
          x = alpha(bravo).charlie(delta(echo).foxtrot(golf));
          expect(x).to.equal("india");
          expect(alpha).to.be.calledOnce;
          expect(charlie).to.be.calledOnce;
          return expect(delta.echo).to.be.calledOnce;
        }
      );
    });
  });
  describe("function apply", function () {
    describe("with zero arguments", function () {});
    describe("with one argument", function () {
      it("works with parentheses", function () {
        var obj, value;
        obj = spy();
        value = getThisAndArgs.call(obj);
        return expect(value).to.be.an("array")["with"].length(1).and.have.property(0).that.equal(obj);
      });
      return it("does not require parentheses", function () {
        var obj, value;
        obj = spy();
        value = getThisAndArgs.call(obj);
        return expect(value).to.be.an("array")["with"].length(1).and.have.property(0).that.equal(obj);
      });
    });
    describe("with two arguments", function () {
      it("works with parentheses", function () {
        var obj, value;
        obj = spy();
        value = getThisAndArgs.call(obj, "x");
        return expect(value).to.eql([obj, "x"]);
      });
      return it("does not require parentheses", function () {
        var obj, value;
        obj = spy();
        value = getThisAndArgs.call(obj, "x");
        return expect(value).to.eql([obj, "x"]);
      });
    });
    return describe("with spread invocation", function () {
      describe("as the first argument", function () {
        it("works with parentheses", function () {
          var _ref, arr, obj;
          obj = spy();
          arr = [obj, 1, 2];
          return expect(getThisAndArgs.apply((_ref = arr.concat([3]))[0], _ref.slice(1))).to.eql([obj, 1, 2, 3]);
        });
        return it("does not require parentheses", function () {
          var _ref, arr, obj;
          obj = spy();
          arr = [obj, 1, 2];
          return expect(getThisAndArgs.apply((_ref = arr.concat([3]))[0], _ref.slice(1))).to.eql([obj, 1, 2, 3]);
        });
      });
      return describe("as not the first argument", function () {
        it("works with parentheses", function () {
          var arr, obj;
          obj = spy();
          arr = [1, 2, 3];
          return expect(getThisAndArgs.apply(obj, arr)).to.eql([obj, 1, 2, 3]);
        });
        return it("does not require parentheses", function () {
          var arr, obj;
          obj = spy();
          arr = [1, 2, 3];
          return expect(getThisAndArgs.apply(obj, arr)).to.eql([obj, 1, 2, 3]);
        });
      });
    });
  });
  describe("new call", function () {
    it("does not require parentheses, even for 0 arguments", function () {
      var now;
      now = new Date();
      return expect(now).to.be.an["instanceof"](Date);
    });
    it("allows chain after new call", function () {
      var now;
      now = new Date().getTime();
      return expect(now).to.be.a("number");
    });
    it("works if the func is a call itself", function () {
      function getDate() {
        return Date;
      }
      expect(new (getDate())()).to.be.an["instanceof"](Date);
      return expect(new (getDate())().getTime()).to.be.a("number");
    });
    it("works if the func is a method call", function () {
      var now, weirdDate, x;
      x = {
        getDate: function () {
          return Date;
        }
      };
      now = new Date().getTime();
      weirdDate = new (x.getDate())(now);
      return expect(weirdDate.getTime()).to.equal(now);
    });
    it("works if the func is an access on a call", function () {
      var now, weirdDate;
      function x() {
        return { Date: Date };
      }
      now = new Date().getTime();
      weirdDate = new (x().Date)(now);
      return expect(weirdDate.getTime()).to.equal(now);
    });
    it("works if the func is an access on a literal array", function () {
      var now, weirdDate;
      now = new Date().getTime();
      weirdDate = new ([Date][0])(now);
      return expect(weirdDate.getTime()).to.equal(now);
    });
    it(
      "works if the func is an access on a sliced literal array",
      function () {
        var now, weirdDate;
        now = new Date().getTime();
        weirdDate = new (__slice.call([Date], 0, 1)[0])(now);
        return expect(weirdDate.getTime()).to.equal(now);
      }
    );
    return describe("spread invocation", function () {
      function Class() {
        expect(this).to.be.an["instanceof"](Class);
        this.args = [].slice.call(arguments);
      }
      it("works with parentheses", function () {
        var arr;
        arr = [1, 2, 3];
        return expect(__new.apply(Class, arr)).to.have.property("args").that.eql([1, 2, 3]);
      });
      it("does not require parentheses", function () {
        var arr;
        arr = [1, 2, 3];
        return expect(__new.apply(Class, arr)).to.have.property("args").that.eql([1, 2, 3]);
      });
      it("can handle at least 200 arguments", function () {
        var arr, i;
        arr = [];
        for (i = 0; i < 200; ++i) {
          arr.push(i);
          expect(__new.apply(Class, arr)).to.have.property("args").that.eql(arr);
        }
      });
      return it("works for builtins like Date", function () {
        var args, dateValues, normalDate;
        dateValues = [1987];
        expect(__new.apply(Date, dateValues)).to.be.an["instanceof"](Date);
        dateValues.push(7);
        expect(__new.apply(Date, dateValues)).to.be.an["instanceof"](Date);
        dateValues.push(22);
        expect(__new.apply(Date, dateValues)).to.be.an["instanceof"](Date);
        normalDate = new Date();
        args = [normalDate.getTime()];
        return expect(__new.apply(Date, args).getTime()).to.equal(normalDate.getTime());
      });
    });
  });
}.call(this));
