(function () {
  "use strict";
  var __num, __owns, __slice, __typeof, expect, stub;
  __num = function (num) {
    if (typeof num !== "number") {
      throw new TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
  };
  __owns = Object.prototype.hasOwnProperty;
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
  stub = require("sinon").stub;
  describe("function parameter destructuring", function () {
    describe("array parameter", function () {
      it("works", function () {
        function fun(_p) {
          var a, b;
          a = _p[0];
          b = _p[1];
          return [a, b];
        }
        expect(fun).to.be.a("function").and.have.length(1);
        expect(fun([])).to.eql([void 0, void 0]);
        expect(fun(["a"])).to.eql(["a", void 0]);
        expect(fun(["a", "b"])).to.eql(["a", "b"]);
        expect(fun(["a", "b", "c"])).to.eql(["a", "b"]);
        expect(fun(
          ["a", "b"],
          "c"
        )).to.eql(["a", "b"]);
        expect(fun(
          ["a", "b"],
          "c"
        )).to.eql(["a", "b"]);
        expect(fun(
          ["a", "b"],
          "c"
        )).to.eql(["a", "b"]);
        return expect(fun(["a"], "b", "c")).to.eql(["a", void 0]);
      });
      it("allows for spread", function () {
        function fun(_p) {
          var a, b;
          a = _p[0];
          b = __slice.call(_p, 1);
          return [a, b];
        }
        expect(fun([])).to.eql([void 0, []]);
        expect(fun(["a"])).to.eql(["a", []]);
        expect(fun(["a", "b"])).to.eql(["a", ["b"]]);
        return expect(fun(["a", "b", "c"])).to.eql([
          "a",
          ["b", "c"]
        ]);
      });
      it("allows for spread in middle", function () {
        function fun(_p) {
          var _i, a, b, c;
          a = _p[0];
          _i = __num(_p.length) - 1;
          if (_i > 1) {
            b = __slice.call(_p, 1, _i);
          } else {
            _i = 1;
            b = [];
          }
          c = _p[_i];
          return [a, b, c];
        }
        expect(fun([])).to.eql([void 0, [], void 0]);
        expect(fun(["a"])).to.eql(["a", [], void 0]);
        expect(fun(["a", "b"])).to.eql(["a", [], "b"]);
        expect(fun(["a", "b", "c"])).to.eql(["a", ["b"], "c"]);
        return expect(fun(["a", "b", "c", "d"])).to.eql([
          "a",
          ["b", "c"],
          "d"
        ]);
      });
      it("allows for this-params", function () {
        var obj;
        function fun(_p) {
          var a, b;
          this.a = a = _p[0];
          this.b = b = _p[1];
          return [a, b];
        }
        obj = {};
        expect(fun.call(obj, ["a", "b"])).to.eql(["a", "b"]);
        return expect(obj).to.eql({ a: "a", b: "b" });
      });
      return it(
        "it allows for deep destructure with this parameters",
        function () {
          var obj;
          function func(_p) {
            var _p2, _p3, alpha, bravo, charlie;
            this.alpha = alpha = _p[0];
            _p2 = _p[1];
            this.bravo = bravo = _p2[0];
            _p3 = _p2[1];
            this.charlie = charlie = _p3[0];
          }
          obj = {};
          func.call(obj, [
            "delta",
            ["echo", ["foxtrot"]]
          ]);
          return expect(obj).to.eql({ alpha: "delta", bravo: "echo", charlie: "foxtrot" });
        }
      );
    });
    describe("object parameter", function () {
      it("works", function () {
        function fun(_p) {
          var a, b;
          a = _p.a;
          b = _p.b;
          return [a, b];
        }
        expect(fun).to.be.a("function").and.have.property("length").that.equals(1);
        expect(fun({})).to.eql([void 0, void 0]);
        expect(fun({ a: "a" })).to.eql(["a", void 0]);
        expect(fun({ a: "a", b: "b" })).to.eql(["a", "b"]);
        expect(fun({ a: "a", b: "b", c: "c" })).to.eql(["a", "b"]);
        expect(fun(
          { a: "a", b: "b" },
          "c"
        )).to.eql(["a", "b"]);
        return expect(fun({ a: "a" }, "b", "c")).to.eql(["a", void 0]);
      });
      it("allows for this-params", function () {
        var obj;
        function fun(_p) {
          var a, b;
          this.a = a = _p.a;
          this.b = b = _p.b;
          return [a, b];
        }
        obj = {};
        expect(fun.call(obj, { a: "a", b: "b" })).to.eql(["a", "b"]);
        return expect(obj).to.eql({ a: "a", b: "b" });
      });
      return it(
        "allows for deep object destructure with this params",
        function () {
          var obj;
          function func(_p) {
            var _p2, _p3, alpha, charlie, echo;
            this.alpha = alpha = _p.alpha;
            _p2 = _p.bravo;
            this.charlie = charlie = _p2.charlie;
            _p3 = _p2.delta;
            this.echo = echo = _p3.echo;
          }
          obj = {};
          func.call(obj, {
            alpha: "foxtrot",
            bravo: { charlie: "golf", delta: { echo: "hotel" } }
          });
          return expect(obj).to.eql({ alpha: "foxtrot", charlie: "golf", echo: "hotel" });
        }
      );
    });
    return it("allows for mixed object and array destructures", function () {
      var obj;
      function func(_p) {
        var _p2, _p3, alpha, charlie, delta;
        this.alpha = alpha = _p.alpha;
        _p2 = _p.bravo;
        this.charlie = charlie = _p2[0];
        _p3 = _p2[1];
        this.delta = delta = _p3.delta;
      }
      obj = {};
      func.call(obj, {
        alpha: "echo",
        bravo: ["foxtrot", { delta: "golf" }]
      });
      return expect(obj).to.eql({ alpha: "echo", charlie: "foxtrot", delta: "golf" });
    });
  });
  describe("let destructuring", function () {
    describe("array", function () {
      it("works with an ident", function () {
        var a, arr, b, c;
        arr = ["a", "b", "c"];
        a = arr[0];
        b = arr[1];
        c = arr[2];
        expect(a).to.equal("a");
        expect(b).to.equal("b");
        return expect(c).to.equal("c");
      });
      it("works with a function call", function () {
        var _ref, a, b, c, f;
        f = stub().returns(["a", "b", "c"]);
        _ref = f();
        a = _ref[0];
        b = _ref[1];
        c = _ref[2];
        _ref = null;
        expect(a).to.equal("a");
        expect(b).to.equal("b");
        expect(c).to.equal("c");
        return expect(f).to.be.calledOnce;
      });
      it("works with a literal array", function () {
        var a, b, c;
        a = "a";
        b = "b";
        c = "c";
        expect(a).to.equal("a");
        expect(b).to.equal("b");
        return expect(c).to.equal("c");
      });
      it("works with a single element", function () {
        var a, f;
        f = stub().returns(["a", "b", "c"]);
        a = f()[0];
        expect(a).to.equal("a");
        return expect(f).to.be.calledOnce;
      });
      it("allows ignored values", function () {
        var x;
        x = 6;
        return expect(x).to.equal(6);
      });
      it("allows ignored values in the middle", function () {
        var x, y;
        x = 5;
        y = 7;
        expect(x).to.equal(5);
        return expect(y).to.equal(7);
      });
      it(
        "returns the full array if in the return position, with one destructure",
        function () {
          var get;
          function f(getArr) {
            var a;
            a = getArr()[0];
          }
          get = stub().returns([1, 2, 3]);
          expect(f(get)).to.be["undefined"];
          return expect(get).to.be.calledOnce;
        }
      );
      return it(
        "returns void if in the return position, with multiple destructures",
        function () {
          var get;
          function f(getArr) {
            var _ref, a, b;
            _ref = getArr();
            a = _ref[0];
            b = _ref[1];
            _ref = null;
          }
          get = stub().returns([1, 2, 3]);
          expect(f(get)).to.be["undefined"];
          return expect(get).to.be.calledOnce;
        }
      );
    });
    return describe("object", function () {
      it("works with an ident", function () {
        var a, c, e, obj;
        obj = { a: "b", c: "d", e: "f" };
        a = obj.a;
        c = obj.c;
        e = obj.e;
        expect(a).to.equal("b");
        expect(c).to.equal("d");
        return expect(e).to.equal("f");
      });
      it("works with an ident and named keys", function () {
        var b, d, f, obj;
        obj = { a: "b", c: "d", e: "f" };
        b = obj.a;
        d = obj.c;
        f = obj.e;
        expect(b).to.equal("b");
        expect(d).to.equal("d");
        return expect(f).to.equal("f");
      });
      it("works with a call", function () {
        var _ref, a, c, e, fun;
        fun = stub().returns({ a: "b", c: "d", e: "f" });
        _ref = fun();
        a = _ref.a;
        c = _ref.c;
        e = _ref.e;
        _ref = null;
        expect(a).to.equal("b");
        expect(c).to.equal("d");
        expect(e).to.equal("f");
        return expect(fun).to.be.calledOnce;
      });
      it("works with a call and named keys", function () {
        var _ref, b, d, f, fun;
        fun = stub().returns({ a: "b", c: "d", e: "f" });
        _ref = fun();
        b = _ref.a;
        d = _ref.c;
        f = _ref.e;
        _ref = null;
        expect(b).to.equal("b");
        expect(d).to.equal("d");
        expect(f).to.equal("f");
        return expect(fun).to.be.calledOnce;
      });
      it("works with literal object", function () {
        var _ref, a, c, e;
        _ref = { a: "b", c: "d", e: "f" };
        a = _ref.a;
        c = _ref.c;
        e = _ref.e;
        _ref = null;
        expect(a).to.equal("b");
        expect(c).to.equal("d");
        return expect(e).to.equal("f");
      });
      it("works with literal object and named keys", function () {
        var _ref, b, d, f;
        _ref = { a: "b", c: "d", e: "f" };
        b = _ref.a;
        d = _ref.c;
        f = _ref.e;
        _ref = null;
        expect(b).to.equal("b");
        expect(d).to.equal("d");
        return expect(f).to.equal("f");
      });
      it("works with a single element", function () {
        var a, fun;
        fun = stub().returns({ a: "b", c: "d", e: "f" });
        a = fun().a;
        expect(a).to.equal("b");
        return expect(fun).to.be.calledOnce;
      });
      it("works with a single element and named key", function () {
        var b, fun;
        fun = stub().returns({ a: "b", c: "d", e: "f" });
        b = fun().a;
        expect(b).to.equal("b");
        return expect(fun).to.be.calledOnce;
      });
      it(
        "returns void if in the return position, with one destructure",
        function () {
          var get;
          function f(getObj) {
            var a;
            a = getObj().a;
          }
          get = stub().returns({ a: 1, b: 2, c: 3 });
          expect(f(get)).to.be["undefined"];
          return expect(get).to.be.calledOnce;
        }
      );
      return it(
        "returns void if in the return position, with multiple destructures",
        function () {
          var get;
          function f(getObj) {
            var _ref, a, b;
            _ref = getObj();
            a = _ref.a;
            b = _ref.b;
            _ref = null;
          }
          get = stub().returns({ a: 1, b: 2, c: 3 });
          expect(f(get)).to.be["undefined"];
          return expect(get).to.be.calledOnce;
        }
      );
    });
  });
  describe("for loop destructuring", function () {
    describe("in array", function () {
      it("works", function () {
        var _i, _len, _ref, arr, result, x, y;
        arr = [
          ["a", "b"],
          ["c", "d"],
          ["e", "f"]
        ];
        result = [];
        for (_i = 0, _len = arr.length; _i < _len; ++_i) {
          _ref = arr[_i];
          x = _ref[0];
          y = _ref[1];
          _ref = null;
          result.push(x);
          result.push(y);
        }
        return expect(result).to.eql([
          "a",
          "b",
          "c",
          "d",
          "e",
          "f"
        ]);
      });
      return it("block-scopes the variables", function () {
        var _f, _i, _len, _this, arr, result;
        _this = this;
        arr = [
          ["a", "b"],
          ["c", "d"],
          ["e", "f"]
        ];
        result = [];
        for (_i = 0, _len = arr.length, _f = function (_v) {
          var x, y;
          x = _v[0];
          y = _v[1];
          result.push(function () {
            return x;
          });
          return result.push(function () {
            return y;
          });
        }; _i < _len; ++_i) {
          _f.call(this, arr[_i]);
        }
        return expect((function () {
          var _arr, _i, _len, f;
          _arr = [];
          for (_i = 0, _len = result.length; _i < _len; ++_i) {
            f = result[_i];
            _arr.push(f());
          }
          return _arr;
        }())).to.eql([
          "a",
          "b",
          "c",
          "d",
          "e",
          "f"
        ]);
      });
    });
    return describe("of object", function () {
      it("works", function () {
        var _ref, k, obj, result, x, y;
        obj = {
          x: ["a", "b"],
          y: ["c", "d"],
          z: ["e", "f"]
        };
        result = [];
        for (k in obj) {
          if (__owns.call(obj, k)) {
            _ref = obj[k];
            x = _ref[0];
            y = _ref[1];
            _ref = null;
            result.push(k);
            result.push(x);
            result.push(y);
          }
        }
        return expect(result.sort()).to.eql([
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "x",
          "y",
          "z"
        ]);
      });
      return it("block-scopes the variables", function () {
        var _this, k, obj, result;
        _this = this;
        obj = {
          x: ["a", "b"],
          y: ["c", "d"],
          z: ["e", "f"]
        };
        result = [];
        function _f(k, _v) {
          var x, y;
          x = _v[0];
          y = _v[1];
          result.push(function () {
            return k;
          });
          result.push(function () {
            return x;
          });
          return result.push(function () {
            return y;
          });
        }
        for (k in obj) {
          if (__owns.call(obj, k)) {
            _f.call(this, k, obj[k]);
          }
        }
        return expect((function () {
          var _arr, _i, _len, f;
          _arr = [];
          for (_i = 0, _len = result.length; _i < _len; ++_i) {
            f = result[_i];
            _arr.push(f());
          }
          return _arr;
        }()).sort()).to.eql([
          "a",
          "b",
          "c",
          "d",
          "e",
          "f",
          "x",
          "y",
          "z"
        ]);
      });
    });
  });
}.call(this));
