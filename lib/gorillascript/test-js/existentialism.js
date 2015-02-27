(function (GLOBAL) {
  "use strict";
  var expect, stub;
  expect = require("chai").expect;
  stub = require("sinon").stub;
  describe("return?", function () {
    describe("on an ident", function () {
      function fun(value) {
        if (value != null) {
          return value;
        }
        return "none";
      }
      it("should return if the value exists", function () {
        expect(fun(true)).to.be["true"];
        expect(fun(false)).to.be["false"];
        return expect(fun(0)).to.equal(0);
      });
      return it("should not return if the value does not exist", function () {
        expect(fun(null)).to.equal("none");
        return expect(fun(void 0)).to.equal("none");
      });
    });
    return it("only execute expression once", function () {
      var alpha, retNull;
      function fun(callback) {
        var _ref;
        if ((_ref = callback()) != null) {
          return _ref;
        }
        return "nope";
      }
      alpha = stub().returns("alpha");
      expect(fun(alpha)).to.equal("alpha");
      expect(alpha).to.be.calledOnce;
      retNull = stub().returns(null);
      expect(fun(retNull)).to.equal("nope");
      return expect(alpha).to.be.calledOnce;
    });
  });
  describe("existential access", function () {
    describe("on an ident", function () {
      function get(obj) {
        if (obj != null) {
          return obj.key;
        }
      }
      it("returns void if parent does not exist", function () {
        expect(get()).to.be["undefined"];
        expect(get(void 0)).to.be["undefined"];
        return expect(get(null)).to.be["undefined"];
      });
      return it("returns the key if the parent exists", function () {
        expect(get({})).to.be["undefined"];
        return expect(get({ key: "value" })).to.equal("value");
      });
    });
    describe("where parent is a call", function () {
      function get(obj) {
        var _ref;
        if ((_ref = obj()) != null) {
          return _ref.key;
        }
      }
      return it("only calculates parent once", function () {
        var retObj, retVoid;
        retVoid = stub().returns(void 0);
        expect(get(retVoid)).to.be["undefined"];
        expect(retVoid).to.be.calledOnce;
        retObj = stub().returns({ key: "value" });
        expect(get(retObj)).to.equal("value");
        return expect(retObj).to.be.calledOnce;
      });
    });
    describe("where child is a call", function () {
      function get(obj, key) {
        if (obj != null) {
          return obj[key()];
        }
      }
      it("where parent exists, only calculates key once", function () {
        var key;
        key = stub().returns("key");
        expect(get({ key: "value" }, key)).to.equal("value");
        return expect(key).to.be.calledOnce;
      });
      return it("where parent does not exist, never calculates key", function () {
        var key;
        key = stub().returns("key");
        expect(get(null, key)).to.be["undefined"];
        return expect(key).to.not.be.called;
      });
    });
    describe("with trailing normal access", function () {
      function get(obj) {
        if (obj != null) {
          return obj.alpha.bravo;
        }
      }
      it("traverses the path if parent exists", function () {
        expect(get({ alpha: { bravo: "charlie" } })).to.equal("charlie");
        return expect(get({ alpha: {} })).to.be["undefined"];
      });
      it("returns void if the parent does not exist", function () {
        expect(get()).to.be["undefined"];
        expect(get(void 0)).to.be["undefined"];
        return expect(get(null)).to.be["undefined"];
      });
      return it(
        "errors if the parent exists but the initial child does not",
        function () {
          return expect(function () {
            return get({});
          }).throws(TypeError);
        }
      );
    });
    return describe("where child is called as a method", function () {
      function get(obj) {
        if (obj != null) {
          return obj.method();
        }
      }
      it("return void if the parent does not exist", function () {
        expect(get()).to.be["undefined"];
        expect(get(void 0)).to.be["undefined"];
        return expect(get(null)).to.be["undefined"];
      });
      return it("calls the method if the parent exists", function () {
        var obj;
        obj = {
          method: function () {
            expect(this).to.equal(obj);
            return "value";
          }
        };
        return expect(get(obj)).to.equal("value");
      });
    });
  });
  describe("existential invocation", function () {
    describe("on an ident", function () {
      function call(f) {
        if (typeof f === "function") {
          return f();
        }
      }
      it("returns void if func is not a function", function () {
        expect(call()).to.be["undefined"];
        expect(call(null)).to.be["undefined"];
        expect(call(void 0)).to.be["undefined"];
        expect(call({})).to.be["undefined"];
        expect(call([])).to.be["undefined"];
        return expect(call(0)).to.be["undefined"];
      });
      return it("calls the func if it is a function", function () {
        var fun;
        fun = stub().returns("value");
        expect(call(fun)).to.equal("value");
        return expect(fun).to.be.calledOnce;
      });
    });
    describe("on a method", function () {
      function call(x) {
        if (typeof x.f === "function") {
          return x.f();
        }
      }
      it("errors if the parent does not exist", function () {
        return expect(function () {
          return call();
        }).throws(TypeError);
      });
      it("returns void if method is not a function", function () {
        expect(call({})).to.be["undefined"];
        return expect(call({ f: {} })).to.be["undefined"];
      });
      return it("calls the method if it is a function", function () {
        var obj;
        obj = {
          f: function () {
            expect(this).to.equal(obj);
            return "value";
          }
        };
        return expect(call(obj)).to.equal("value");
      });
    });
    describe("on a method with a callback as the key", function () {
      function call(x, k) {
        var _ref;
        if (typeof x[_ref = k()] === "function") {
          return x[_ref]();
        }
      }
      it("errors if the parent does not exist", function () {
        return expect(function () {
          return call(null, function () {
            return "k";
          });
        }).throws(TypeError);
      });
      it("returns void if method is not a function", function () {
        expect(call({}, function () {
          return "k";
        })).to.be["undefined"];
        return expect(call({ k: {} }, function () {
          return "k";
        })).to.be["undefined"];
      });
      return it("calls the method if it is a function", function () {
        var getKey, obj;
        obj = {
          key: function () {
            expect(this).to.equal(obj);
            return "value";
          }
        };
        getKey = stub().returns("key");
        expect(call(obj, getKey)).to.equal("value");
        return expect(getKey).to.be.calledOnce;
      });
    });
    return describe("called with new", function () {
      describe("on an ident", function () {
        function call(func) {
          if (typeof func === "function") {
            return new func();
          }
        }
        it("returns void if func is not a function", function () {
          expect(call()).to.be["undefined"];
          expect(call(null)).to.be["undefined"];
          expect(call(void 0)).to.be["undefined"];
          expect(call({})).to.be["undefined"];
          expect(call([])).to.be["undefined"];
          return expect(call(0)).to.be["undefined"];
        });
        return it("calls the func with new if it is a function", function () {
          var ran;
          ran = stub();
          function Class() {
            expect(this).to.be["instanceof"](Class);
            ran();
          }
          expect(call(Class)).to.be["instanceof"](Class);
          return expect(ran).to.be.calledOnce;
        });
      });
      describe("on a member", function () {
        function call(obj) {
          var _ref;
          if (typeof (_ref = obj.func) === "function") {
            return new _ref();
          }
        }
        it("errors if obj does not exist", function () {
          expect(function () {
            return call();
          }).throws(TypeError);
          expect(function () {
            return call(null);
          }).throws(TypeError);
          return expect(function () {
            return call(void 0);
          }).throws(TypeError);
        });
        it("returns void if func is not a function", function () {
          expect(call({})).to.be["undefined"];
          return expect(call({ func: {} })).to.be["undefined"];
        });
        return it("calls the func with new if it is a function", function () {
          var obj, ran;
          ran = stub();
          function Class() {
            expect(this).to.be["instanceof"](Class);
            ran();
          }
          obj = { func: Class };
          expect(call(obj)).to.be["instanceof"](Class);
          return expect(ran).to.be.calledOnce;
        });
      });
      return describe("on the parent of an access", function () {
        function call(obj) {
          if (obj != null) {
            return new (obj.func)();
          }
        }
        it("returns void if parent does not exist", function () {
          expect(call()).to.be["undefined"];
          expect(call(null)).to.be["undefined"];
          return expect(call(void 0)).to.be["undefined"];
        });
        it("errors if parent exists and func is not a function", function () {
          expect(function () {
            return call({});
          }).throws(TypeError);
          return expect(function () {
            return call({ func: {} });
          }).throws(TypeError);
        });
        return it("calls the func with new if it is a function", function () {
          var obj, ran;
          ran = stub();
          function Class() {
            expect(this).to.be["instanceof"](Class);
            ran();
          }
          obj = { func: Class };
          expect(call(obj)).to.be["instanceof"](Class);
          return expect(ran).to.be.calledOnce;
        });
      });
    });
  });
  describe("deep existential access", function () {
    function fun(a, b, c, d) {
      var _ref, _ref2, _ref3, _ref4;
      if ((_ref = a()) != null && (_ref2 = _ref[b()]) != null && (_ref3 = _ref2[c()]) != null && typeof _ref3[_ref4 = d()] === "function") {
        return _ref3[_ref4]();
      }
    }
    function handle(a, b, c, d) {
      var aStub, bStub, cStub, dStub, result;
      aStub = stub().returns(a);
      bStub = stub().returns(b);
      cStub = stub().returns(c);
      if (typeof d !== "function") {
        dStub = stub().returns(d);
      }
      result = fun(aStub, bStub, cStub, dStub || d);
      expect(aStub).to.be.calledOnce;
      expect(bStub).to.be.calledOnce;
      expect(cStub).to.be.calledOnce;
      if (dStub) {
        expect(dStub).to.be.calledOnce;
      }
      return result;
    }
    it("works in the best-case", function () {
      return expect(handle(
        {
          x: {
            y: {
              z: function () {
                return "hello";
              }
            }
          }
        },
        "x",
        "y",
        "z"
      )).to.equal("hello");
    });
    it("returns void if not a function", function () {
      return expect(handle({ x: { y: { z: "hello" } } }, "x", "y", "z")).to.be["undefined"];
    });
    it("returns void if last key not found", function () {
      return expect(handle(
        {
          x: {
            y: {
              z: function () {
                return "hello";
              }
            }
          }
        },
        "x",
        "y",
        "w"
      )).to.be["undefined"];
    });
    return it(
      "does not execute the last key if failed before then",
      function () {
        return expect(handle(
          {
            x: {
              y: {
                z: function () {
                  return "hello";
                }
              }
            }
          },
          "x",
          "w",
          function () {
            throw new Error("never reached");
          }
        )).to.be["undefined"];
      }
    );
  });
  describe("deep existential access with an or on the end", function () {
    function fun(a, b, c, d, e) {
      var _ref, _ref2, _ref3, _ref4;
      return ((_ref = a()) != null && (_ref2 = _ref[b()]) != null && (_ref3 = _ref2[c()]) != null && typeof _ref3[_ref4 = d()] === "function" ? _ref3[_ref4]() : void 0) || e();
    }
    function handle(a, b, c, d, e) {
      var aStub, bStub, cStub, dStub, eStub, result;
      aStub = stub().returns(a);
      bStub = stub().returns(b);
      cStub = stub().returns(c);
      if (typeof d !== "function") {
        dStub = stub().returns(d);
      }
      if (typeof e !== "function") {
        eStub = stub().returns(e);
      }
      result = fun(
        aStub,
        bStub,
        cStub,
        dStub || d,
        eStub || e
      );
      expect(aStub).to.be.calledOnce;
      expect(bStub).to.be.calledOnce;
      expect(cStub).to.be.calledOnce;
      if (dStub) {
        expect(dStub).to.be.calledOnce;
      }
      if (eStub) {
        expect(eStub).to.be.calledOnce;
      }
      return result;
    }
    it("works in the best-case", function () {
      return expect(handle(
        {
          x: {
            y: {
              z: function () {
                return "hello";
              }
            }
          }
        },
        "x",
        "y",
        "z",
        function () {
          throw new Error("never reached");
        }
      )).to.equal("hello");
    });
    it("returns void if not a function", function () {
      return expect(handle(
        { x: { y: { z: "hello" } } },
        "x",
        "y",
        "z",
        "nope"
      )).to.equal("nope");
    });
    it("returns void if last key not found", function () {
      return expect(handle(
        {
          x: {
            y: {
              z: function () {
                return "hello";
              }
            }
          }
        },
        "x",
        "y",
        "w",
        "nope"
      )).to.equal("nope");
    });
    return it(
      "does not execute the last key if failed before then",
      function () {
        return expect(handle(
          {
            x: {
              y: {
                z: function () {
                  return "hello";
                }
              }
            }
          },
          "x",
          "w",
          function () {
            throw new Error("never reached");
          },
          "nope"
        )).to.equal("nope");
      }
    );
  });
  describe("existential prototype access", function () {
    function get(obj) {
      var _ref;
      if (obj != null && (_ref = obj.prototype) != null) {
        return _ref.key;
      }
    }
    it("returns void if object does not exist", function () {
      expect(get()).to.be["undefined"];
      expect(get(null)).to.be["undefined"];
      return expect(get(void 0)).to.be["undefined"];
    });
    it(
      "returns void if object has a prototype that does not exist",
      function () {
        expect(get({})).to.be["undefined"];
        expect(get({ prototype: null })).to.be["undefined"];
        return expect(get({ prototype: void 0 })).to.be["undefined"];
      }
    );
    return it(
      "returns the key if the object has a prototype which exists",
      function () {
        expect(get({ prototype: {} })).to.be["undefined"];
        expect(get({ prototype: { key: void 0 } })).to.be["undefined"];
        expect(get({ prototype: { key: null } })).to.be["null"];
        return expect(get({ prototype: { key: "hello" } })).to.equal("hello");
      }
    );
  });
  describe("postfix ? operator", function () {
    function check(obj) {
      return obj != null;
    }
    it("returns false if the object does not exist", function () {
      expect(check()).to.be["false"];
      expect(check(null)).to.be["false"];
      return expect(check(void 0)).to.be["false"];
    });
    it("returns true if the object exists", function () {
      expect(check(0)).to.be["true"];
      expect(check("")).to.be["true"];
      expect(check(false)).to.be["true"];
      expect(check(true)).to.be["true"];
      return expect(check({})).to.be["true"];
    });
    return it("works on a potentially unknown global", function () {
      expect(typeof Math !== "undefined" && Math !== null).to.be["true"];
      expect(typeof NonexistentGlobal !== "undefined" && NonexistentGlobal !== null).to.be["false"];
      GLOBAL.NonexistentGlobal = true;
      expect(typeof NonexistentGlobal !== "undefined" && NonexistentGlobal !== null).to.be["true"];
      return delete GLOBAL.NonexistentGlobal;
    });
  });
  describe("binary ? operator", function () {
    function exist(x, y) {
      var _ref;
      if ((_ref = x()) != null) {
        return _ref;
      } else {
        return y();
      }
    }
    it(
      "returns the left-hand-side if it exists, never executing right",
      function () {
        var left;
        left = stub().returns("hello");
        expect(exist(left, function () {
          throw new Error("never reached");
        })).to.equal("hello");
        return expect(left).to.be.calledOnce;
      }
    );
    return it("returns the right if the left does not exist", function () {
      var left, obj, right;
      left = stub().returns(null);
      obj = {};
      right = stub().returns(obj);
      expect(exist(left, right)).to.equal(obj);
      expect(left).to.be.calledOnce;
      return expect(right).to.be.calledOnce;
    });
  });
  describe("?= assignment", function () {
    function existAssign(x, y) {
      if (x == null) {
        return x = y();
      } else {
        return x;
      }
    }
    function existMemberAssign(x, y, z) {
      var _ref, _ref2;
      if ((_ref = x[_ref2 = y()]) == null) {
        return x[_ref2] = z();
      } else {
        return _ref;
      }
    }
    describe("with ident", function () {
      it("if the left exists, never execute the right", function () {
        expect(existAssign(true, function () {
          throw new Error("never reached");
        })).to.be["true"];
        return expect(existAssign(0, function () {
          throw new Error("never reached");
        })).to.equal(0);
      });
      return it("if the left does not exist, assign it to the right", function () {
        var obj, right;
        obj = {};
        right = stub().returns(obj);
        expect(existAssign(null, right)).to.equal(obj);
        return expect(right).to.be.calledOnce;
      });
    });
    return describe("with access", function () {
      it(
        "if the left exists, return its value and do not execute the right",
        function () {
          var key, obj;
          key = stub().returns("key");
          obj = { key: 0 };
          expect(existMemberAssign(obj, key, function () {
            throw new Error("never reached");
          })).to.equal(0);
          expect(key).to.be.calledOnce;
          return expect(obj).to.eql({ key: 0 });
        }
      );
      return it(
        "if the left does not exist, execute the right and assign it",
        function () {
          var key, obj, value;
          key = stub().returns("key");
          obj = { key: null };
          value = stub().returns("hello");
          expect(existMemberAssign(obj, key, value)).to.equal("hello");
          expect(key).to.be.calledOnce;
          return expect(obj).to.eql({ key: "hello" });
        }
      );
    });
  });
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
