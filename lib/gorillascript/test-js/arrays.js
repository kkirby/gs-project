(function () {
  "use strict";
  var __in, __isArray, __slice, __sliceStep, __step, __toArray, __typeof,
      expect, stub;
  __in = typeof Array.prototype.indexOf === "function"
    ? (function (indexOf) {
      return function (child, parent) {
        return indexOf.call(parent, child) !== -1;
      };
    }(Array.prototype.indexOf))
    : function (child, parent) {
      var i, len;
      len = +parent.length;
      i = -1;
      while (++i < len) {
        if (child === parent[i] && i in parent) {
          return true;
        }
      }
      return false;
    };
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function (_toString) {
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }(Object.prototype.toString));
  __slice = Array.prototype.slice;
  __sliceStep = function (array, start, end, step, inclusive) {
    var arr;
    if (step < 0) {
      arr = __slice.call(
        array,
        inclusive ? end : +end + 1,
        +start + 1 || 1/0
      );
    } else {
      arr = __slice.call(array, start, inclusive ? +end + 1 || 1/0 : end);
    }
    if (step === 1) {
      return arr;
    } else if (step === -1) {
      return arr.reverse();
    } else {
      return __step(arr, step);
    }
  };
  __step = function (array, step) {
    var i, len, result;
    if (typeof step !== "number") {
      throw new TypeError("Expected step to be a Number, got " + __typeof(step));
    }
    if (step === 0) {
      throw new RangeError("step cannot be zero");
    } else if (step === 1) {
      return __toArray(array);
    } else if (step === -1) {
      return __slice.call(array).reverse();
    } else if (step % 1 !== 0) {
      throw new RangeError("step must be an integer, got " + String(step));
    } else {
      array = __toArray(array);
      len = array.length;
      result = [];
      if (step > 0) {
        i = 0;
        for (; i < len; i += step) {
          result.push(array[i]);
        }
      } else {
        i = len - 1;
        for (; i >= 0; i += step) {
          result.push(array[i]);
        }
      }
      return result;
    }
  };
  __toArray = function (x) {
    if (x == null) {
      throw new TypeError("Expected an object, got " + __typeof(x));
    } else if (__isArray(x)) {
      return x;
    } else if (typeof x === "string") {
      return x.split("");
    } else if (typeof x.length === "number") {
      return __slice.call(x);
    } else {
      throw new TypeError("Expected an object with a length property, got " + __typeof(x));
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
  stub = require("sinon").stub;
  describe("single-line arrays", function () {
    it("allows an empty array", function () {
      var arr;
      arr = [];
      expect(arr).to.be.an("array").to.be.empty;
      return expect(Object.prototype.toString.call(arr) === "[object Array]");
    });
    it("allows for single-line arrays", function () {
      var arr;
      arr = ["alpha", "bravo", "charlie"];
      expect(arr).to.be.an("array").to.have.length(3).to.have.property(0).that.equals("alpha");
      expect(arr).to.have.property(1).that.equals("bravo");
      return expect(arr).to.have.property(2).that.equals("charlie");
    });
    return it("ignores trailing comma", function () {
      var arr;
      arr = ["alpha", "bravo", "charlie"];
      return expect(arr).to.have.length(3).to.eql(["alpha", "bravo", "charlie"]);
    });
  });
  describe("multi-line arrays", function () {
    it("works with commas", function () {
      var arr;
      arr = ["alpha", "bravo", "charlie"];
      return expect(arr).to.eql(["alpha", "bravo", "charlie"]);
    });
    it("works without commas", function () {
      var arr;
      arr = ["alpha", "bravo", "charlie"];
      return expect(arr).to.eql(["alpha", "bravo", "charlie"]);
    });
    it("works with mixed commas", function () {
      var arr;
      arr = ["alpha", "bravo", "charlie"];
      return expect(arr).to.eql(["alpha", "bravo", "charlie"]);
    });
    it("works with multiple elements on one line", function () {
      var arr;
      arr = [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ];
      return expect(arr).to.eql([
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
      ]);
    });
    return it("works with objects", function () {
      var arr;
      arr = [{ a: 1 }, { b: 2 }, { c: 3 }];
      return expect(arr).to.eql([{ a: 1 }, { b: 2 }, { c: 3 }]);
    });
  });
  describe("spread", function () {
    var arr;
    arr = ["alpha", "bravo", "charlie"];
    it("works at the beginning of an array", function () {
      return expect(arr.concat(["delta"])).to.eql(["alpha", "bravo", "charlie", "delta"]);
    });
    it("works at the end of an array", function () {
      return expect(["delta"].concat(arr)).to.eql(["delta", "alpha", "bravo", "charlie"]);
    });
    it("works in the middle of an array", function () {
      return expect(["delta"].concat(arr, ["echo"])).to.eql([
        "delta",
        "alpha",
        "bravo",
        "charlie",
        "echo"
      ]);
    });
    it("works with a literal array being spread", function () {
      expect([arr, "delta"]).to.eql([
        ["alpha", "bravo", "charlie"],
        "delta"
      ]);
      expect(["delta", arr]).to.eql([
        "delta",
        ["alpha", "bravo", "charlie"]
      ]);
      return expect(["delta", arr, "echo"]).to.eql([
        "delta",
        ["alpha", "bravo", "charlie"],
        "echo"
      ]);
    });
    it("works with an array of arrays being spread", function () {
      var arr2;
      arr2 = [arr];
      expect(arr2.concat(["delta"])).to.eql([
        ["alpha", "bravo", "charlie"],
        "delta"
      ]);
      expect(["delta"].concat(arr2)).to.eql([
        "delta",
        ["alpha", "bravo", "charlie"]
      ]);
      return expect(["delta"].concat(arr2, ["echo"])).to.eql([
        "delta",
        ["alpha", "bravo", "charlie"],
        "echo"
      ]);
    });
    it(
      "does not create an array that is reference equal if the only item",
      function () {
        return expect(__slice.call(arr)).to.eql(arr).to.not.equal(arr);
      }
    );
    return it("works with multiple array spreads", function () {
      var alpha, bravo;
      alpha = [1, 2, 3];
      bravo = [4, 5, 6];
      expect(alpha.concat(bravo)).to.eql([
        1,
        2,
        3,
        4,
        5,
        6
      ]);
      expect(bravo.concat(alpha)).to.eql([
        4,
        5,
        6,
        1,
        2,
        3
      ]);
      expect(["charlie"].concat(alpha, bravo)).to.eql([
        "charlie",
        1,
        2,
        3,
        4,
        5,
        6
      ]);
      expect(["charlie"].concat(alpha, ["delta"], bravo)).to.eql([
        "charlie",
        1,
        2,
        3,
        "delta",
        4,
        5,
        6
      ]);
      expect(["charlie"].concat(alpha, ["delta"], bravo, ["echo"])).to.eql([
        "charlie",
        1,
        2,
        3,
        "delta",
        4,
        5,
        6,
        "echo"
      ]);
      expect(alpha.concat(["delta"], bravo)).to.eql([
        1,
        2,
        3,
        "delta",
        4,
        5,
        6
      ]);
      expect(alpha.concat(["delta"], bravo, ["echo"])).to.eql([
        1,
        2,
        3,
        "delta",
        4,
        5,
        6,
        "echo"
      ]);
      return expect(alpha.concat(bravo, ["echo"])).to.eql([
        1,
        2,
        3,
        4,
        5,
        6,
        "echo"
      ]);
    });
  });
  describe("array containment", function () {
    it("works on an ident", function () {
      var array;
      array = ["alpha", "bravo", "charlie"];
      expect(__in("alpha", array)).to.be["true"];
      expect(__in("bravo", array)).to.be["true"];
      expect(__in("charlie", array)).to.be["true"];
      expect(__in("delta", array)).to.be["false"];
      return expect(!__in("delta", array)).to.be["true"];
    });
    it("works on a literal array", function () {
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(false).to.be["false"];
      return expect(true).to.be["true"];
    });
    it("does not calculate key more than once", function () {
      var array, getKey;
      getKey = stub().returns("charlie");
      array = ["alpha", "bravo", "charlie"];
      expect(__in(getKey(), array)).to.be["true"];
      return expect(getKey).to.be.calledOnce;
    });
    it(
      "does not calculate key more than once with literal array",
      function () {
        var _ref, getKey;
        getKey = stub().returns("charlie");
        expect((_ref = getKey()) === "alpha" || _ref === "bravo" || _ref === "charlie").to.be["true"];
        return expect(getKey).to.be.calledOnce;
      }
    );
    it("calculates key once with empty literal array", function () {
      var getKey;
      getKey = stub().returns("charlie");
      expect((getKey(), false)).to.be["false"];
      return expect(getKey).to.be.calledOnce;
    });
    return it("does not calculate array more than once", function () {
      var getArray;
      getArray = stub().returns(["alpha", "bravo", "charlie"]);
      expect(__in("charlie", getArray())).to.be["true"];
      return expect(getArray).to.be.calledOnce;
    });
  });
  describe("multiple access", function () {
    it("returns an array", function () {
      var array;
      array = [
        "alpha",
        "bravo",
        "charlie",
        "delta",
        "echo"
      ];
      return expect([array[0], array[2], array[4]]).to.eql(["alpha", "charlie", "echo"]);
    });
    return it("only accesses object once", function () {
      var _ref, getArray;
      getArray = stub().returns([
        "alpha",
        "bravo",
        "charlie",
        "delta",
        "echo"
      ]);
      expect([(_ref = getArray())[0], _ref[2], _ref[4]]).to.eql(["alpha", "charlie", "echo"]);
      return expect(getArray).to.be.calledOnce;
    });
  });
  describe("slicing", function () {
    var array;
    array = [
      "a",
      "b",
      "c",
      "d",
      "e"
    ];
    it("returns a similar array when slicing from 0 to -1", function () {
      return expect(__slice.call(array)).to.eql(array).to.be.not.equal(array);
    });
    it("works as expected", function () {
      expect(__slice.call(array, 1)).to.eql(["b", "c", "d", "e"]);
      expect(__slice.call(array, -1)).to.eql(["e"]);
      expect(__slice.call(array, 2)).to.eql(["c", "d", "e"]);
      expect(__slice.call(array, 0, 3)).to.eql(["a", "b", "c"]);
      expect(__slice.call(array, 0, 3)).to.eql(["a", "b", "c"]);
      expect(__slice.call(array, 0, -1)).to.eql(["a", "b", "c", "d"]);
      expect(__slice.call(array, 1, 4)).to.eql(["b", "c", "d"]);
      expect(__slice.call(array, 1, 4)).to.eql(["b", "c", "d"]);
      expect(__slice.call(array, 4)).to.eql(["e"]);
      expect(__slice.call(array, 5)).to.eql([]);
      expect(__slice.call(array, -2)).to.eql(["d", "e"]);
      expect(__slice.call(array, 4, 4)).to.eql([]);
      return expect(__slice.call(array, 4, 4)).to.eql([]);
    });
    it("only accesses array, left, and right once each", function () {
      function slice(getArray, getLeft, getRight, inclusive) {
        var result;
        if (inclusive) {
          result = __slice.call(getArray(), getLeft(), getRight() + 1 || 1/0);
        } else {
          result = __slice.call(getArray(), getLeft(), getRight());
        }
        expect(getArray).to.be.calledOnce;
        expect(getLeft).to.be.calledOnce;
        expect(getRight).to.be.calledOnce;
        return result;
      }
      expect(slice(stub().returns(array), stub().returns(0), stub().returns(-1), true)).to.eql(array).to.be.not.equal(array);
      expect(slice(stub().returns(array), stub().returns(1), stub().returns(-1), true)).to.eql(["b", "c", "d", "e"]);
      expect(slice(stub().returns(array), stub().returns(-1), stub().returns(-1), true)).to.eql(["e"]);
      expect(slice(stub().returns(array), stub().returns(2), stub().returns(-1), true)).to.eql(["c", "d", "e"]);
      expect(slice(stub().returns(array), stub().returns(0), stub().returns(2), true)).to.eql(["a", "b", "c"]);
      expect(slice(stub().returns(array), stub().returns(0), stub().returns(3), false)).to.eql(["a", "b", "c"]);
      expect(slice(stub().returns(array), stub().returns(0), stub().returns(-1), false)).to.eql(["a", "b", "c", "d"]);
      expect(slice(stub().returns(array), stub().returns(1), stub().returns(3), true)).to.eql(["b", "c", "d"]);
      expect(slice(stub().returns(array), stub().returns(1), stub().returns(4), false)).to.eql(["b", "c", "d"]);
      expect(slice(stub().returns(array), stub().returns(4), stub().returns(-1), true)).to.eql(["e"]);
      expect(slice(stub().returns(array), stub().returns(5), stub().returns(-1), true)).to.eql([]);
      expect(slice(stub().returns(array), stub().returns(-2), stub().returns(-1), true)).to.eql(["d", "e"]);
      expect(slice(stub().returns(array), stub().returns(4), stub().returns(3), true)).to.eql([]);
      return expect(slice(stub().returns(array), stub().returns(4), stub().returns(4), false)).to.eql([]);
    });
    it("works with a specified step", function () {
      expect(__slice.call(array)).to.eql(array).to.be.not.equal(array);
      expect(__sliceStep(
        array,
        -1,
        0,
        -1,
        true
      )).to.eql([
        "e",
        "d",
        "c",
        "b",
        "a"
      ]);
      expect(__sliceStep(
        array,
        -1,
        0,
        -2,
        true
      )).to.eql(["e", "c", "a"]);
      expect(__sliceStep(
        array,
        0,
        -1,
        2,
        true
      )).to.eql(["a", "c", "e"]);
      expect(__slice.call(array, 1)).to.eql(["b", "c", "d", "e"]);
      expect(__sliceStep(
        array,
        -1,
        1,
        -1,
        true
      )).to.eql(["e", "d", "c", "b"]);
      expect(__sliceStep(
        array,
        -1,
        1,
        -2,
        true
      )).to.eql(["e", "c"]);
      expect(__sliceStep(
        array,
        -1,
        -1,
        100,
        true
      )).to.eql(["e"]);
      expect(__sliceStep(
        array,
        2,
        -1,
        2,
        true
      )).to.eql(["c", "e"]);
      expect(__sliceStep(
        array,
        -1,
        2,
        -2,
        true
      )).to.eql(["e", "c"]);
      expect(__sliceStep(
        array,
        0,
        2,
        2,
        true
      )).to.eql(["a", "c"]);
      expect(__sliceStep(
        array,
        2,
        0,
        -2,
        true
      )).to.eql(["c", "a"]);
      expect(__sliceStep(array, 0, -1, 3)).to.eql(["a", "d"]);
      expect(__sliceStep(
        array,
        1,
        3,
        2,
        true
      )).to.eql(["b", "d"]);
      expect(__sliceStep(array, 1, 4, 2)).to.eql(["b", "d"]);
      expect(__sliceStep(
        array,
        3,
        1,
        -2,
        true
      )).to.eql(["d", "b"]);
      expect(__sliceStep(array, 3, 0, -2)).to.eql(["d", "b"]);
      expect(__slice.call(array, 4)).to.eql(["e"]);
      expect(__slice.call(array, 5)).to.eql([]);
      expect(__sliceStep(
        array,
        -3,
        -1,
        2,
        true
      )).to.eql(["c", "e"]);
      expect(__slice.call(array, 4, 4)).to.eql([]);
      expect(__slice.call(array, 4, 4)).to.eql([]);
      expect(__sliceStep(
        array,
        4,
        -1,
        -1,
        true
      )).to.eql(["e"]);
      expect(__sliceStep(
        array,
        5,
        -1,
        -1,
        true
      )).to.eql(["e"]);
      expect(__sliceStep(
        array,
        -1,
        -3,
        -2,
        true
      )).to.eql(["e", "c"]);
      expect(__sliceStep(
        array,
        3,
        4,
        -1,
        true
      )).to.eql([]);
      return expect(__sliceStep(array, 4, 4, -1)).to.eql([]);
    });
    return it("only accesses array, left, right, and step once", function () {
      function slice(getArray, getLeft, getRight, getStep, inclusive) {
        var result;
        if (inclusive) {
          result = __sliceStep(
            getArray(),
            getLeft(),
            getRight(),
            getStep(),
            true
          );
        } else {
          result = __sliceStep(getArray(), getLeft(), getRight(), getStep());
        }
        expect(getArray).to.be.calledOnce;
        expect(getLeft).to.be.calledOnce;
        expect(getRight).to.be.calledOnce;
        return result;
      }
      expect(slice(
        stub().returns(array),
        stub().returns(0),
        stub().returns(-1),
        stub().returns(1),
        true
      )).to.eql(array).to.be.not.equal(array);
      expect(slice(
        stub().returns(array),
        stub().returns(-1),
        stub().returns(0),
        stub().returns(-1),
        true
      )).to.eql([
        "e",
        "d",
        "c",
        "b",
        "a"
      ]);
      expect(slice(
        stub().returns(array),
        stub().returns(-1),
        stub().returns(0),
        stub().returns(-2),
        true
      )).to.eql(["e", "c", "a"]);
      expect(slice(
        stub().returns(array),
        stub().returns(0),
        stub().returns(-1),
        stub().returns(2),
        true
      )).to.eql(["a", "c", "e"]);
      expect(slice(
        stub().returns(array),
        stub().returns(1),
        stub().returns(-1),
        stub().returns(1),
        true
      )).to.eql(["b", "c", "d", "e"]);
      expect(slice(
        stub().returns(array),
        stub().returns(-1),
        stub().returns(1),
        stub().returns(-1),
        true
      )).to.eql(["e", "d", "c", "b"]);
      expect(slice(
        stub().returns(array),
        stub().returns(-1),
        stub().returns(1),
        stub().returns(-2),
        true
      )).to.eql(["e", "c"]);
      expect(slice(
        stub().returns(array),
        stub().returns(-1),
        stub().returns(-1),
        stub().returns(100),
        true
      )).to.eql(["e"]);
      expect(slice(
        stub().returns(array),
        stub().returns(2),
        stub().returns(-1),
        stub().returns(2),
        true
      )).to.eql(["c", "e"]);
      expect(slice(
        stub().returns(array),
        stub().returns(-1),
        stub().returns(2),
        stub().returns(-2),
        true
      )).to.eql(["e", "c"]);
      expect(slice(
        stub().returns(array),
        stub().returns(0),
        stub().returns(2),
        stub().returns(2),
        true
      )).to.eql(["a", "c"]);
      expect(slice(
        stub().returns(array),
        stub().returns(2),
        stub().returns(0),
        stub().returns(-2),
        true
      )).to.eql(["c", "a"]);
      expect(slice(
        stub().returns(array),
        stub().returns(0),
        stub().returns(-1),
        stub().returns(3),
        false
      )).to.eql(["a", "d"]);
      expect(slice(
        stub().returns(array),
        stub().returns(1),
        stub().returns(3),
        stub().returns(2),
        true
      )).to.eql(["b", "d"]);
      expect(slice(
        stub().returns(array),
        stub().returns(1),
        stub().returns(4),
        stub().returns(2),
        false
      )).to.eql(["b", "d"]);
      expect(slice(
        stub().returns(array),
        stub().returns(3),
        stub().returns(1),
        stub().returns(-2),
        true
      )).to.eql(["d", "b"]);
      return expect(slice(
        stub().returns(array),
        stub().returns(3),
        stub().returns(0),
        stub().returns(-2),
        false
      )).to.eql(["d", "b"]);
    });
  });
  describe("unclosed array syntax", function () {
    it("works when assigned", function () {
      var arr;
      arr = [1, 2, 3, 4];
      return expect(arr).to.eql([1, 2, 3, 4]);
    });
    it("works with only a single item", function () {
      var arr;
      arr = [1];
      return expect(arr).to.eql([1]);
    });
    it("works in an invocation", function () {
      var arr;
      function f(a) {
        return a;
      }
      arr = f([1, 2, 3, 4]);
      return expect(arr).to.eql([1, 2, 3, 4]);
    });
    it("works in an invocation with leading arguments", function () {
      var arr;
      function f(a, b, o) {
        return [a, b, o];
      }
      arr = f(1, 2, [3, 4]);
      return expect(arr).to.eql([
        1,
        2,
        [3, 4]
      ]);
    });
    it("acts as the function return if the last expression", function () {
      function f() {
        return [1, 2, 3, 4];
      }
      return expect(f()).to.eql([1, 2, 3, 4]);
    });
    return it("allows for multiple levels", function () {
      var x;
      x = [
        1,
        2,
        [3, 4],
        [
          5,
          [6, 7],
          8
        ],
        9
      ];
      return expect(x).to.eql([
        1,
        2,
        [3, 4],
        [
          5,
          [6, 7],
          8
        ],
        9
      ]);
    });
  });
}.call(this));
