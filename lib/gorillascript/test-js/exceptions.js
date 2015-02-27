(function () {
  "use strict";
  var __create, __throw, expect, stub;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __throw = function (x) {
    throw x;
  };
  expect = require("chai").expect;
  stub = require("sinon").stub;
  describe("throwing an exception", function () {
    it("works as expected", function () {
      var obj;
      obj = {};
      return expect(function () {
        throw obj;
      }).throws(obj);
    });
    return it("works as an expression", function () {
      var obj, x;
      x = true;
      obj = {};
      return expect(function () {
        return x && __throw(obj);
      }).throws(obj);
    });
  });
  describe("try-catch", function () {
    it("goes to the catch body if an error occurs", function () {
      var obj, ran;
      obj = {};
      ran = stub();
      try {
        throw obj;
      } catch (e) {
        expect(e).to.equal(obj);
        ran();
      }
      return expect(ran).to.be.calledOnce;
    });
    it(
      "does not go to the catch body if an error does not occur",
      function () {
        var ran;
        ran = stub();
        try {
          ran();
        } catch (e) {
          throw new Error("Never reached");
        }
        return expect(ran).to.be.calledOnce;
      }
    );
    it("can have an empty catch", function () {
      try {
        throw {};
      } catch (e) {}
    });
    return it("does not require a catch ident", function () {
      try {
        throw {};
      } catch (_err) {}
    });
  });
  describe("try-catch-else", function () {
    return describe("as a statement", function () {
      describe("if an error occurs", function () {
        return it("goes to the catch body, not else body", function () {
          var _else, inCatch, inElse, obj;
          obj = {};
          inCatch = stub();
          inElse = stub();
          _else = true;
          try {
            throw obj;
          } catch (e) {
            _else = false;
            expect(e).to.equal(obj);
            inCatch();
          } finally {
            if (_else) {
              inElse();
            }
          }
          expect(inCatch).to.be.calledOnce;
          return expect(inElse).to.not.be.called;
        });
      });
      return describe("if an error does not occur", function () {
        return it("goes to the else body, not catch body", function () {
          var _else, inCatch, inElse, obj, ran;
          obj = {};
          ran = stub();
          inCatch = stub();
          inElse = stub();
          _else = true;
          try {
            ran();
          } catch (e) {
            _else = false;
            inCatch();
          } finally {
            if (_else) {
              inElse();
            }
          }
          expect(inCatch).to.not.be.called;
          return expect(inElse).to.be.calledOnce;
        });
      });
    });
  });
  describe("try-finally", function () {
    describe("if an error occurs", function () {
      return it("should hit the finally and throw the error", function () {
        var after, err, hitFinally;
        err = new Error();
        hitFinally = stub();
        after = stub();
        expect(function () {
          try {
            throw err;
          } finally {
            hitFinally();
          }
          return after();
        }).throws(err);
        expect(hitFinally).to.be.calledOnce;
        return expect(after).to.not.be.called;
      });
    });
    describe("if an error does not occur", function () {
      return it("should hit the finally", function () {
        var err, hitFinally, ran;
        err = new Error();
        ran = stub();
        hitFinally = stub();
        try {
          ran();
        } finally {
          hitFinally();
        }
        expect(ran).to.be.calledOnce;
        return expect(hitFinally).to.be.calledOnce;
      });
    });
    return describe("as an auto-returned last statement", function () {
      return it("should return the value in the try", function () {
        var hitFinally, ran;
        ran = stub().returns("alpha");
        hitFinally = stub();
        function f() {
          try {
            return ran();
          } finally {
            hitFinally();
          }
        }
        expect(f()).to.equal("alpha");
        expect(ran).to.be.calledOnce;
        return expect(hitFinally).to.be.calledOnce;
      });
    });
  });
  describe("try-catch-finally", function () {
    describe("if an error occurs", function () {
      return it("should hit both the catch and the finally", function () {
        var err, inCatch, inFinally;
        err = new Error();
        inCatch = stub();
        inFinally = stub();
        try {
          throw err;
        } catch (e) {
          expect(e).to.equal(err);
          inCatch();
        } finally {
          inFinally();
        }
        expect(inCatch).to.be.calledOnce;
        return expect(inFinally).to.be.calledOnce;
      });
    });
    return describe("if an error does not occur", function () {
      return it("should ignore the catch and hit finally", function () {
        var err, inFinally, ran;
        err = new Error();
        ran = stub();
        inFinally = stub();
        try {
          ran();
        } catch (e) {
          throw new Error("never reached");
        } finally {
          inFinally();
        }
        expect(ran).to.be.calledOnce;
        return expect(inFinally).to.be.calledOnce;
      });
    });
  });
  describe("try-catch-else-finally", function () {
    describe("if an error occurs", function () {
      return it(
        "should hit the catch and the finally, ignore the else",
        function () {
          var _else, err, inCatch, inFinally;
          err = new Error();
          inCatch = stub();
          inFinally = stub();
          _else = true;
          try {
            try {
              throw err;
            } catch (e) {
              _else = false;
              expect(e).to.equal(err);
              inCatch();
            } finally {
              if (_else) {
                throw new Error("never reached");
              }
            }
          } finally {
            inFinally();
          }
          expect(inCatch).to.be.calledOnce;
          return expect(inFinally).to.be.calledOnce;
        }
      );
    });
    return describe("if an error does not occur", function () {
      return it(
        "should hit the else and the finally, ignore the catch",
        function () {
          var _else, inElse, inFinally, ran;
          ran = stub();
          inElse = stub();
          inFinally = stub();
          _else = true;
          try {
            try {
              ran();
            } catch (e) {
              _else = false;
              throw new Error("never reached");
            } finally {
              if (_else) {
                inElse();
              }
            }
          } finally {
            inFinally();
          }
          expect(ran).to.be.calledOnce;
          expect(inElse).to.be.calledOnce;
          return expect(inFinally).to.be.calledOnce;
        }
      );
    });
  });
  describe("try-catch as type", function () {
    var MyError;
    MyError = (function () {
      var _MyError_prototype;
      _MyError_prototype = MyError.prototype;
      MyError.displayName = "MyError";
      function MyError() {
        if (this instanceof MyError) {
          return this;
        } else {
          return __create(_MyError_prototype);
        }
      }
      return MyError;
    }());
    describe("with an untyped catch", function () {
      describe("when the expected error is thrown", function () {
        return it("should hit the specific catch but ignore the other", function () {
          var err, inSpecific;
          inSpecific = stub();
          err = MyError();
          try {
            throw err;
          } catch (e) {
            if (e instanceof MyError) {
              expect(e).to.equal(err);
              inSpecific();
            } else {
              throw new Error("never reached");
            }
          }
          return expect(inSpecific).to.be.calledOnce;
        });
      });
      describe("when an unexpected error is thrown", function () {
        return it("should hit the specific catch but ignore the other", function () {
          var err, inCatch;
          err = {};
          inCatch = stub();
          try {
            throw err;
          } catch (e) {
            if (e instanceof MyError) {
              throw new Error("never reached");
            } else {
              expect(e).to.equal(err);
              inCatch();
            }
          }
          return expect(inCatch).to.be.calledOnce;
        });
      });
      describe("when no error is thrown", function () {
        return it("should ignore both catches", function () {
          var ran;
          ran = stub();
          try {
            ran();
          } catch (e) {
            if (e instanceof MyError) {
              throw new Error("never reached");
            } else {
              throw new Error("never reached");
            }
          }
          return expect(ran).to.be.calledOnce;
        });
      });
      return describe("with differing idents", function () {
        return it("should work fine", function () {
          var e, err, inCatch;
          err = new Error();
          inCatch = stub();
          try {
            throw err;
          } catch (e2) {
            if (e2 instanceof MyError) {
              e = e2;
              throw new Error("never reached");
            } else {
              expect(e2).to.equal(err);
              inCatch();
            }
          }
          return expect(inCatch).to.be.calledOnce;
        });
      });
    });
    describe("without an untyped catch", function () {
      describe("when the expected error is thrown", function () {
        return it("should hit the specific catch but ignore the other", function () {
          var err, inSpecific;
          inSpecific = stub();
          err = MyError();
          try {
            throw err;
          } catch (e) {
            if (e instanceof MyError) {
              expect(e).to.equal(err);
              inSpecific();
            } else {
              throw e;
            }
          }
          return expect(inSpecific).to.be.calledOnce;
        });
      });
      describe("when an unexpected error is thrown", function () {
        return it("should hit the specific catch but ignore the other", function () {
          var err, inCatch;
          err = {};
          inCatch = stub();
          return expect(function () {
            try {
              throw err;
            } catch (e) {
              if (e instanceof MyError) {
                throw new Error("never reached");
              } else {
                throw e;
              }
            }
          }).throws(err);
        });
      });
      return describe("when no error is thrown", function () {
        return it("should ignore both catches", function () {
          var ran;
          ran = stub();
          try {
            ran();
          } catch (e) {
            if (e instanceof MyError) {
              throw new Error("never reached");
            } else {
              throw e;
            }
          }
          return expect(ran).to.be.calledOnce;
        });
      });
    });
    describe("multiple catch as types", function () {
      var OtherError;
      OtherError = (function () {
        var _OtherError_prototype;
        _OtherError_prototype = OtherError.prototype;
        OtherError.displayName = "OtherError";
        function OtherError() {
          if (this instanceof OtherError) {
            return this;
          } else {
            return __create(_OtherError_prototype);
          }
        }
        return OtherError;
      }());
      function f(err) {
        try {
          throw err;
        } catch (e) {
          if (e instanceof MyError) {
            return "myError";
          } else if (e instanceof OtherError) {
            return "otherError";
          } else {
            return "unknown";
          }
        }
      }
      it("when the first error is thrown", function () {
        return expect(f(MyError())).to.equal("myError");
      });
      it("when the second error is thrown", function () {
        return expect(f(OtherError())).to.equal("otherError");
      });
      return it("when an unknown error is thrown", function () {
        return expect(f(new Error())).to.equal("unknown");
      });
    });
    return describe("multiple catch as types using union syntax", function () {
      var OtherError;
      OtherError = (function () {
        var _OtherError_prototype;
        _OtherError_prototype = OtherError.prototype;
        OtherError.displayName = "OtherError";
        function OtherError() {
          if (this instanceof OtherError) {
            return this;
          } else {
            return __create(_OtherError_prototype);
          }
        }
        return OtherError;
      }());
      function f(err) {
        try {
          throw err;
        } catch (e) {
          if (e instanceof MyError || e instanceof OtherError) {
            return "myError";
          } else {
            return "unknown";
          }
        }
      }
      it("when the first error is thrown", function () {
        return expect(f(MyError())).to.equal("myError");
      });
      it("when the second error is thrown", function () {
        return expect(f(OtherError())).to.equal("myError");
      });
      return it("when an unknown error is thrown", function () {
        return expect(f(new Error())).to.equal("unknown");
      });
    });
  });
  describe("try-catch == type", function () {
    var MyError, obj;
    MyError = (function () {
      var _MyError_prototype;
      _MyError_prototype = MyError.prototype;
      MyError.displayName = "MyError";
      function MyError() {
        if (this instanceof MyError) {
          return this;
        } else {
          return __create(_MyError_prototype);
        }
      }
      return MyError;
    }());
    obj = {};
    function f(err) {
      var _else, e1, e2, result;
      result = "";
      _else = true;
      try {
        try {
          if (err != null) {
            throw err;
          }
        } catch (e3) {
          _else = false;
          if (e3 instanceof MyError) {
            e1 = e3;
            return result = "myError";
          } else if (e3 === obj) {
            e2 = e3;
            return result = "obj";
          } else {
            return result = String(e3);
          }
        } finally {
          if (_else) {
            result = "none";
          }
        }
      } finally {
        return ":" + result;
      }
    }
    it("when the first error is thrown", function () {
      return expect(f(MyError())).to.equal(":myError");
    });
    it("when the second error is thrown", function () {
      return expect(f(obj)).to.equal(":obj");
    });
    it("when an unknown error is thrown", function () {
      return expect(f({
        toString: function () {
          return "other";
        }
      })).to.equal(":other");
    });
    return it("when no error is thrown", function () {
      return expect(f()).to.equal(":none");
    });
  });
}.call(this));
