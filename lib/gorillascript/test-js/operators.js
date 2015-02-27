(function () {
  "use strict";
  var __cmp, __compose, __create, __curry, __import, __in, __instanceofsome,
      __is, __isArray, __lt, __lte, __num, __owns, __range, __slice, __step,
      __strnum, __toArray, __typeof, __xor, expect, gorilla, stub;
  __cmp = function (left, right) {
    var type;
    if (left === right) {
      return 0;
    } else {
      type = typeof left;
      if (type !== "number" && type !== "string") {
        throw new TypeError("Cannot compare a non-number/string: " + type);
      } else if (type !== typeof right) {
        throw new TypeError("Cannot compare elements of different types: " + type + " vs " + typeof right);
      } else if (left < right) {
        return -1;
      } else {
        return 1;
      }
    }
  };
  __compose = function (left, right) {
    if (typeof left !== "function") {
      throw new TypeError("Expected left to be a Function, got " + __typeof(left));
    }
    if (typeof right !== "function") {
      throw new TypeError("Expected right to be a Function, got " + __typeof(right));
    }
    return function () {
      return left.call(this, right.apply(this, arguments));
    };
  };
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __curry = function (numArgs, f) {
    var currier;
    if (typeof numArgs !== "number") {
      throw new TypeError("Expected numArgs to be a Number, got " + __typeof(numArgs));
    }
    if (typeof f !== "function") {
      throw new TypeError("Expected f to be a Function, got " + __typeof(f));
    }
    if (numArgs > 1) {
      currier = function (args) {
        var ret;
        if (args.length >= numArgs) {
          return f.apply(this, args);
        } else {
          ret = function () {
            if (arguments.length === 0) {
              return ret;
            } else {
              return currier.call(this, args.concat(__slice.call(arguments)));
            }
          };
          return ret;
        }
      };
      return currier([]);
    } else {
      return f;
    }
  };
  __import = function (dest, source) {
    var k;
    for (k in source) {
      if (__owns.call(source, k)) {
        dest[k] = source[k];
      }
    }
    return dest;
  };
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
  __instanceofsome = function (value, array) {
    var _arr, _i, _some, item;
    _some = false;
    for (_arr = __toArray(array), _i = _arr.length; _i--; ) {
      item = _arr[_i];
      if (value instanceof item) {
        _some = true;
        break;
      }
    }
    return _some;
  };
  __is = typeof Object.is === "function" ? Object.is
    : function (x, y) {
      if (x === y) {
        return x !== 0 || 1 / x === 1 / y;
      } else {
        return x !== x && y !== y;
      }
    };
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function (_toString) {
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }(Object.prototype.toString));
  __lt = function (x, y) {
    var type;
    type = typeof x;
    if (type !== "number" && type !== "string") {
      throw new TypeError("Cannot compare a non-number/string: " + type);
    } else if (type !== typeof y) {
      throw new TypeError("Cannot compare elements of different types: " + type + " vs " + typeof y);
    } else {
      return x < y;
    }
  };
  __lte = function (x, y) {
    var type;
    type = typeof x;
    if (type !== "number" && type !== "string") {
      throw new TypeError("Cannot compare a non-number/string: " + type);
    } else if (type !== typeof y) {
      throw new TypeError("Cannot compare elements of different types: " + type + " vs " + typeof y);
    } else {
      return x <= y;
    }
  };
  __num = function (num) {
    if (typeof num !== "number") {
      throw new TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
  };
  __owns = Object.prototype.hasOwnProperty;
  __range = function (start, end, step, inclusive) {
    var i, result;
    if (typeof start !== "number") {
      throw new TypeError("Expected start to be a Number, got " + __typeof(start));
    }
    if (typeof end !== "number") {
      throw new TypeError("Expected end to be a Number, got " + __typeof(end));
    }
    if (typeof step !== "number") {
      throw new TypeError("Expected step to be a Number, got " + __typeof(step));
    }
    if (inclusive == null) {
      inclusive = false;
    } else if (typeof inclusive !== "boolean") {
      throw new TypeError("Expected inclusive to be a Boolean, got " + __typeof(inclusive));
    }
    if (step === 0) {
      throw new RangeError("step cannot be zero");
    } else if (!isFinite(start)) {
      throw new RangeError("start must be finite");
    } else if (!isFinite(end)) {
      throw new RangeError("end must be finite");
    }
    result = [];
    i = start;
    if (step > 0) {
      for (; i < end; i += step) {
        result.push(i);
      }
      if (inclusive && i <= end) {
        result.push(i);
      }
    } else {
      for (; i > end; i += step) {
        result.push(i);
      }
      if (inclusive && i >= end) {
        result.push(i);
      }
    }
    return result;
  };
  __slice = Array.prototype.slice;
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
  __strnum = function (strnum) {
    var type;
    type = typeof strnum;
    if (type === "string") {
      return strnum;
    } else if (type === "number") {
      return String(strnum);
    } else {
      throw new TypeError("Expected a string or number, got " + __typeof(strnum));
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
  __xor = function (x, y) {
    if (x) {
      return !y && x;
    } else {
      return y || x;
    }
  };
  expect = require("chai").expect;
  stub = require("sinon").stub;
  gorilla = require("../index");
  function fail() {
    throw new Error();
  }
  function runOnce(value) {
    function f() {
      if (f.ran) {
        throw new Error("Already ran function");
      }
      f.ran = true;
      return value;
    }
    return f;
  }
  describe("Simple operators", function () {
    it("should perform the operation", function () {
      expect(3).to.equal(3);
      expect(5).to.equal(5);
      expect(-5).to.equal(-5);
      expect(6).to.equal(6);
      expect(4.5).to.equal(4.5);
      return expect(1).to.equal(1);
    });
    it("Simple operator assignment", function () {
      var x;
      x = 1;
      x += 2;
      expect(x).to.equal(3);
      x -= 5;
      expect(x).to.equal(-2);
      x *= 2;
      expect(x).to.equal(-4);
      x /= -0.5;
      expect(x).to.equal(8);
      x %= 3;
      expect(x).to.equal(2);
      ++x;
      expect(x).to.equal(3);
      --x;
      expect(x).to.equal(2);
      expect(x++).to.equal(2);
      expect(x).to.equal(3);
      expect(x--).to.equal(3);
      return expect(x).to.equal(2);
    });
    it("Addition", function () {
      expect(5).to.equal(5);
      expect(10).to.equal(10);
      expect(10).to.equal(10);
      expect(10).to.equal(10);
      function add(a, b) {
        return __num(a()) + __num(b());
      }
      expect(add(runOnce(1), runOnce(2))).to.equal(3);
      expect(function () {
        return add(runOnce("1"), runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return add(runOnce(1), runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return add(runOnce("1"), runOnce(2));
      }).throws(TypeError);
      function addAssign(a, b) {
        return a = __num(a) + __num(b());
      }
      expect(addAssign(1, runOnce(2))).to.equal(3);
      expect(function () {
        return addAssign("1", runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return addAssign(1, runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return addAssign("1", runOnce(2));
      }).throws(TypeError);
      function addMemberAssign(a, b, c) {
        var _ref;
        return a[_ref = b()] = __num(a[_ref]) + __num(c());
      }
      expect(addMemberAssign({ key: 1 }, runOnce("key"), runOnce(2))).to.equal(3);
      expect(function () {
        return addMemberAssign({ key: "1" }, runOnce("key"), runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return addMemberAssign({ key: 1 }, runOnce("key"), runOnce("2"));
      }).throws(TypeError);
      return expect(function () {
        return addMemberAssign({ key: "1" }, runOnce("key"), runOnce(2));
      }).throws(TypeError);
    });
    it("Subtraction", function () {
      var five, three, two;
      two = 2;
      three = 3;
      five = 5;
      expect(five - three).to.equal(2);
      expect(three - five).to.equal(-2);
      expect(five - three - two).to.equal(0);
      expect(five - three - two).to.equal(0);
      expect(five - (three - two)).to.equal(4);
      function sub(a, b) {
        return __num(a()) - __num(b());
      }
      expect(sub(runOnce(3), runOnce(2))).to.equal(1);
      expect(function () {
        return sub(runOnce("3"), runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return sub(runOnce(3), runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return sub(runOnce("3"), runOnce(2));
      }).throws(TypeError);
      function subAssign(a, b) {
        return a = __num(a) - __num(b());
      }
      expect(subAssign(3, runOnce(2))).to.equal(1);
      expect(function () {
        return subAssign("3", runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return subAssign(3, runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return subAssign("3", runOnce(2));
      }).throws(TypeError);
      function subMemberAssign(a, b, c) {
        var _ref;
        return a[_ref = b()] = __num(a[_ref]) - __num(c());
      }
      expect(subMemberAssign({ key: 3 }, runOnce("key"), runOnce(2))).to.equal(1);
      expect(function () {
        return subMemberAssign({ key: "3" }, runOnce("key"), runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return subMemberAssign({ key: 3 }, runOnce("key"), runOnce("2"));
      }).throws(TypeError);
      return expect(function () {
        return subMemberAssign({ key: "3" }, runOnce("key"), runOnce(2));
      }).throws(TypeError);
    });
    it("Addition and Subtraction", function () {
      var five, three, two;
      two = 2;
      three = 3;
      five = 5;
      expect(two + three - five).to.equal(0);
      expect(two + three - five).to.equal(0);
      expect(two + (three - five)).to.equal(0);
      expect(two - three + five).to.equal(4);
      expect(two - three + five).to.equal(4);
      return expect(two - (three + five)).to.equal(-6);
    });
    it("Subtraction versus negation", function () {
      var a, b, d;
      a = 1;
      b = 2;
      expect(a - b).to.equal(-1);
      expect(a - b).to.equal(-1);
      function c(x) {
        return __num(x) * 2;
      }
      d = 3;
      return expect(c(-d)).to.equal(-6);
    });
    it("Addition versus unary plus", function () {
      var a, b, d;
      a = 1;
      b = 2;
      expect(a + b).to.equal(3);
      expect(a + b).to.equal(3);
      expect(a + b).to.equal(3);
      function c(x) {
        return __num(x) * 2;
      }
      d = 3;
      return expect(c(d)).to.equal(6);
    });
    it("Multiplication", function () {
      expect(6).to.equal(6);
      expect(30).to.equal(30);
      expect(30).to.equal(30);
      expect(30).to.equal(30);
      function mult(a, b) {
        return __num(a()) * __num(b());
      }
      expect(mult(runOnce(3), runOnce(2))).to.equal(6);
      expect(function () {
        return mult(runOnce("3"), runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return mult(runOnce(3), runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return mult(runOnce("3"), runOnce(2));
      }).throws(TypeError);
      function multAssign(a, b) {
        return a = __num(a) * __num(b());
      }
      expect(multAssign(3, runOnce(2))).to.equal(6);
      expect(function () {
        return multAssign("3", runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return multAssign(3, runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return multAssign("3", runOnce(2));
      }).throws(TypeError);
      function multMemberAssign(a, b, c) {
        var _ref;
        return a[_ref = b()] = __num(a[_ref]) * __num(c());
      }
      expect(multMemberAssign({ key: 2 }, runOnce("key"), runOnce(3))).to.equal(6);
      expect(function () {
        return multMemberAssign({ key: "2" }, runOnce("key"), runOnce("3"));
      }).throws(TypeError);
      expect(function () {
        return multMemberAssign({ key: 2 }, runOnce("key"), runOnce("3"));
      }).throws(TypeError);
      return expect(function () {
        return multMemberAssign({ key: "2" }, runOnce("key"), runOnce(3));
      }).throws(TypeError);
    });
    it("Division", function () {
      var six, thirtySix, three;
      thirtySix = 36;
      six = 6;
      three = 3;
      expect(thirtySix / six).to.equal(6);
      expect(thirtySix / six / three).to.equal(2);
      expect(thirtySix / six / three).to.equal(2);
      expect(thirtySix / (six / three)).to.equal(18);
      function div(a, b) {
        return __num(a()) / __num(b());
      }
      expect(div(runOnce(6), runOnce(3))).to.equal(2);
      expect(function () {
        return div(runOnce("6"), runOnce("3"));
      }).throws(TypeError);
      expect(function () {
        return div(runOnce(6), runOnce("3"));
      }).throws(TypeError);
      expect(function () {
        return div(runOnce("6"), runOnce(3));
      }).throws(TypeError);
      function divAssign(a, b) {
        return a = __num(a) / __num(b());
      }
      expect(divAssign(6, runOnce(3))).to.equal(2);
      expect(function () {
        return divAssign("6", runOnce("3"));
      }).throws(TypeError);
      expect(function () {
        return divAssign(6, runOnce("3"));
      }).throws(TypeError);
      expect(function () {
        return divAssign("6", runOnce(3));
      }).throws(TypeError);
      function divMemberAssign(a, b, c) {
        var _ref;
        return a[_ref = b()] = __num(a[_ref]) / __num(c());
      }
      expect(divMemberAssign({ key: 6 }, runOnce("key"), runOnce(3))).to.equal(2);
      expect(function () {
        return divMemberAssign({ key: "6" }, runOnce("key"), runOnce("3"));
      }).throws(TypeError);
      expect(function () {
        return divMemberAssign({ key: 6 }, runOnce("key"), runOnce("3"));
      }).throws(TypeError);
      return expect(function () {
        return divMemberAssign({ key: "6" }, runOnce("key"), runOnce(3));
      }).throws(TypeError);
    });
    it("Multiplication and Division", function () {
      var fifteen, five, three;
      fifteen = 15;
      three = 3;
      five = 5;
      expect(fifteen * three / five).to.equal(9);
      expect(fifteen * three / five).to.equal(9);
      expect(fifteen * (three / five)).to.equal(9);
      expect(fifteen / three * five).to.equal(25);
      expect(fifteen / three * five).to.equal(25);
      return expect(fifteen / (three * five)).to.equal(1);
    });
    it("Modulus", function () {
      expect(2).to.equal(2);
      expect(1).to.equal(1);
      expect(1).to.equal(1);
      expect(4).to.equal(4);
      expect(3).to.equal(3);
      expect(3).to.equal(3);
      function mod(a, b) {
        return __num(a()) % __num(b());
      }
      expect(mod(runOnce(8), runOnce(3))).to.equal(2);
      expect(function () {
        return mod(runOnce("8"), runOnce("3"));
      }).throws(TypeError);
      expect(function () {
        return mod(runOnce(8), runOnce("3"));
      }).throws(TypeError);
      expect(function () {
        return mod(runOnce("8"), runOnce(3));
      }).throws(TypeError);
      function modAssign(a, b) {
        return a = __num(a) % __num(b());
      }
      expect(modAssign(8, runOnce(3))).to.equal(2);
      expect(function () {
        return modAssign("8", runOnce("3"));
      }).throws(TypeError);
      expect(function () {
        return modAssign(8, runOnce("3"));
      }).throws(TypeError);
      expect(function () {
        return modAssign("8", runOnce(3));
      }).throws(TypeError);
      function modMemberAssign(a, b, c) {
        var _ref;
        return a[_ref = b()] = __num(a[_ref]) % __num(c());
      }
      expect(modMemberAssign({ key: 8 }, runOnce("key"), runOnce(3))).to.equal(2);
      expect(function () {
        return modMemberAssign({ key: "8" }, runOnce("key"), runOnce("3"));
      }).throws(TypeError);
      expect(function () {
        return modMemberAssign({ key: 8 }, runOnce("key"), runOnce("3"));
      }).throws(TypeError);
      return expect(function () {
        return modMemberAssign({ key: "8" }, runOnce("key"), runOnce(3));
      }).throws(TypeError);
    });
    it("Exponentiation", function () {
      var _ref, x;
      expect(1).to.equal(1);
      expect(3).to.equal(3);
      expect(9).to.equal(9);
      expect(27).to.equal(27);
      expect(3).to.equal(3);
      expect(27).to.equal(27);
      expect(81).to.equal(81);
      expect(243).to.equal(243);
      expect(2).to.equal(2);
      expect(4).to.equal(4);
      expect(8).to.equal(8);
      expect(16).to.equal(16);
      expect(8).to.equal(8);
      expect(32).to.equal(32);
      expect(128).to.equal(128);
      expect(262144).to.equal(262144);
      expect((_ref = 64) * _ref).to.equal(4096);
      expect(262144).to.equal(262144);
      x = 2;
      expect(Math.pow(x, 10)).to.equal(1024);
      expect(Math.pow(x, 32)).to.equal(4294967296);
      function pow(a, b) {
        return Math.pow(__num(a()), __num(b()));
      }
      expect(pow(runOnce(2), runOnce(3))).to.equal(8);
      expect(function () {
        return pow(runOnce("2"), runOnce("3"));
      }).throws(TypeError);
      expect(function () {
        return pow(runOnce(2), runOnce("3"));
      }).throws(TypeError);
      expect(function () {
        return pow(runOnce("2"), runOnce(3));
      }).throws(TypeError);
      function powAssign(a, b) {
        return a = Math.pow(__num(a), __num(b()));
      }
      expect(powAssign(2, runOnce(3))).to.equal(8);
      expect(function () {
        return powAssign("2", runOnce("3"));
      }).throws(TypeError);
      expect(function () {
        return powAssign(2, runOnce("3"));
      }).throws(TypeError);
      expect(function () {
        return powAssign("2", runOnce(3));
      }).throws(TypeError);
      function powMemberAssign(a, b, c) {
        var _ref;
        return a[_ref = b()] = Math.pow(__num(a[_ref]), __num(c()));
      }
      expect(powMemberAssign({ key: 2 }, runOnce("key"), runOnce(3))).to.equal(8);
      expect(function () {
        return powMemberAssign({ key: "2" }, runOnce("key"), runOnce("3"));
      }).throws(TypeError);
      expect(function () {
        return powMemberAssign({ key: 2 }, runOnce("key"), runOnce("3"));
      }).throws(TypeError);
      return expect(function () {
        return powMemberAssign({ key: "2" }, runOnce("key"), runOnce(3));
      }).throws(TypeError);
    });
    it(
      "Exponentation still calculates left side if right is 0",
      function () {
        var ten;
        ten = stub().returns(10);
        expect((__num(ten()), 1)).to.equal(1);
        return expect(ten).to.be.calledOnce;
      }
    );
    it("Logical operators", function () {
      expect(false).to.be["false"];
      expect(false).to.be["false"];
      expect(false).to.be["false"];
      expect(true).to.be["true"];
      function fail() {
        throw new Error("should not be reached");
      }
      expect(void 0).to.equal(void 0);
      expect(0).to.equal(0);
      expect(0).to.equal(0);
      expect("yes").to.equal("yes");
      expect(false).to.be["false"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(0).to.equal(0);
      expect(void 0).to.equal(void 0);
      expect("yes").to.equal("yes");
      expect("yes").to.equal("yes");
      expect(__xor(false, false)).to.be["false"];
      expect(__xor(true, false)).to.be["true"];
      expect(__xor(false, true)).to.be["true"];
      expect(__xor(true, true)).to.be["false"];
      expect(__xor(0, void 0)).to.equal(0);
      expect(__xor(void 0, 0)).to.equal(void 0);
      expect(__xor("yes", void 0)).to.equal("yes");
      expect(__xor(void 0, "yes")).to.equal("yes");
      return expect(__xor("yes", 1)).to.be["false"];
    });
    it("logical assignment", function () {
      function andAssign(x, y) {
        return x && (x = y());
      }
      function andMemberAssign(x, y, z) {
        var _ref;
        return x[_ref = y()] && (x[_ref] = z());
      }
      function orAssign(x, y) {
        return x || (x = y());
      }
      function orMemberAssign(x, y, z) {
        var _ref;
        return x[_ref = y()] || (x[_ref] = z());
      }
      function xorAssign(x, y) {
        return x = __xor(x, y());
      }
      function xorMemberAssign(x, y, z) {
        var _ref;
        return x[_ref = y()] = __xor(x[_ref], z());
      }
      expect(andAssign(1, runOnce(2))).to.equal(2);
      expect(andAssign(0, function () {
        throw new Error();
      })).to.equal(0);
      expect(orAssign(1, function () {
        throw new Error();
      })).to.equal(1);
      expect(orAssign(0, runOnce(2))).to.equal(2);
      expect(xorAssign(1, runOnce(1))).to.equal(false);
      expect(xorAssign(1, runOnce(0))).to.equal(1);
      expect(xorAssign(0, runOnce(1))).to.equal(1);
      expect(xorAssign(0, runOnce(0))).to.equal(0);
      expect(andMemberAssign({}, runOnce("key"), function () {
        throw new Error();
      })).to.equal(void 0);
      expect(andMemberAssign({ key: "alpha" }, runOnce("key"), runOnce("bravo"))).to.equal("bravo");
      expect(orMemberAssign({}, runOnce("key"), runOnce("value"))).to.equal("value");
      expect(orMemberAssign({ key: "alpha" }, runOnce("key"), function () {
        throw new Error();
      })).to.equal("alpha");
      expect(xorMemberAssign({}, runOnce("key"), runOnce("value"))).to.equal("value");
      expect(xorMemberAssign({}, runOnce("key"), runOnce(0))).to.equal(void 0);
      expect(xorMemberAssign({ key: "alpha" }, runOnce("key"), runOnce("value"))).to.equal(false);
      return expect(xorMemberAssign({ key: "alpha" }, runOnce(0), runOnce(0))).to.equal(void 0);
    });
    it("not", function () {
      expect(true).to.equal(true);
      return expect(false).to.equal(false);
    });
    it("instanceof", function () {
      function MyType() {}
      expect(new MyType() instanceof MyType).to.be["true"];
      expect(!("hello" instanceof MyType)).to.be["true"];
      expect(true).to.be["true"];
      expect(typeof new MyType() !== "string").to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      return expect(__isArray([])).to.be["true"];
    });
    it("instanceofsome", function () {
      var _ref, str;
      expect(true).to.be["true"];
      expect(false).to.be["false"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      str = runOnce("");
      expect(!(str(), false)).to.be["true"];
      expect(str.ran).to.be["true"];
      str = runOnce("");
      return expect(typeof (_ref = str()) === "function" || typeof _ref === "string").to.be["true"];
    });
    it("unary negate", function () {
      expect(-5).to.equal(-5);
      expect(5).to.equal(5);
      expect(-5).to.equal(-5);
      expect(5).to.equal(5);
      expect(-5).to.equal(-5);
      return expect(5).to.equal(5);
    });
    it("Spaceship", function () {
      var cmp;
      expect(__cmp(0, 0)).to.equal(0);
      expect(__cmp("hello", "hello")).to.equal(0);
      expect(__cmp(1, 0)).to.equal(1);
      expect(__cmp(0, 1)).to.equal(-1);
      expect(__cmp(1000000000, -1000000000)).to.equal(1);
      expect(__cmp(-1000000000, 1000000000)).to.equal(-1);
      expect(__cmp(1/0, -1/0)).to.equal(1);
      expect(__cmp(-1/0, 1/0)).to.equal(-1);
      expect(__cmp("alpha", "bravo")).to.equal(-1);
      expect(__cmp("bravo", "alpha")).to.equal(1);
      cmp = __curry(2, function (x, y) {
        return __cmp(x, y);
      });
      expect(cmp(0, 0)).to.equal(0);
      expect(cmp("hello", "hello")).to.equal(0);
      expect(cmp(1, 0)).to.equal(1);
      expect(cmp(0, 1)).to.equal(-1);
      expect(cmp(1000000000, -1000000000)).to.equal(1);
      expect(cmp(-1000000000, 1000000000)).to.equal(-1);
      expect(cmp(1/0, -1/0)).to.equal(1);
      expect(cmp(-1/0, 1/0)).to.equal(-1);
      expect(cmp("alpha", "bravo")).to.equal(-1);
      return expect(cmp("bravo", "alpha")).to.equal(1);
    });
    it("Comparison", function () {
      expect(true).to.equal(true);
      expect(false).to.equal(false);
      expect(true).to.equal(true);
      expect(true).to.equal(true);
      expect(false).to.equal(false);
      expect(true).to.equal(true);
      expect(false).to.equal(false);
      expect(true).to.equal(true);
      expect(true).to.equal(true);
      expect(false).to.equal(false);
      expect(true).to.equal(true);
      expect(false).to.equal(false);
      expect(true).to.equal(true);
      expect(true).to.equal(true);
      expect(false).to.equal(false);
      expect(true).to.equal(true);
      expect(false).to.equal(false);
      expect(true).to.equal(true);
      expect(true).to.equal(true);
      return expect(false).to.equal(false);
    });
    it("String concatenation", function () {
      var x;
      expect("hello there").to.equal("hello there");
      expect("12").to.equal("12");
      x = "1";
      x += "2";
      expect(x).to.equal("12");
      function concat(a, b) {
        return __strnum(a()) + __strnum(b());
      }
      expect(concat(runOnce(1), runOnce(2))).to.equal("12");
      expect(concat(runOnce("1"), runOnce("2"))).to.equal("12");
      expect(concat(runOnce(1), runOnce("2"))).to.equal("12");
      expect(concat(runOnce("1"), runOnce(2))).to.equal("12");
      expect(function () {
        return concat(runOnce("1"), runOnce({}));
      }).throws(TypeError);
      expect(function () {
        return concat(runOnce({}), runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return concat(runOnce({}), runOnce({}));
      }).throws(TypeError);
      expect(function () {
        return concat(runOnce("1"), runOnce(null));
      }).throws(TypeError);
      expect(function () {
        return concat(runOnce(null), runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return concat(runOnce(null), runOnce(null));
      }).throws(TypeError);
      expect(function () {
        return concat(runOnce("1"), runOnce(void 0));
      }).throws(TypeError);
      expect(function () {
        return concat(runOnce(void 0), runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return concat(runOnce(void 0), runOnce(void 0));
      }).throws(TypeError);
      function concatAssign(a, b) {
        return a = __strnum(a) + __strnum(b());
      }
      expect(concatAssign("1", runOnce("2"))).to.equal("12");
      expect(concatAssign("1", runOnce(2))).to.equal("12");
      expect(function () {
        return concatAssign("1", runOnce({}));
      }).throws(TypeError);
      expect(function () {
        return concatAssign({}, runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return concatAssign({}, runOnce({}));
      }).throws(TypeError);
      expect(function () {
        return concatAssign("1", runOnce(null));
      }).throws(TypeError);
      expect(function () {
        return concatAssign(null, runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return concatAssign(null, runOnce(null));
      }).throws(TypeError);
      expect(function () {
        return concatAssign("1", runOnce(void 0));
      }).throws(TypeError);
      expect(function () {
        return concatAssign(void 0, runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return concatAssign(void 0, runOnce(void 0));
      }).throws(TypeError);
      function concatMemberAssign(a, b, c) {
        var _ref;
        return a[_ref = b()] = __strnum(a[_ref]) + __strnum(c());
      }
      expect(concatMemberAssign({ key: "1" }, runOnce("key"), runOnce(2))).to.equal("12");
      expect(concatMemberAssign({ key: "1" }, runOnce("key"), runOnce("2"))).to.equal("12");
      expect(function () {
        return concatMemberAssign({ key: "1" }, runOnce("key"), runOnce({}));
      }).throws(TypeError);
      expect(function () {
        return concatMemberAssign({ key: {} }, runOnce("key"), runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return concatMemberAssign({ key: {} }, runOnce("key"), runOnce({}));
      }).throws(TypeError);
      expect(function () {
        return concatMemberAssign({ key: "1" }, runOnce("key"), runOnce(null));
      }).throws(TypeError);
      expect(function () {
        return concatMemberAssign({ key: null }, runOnce("key"), runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return concatMemberAssign({ key: null }, runOnce("key"), runOnce(null));
      }).throws(TypeError);
      expect(function () {
        return concatMemberAssign({ key: "1" }, runOnce("key"), runOnce(void 0));
      }).throws(TypeError);
      expect(function () {
        return concatMemberAssign({ key: void 0 }, runOnce("key"), runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return concatMemberAssign({ key: void 0 }, runOnce("key"), runOnce(void 0));
      }).throws(TypeError);
      function concatKnownNumbers() {
        var a, b;
        a = 1;
        b = 2;
        return "" + a + b;
      }
      expect(concatKnownNumbers()).to.equal("12");
      function unstrictConcatAssign(a, b) {
        return a += "" + b();
      }
      expect(unstrictConcatAssign("1", runOnce("2"))).to.equal("12");
      expect(unstrictConcatAssign(1, runOnce("2"))).to.equal("12");
      expect(unstrictConcatAssign("1", runOnce(2))).to.equal("12");
      return expect(unstrictConcatAssign(1, runOnce(2))).to.equal("12");
    });
    it("delete removes key", function () {
      var obj;
      obj = { alpha: "bravo", charlie: "delta" };
      expect(__owns.call(obj, "alpha")).to.be["true"];
      delete obj.alpha;
      return expect(!__owns.call(obj, "alpha")).to.be["true"];
    });
    it("delete plucks values", function () {
      var _ref, obj;
      obj = { alpha: "bravo", charlie: "delta" };
      expect(__owns.call(obj, "alpha")).to.be["true"];
      expect((_ref = obj.alpha, delete obj.alpha, _ref)).to.equal("bravo");
      return expect(!__owns.call(obj, "alpha")).to.be["true"];
    });
    it("delete returns undefined if no value found", function () {
      var _ref, obj;
      obj = {};
      return expect((_ref = obj.alpha, delete obj.alpha, _ref)).to.equal(void 0);
    });
    it("delete doesn't pluck if unnecessary", function () {
      var obj;
      if (typeof Object.defineProperty !== "function") {
        return;
      }
      obj = {};
      Object.defineProperty(obj, "alpha", {
        get: function () {
          return fail();
        },
        configurable: true
      });
      delete obj.alpha;
      return expect(obj.alpha).to.equal(void 0);
    });
    it("delete pluck only calculates object once", function () {
      var _ref, _ref2, obj;
      obj = runOnce({ alpha: "bravo" });
      return expect((_ref = (_ref2 = obj()).alpha, delete _ref2.alpha, _ref)).to.equal("bravo");
    });
    it("delete pluck only calculates key once", function () {
      var _ref, _ref2, key, obj;
      obj = { alpha: "bravo" };
      key = runOnce("alpha");
      return expect((_ref = obj[_ref2 = key()], delete obj[_ref2], _ref)).to.equal("bravo");
    });
    it("delete pluck only calculates value once", function () {
      var _ref, obj;
      if (typeof Object.defineProperty !== "function") {
        return;
      }
      obj = {};
      Object.defineProperty(obj, "alpha", { get: runOnce("bravo"), configurable: true });
      return expect((_ref = obj.alpha, delete obj.alpha, _ref)).to.equal("bravo");
    });
    it("let with assignment at the same time", function () {
      var a, b, w, x, y, z;
      b = a = "alpha";
      expect("alpha").to.equal(a);
      expect("alpha").to.equal(b);
      w = x = y = z = "bravo";
      expect("bravo").to.equal(w);
      expect("bravo").to.equal(x);
      expect("bravo").to.equal(y);
      return expect("bravo").to.equal(z);
    });
    it("let with ?= assignment", function () {
      var x, y, z;
      if (x != null) {
        y = x;
      } else {
        y = x = {};
      }
      if (x != null) {
        z = x;
      } else {
        z = x = {};
      }
      expect(y).to.equal(x);
      return expect(z).to.equal(x);
    });
    it("let with ownsor= assignment", function () {
      var x, y, z;
      x = {};
      if (__owns.call(x, "key")) {
        y = x.key;
      } else {
        y = x.key = {};
      }
      if (__owns.call(x, "key")) {
        z = x.key;
      } else {
        z = x.key = {};
      }
      expect(y).to.equal(x.key);
      return expect(z).to.equal(x.key);
    });
    it("let with or= assignment", function () {
      var x, y, z;
      y = x || (x = {});
      z = x || (x = {});
      expect(y).to.equal(x);
      return expect(z).to.equal(x);
    });
    it("multiple assignment", function () {
      var x, y, z;
      x = y = z = "alpha";
      expect("alpha").to.equal(x);
      expect("alpha").to.equal(y);
      return expect("alpha").to.equal(z);
    });
    it("multiple ?= assignment", function () {
      var x, y, z;
      if (x != null) {
        y = x;
      } else {
        y = x = {};
      }
      if (x != null) {
        z = x;
      } else {
        z = x = {};
      }
      expect(y).to.equal(x);
      return expect(z).to.equal(x);
    });
    it("multiple ownsor= assignment", function () {
      var x, y, z;
      x = {};
      if (__owns.call(x, "key")) {
        y = x.key;
      } else {
        y = x.key = {};
      }
      if (__owns.call(x, "key")) {
        z = x.key;
      } else {
        z = x.key = {};
      }
      expect(y).to.equal(x.key);
      return expect(z).to.equal(x.key);
    });
    it("multiple or= assignment", function () {
      var x, y, z;
      y = x || (x = {});
      z = x || (x = {});
      expect(y).to.equal(x);
      return expect(z).to.equal(x);
    });
    it("equality", function () {
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      function eq(a, b) {
        return a === b;
      }
      expect(eq("", 0)).to.be["false"];
      expect(eq("0", 0)).to.be["false"];
      return expect(eq(null, void 0)).to.be["false"];
    });
    it("bitnot", function () {
      expect(-1).to.equal(-1);
      expect(-2).to.equal(-2);
      return expect(-6).to.equal(-6);
    });
    it("bitand", function () {
      return expect(10).to.equal(10);
    });
    it("bitor", function () {
      return expect(15).to.equal(15);
    });
    it("bitxor", function () {
      return expect(9).to.equal(9);
    });
    it("bitlshift", function () {
      return expect(336).to.equal(336);
    });
    it("bitrshift", function () {
      return expect(21).to.equal(21);
    });
    it("biturshift", function () {
      expect(21).to.equal(21);
      return expect(4294967295).to.equal(4294967295);
    });
    it("divisibility", function () {
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(false).to.be["false"];
      expect(false).to.be["false"];
      expect(true).to.be["true"];
      expect(false).to.be["false"];
      expect(false).to.be["false"];
      expect(false).to.be["false"];
      expect(false).to.be["false"];
      expect(true).to.be["true"];
      expect(false).to.be["false"];
      expect(false).to.be["false"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(false).to.be["false"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      return expect(false).to.be["false"];
    });
    it("floor division", function () {
      var x;
      expect(4).to.equal(4);
      expect(5).to.equal(5);
      expect(4).to.equal(4);
      x = 10;
      x = Math.floor(x / 3);
      expect(x).to.equal(3);
      function div(a, b) {
        return Math.floor(__num(a()) / __num(b()));
      }
      expect(div(runOnce(9), runOnce(2))).to.equal(4);
      expect(function () {
        return div(runOnce("9"), runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return div(runOnce(9), runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return div(runOnce("9"), runOnce(2));
      }).throws(TypeError);
      function divAssign(a, b) {
        return a = Math.floor(__num(a) / __num(b()));
      }
      expect(divAssign(9, runOnce(2))).to.equal(4);
      expect(function () {
        return divAssign("9", runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return divAssign(9, runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return divAssign("9", runOnce(2));
      }).throws(TypeError);
      function divMemberAssign(a, b, c) {
        var _ref;
        return a[_ref = b()] = Math.floor(__num(a[_ref]) / __num(c()));
      }
      expect(divMemberAssign({ key: 9 }, runOnce("key"), runOnce(2))).to.equal(4);
      expect(function () {
        return divMemberAssign({ key: "9" }, runOnce("key"), runOnce("2"));
      }).throws(TypeError);
      expect(function () {
        return divMemberAssign({ key: 9 }, runOnce("key"), runOnce("2"));
      }).throws(TypeError);
      return expect(function () {
        return divMemberAssign({ key: "9" }, runOnce("key"), runOnce(2));
      }).throws(TypeError);
    });
    it("min/max operators", function () {
      var _ref, _ref2;
      expect((_ref = (_ref2 = 1) < 3 ? _ref2 : 3) < 4 ? _ref : 4).to.equal(1);
      expect((_ref = (_ref2 = 2) > 3 ? _ref2 : 3) > 4 ? _ref : 4).to.equal(4);
      expect((_ref = (_ref2 = "alpha") < "charlie" ? _ref2 : "charlie") < "delta" ? _ref : "delta").to.equal("alpha");
      return expect((_ref = (_ref2 = "bravo") > "charlie" ? _ref2 : "charlie") > "delta" ? _ref : "delta").to.equal("delta");
    });
    it("min/max assignment", function () {
      function minAssign(x, y) {
        var _ref;
        if (!__lte(x, _ref = y())) {
          return x = _ref;
        } else {
          return x;
        }
      }
      function minMemberAssign(x, y, z) {
        var _ref, _ref2, _ref3;
        if (!__lte(_ref = x[_ref2 = y()], _ref3 = z())) {
          return x[_ref2] = _ref3;
        } else {
          return _ref;
        }
      }
      function maxAssign(x, y) {
        var _ref;
        if (__lt(x, _ref = y())) {
          return x = _ref;
        } else {
          return x;
        }
      }
      function maxMemberAssign(x, y, z) {
        var _ref, _ref2, _ref3;
        if (__lt(_ref = x[_ref2 = y()], _ref3 = z())) {
          return x[_ref2] = _ref3;
        } else {
          return _ref;
        }
      }
      expect(minAssign(1, runOnce(2))).to.equal(1);
      expect(minAssign(2, runOnce(1))).to.equal(1);
      expect(maxAssign(1, runOnce(2))).to.equal(2);
      expect(maxAssign(2, runOnce(1))).to.equal(2);
      expect(minAssign("alpha", runOnce("bravo"))).to.equal("alpha");
      expect(minAssign("bravo", runOnce("alpha"))).to.equal("alpha");
      expect(maxAssign("alpha", runOnce("bravo"))).to.equal("bravo");
      expect(maxAssign("bravo", runOnce("alpha"))).to.equal("bravo");
      expect(minMemberAssign({ key: 1 }, runOnce("key"), runOnce(2))).to.equal(1);
      expect(minMemberAssign({ key: 2 }, runOnce("key"), runOnce(1))).to.equal(1);
      expect(maxMemberAssign({ key: 1 }, runOnce("key"), runOnce(2))).to.equal(2);
      expect(maxMemberAssign({ key: 2 }, runOnce("key"), runOnce(1))).to.equal(2);
      expect(minMemberAssign({ key: "alpha" }, runOnce("key"), runOnce("bravo"))).to.equal("alpha");
      expect(minMemberAssign({ key: "bravo" }, runOnce("key"), runOnce("alpha"))).to.equal("alpha");
      expect(maxMemberAssign({ key: "alpha" }, runOnce("key"), runOnce("bravo"))).to.equal("bravo");
      return expect(maxMemberAssign({ key: "bravo" }, runOnce("key"), runOnce("alpha"))).to.equal("bravo");
    });
    it(
      "negation on separate line does not look like subtraction",
      function () {
        function f() {
          var x;
          x = 5;
          return -1;
        }
        return expect(f()).to.equal(-1);
      }
    );
    it("ownskey", function () {
      var x, y;
      x = { alpha: true };
      y = __create(x);
      y.bravo = true;
      expect(__owns.call(x, "alpha")).to.be["true"];
      expect(!__owns.call(y, "alpha")).to.be["true"];
      return expect(__owns.call(y, "bravo")).to.be["true"];
    });
    it("haskey", function () {
      var x, y;
      x = { alpha: true };
      y = __create(x);
      y.bravo = true;
      expect("alpha" in x).to.be["true"];
      expect("alpha" in y).to.be["true"];
      return expect("bravo" in y).to.be["true"];
    });
    it("ownskey with hasOwnProperty in object", function () {
      var x;
      x = {
        hasOwnProperty: function () {
          return false;
        }
      };
      expect(__owns.call(x, "hasOwnProperty")).to.be["true"];
      return expect(x.hasOwnProperty("hasOwnProperty")).to.be["false"];
    });
    it("Operators as functions", function () {
      function n(f, x, y, expected, safe) {
        var _ref;
        expect(f).to.be.a("function");
        expect(f(x, y)).to.equal(expected);
        if (safe) {
          return expect(function () {
            return f(x, String(y));
          }).throws(TypeError);
        } else {
          return expect((_ref = f(x, String(y))) === expected || _ref === String(expected)).to.be["true"];
        }
      }
      function s(f, x, y, expected, safe) {
        var _ref;
        expect(f).to.be.a("function");
        expect(f(x, y)).to.equal(expected);
        if (safe) {
          return expect(function () {
            return f(x, Number(y));
          }).throws(TypeError);
        } else {
          return expect((_ref = f(x, Number(y))) === expected || _ref === Number(expected)).to.be["true"];
        }
      }
      n(
        __curry(2, function (x, y) {
          return Math.pow(__num(x), __num(y));
        }),
        2,
        10,
        1024,
        true
      );
      n(
        __curry(2, function (x, y) {
          return Math.pow(x, y);
        }),
        2,
        10,
        1024,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __num(x) * __num(y);
        }),
        5,
        6,
        30,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x * y;
        }),
        5,
        6,
        30,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __num(x) / __num(y);
        }),
        5,
        4,
        1.25,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x / y;
        }),
        5,
        4,
        1.25,
        false
      );
      n(
        __curry(2, function (x, y) {
          return Math.floor(__num(x) / __num(y));
        }),
        5,
        3,
        1,
        true
      );
      n(
        __curry(2, function (x, y) {
          return Math.floor(x / y);
        }),
        5,
        3,
        1,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __num(x) % __num(y);
        }),
        5,
        3,
        2,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x % y;
        }),
        5,
        3,
        2,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __num(x) + __num(y);
        }),
        2,
        4,
        6,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x - -y;
        }),
        2,
        4,
        6,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __num(x) - __num(y);
        }),
        10,
        4,
        6,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x - y;
        }),
        10,
        4,
        6,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __num(x) << __num(y);
        }),
        21,
        4,
        336,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x << y;
        }),
        21,
        4,
        336,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __num(x) >> __num(y);
        }),
        336,
        4,
        21,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x >> y;
        }),
        336,
        4,
        21,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __num(x) >>> __num(y);
        }),
        336,
        4,
        21,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x >>> y;
        }),
        336,
        4,
        21,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __num(x) >>> __num(y);
        }),
        -1,
        0,
        4294967295,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x >>> y;
        }),
        -1,
        0,
        4294967295,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __num(x) & __num(y);
        }),
        14,
        11,
        10,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x & y;
        }),
        14,
        11,
        10,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __num(x) | __num(y);
        }),
        14,
        5,
        15,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x | y;
        }),
        14,
        5,
        15,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __num(x) ^ __num(y);
        }),
        12,
        5,
        9,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x ^ y;
        }),
        12,
        5,
        9,
        false
      );
      n(
        __curry(2, function (x, y) {
          if (__lt(x, y)) {
            return x;
          } else {
            return y;
          }
        }),
        5,
        2,
        2,
        true
      );
      n(
        __curry(2, function (x, y) {
          if (x < y) {
            return x;
          } else {
            return y;
          }
        }),
        5,
        2,
        2,
        false
      );
      n(
        __curry(2, function (x, y) {
          if (__lt(x, y)) {
            return x;
          } else {
            return y;
          }
        }),
        2,
        5,
        2,
        true
      );
      n(
        __curry(2, function (x, y) {
          if (x < y) {
            return x;
          } else {
            return y;
          }
        }),
        2,
        5,
        2,
        false
      );
      n(
        __curry(2, function (x, y) {
          if (!__lte(x, y)) {
            return x;
          } else {
            return y;
          }
        }),
        5,
        2,
        5,
        true
      );
      n(
        __curry(2, function (x, y) {
          if (x > y) {
            return x;
          } else {
            return y;
          }
        }),
        5,
        2,
        5,
        false
      );
      n(
        __curry(2, function (x, y) {
          if (!__lte(x, y)) {
            return x;
          } else {
            return y;
          }
        }),
        2,
        5,
        5,
        true
      );
      n(
        __curry(2, function (x, y) {
          if (x > y) {
            return x;
          } else {
            return y;
          }
        }),
        2,
        5,
        5,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __strnum(x) + __strnum(y);
        }),
        1,
        2,
        "12"
      );
      n(
        __curry(2, function (x, y) {
          return "" + x + y;
        }),
        "1",
        "2",
        "12"
      );
      n(
        __curry(2, function (x, y) {
          return __strnum(x) + __strnum(y);
        }),
        "hello",
        "there",
        "hellothere"
      );
      n(
        __curry(2, function (x, y) {
          return "" + x + y;
        }),
        "hello",
        "there",
        "hellothere"
      );
      expect(function () {
        return __curry(2, function (x, y) {
          return __strnum(x) + __strnum(y);
        })(void 0, 1);
      }).throws(TypeError);
      n(
        __curry(2, function (x, y) {
          return "" + x + y;
        }),
        void 0,
        1,
        "undefined1",
        false
      );
      expect(__curry(2, function (x, y) {
        return __in(x, y);
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return __in(x, y);
      })("c", ["a", "b", "c", "d"])).to.be["true"];
      expect(__curry(2, function (x, y) {
        return __in(x, y);
      })("e", ["a", "b", "c", "d"])).to.be["false"];
      expect(__curry(2, function (x, y) {
        return !__in(x, y);
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return !__in(x, y);
      })("c", ["a", "b", "c", "d"])).to.be["false"];
      expect(__curry(2, function (x, y) {
        return !__in(x, y);
      })("e", ["a", "b", "c", "d"])).to.be["true"];
      expect(__curry(2, function (x, y) {
        return y in x;
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return y in x;
      })({ hello: "there" }, "hello")).to.be["true"];
      expect(__curry(2, function (x, y) {
        return y in x;
      })(__create({ hello: "there" }), "hello")).to.be["true"];
      expect(__curry(2, function (x, y) {
        return y in x;
      })(__create({}), "hello")).to.be["false"];
      expect(__curry(2, function (x, y) {
        return !(y in x);
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return !(y in x);
      })({ hello: "there" }, "hello")).to.be["false"];
      expect(__curry(2, function (x, y) {
        return !(y in x);
      })(__create({ hello: "there" }), "hello")).to.be["false"];
      expect(__curry(2, function (x, y) {
        return !(y in x);
      })(__create({}), "hello")).to.be["true"];
      expect(__curry(2, function (x, y) {
        return __owns.call(x, y);
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return __owns.call(x, y);
      })({ hello: "there" }, "hello")).to.be["true"];
      expect(__curry(2, function (x, y) {
        return __owns.call(x, y);
      })(__create({ hello: "there" }), "hello")).to.be["false"];
      expect(__curry(2, function (x, y) {
        return __owns.call(x, y);
      })(__create({}), "hello")).to.be["false"];
      expect(__curry(2, function (x, y) {
        return !__owns.call(x, y);
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return !__owns.call(x, y);
      })({ hello: "there" }, "hello")).to.be["false"];
      expect(__curry(2, function (x, y) {
        return !__owns.call(x, y);
      })(__create({ hello: "there" }), "hello")).to.be["true"];
      expect(__curry(2, function (x, y) {
        return !__owns.call(x, y);
      })(__create({}), "hello")).to.be["true"];
      expect(__curry(2, function (x, y) {
        return x instanceof y;
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return x instanceof y;
      })(
        function () {},
        Function
      )).to.be["true"];
      expect(__curry(2, function (x, y) {
        return x instanceof y;
      })({}, Object)).to.be["true"];
      expect(__curry(2, function (x, y) {
        return x instanceof y;
      })([], Array)).to.be["true"];
      expect(__curry(2, function (x, y) {
        return x instanceof y;
      })(
        function () {},
        Array
      )).to.be["false"];
      expect(__curry(2, function (x, y) {
        return x instanceof y;
      })([], Number)).to.be["false"];
      expect(__curry(2, function (x, y) {
        return !(x instanceof y);
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return !(x instanceof y);
      })(
        function () {},
        Function
      )).to.be["false"];
      expect(__curry(2, function (x, y) {
        return !(x instanceof y);
      })({}, Object)).to.be["false"];
      expect(__curry(2, function (x, y) {
        return !(x instanceof y);
      })([], Array)).to.be["false"];
      expect(__curry(2, function (x, y) {
        return !(x instanceof y);
      })(
        function () {},
        Array
      )).to.be["true"];
      expect(__curry(2, function (x, y) {
        return !(x instanceof y);
      })([], Number)).to.be["true"];
      expect(__curry(2, function (x, y) {
        return __instanceofsome(x, y);
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return __instanceofsome(x, y);
      })(
        function () {},
        [Number, Function]
      )).to.be["true"];
      expect(__curry(2, function (x, y) {
        return __instanceofsome(x, y);
      })(
        function () {},
        [Function, Number]
      )).to.be["true"];
      expect(__curry(2, function (x, y) {
        return __instanceofsome(x, y);
      })(
        function () {},
        [String, Number]
      )).to.be["false"];
      expect(__curry(2, function (x, y) {
        return !__instanceofsome(x, y);
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return !__instanceofsome(x, y);
      })(
        function () {},
        [Number, Function]
      )).to.be["false"];
      expect(__curry(2, function (x, y) {
        return !__instanceofsome(x, y);
      })(
        function () {},
        [Function, Number]
      )).to.be["false"];
      expect(__curry(2, function (x, y) {
        return !__instanceofsome(x, y);
      })(
        function () {},
        [String, Number]
      )).to.be["true"];
      expect(__curry(2, function (x, y) {
        return __cmp(x, y);
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return __cmp(x, y);
      })("hello", "hello")).to.equal(0);
      expect(__curry(2, function (x, y) {
        return __cmp(x, y);
      })("alpha", "bravo")).to.equal(-1);
      expect(__curry(2, function (x, y) {
        return __cmp(x, y);
      })("bravo", "alpha")).to.equal(1);
      expect(__curry(2, function (x, y) {
        return __cmp(x, y);
      })(1000, 1000)).to.equal(0);
      expect(__curry(2, function (x, y) {
        return __cmp(x, y);
      })(1000, 1100)).to.equal(-1);
      expect(__curry(2, function (x, y) {
        return __cmp(x, y);
      })(1000, 900)).to.equal(1);
      expect(__curry(2, function (x, y) {
        return x == y;
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return x == y;
      })("1", 1)).to.be["true"];
      expect(__curry(2, function (x, y) {
        return x == y;
      })("", 0)).to.be["true"];
      expect(__curry(2, function (x, y) {
        return x == y;
      })("", [])).to.be["true"];
      expect(__curry(2, function (x, y) {
        return x == y;
      })(false, 1)).to.be["false"];
      expect(__curry(2, function (x, y) {
        return x != y;
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return x != y;
      })("1", 1)).to.be["false"];
      expect(__curry(2, function (x, y) {
        return x != y;
      })("", 0)).to.be["false"];
      expect(__curry(2, function (x, y) {
        return x != y;
      })("", [])).to.be["false"];
      expect(__curry(2, function (x, y) {
        return x != y;
      })(false, 1)).to.be["true"];
      expect(__curry(2, function (x, y) {
        return x === y;
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return x === y;
      })(1, 1)).to.be["true"];
      expect(__curry(2, function (x, y) {
        return x === y;
      })("1", 1)).to.be["false"];
      expect(__curry(2, function (x, y) {
        return x === y;
      })("hello", "hello")).to.be["true"];
      expect(__curry(2, function (x, y) {
        return x === y;
      })("hello", "Hello")).to.be["false"];
      expect(__curry(2, function (x, y) {
        return x !== y;
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return x !== y;
      })(1, 1)).to.be["false"];
      expect(__curry(2, function (x, y) {
        return x !== y;
      })("1", 1)).to.be["true"];
      expect(__curry(2, function (x, y) {
        return x !== y;
      })("hello", "hello")).to.be["false"];
      expect(__curry(2, function (x, y) {
        return x !== y;
      })("hello", "Hello")).to.be["true"];
      n(
        __curry(2, function (x, y) {
          return __num(x) % __num(y) === 0;
        }),
        10,
        5,
        true,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x % y === 0;
        }),
        10,
        5,
        true,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __num(x) % __num(y) === 0;
        }),
        10,
        6,
        false,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x % y === 0;
        }),
        10,
        6,
        false,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __num(x) % __num(y) !== 0;
        }),
        10,
        5,
        false,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x % y !== 0;
        }),
        10,
        5,
        false,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __num(x) % __num(y) !== 0;
        }),
        10,
        6,
        true,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x % y !== 0;
        }),
        10,
        6,
        true,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __lt(x, y);
        }),
        1,
        5,
        true,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x < y;
        }),
        1,
        5,
        true,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __lt(x, y);
        }),
        5,
        5,
        false,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x < y;
        }),
        5,
        5,
        false,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __lt(x, y);
        }),
        5,
        1,
        false,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x < y;
        }),
        5,
        1,
        false,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __lte(x, y);
        }),
        1,
        5,
        true,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x <= y;
        }),
        1,
        5,
        true,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __lte(x, y);
        }),
        5,
        5,
        true,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x <= y;
        }),
        5,
        5,
        true,
        false
      );
      n(
        __curry(2, function (x, y) {
          return __lte(x, y);
        }),
        5,
        1,
        false,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x <= y;
        }),
        5,
        1,
        false,
        false
      );
      n(
        __curry(2, function (x, y) {
          return !__lte(x, y);
        }),
        5,
        1,
        true,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x > y;
        }),
        5,
        1,
        true,
        false
      );
      n(
        __curry(2, function (x, y) {
          return !__lte(x, y);
        }),
        5,
        5,
        false,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x > y;
        }),
        5,
        5,
        false,
        false
      );
      n(
        __curry(2, function (x, y) {
          return !__lte(x, y);
        }),
        1,
        5,
        false,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x > y;
        }),
        1,
        5,
        false,
        false
      );
      n(
        __curry(2, function (x, y) {
          return !__lt(x, y);
        }),
        5,
        1,
        true,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x >= y;
        }),
        5,
        1,
        true,
        false
      );
      n(
        __curry(2, function (x, y) {
          return !__lt(x, y);
        }),
        5,
        5,
        true,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x >= y;
        }),
        5,
        5,
        true,
        false
      );
      n(
        __curry(2, function (x, y) {
          return !__lt(x, y);
        }),
        1,
        5,
        false,
        true
      );
      n(
        __curry(2, function (x, y) {
          return x >= y;
        }),
        1,
        5,
        false,
        false
      );
      s(
        __curry(2, function (x, y) {
          return __lt(x, y);
        }),
        "1",
        "5",
        true,
        true
      );
      s(
        __curry(2, function (x, y) {
          return x < y;
        }),
        "1",
        "5",
        true,
        false
      );
      s(
        __curry(2, function (x, y) {
          return __lt(x, y);
        }),
        "5",
        "5",
        false,
        true
      );
      s(
        __curry(2, function (x, y) {
          return x < y;
        }),
        "5",
        "5",
        false,
        false
      );
      s(
        __curry(2, function (x, y) {
          return __lt(x, y);
        }),
        "5",
        "1",
        false,
        true
      );
      s(
        __curry(2, function (x, y) {
          return x < y;
        }),
        "5",
        "1",
        false,
        false
      );
      s(
        __curry(2, function (x, y) {
          return __lte(x, y);
        }),
        "1",
        "5",
        true,
        true
      );
      s(
        __curry(2, function (x, y) {
          return x <= y;
        }),
        "1",
        "5",
        true,
        false
      );
      s(
        __curry(2, function (x, y) {
          return __lte(x, y);
        }),
        "5",
        "5",
        true,
        true
      );
      s(
        __curry(2, function (x, y) {
          return x <= y;
        }),
        "5",
        "5",
        true,
        false
      );
      s(
        __curry(2, function (x, y) {
          return __lte(x, y);
        }),
        "5",
        "1",
        false,
        true
      );
      s(
        __curry(2, function (x, y) {
          return x <= y;
        }),
        "5",
        "1",
        false,
        false
      );
      s(
        __curry(2, function (x, y) {
          return !__lte(x, y);
        }),
        "5",
        "1",
        true,
        true
      );
      s(
        __curry(2, function (x, y) {
          return x > y;
        }),
        "5",
        "1",
        true,
        false
      );
      s(
        __curry(2, function (x, y) {
          return !__lte(x, y);
        }),
        "5",
        "5",
        false,
        true
      );
      s(
        __curry(2, function (x, y) {
          return x > y;
        }),
        "5",
        "5",
        false,
        false
      );
      s(
        __curry(2, function (x, y) {
          return !__lte(x, y);
        }),
        "1",
        "5",
        false,
        true
      );
      s(
        __curry(2, function (x, y) {
          return x > y;
        }),
        "1",
        "5",
        false,
        false
      );
      s(
        __curry(2, function (x, y) {
          return !__lt(x, y);
        }),
        "5",
        "1",
        true,
        true
      );
      s(
        __curry(2, function (x, y) {
          return x >= y;
        }),
        "5",
        "1",
        true,
        false
      );
      s(
        __curry(2, function (x, y) {
          return !__lt(x, y);
        }),
        "5",
        "5",
        true,
        true
      );
      s(
        __curry(2, function (x, y) {
          return x >= y;
        }),
        "5",
        "5",
        true,
        false
      );
      s(
        __curry(2, function (x, y) {
          return !__lt(x, y);
        }),
        "1",
        "5",
        false,
        true
      );
      s(
        __curry(2, function (x, y) {
          return x >= y;
        }),
        "1",
        "5",
        false,
        false
      );
      expect(__curry(2, function (x, y) {
        return x && y;
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return x && y;
      })(1, 5)).to.equal(5);
      expect(__curry(2, function (x, y) {
        return x && y;
      })(0, 5)).to.equal(0);
      expect(__curry(2, function (x, y) {
        return x && y;
      })(false, 5)).to.equal(false);
      expect(__curry(2, function (x, y) {
        return x && y;
      })(true, 5)).to.equal(5);
      expect(__curry(2, function (x, y) {
        return x && y;
      })(void 0, 5)).to.equal(void 0);
      expect(__curry(2, function (x, y) {
        return x && y;
      })(null, 5)).to.equal(null);
      expect(__curry(2, function (x, y) {
        return x && y;
      })("", 5)).to.equal("");
      expect(__curry(2, function (x, y) {
        return x && y;
      })("a", 5)).to.equal(5);
      expect(__curry(2, function (x, y) {
        return x || y;
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return x || y;
      })(1, 5)).to.equal(1);
      expect(__curry(2, function (x, y) {
        return x || y;
      })(0, 5)).to.equal(5);
      expect(__curry(2, function (x, y) {
        return x || y;
      })(false, 5)).to.equal(5);
      expect(__curry(2, function (x, y) {
        return x || y;
      })(true, 5)).to.equal(true);
      expect(__curry(2, function (x, y) {
        return x || y;
      })(void 0, 5)).to.equal(5);
      expect(__curry(2, function (x, y) {
        return x || y;
      })(null, 5)).to.equal(5);
      expect(__curry(2, function (x, y) {
        return x || y;
      })("", 5)).to.equal(5);
      expect(__curry(2, function (x, y) {
        return x || y;
      })("a", 5)).to.equal("a");
      expect(__curry(2, function (x, y) {
        return __xor(x, y);
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        return __xor(x, y);
      })(1, 5)).to.equal(false);
      expect(__curry(2, function (x, y) {
        return __xor(x, y);
      })(1, 0)).to.equal(1);
      expect(__curry(2, function (x, y) {
        return __xor(x, y);
      })(0, 5)).to.equal(5);
      expect(__curry(2, function (x, y) {
        return __xor(x, y);
      })(false, 5)).to.equal(5);
      expect(__curry(2, function (x, y) {
        return __xor(x, y);
      })(true, 5)).to.equal(false);
      expect(__curry(2, function (x, y) {
        return __xor(x, y);
      })(true, void 0)).to.equal(true);
      expect(__curry(2, function (x, y) {
        return __xor(x, y);
      })(void 0, 5)).to.equal(5);
      expect(__curry(2, function (x, y) {
        return __xor(x, y);
      })(null, 5)).to.equal(5);
      expect(__curry(2, function (x, y) {
        return __xor(x, y);
      })("", 5)).to.equal(5);
      expect(__curry(2, function (x, y) {
        return __xor(x, y);
      })("a", 5)).to.equal(false);
      expect(__curry(2, function (x, y) {
        return __xor(x, y);
      })("a", null)).to.equal("a");
      expect(__curry(2, function (x, y) {
        if (x != null) {
          return x;
        } else {
          return y;
        }
      })).to.be.a("function");
      expect(__curry(2, function (x, y) {
        if (x != null) {
          return x;
        } else {
          return y;
        }
      })(1, 5)).to.equal(1);
      expect(__curry(2, function (x, y) {
        if (x != null) {
          return x;
        } else {
          return y;
        }
      })(0, 5)).to.equal(0);
      expect(__curry(2, function (x, y) {
        if (x != null) {
          return x;
        } else {
          return y;
        }
      })(false, 5)).to.equal(false);
      expect(__curry(2, function (x, y) {
        if (x != null) {
          return x;
        } else {
          return y;
        }
      })(true, 5)).to.equal(true);
      expect(__curry(2, function (x, y) {
        if (x != null) {
          return x;
        } else {
          return y;
        }
      })(void 0, 5)).to.equal(5);
      expect(__curry(2, function (x, y) {
        if (x != null) {
          return x;
        } else {
          return y;
        }
      })(null, 5)).to.equal(5);
      expect(__curry(2, function (x, y) {
        if (x != null) {
          return x;
        } else {
          return y;
        }
      })("", 5)).to.equal("");
      expect(__curry(2, function (x, y) {
        if (x != null) {
          return x;
        } else {
          return y;
        }
      })("a", 5)).to.equal("a");
      expect(function (x) {
        return !x;
      }).to.be.a("function");
      expect((function (x) {
        return !x;
      }(false))).to.equal(true);
      expect((function (x) {
        return !x;
      }(true))).to.equal(false);
      expect((function (x) {
        return !x;
      }(""))).to.equal(true);
      expect((function (x) {
        return !x;
      }("a"))).to.equal(false);
      expect((function (x) {
        return !x;
      }(0))).to.equal(true);
      expect((function (x) {
        return !x;
      }(1))).to.equal(false);
      expect((function (x) {
        return !x;
      }(void 0))).to.equal(true);
      expect((function (x) {
        return !x;
      }(null))).to.equal(true);
      expect(function (x) {
        return ~__num(x);
      }).to.be.a("function");
      expect((function (x) {
        return ~__num(x);
      }(0))).to.equal(-1);
      expect((function (x) {
        return ~__num(x);
      }(1))).to.equal(-2);
      expect((function (x) {
        return ~__num(x);
      }(5.5))).to.equal(-6);
      expect(function () {
        return (function (x) {
          return ~__num(x);
        }(""));
      }).throws(TypeError);
      expect(function () {
        return (function (x) {
          return ~__num(x);
        }(void 0));
      }).throws(TypeError);
      expect(function (x) {
        return ~x;
      }).to.be.a("function");
      expect((function (x) {
        return ~x;
      }(0))).to.equal(-1);
      expect((function (x) {
        return ~x;
      }(1))).to.equal(-2);
      expect((function (x) {
        return ~x;
      }(5.5))).to.equal(-6);
      expect((function (x) {
        return ~x;
      }(""))).to.equal(-1);
      expect(function (x) {
        return typeof x;
      }).to.be.a("function");
      expect((function (x) {
        return typeof x;
      }(0))).to.equal("number");
      expect((function (x) {
        return typeof x;
      }(1))).to.equal("number");
      expect((function (x) {
        return typeof x;
      }(0/0))).to.equal("number");
      expect((function (x) {
        return typeof x;
      }(""))).to.equal("string");
      expect((function (x) {
        return typeof x;
      }(void 0))).to.equal("undefined");
      expect((function (x) {
        return typeof x;
      }(null))).to.equal("object");
      expect((function (x) {
        return typeof x;
      }({}))).to.equal("object");
      expect((function (x) {
        return typeof x;
      }([]))).to.equal("object");
      expect((function (x) {
        return typeof x;
      }(function () {}))).to.equal("function");
      expect((function (x) {
        return typeof x;
      }(true))).to.equal("boolean");
      expect((function (x) {
        return typeof x;
      }(false))).to.equal("boolean");
      expect(function (x) {
        return __typeof(x);
      }).to.be.a("function");
      expect((function (x) {
        return __typeof(x);
      }(0))).to.equal("Number");
      expect((function (x) {
        return __typeof(x);
      }(1))).to.equal("Number");
      expect((function (x) {
        return __typeof(x);
      }(0/0))).to.equal("Number");
      expect((function (x) {
        return __typeof(x);
      }(""))).to.equal("String");
      expect((function (x) {
        return __typeof(x);
      }(void 0))).to.equal("Undefined");
      expect((function (x) {
        return __typeof(x);
      }(null))).to.equal("Null");
      expect((function (x) {
        return __typeof(x);
      }({}))).to.equal("Object");
      expect((function (x) {
        return __typeof(x);
      }([]))).to.equal("Array");
      expect((function (x) {
        return __typeof(x);
      }(function () {}))).to.equal("Function");
      expect((function (x) {
        return __typeof(x);
      }(true))).to.equal("Boolean");
      expect((function (x) {
        return __typeof(x);
      }(false))).to.equal("Boolean");
      function t(f, obj, shouldCatch) {
        var caught;
        expect(f).to.be.a("function");
        caught = false;
        try {
          f(obj);
        } catch (e) {
          caught = true;
        }
        return expect(__xor(caught, shouldCatch)).to.be["false"];
      }
      t(
        function (x) {
          throw x;
        },
        {},
        true
      );
      t(
        function (x) {
          throw x;
        },
        false,
        true
      );
      t(
        function (x) {
          throw x;
        },
        null,
        true
      );
      t(
        function (x) {
          throw x;
        },
        void 0,
        true
      );
      t(
        function (x) {
          if (x != null) {
            throw x;
          }
        },
        {},
        true
      );
      t(
        function (x) {
          if (x != null) {
            throw x;
          }
        },
        false,
        true
      );
      t(
        function (x) {
          if (x != null) {
            throw x;
          }
        },
        null,
        false
      );
      return t(
        function (x) {
          if (x != null) {
            throw x;
          }
        },
        void 0,
        false
      );
    });
    it("Operators as functions are curried", function () {
      var add, plus5, plus6;
      add = __curry(2, function (x, y) {
        return __num(x) + __num(y);
      });
      expect(add(1, 2)).to.equal(3);
      plus5 = add(5);
      expect(plus5(3)).to.equal(8);
      expect(plus5(4)).to.equal(9);
      plus6 = add(6);
      return expect(plus6(4)).to.equal(10);
    });
    it("Partial operator functions", function () {
      function double(_x) {
        return __num(_x) * 2;
      }
      expect(double).to.be.a("function");
      expect(double(3)).to.equal(6);
      function square(_x) {
        var _ref;
        return (_ref = __num(_x)) * _ref;
      }
      expect(square).to.be.a("function");
      expect(square(3)).to.equal(9);
      function twoExp(_x) {
        return Math.pow(2, __num(_x));
      }
      expect(twoExp).to.be.a("function");
      expect(twoExp(10)).to.equal(1024);
      function F() {}
      function isF(_x) {
        return _x instanceof F;
      }
      function isNotF(_x) {
        return !(_x instanceof F);
      }
      expect(isF(new F())).to.be["true"];
      expect(isNotF(new F())).to.be["false"];
      expect(isF({})).to.be["false"];
      return expect(isNotF({})).to.be["true"];
    });
    it("til operator", function () {
      expect(__range(0, 5, 1, false)).to.eql([
        0,
        1,
        2,
        3,
        4
      ]);
      expect(__range(5, 0, 1, false)).to.eql([]);
      return expect(__range(0.5, 5, 1, false)).to.eql([
        0.5,
        1.5,
        2.5,
        3.5,
        4.5
      ]);
    });
    it("to operator", function () {
      expect(__range(0, 5, 1, true)).to.eql([
        0,
        1,
        2,
        3,
        4,
        5
      ]);
      expect(__range(5, 0, 1, true)).to.eql([]);
      return expect(__range(0.5, 5, 1, true)).to.eql([
        0.5,
        1.5,
        2.5,
        3.5,
        4.5
      ]);
    });
    it("til with by", function () {
      expect(__range(0, 5, 2, false)).to.eql([0, 2, 4]);
      expect(__range(5, 0, 2, false)).to.eql([]);
      expect(__range(5, 0, -1, false)).to.eql([
        5,
        4,
        3,
        2,
        1
      ]);
      expect(__range(5, 0, -2, false)).to.eql([5, 3, 1]);
      return expect(__range(0, 3, 0.5, false)).to.eql([
        0,
        0.5,
        1,
        1.5,
        2,
        2.5
      ]);
    });
    it("to with by", function () {
      expect(__range(0, 5, 2, true)).to.eql([0, 2, 4]);
      expect(__range(5, 0, 2, true)).to.eql([]);
      expect(__range(5, 0, -1, true)).to.eql([
        5,
        4,
        3,
        2,
        1,
        0
      ]);
      expect(__range(5, 0, -2, true)).to.eql([5, 3, 1]);
      return expect(__range(0, 3, 0.5, true)).to.eql([
        0,
        0.5,
        1,
        1.5,
        2,
        2.5,
        3
      ]);
    });
    it("by on normal array", function () {
      expect(__step(
        [1, 2, 3, 4],
        1
      )).to.eql([1, 2, 3, 4]);
      expect(__step(
        [1, 2, 3, 4],
        2
      )).to.eql([1, 3]);
      expect(__step(
        [1, 2, 3, 4],
        -1
      )).to.eql([4, 3, 2, 1]);
      return expect(__step(
        [1, 2, 3, 4],
        -2
      )).to.eql([4, 2]);
    });
    it("is/isnt operator", function () {
      var nan, negativeZero, positiveZero;
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(false).to.be["false"];
      positiveZero = 0;
      negativeZero = -0;
      nan = 0/0;
      expect(positiveZero === 0 && 1 / positiveZero > 0).to.be["true"];
      expect(positiveZero === 0 && 1 / positiveZero > 0).to.be["true"];
      expect(__is(positiveZero, positiveZero)).to.be["true"];
      expect(negativeZero === 0 && 1 / negativeZero < 0).to.be["true"];
      expect(negativeZero === 0 && 1 / negativeZero < 0).to.be["true"];
      expect(__is(negativeZero, negativeZero)).to.be["true"];
      expect(nan !== nan).to.be["true"];
      expect(nan !== nan).to.be["true"];
      return expect(__is(nan, nan)).to.be["true"];
    });
    it("percent operator", function () {
      var x;
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      expect(true).to.be["true"];
      x = 100;
      return expect(x / 100 === 1).to.be["true"];
    });
    it(
      "Addition verifies numericity with different possible return types",
      function () {
        function f(x) {
          if (x) {
            return "234";
          } else {
            return 234;
          }
        }
        expect(1 + __num(f(false))).to.equal(235);
        return expect(function () {
          return 1 + __num(f(true));
        }).throws(TypeError);
      }
    );
    it(
      "Addition verifies numericity with an idle return statement",
      function () {
        function f(x) {
          if (x) {
            return "234";
          }
          return 234;
        }
        expect(1 + __num(f(false))).to.equal(235);
        return expect(function () {
          return 1 + __num(f(true));
        }).throws(TypeError);
      }
    );
    it("Assigning an unknown variable is an error", function () {
      return expect(function () {
        return gorilla.compileSync("let x = 0\ny := 5");
      }).throws(gorilla.MacroError, /Trying to assign with := to unknown variable 'y'.*?2:\d+/);
    });
    it("Assigning an immutable variable is an error", function () {
      return expect(function () {
        return gorilla.compileSync("let x = 0\nx := 5");
      }).throws(gorilla.MacroError, /Trying to assign with := to immutable variable 'x'.*?2:\d+/);
    });
    it("Compose operators", function () {
      var doubleOfSquare, squareOfDouble, times8;
      function double(x) {
        return __num(x) * 2;
      }
      function square(x) {
        var _ref;
        return (_ref = __num(x)) * _ref;
      }
      squareOfDouble = __compose(square, double);
      doubleOfSquare = __compose(double, square);
      expect(squareOfDouble(5)).to.equal(100);
      expect(doubleOfSquare(5)).to.equal(50);
      times8 = __compose(
        __compose(double, double),
        double
      );
      return expect(times8(5)).to.equal(40);
    });
    it("Compose operators are executed in expected order", function () {
      var _ref, alpha, bravo, withAddition;
      withAddition = (function () {
        var id;
        id = 0;
        return function (f) {
          var myId;
          myId = ++id;
          return function (x) {
            return __num(f(x)) + myId;
          };
        };
      }());
      function double(x) {
        return __num(x) * 2;
      }
      function square(x) {
        var _ref;
        return (_ref = __num(x)) * _ref;
      }
      alpha = __compose(withAddition(square), withAddition(double));
      expect([
        alpha(0),
        alpha(1),
        alpha(2),
        alpha(3),
        alpha(4),
        alpha(5)
      ]).to.eql([
        5,
        17,
        37,
        65,
        101,
        145
      ]);
      _ref = withAddition(square);
      bravo = __compose(withAddition(double), _ref);
      return expect([
        bravo(0),
        bravo(1),
        bravo(2),
        bravo(3),
        bravo(4),
        bravo(5)
      ]).to.eql([
        10,
        12,
        18,
        28,
        42,
        60
      ]);
    });
    it("Pipe operators", function () {
      function double(x) {
        return __num(x) * 2;
      }
      function square(x) {
        var _ref;
        return (_ref = __num(x)) * _ref;
      }
      expect(square(double(5))).to.equal(100);
      return expect(square(double(5))).to.equal(100);
    });
    it("Pipe operators are executed in expected order", function () {
      var _ref, withAddition;
      withAddition = (function () {
        var id;
        id = 0;
        return function (f) {
          var myId;
          myId = ++id;
          return function (x) {
            return __num(f(x)) + myId;
          };
        };
      }());
      function double(x) {
        return __num(x) * 2;
      }
      function square(x) {
        var _ref;
        return (_ref = __num(x)) * _ref;
      }
      expect((_ref = withAddition(double)(5), withAddition(square)(_ref))).to.equal(123);
      return expect(withAddition(square)(withAddition(double)(5))).to.equal(199);
    });
    it("Import operators", function () {
      var dest, source;
      source = { alpha: "bravo" };
      dest = { charlie: "delta" };
      expect(__import(dest, source)).to.equal(dest);
      expect(dest.alpha).to.equal("bravo");
      expect(dest.charlie).to.equal("delta");
      dest = { charlie: "delta" };
      expect(__import(dest, source)).to.equal(dest);
      expect(dest.alpha).to.equal("bravo");
      expect(dest.charlie).to.equal("delta");
      dest = { charlie: "delta" };
      expect((dest.alpha = "bravo", dest)).to.equal(dest);
      expect(dest.alpha).to.equal("bravo");
      return expect(dest.charlie).to.equal("delta");
    });
    it("Import chain", function () {
      var _ref, _ref2, a, b, one, two;
      _ref2 = {};
      _ref2.alpha = "bravo";
      _ref = _ref2;
      _ref.charlie = "delta";
      a = _ref;
      expect(a.alpha).to.equal("bravo");
      expect(a.charlie).to.equal("delta");
      one = { alpha: "bravo" };
      two = { charlie: "delta" };
      b = __import(
        __import({}, one),
        two
      );
      expect(b.alpha).to.equal("bravo");
      expect(b.charlie).to.equal("delta");
      return expect(one.charlie).to.equal(void 0);
    });
    it("Let allows for bodies as the right-hand expression", function () {
      var a, b, c, value;
      a = stub();
      b = stub();
      c = stub().returns("hello");
      a();
      b();
      value = c();
      expect(a).to.be.calledOnce;
      expect(b).to.be.calledOnce;
      expect(c).to.be.calledOnce;
      return expect(value).to.be.equal("hello");
    });
    return it(
      "Assign allows for bodies as the right-hand expression",
      function () {
        var a, b, c, value;
        a = stub();
        b = stub();
        c = stub().returns("hello");
        a();
        b();
        value = c();
        expect(a).to.be.calledOnce;
        expect(b).to.be.calledOnce;
        expect(c).to.be.calledOnce;
        return expect(value).to.be.equal("hello");
      }
    );
  });
}.call(this));
