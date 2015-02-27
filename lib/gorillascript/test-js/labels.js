(function () {
  "use strict";
  var __owns, expect;
  __owns = Object.prototype.hasOwnProperty;
  expect = require("chai").expect;
  describe("labels", function () {
    it("works with blocks", function () {
      function f(shouldBreak) {
        var x;
        x = 0;
        blah: {
          x |= 1;
          if (shouldBreak) {
            break blah;
          }
          x |= 2;
        }
        return x;
      }
      expect(f(false)).to.equal(3);
      return expect(f(true)).to.equal(1);
    });
    it("works with if statements", function () {
      function f(test, shouldBreak) {
        var x;
        x = 0;
        blah: if (test) {
          x |= 1;
          if (shouldBreak) {
            break blah;
          }
          x |= 2;
        } else {
          x |= 4;
          if (shouldBreak) {
            break blah;
          }
          x |= 8;
        }
        return x;
      }
      expect(f(true, true)).to.equal(1);
      expect(f(true, false)).to.equal(3);
      expect(f(false, true)).to.equal(4);
      return expect(f(false, false)).to.equal(12);
    });
    it("works with switch statements", function () {
      function f(topic, shouldBreak) {
        var x;
        x = 0;
        blah: switch (topic) {
        case true:
          x |= 1;
          if (shouldBreak) {
            break blah;
          }
          x |= 2;
          break;
        case false:
          x |= 4;
          if (shouldBreak) {
            break blah;
          }
          x |= 8;
          break;
        default: throw new Error("Unhandled value in switch");
        }
        return x;
      }
      expect(f(true, true)).to.equal(1);
      expect(f(true, false)).to.equal(3);
      expect(f(false, true)).to.equal(4);
      return expect(f(false, false)).to.equal(12);
    });
    it("works with while statements", function () {
      var i, sum;
      sum = 0;
      i = 0;
      blah: for (; i < 10; ++i) {
        if (i % 2 === 0) {
          continue blah;
        } else if (i > 7) {
          break blah;
        }
        sum |= Math.pow(2, i);
      }
      return expect(sum).to.equal(170);
    });
    it("works with for-in loop statements", function () {
      var _arr, _i, _len, result, x;
      result = [];
      blah: for (_arr = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f"
      ], _i = 0, _len = _arr.length; _i < _len; ++_i) {
        x = _arr[_i];
        if (x === "c") {
          continue blah;
        } else if (x === "e") {
          break blah;
        }
        result.push(x);
      }
      return expect(result).to.eql(["a", "b", "d"]);
    });
    it("works with for-of loop statements", function () {
      var _obj, result, x;
      result = [];
      _obj = {
        a: "a",
        b: "b",
        c: "c",
        d: "d",
        e: "e",
        f: "f"
      };
      blah: for (x in _obj) {
        if (__owns.call(_obj, x)) {
          if (x === "c") {
            continue blah;
          }
          result.push(x);
        }
      }
      result.sort();
      return expect(result).to.eql([
        "a",
        "b",
        "d",
        "e",
        "f"
      ]);
    });
    it("works with try-catch statements", function () {
      function f(shouldBreak) {
        var err, result;
        err = {};
        result = 0;
        blah: try {
          result |= 1;
          if (shouldBreak) {
            break blah;
          }
          result |= 2;
          throw err;
        } catch (e) {
          expect(e).to.equal(err);
          result |= 4;
        }
        return result;
      }
      expect(f(true)).to.equal(1);
      return expect(f(false)).to.equal(7);
    });
    it("works with try-finally statements", function () {
      function f(shouldBreak) {
        var err, result;
        err = {};
        result = 0;
        try {
          blah: try {
            result |= 1;
            if (shouldBreak) {
              break blah;
            }
            result |= 2;
            throw err;
          } finally {
            result |= 4;
          }
        } catch (e) {
          expect(e).to.equal(err);
          result |= 8;
        }
        return result;
      }
      expect(f(true)).to.equal(5);
      return expect(f(false)).to.equal(15);
    });
    it("works with nested loops", function () {
      var i, j, sum;
      sum = 0;
      blah: for (i = 1; i <= 10; ++i) {
        for (j = 1; j <= 10; ++j) {
          if (i === j) {
            continue blah;
          }
          sum += j;
        }
      }
      return expect(sum).to.equal(165);
    });
    return it("can break an outer loop", function () {
      var i, j, sum;
      sum = 0;
      blah: for (i = 1; i <= 10; ++i) {
        for (j = 1; j <= 10; ++j) {
          if (i > 5 && j === i) {
            break blah;
          }
          sum += j;
        }
      }
      return expect(sum).to.equal(290);
    });
  });
}.call(this));
