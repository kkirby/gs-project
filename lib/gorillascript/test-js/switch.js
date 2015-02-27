(function () {
  "use strict";
  var expect, stub;
  expect = require("chai").expect;
  stub = require("sinon").stub;
  describe("switch", function () {
    it("works as the return value if the last statement", function () {
      function run(num) {
        switch (num) {
        case 1: return "one";
        case 2: return "two";
        case "a": return "eh";
        default: throw new Error("Unhandled value in switch");
        }
      }
      expect(run(1)).to.equal("one");
      expect(run(2)).to.equal("two");
      expect(run("a")).to.equal("eh");
      return expect(function () {
        return run("other");
      }).throws(Error, /Unhandled value in switch/);
    });
    it(
      "fallsthrough to the next case if fallthrough is detected",
      function () {
        function run(num) {
          switch (num) {
          case 1: return "one";
          case 2:
          case 3: return "two or three";
          case "a": return "eh";
          default: throw new Error("Unhandled value in switch");
          }
        }
        expect(run(1)).to.equal("one");
        expect(run(2)).to.equal("two or three");
        expect(run(3)).to.equal("two or three");
        expect(run("a")).to.equal("eh");
        return expect(function () {
          return run("other");
        }).throws(Error, /Unhandled value in switch/);
      }
    );
    it("will execute code before falling through", function () {
      function run(num) {
        var foundTwo;
        foundTwo = false;
        switch (num) {
        case 1: return "one";
        case 2: foundTwo = true;
        case 3:
          if (foundTwo) {
            return "two";
          } else {
            return "three";
          }
        case "a": return "eh";
        default: throw new Error("Unhandled value in switch");
        }
      }
      expect(run(1)).to.equal("one");
      expect(run(2)).to.equal("two");
      expect(run(3)).to.equal("three");
      expect(run("a")).to.equal("eh");
      return expect(function () {
        return run("other");
      }).throws(Error, /Unhandled value in switch/);
    });
    it("will execute the default block if no case reached", function () {
      function run(num) {
        switch (num) {
        case 1: return "one";
        case 2: return "two";
        case "a": return "eh";
        default: return "unknown";
        }
      }
      expect(run(1)).to.equal("one");
      expect(run(2)).to.equal("two");
      expect(run("a")).to.equal("eh");
      return expect(run("other")).to.equal("unknown");
    });
    it("can support multiple case values at once", function () {
      function run(num) {
        switch (num) {
        case 1:
        case 2:
        case 3: return "one, two, or three";
        case 4:
        case 5:
        case 6: return "four, five, or six";
        default: return "other";
        }
      }
      expect(run(1)).to.equal("one, two, or three");
      expect(run(2)).to.equal("one, two, or three");
      expect(run(3)).to.equal("one, two, or three");
      expect(run(4)).to.equal("four, five, or six");
      expect(run(5)).to.equal("four, five, or six");
      expect(run(6)).to.equal("four, five, or six");
      return expect(run(0)).to.equal("other");
    });
    it("can be used as an expression", function () {
      function run(num) {
        var result;
        switch (num) {
        case 1:
          result = "one";
          break;
        case 2:
          result = "two";
          break;
        default: throw new Error("Unhandled value in switch");
        }
        return result;
      }
      expect(run(1)).to.equal("one");
      expect(run(2)).to.equal("two");
      return expect(function () {
        return run(3);
      }).throws(Error, /Unhandled value in switch/);
    });
    it(
      "allows non-const case nodes, stopping on the first equal value",
      function () {
        var f, ran;
        f = stub().returns(1);
        ran = stub();
        switch (1) {
        case f(): ran();
        case f():
          ran();
          break;
        case f(): throw new Error("never reached");
        case f(): throw new Error("never reached");
        case f():
        case f():
        case f():
        case f(): throw new Error("never reached");
        default: throw new Error("Unhandled value in switch");
        }
        expect(f).to.be.calledOnce;
        return expect(ran).to.be.calledTwice;
      }
    );
    it(
      "should not fallthrough in a case where a return is present but not guaranteed",
      function () {
        var value;
        value = 1;
        switch (true) {
        case true:
          if (!value) {
            return 5;
          }
          break;
        default: value = 2;
        }
        return expect(value).to.equal(1);
      }
    );
    it(
      "should have this and arguments available in the cases when an implicit closure is made",
      function () {
        var obj;
        function fun(value) {
          var result;
          switch (value) {
          case "this":
            result = this;
            break;
          default: throw new Error("Unhandled value in switch");
          }
          return result;
        }
        obj = {};
        expect(fun.call(obj, "this")).to.equal(obj);
        return expect(function () {
          return fun.call(obj, "other");
        }).throws(Error, /Unhandled value in switch/);
      }
    );
    it(
      "should have this and arguments available in the case checks when an implicit closure is made",
      function () {
        function fun(value) {
          var result;
          switch (value) {
          case this.value:
            result = "this";
            break;
          default: result = "other";
          }
          return result;
        }
        expect(fun.call({ value: "alpha" }, "alpha")).to.equal("this");
        return expect(fun.call({}, "bravo", "charlie")).to.equal("other");
      }
    );
    it(
      "should have this available in the value check when an implicit closure is made",
      function () {
        function fun() {
          var result;
          switch (this.value) {
          case 1:
            result = "one";
            break;
          case 2:
            result = "two";
            break;
          default: throw new Error("Unhandled value in switch");
          }
          return result;
        }
        expect(fun.call({ value: 1 })).to.equal("one");
        expect(fun.call({ value: 2 })).to.equal("two");
        return expect(function () {
          return fun.call({ value: 3 });
        }).throws(Error, /Unhandled value in switch/);
      }
    );
    it(
      "should not allow inner loops to break out of the switch without labels",
      function () {
        function fun(value) {
          var i;
          switch (value) {
          case 1:
            i = 0;
            for (; i < 100; ++i) {
              if (i === 10) {
                break;
              }
            }
            return i;
          default: throw new Error("Unhandled value in switch");
          }
        }
        return expect(fun(1)).to.equal(10);
      }
    );
    it("should allow return statements within switch", function () {
      function fun(value) {
        switch (value) {
        case 0: return "zero";
        case 1: return "one";
        }
        return "other";
      }
      expect(fun(0)).to.equal("zero");
      expect(fun(1)).to.equal("one");
      return expect(fun(2)).to.equal("other");
    });
    return it(
      "should allow return statements within switch as the last statement",
      function () {
        function fun(value) {
          switch (value) {
          case 0: return "zero";
          case 1: return "one";
          default: return "other";
          }
        }
        expect(fun(0)).to.equal("zero");
        expect(fun(1)).to.equal("one");
        return expect(fun(2)).to.equal("other");
      }
    );
  });
  describe("topicless switch", function () {
    it("works", function () {
      function run(num) {
        if (num === 1) {
          return "one";
        } else if (num === 2) {
          return "two";
        } else if (num === "a") {
          return "eh";
        } else {
          throw new Error("Unhandled value in switch");
        }
      }
      expect(run(1)).to.equal("one");
      expect(run(2)).to.equal("two");
      expect(run("a")).to.equal("eh");
      return expect(function () {
        return run("other");
      }).throws(Error, /Unhandled value in switch/);
    });
    it("works with fallthrough", function () {
      function run(num) {
        if (num === 1) {
          return "one";
        } else if (num === 2 || num === 3) {
          return "two or three";
        } else if (num === "a") {
          return "eh";
        } else {
          throw new Error("Unhandled value in switch");
        }
      }
      expect(run(1)).to.equal("one");
      expect(run(2)).to.equal("two or three");
      expect(run(3)).to.equal("two or three");
      expect(run("a")).to.equal("eh");
      return expect(function () {
        return run("other");
      }).throws(Error, /Unhandled value in switch/);
    });
    it("works with fallthrough and body", function () {
      function run(num) {
        var _fall, foundTwo;
        foundTwo = false;
        if (num === 1) {
          return "one";
        } else {
          _fall = false;
          if (num === 2) {
            _fall = true;
            foundTwo = true;
          }
          if (_fall || num === 3) {
            if (foundTwo) {
              return "two";
            } else {
              return "three";
            }
          } else if (num === "a") {
            return "eh";
          } else {
            throw new Error("Unhandled value in switch");
          }
        }
      }
      expect(run(1)).to.equal("one");
      expect(run(2)).to.equal("two");
      expect(run(3)).to.equal("three");
      expect(run("a")).to.equal("eh");
      return expect(function () {
        return run("other");
      }).throws(Error, /Unhandled value in switch/);
    });
    return it("works with default case", function () {
      function run(num) {
        if (num === 1) {
          return "one";
        } else if (num === 2) {
          return "two";
        } else if (num === "a") {
          return "eh";
        } else {
          return "unknown";
        }
      }
      expect(run(1)).to.equal("one");
      expect(run(2)).to.equal("two");
      expect(run("a")).to.equal("eh");
      return expect(run("other")).to.equal("unknown");
    });
  });
}.call(this));
