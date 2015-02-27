(function () {
  "use strict";
  var __num, __typeof, expect;
  __num = function (num) {
    if (typeof num !== "number") {
      throw new TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
  };
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
  it("has standard macros to give file information", function () {
    expect(4).to.equal(4);
    expect(5).to.equal(5);
    expect(6).to.equal(6);
    expect(10).to.equal(10);
    expect("test/macros.gs").to.match(/\/macros\.gs$/);
    return expect("0.9.10").to.not.be.empty;
  });
  describe("scope of tmp variables", function () {
    return it("should work given differing function scopes", function () {
      expect((function () {
        var _ref;
        function _f() {
          return __num(_ref) * __num(_ref);
        }
        _ref = 0;
        return _f();
      }())).to.equal(0);
      return expect((function () {
        var _ref;
        function _f() {
          return __num(_ref) * __num(_ref);
        }
        _ref = 5;
        return _f();
      }())).to.equal(25);
    });
  });
  describe("Macros", function () {
    return it("should allow for indirect yield expresion", function () {
      var iter;
      function generator() {
        var _e, _send, _state, _step, _throw;
        _state = 0;
        function _close() {
          _state = 3;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: "hello" };
            case 1:
              ++_state;
              return { done: false, value: "there" };
            case 2:
              ++_state;
              return { done: true, value: _received };
            case 3:
              return { done: true, value: void 0 };
            default: throw new Error("Unknown state: " + _state);
            }
          }
        }
        function _throw(_e) {
          _close();
          throw _e;
        }
        function _send(_received) {
          try {
            return _step(_received);
          } catch (_e) {
            _throw(_e);
          }
        }
        return {
          close: _close,
          iterator: function () {
            return this;
          },
          next: function () {
            return _send(void 0);
          },
          send: _send,
          "throw": function (_e) {
            _throw(_e);
            return _send(void 0);
          }
        };
      }
      iter = generator();
      expect(iter.next()).to.eql({ done: false, value: "hello" });
      return expect(iter.next()).to.eql({ done: false, value: "there" });
    });
  });
  describe("to-string method on nodes", function () {
    it("on constants", function () {
      expect("1234").to.equal("1234");
      expect('"hello"').to.equal('"hello"');
      expect("true").to.equal("true");
      expect("false").to.equal("false");
      expect("Infinity").to.equal("Infinity");
      expect("-Infinity").to.equal("-Infinity");
      return expect("NaN").to.equal("NaN");
    });
    it("on idents", function () {
      return expect("dunno").to.equal("dunno");
    });
    it("on arrays", function () {
      return expect('[1, true, "hello"]').to.equal('[1, true, "hello"]');
    });
    it("on objects", function () {
      return expect('{ a: b, c: 1234, d: true, e: false, f: "hello", "g h": null }').to.equal('{ a: b, c: 1234, d: true, e: false, f: "hello", "g h": null }');
    });
    it("on accesses", function () {
      return expect("a.b[c].d").to.equal("a.b[c].d");
    });
    it("on calls", function () {
      expect("f(x, y)").to.equal("f(x, y)");
      expect("f(x, ...y)").to.equal("f(x, ...y)");
      expect("o.f(x, y)").to.equal("o.f(x, y)");
      return expect("o.f(x, ...y)").to.equal("o.f(x, ...y)");
    });
    it("on unary", function () {
      var x;
      expect("(+x)").to.equal("(+x)");
      expect("(-x)").to.equal("(-x)");
      expect("(++x)").to.equal("(++x)");
      expect("(--x)").to.equal("(--x)");
      expect("(x++)").to.equal("(x++)");
      expect("(x--)").to.equal("(x--)");
      expect("(!x)").to.equal("(!x)");
      expect("(~x)").to.equal("(~x)");
      expect("typeof something").to.equal("typeof something");
      return expect("delete o.x").to.equal("delete o.x");
    });
    it("on binary", function () {
      return expect("(((+a) + ((b * c) / d)) - e)").to.equal("(((+a) + ((b * c) / d)) - e)");
    });
    return it("on assign", function () {
      var x, y;
      y = 0;
      x = 0;
      return expect("y = x *= 2").to.equal("y = x *= 2");
    });
  });
  describe("Before overriding", function () {
    return it("should evaluate the old macro", function () {
      expect("alpha").to.equal("alpha");
      return expect("alpha").to.equal("alpha");
    });
  });
  describe("After overriding", function () {
    return it("should evaluate the new macro", function () {
      expect("bravo").to.equal("bravo");
      expect("bravo").to.equal("bravo");
      return expect("charlie").to.equal("charlie");
    });
  });
  it("Lookahead should work", function () {
    var array, call, newline, notArray;
    call = "call";
    newline = "newline";
    array = "array";
    notArray = "notArray";
    expect(call).to.equal("call");
    expect(newline).to.equal("newline");
    expect(array).to.equal("array");
    return expect(notArray).to.equal("notArray");
  });
}.call(this));
