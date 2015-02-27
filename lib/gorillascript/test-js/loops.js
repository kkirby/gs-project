(function () {
  "use strict";
  var __arrayToIter, __cmp, __create, __int, __isArray, __iter, __lt, __nonzero,
      __num, __owns, __slice, __toArray, __typeof, expect, gorilla, stub;
  __arrayToIter = (function () {
    var proto;
    proto = {
      iterator: function () {
        return this;
      },
      next: function () {
        var array, i;
        i = +this.index + 1;
        array = this.array;
        if (i >= array.length) {
          return { done: true, value: void 0 };
        } else {
          this.index = i;
          return { done: false, value: array[i] };
        }
      }
    };
    return function (array) {
      var _o;
      if (!__isArray(array)) {
        throw new TypeError("Expected array to be an Array, got " + __typeof(array));
      }
      _o = __create(proto);
      _o.array = array;
      _o.index = -1;
      return _o;
    };
  }());
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
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __int = function (num) {
    if (typeof num !== "number") {
      throw new TypeError("Expected a number, got " + __typeof(num));
    } else if (num % 1 !== 0) {
      throw new TypeError("Expected an integer, got " + num);
    } else {
      return num;
    }
  };
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function (_toString) {
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }(Object.prototype.toString));
  __iter = function (iterable) {
    if (iterable == null) {
      throw new TypeError("Expected iterable to be an Object, got " + __typeof(iterable));
    } else if (__isArray(iterable)) {
      return __arrayToIter(iterable);
    } else if (typeof iterable.iterator === "function") {
      return iterable.iterator();
    } else if (typeof iterable.next === "function") {
      return iterable;
    } else {
      throw new Error("Expected iterable to be an Array or an Object with an 'iterator' function or an Object with a 'next' function, got " + __typeof(iterable));
    }
  };
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
  __nonzero = function (num) {
    if (num === 0) {
      throw new RangeError("Expected non-zero, got " + num);
    } else {
      return num;
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
  __slice = Array.prototype.slice;
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
  describe("loops", function () {
    it("simple loop from 0 through 9", function () {
      var i, j;
      j = 0;
      for (i = 0; i < 10; ++i) {
        expect(i).to.equal(j);
        ++j;
      }
      return expect(j).to.equal(10);
    });
    it(
      "loop from 0 through 9 can be at the end of a function with a variable mutation. #82",
      function () {
        function f() {
          var i, j;
          j = 0;
          for (i = 0; i < 10; ++i) {
            expect(i).to.equal(j);
            ++j;
          }
        }
        return f();
      }
    );
    it("simple loop from 0 through 10, inclusive", function () {
      var i, j;
      j = 0;
      for (i = 0; i <= 10; ++i) {
        expect(i).to.equal(j);
        ++j;
      }
      return expect(j).to.equal(11);
    });
    it("simple loop from 0 through 8, evens only", function () {
      var i, j;
      j = 0;
      for (i = 0; i < 10; i += 2) {
        expect(i).to.equal(j);
        j += 2;
      }
      return expect(j).to.equal(10);
    });
    it(
      "simple loop from 0 through 10, evens only, inclusive",
      function () {
        var i, j;
        j = 0;
        for (i = 0; i <= 10; i += 2) {
          expect(i).to.equal(j);
          j += 2;
        }
        return expect(j).to.equal(12);
      }
    );
    it("backwards loop", function () {
      var i, j;
      j = 10;
      for (i = 10; i > 0; --i) {
        expect(i).to.equal(j);
        --j;
      }
      return expect(j).to.equal(0);
    });
    it("backwards loop, inclusive", function () {
      var i, j;
      j = 10;
      for (i = 10; i >= 0; --i) {
        expect(i).to.equal(j);
        --j;
      }
      return expect(j).to.equal(-1);
    });
    it("loop with else", function () {
      var hitElse, i, sum;
      sum = 0;
      for (i = 0; i < 10; ++i) {
        sum += i;
      }
      if (i === 0) {
        fail();
      }
      expect(sum).to.equal(45);
      hitElse = false;
      for (i = 10; i < 0; ++i) {
        fail();
      }
      if (i === 10) {
        hitElse = true;
      }
      return expect(hitElse).to.be["true"];
    });
    it("variable loop without step", function () {
      function testLoop(start, finish) {
        var count, i, j;
        j = start;
        count = 0;
        for (i = __num(start), __num(finish); i < finish; ++i) {
          expect(i).to.equal(j);
          j = __num(j) + 1;
          ++count;
        }
        return count;
      }
      expect(testLoop(0, 9)).to.equal(9);
      expect(testLoop(0, 10)).to.equal(10);
      return expect(testLoop(10, 0)).to.equal(0);
    });
    it("variable loop with step", function () {
      function testLoop(start, finish, step) {
        var count, i, j;
        j = start;
        count = 0;
        for (i = __num(start), __num(finish), __num(step); step > 0 ? i < finish : i > finish; i += +step) {
          expect(i).to.equal(j);
          j = __num(j) + __num(step);
          ++count;
        }
        return count;
      }
      expect(testLoop(0, 9, 1)).to.equal(9);
      expect(testLoop(0, 10, 1)).to.equal(10);
      expect(testLoop(10, 0, 1)).to.equal(0);
      expect(testLoop(0, 9, 2)).to.equal(5);
      expect(testLoop(0, 10, 2)).to.equal(5);
      expect(testLoop(0, 5, -1)).to.equal(0);
      return expect(testLoop(5, 0, -1)).to.equal(5);
    });
    it("loop variable start is only calculated once", function () {
      var i, j, start;
      start = runOnce(0);
      j = 0;
      for (i = __num(start()); i < 10; ++i) {
        expect(i).to.equal(j);
        ++j;
      }
      return expect(j).to.equal(10);
    });
    it("loop variable finish is only calculated once", function () {
      var _end, finish, i, j;
      finish = runOnce(10);
      j = 0;
      for (i = 0, _end = __num(finish()); i < _end; ++i) {
        expect(i).to.equal(j);
        ++j;
      }
      return expect(j).to.equal(10);
    });
    it("loop variable step is only calculated once", function () {
      var _step, i, j, step;
      step = runOnce(1);
      j = 0;
      for (i = 0, _step = __num(step()); _step > 0 ? i < 10 : i > 10; i += _step) {
        expect(i).to.equal(j);
        ++j;
      }
      return expect(j).to.equal(10);
    });
    it("loop variable step going backwards", function () {
      var _step, i, j, step;
      step = runOnce(-1);
      j = 10;
      for (i = 10, _step = __num(step()); _step > 0 ? i < 0 : i > 0; i += _step) {
        expect(i).to.equal(j);
        --j;
      }
      return expect(j).to.equal(0);
    });
    it("loop scope", function () {
      var _f, funcs, i;
      funcs = [];
      for (i = 0, _f = function (i) {
        return funcs.push(function () {
          return i * i;
        });
      }; i < 10; ++i) {
        _f.call(this, i);
      }
      expect(funcs[0]()).to.equal(0);
      expect(funcs[1]()).to.equal(1);
      expect(funcs[2]()).to.equal(4);
      expect(funcs[3]()).to.equal(9);
      return expect(funcs[9]()).to.equal(81);
    });
    it("loop scope using this", function () {
      var funcs, obj;
      function getFuncs() {
        var _f, funcs, i;
        funcs = [];
        for (i = 0, _f = function (i) {
          var _this;
          _this = this;
          return funcs.push(function () {
            return [_this, i * i];
          });
        }; i < 10; ++i) {
          _f.call(this, i);
        }
        return funcs;
      }
      obj = {};
      funcs = getFuncs.call(obj);
      expect(funcs[0]()).to.eql([obj, 0]);
      return expect(funcs[9]()).to.eql([obj, 81]);
    });
    it("multiple loops with same variables", function () {
      var i, sum;
      sum = 0;
      for (i = 1; i < 10; ++i) {
        sum += i;
      }
      expect(sum).to.equal(45);
      for (i = 9; i > 0; --i) {
        sum -= i;
      }
      return expect(sum).to.equal(0);
    });
    it("loop scope with multiple variables", function () {
      var _f, funcs, i;
      funcs = [];
      for (i = 0, _f = function (i) {
        var _f, j;
        for (j = 0, _f = function (j) {
          return funcs.push(function () {
            return i * j;
          });
        }; j < 10; ++j) {
          _f.call(this, j);
        }
      }; i < 10; ++i) {
        _f.call(this, i);
      }
      expect(funcs[0]()).to.equal(0);
      expect(funcs[45]()).to.equal(20);
      return expect(funcs[99]()).to.equal(81);
    });
    it("loop scope with same variable used multiple times", function () {
      var _f, funcs, i, sum;
      funcs = [];
      for (i = 0, _f = function (i) {
        return funcs.push(function () {
          return i * i;
        });
      }; i < 10; ++i) {
        _f.call(this, i);
      }
      sum = 0;
      for (i = 0; i < 100; ++i) {
        sum += i;
      }
      expect(sum).to.equal(4950);
      expect(funcs[0]()).to.equal(0);
      expect(funcs[1]()).to.equal(1);
      expect(funcs[2]()).to.equal(4);
      expect(funcs[3]()).to.equal(9);
      return expect(funcs[9]()).to.equal(81);
    });
    it("multiple loops with same variables nested", function () {
      var i, j, k, sum;
      sum = 0;
      for (i = 1; i < 10; ++i) {
        for (j = 1; j < i; ++j) {
          for (k = 1; k < j; ++k) {
            ++sum;
          }
        }
      }
      expect(sum).to.equal(84);
      for (k = 1; k < 10; ++k) {
        for (j = 1; j < k; ++j) {
          for (i = 1; i < j; ++i) {
            --sum;
          }
        }
      }
      return expect(sum).to.equal(0);
    });
    it("continue", function () {
      var count, i;
      count = 0;
      for (i = 0; i < 100; ++i) {
        if (i % 2 === 0) {
          continue;
        }
        ++count;
      }
      return expect(count).to.equal(50);
    });
    it("break", function () {
      var count, i;
      count = 0;
      for (i = 0; i < 100; ++i) {
        if (i === 50) {
          break;
        } else if (i > 50) {
          fail();
        }
        ++count;
      }
      return expect(count).to.equal(50);
    });
    it("while loop", function () {
      var i, sum;
      sum = 0;
      i = 0;
      while (i < 10) {
        sum += i;
        ++i;
      }
      return expect(sum).to.equal(45);
    });
    it("while loop with break", function () {
      var i, sum;
      sum = 0;
      i = 0;
      while (i < 10) {
        sum += i;
        if (sum > 10) {
          break;
        }
        ++i;
      }
      expect(sum).to.equal(15);
      return expect(i).to.equal(5);
    });
    it("while loop with continue", function () {
      var i, sum;
      sum = 0;
      i = 0;
      while (i < 10) {
        ++i;
        if (i % 2 === 0) {
          continue;
        }
        sum += i;
      }
      return expect(sum).to.equal(25);
    });
    it("while loop with else", function () {
      var _else, hitElse, i, sum;
      sum = 0;
      i = 0;
      _else = true;
      while (i < 10) {
        _else = false;
        sum += i;
        ++i;
      }
      if (_else) {
        fail();
      }
      expect(sum).to.equal(45);
      hitElse = false;
      _else = true;
      while (i < 10) {
        _else = false;
        fail();
      }
      if (_else) {
        hitElse = true;
      }
      return expect(hitElse).to.be["true"];
    });
    it("until loop", function () {
      var i, sum;
      sum = 0;
      i = 0;
      while (i <= 10) {
        sum += i;
        ++i;
      }
      return expect(sum).to.equal(55);
    });
    it("until loop with else", function () {
      var _else, hitElse, i, sum;
      sum = 0;
      i = 0;
      _else = true;
      while (i <= 10) {
        _else = false;
        sum += i;
        ++i;
      }
      if (_else) {
        fail();
      }
      expect(sum).to.equal(55);
      hitElse = false;
      _else = true;
      while (i <= 10) {
        _else = false;
        fail();
      }
      if (_else) {
        hitElse = true;
      }
      return expect(hitElse).to.be["true"];
    });
    it("while loop with step", function () {
      var i, sum;
      sum = 0;
      i = 0;
      for (; i < 10; ++i) {
        sum += i;
      }
      return expect(sum).to.equal(45);
    });
    it("while loop with step and else", function () {
      var _else, hitElse, i, sum;
      sum = 0;
      i = 0;
      _else = true;
      for (; i < 10; ++i) {
        _else = false;
        sum += i;
      }
      if (_else) {
        fail();
      }
      expect(sum).to.equal(45);
      hitElse = false;
      _else = true;
      for (; i < 10; fail()) {
        _else = false;
        fail();
      }
      if (_else) {
        hitElse = true;
      }
      return expect(hitElse).to.be["true"];
    });
    it("until loop with step", function () {
      var i, sum;
      sum = 0;
      i = 0;
      for (; i <= 10; ++i) {
        sum += i;
      }
      return expect(sum).to.equal(55);
    });
    it("until loop with step and else", function () {
      var _else, hitElse, i, sum;
      sum = 0;
      i = 0;
      _else = true;
      for (; i <= 10; ++i) {
        _else = false;
        sum += i;
      }
      if (_else) {
        fail();
      }
      expect(sum).to.equal(55);
      hitElse = false;
      _else = true;
      for (; i <= 10; fail()) {
        _else = false;
        fail();
      }
      if (_else) {
        hitElse = true;
      }
      return expect(hitElse).to.be["true"];
    });
    it("object iteration loop", function () {
      var k, keys, obj;
      keys = [];
      obj = { a: 1, b: 4, c: 9, d: 16 };
      for (k in obj) {
        if (__owns.call(obj, k)) {
          keys.push(k);
        }
      }
      keys.sort();
      return expect(keys).to.eql(["a", "b", "c", "d"]);
    });
    it("object iteration loop with value", function () {
      var data, k, obj, v;
      data = [];
      obj = { a: 1, b: 4, c: 9, d: 16 };
      for (k in obj) {
        if (__owns.call(obj, k)) {
          v = obj[k];
          data.push([k, v]);
        }
      }
      data.sort(function (a, b) {
        return __cmp(a[0], b[0]);
      });
      return expect(data).to.eql([
        ["a", 1],
        ["b", 4],
        ["c", 9],
        ["d", 16]
      ]);
    });
    it("object iteration loop with value and index", function () {
      var data, i, j, k, obj, v;
      data = [];
      obj = { a: 1, b: 4, c: 9, d: 16 };
      j = 0;
      i = -1;
      for (k in obj) {
        if (__owns.call(obj, k)) {
          ++i;
          v = obj[k];
          data.push([k, v]);
          expect(i).to.equal(j);
          ++j;
        }
      }
      expect(4).to.equal(j);
      data.sort(function (a, b) {
        return __cmp(a[0], b[0]);
      });
      return expect(data).to.eql([
        ["a", 1],
        ["b", 4],
        ["c", 9],
        ["d", 16]
      ]);
    });
    it("object iteration loop with else", function () {
      var _else, hitElse, k, keys, obj, other;
      keys = [];
      obj = { a: 1, b: 4, c: 9, d: 16 };
      _else = true;
      for (k in obj) {
        if (__owns.call(obj, k)) {
          _else = false;
          keys.push(k);
        }
      }
      if (_else) {
        fail();
      }
      keys.sort();
      expect(keys).to.eql(["a", "b", "c", "d"]);
      hitElse = false;
      other = {};
      _else = true;
      for (k in other) {
        if (__owns.call(other, k)) {
          _else = false;
          fail();
        }
      }
      if (_else) {
        hitElse = true;
      }
      return expect(hitElse).to.be["true"];
    });
    it("object iteration loop with literal object", function () {
      var _obj, k, keys;
      keys = [];
      _obj = { a: 1, b: 4, c: 9, d: 16 };
      for (k in _obj) {
        if (__owns.call(_obj, k)) {
          keys.push(k);
        }
      }
      keys.sort();
      return expect(keys).to.eql(["a", "b", "c", "d"]);
    });
    it(
      "object iteration loop with value and literal object",
      function () {
        var _obj, data, k, v;
        data = [];
        _obj = { a: 1, b: 4, c: 9, d: 16 };
        for (k in _obj) {
          if (__owns.call(_obj, k)) {
            v = _obj[k];
            data.push([k, v]);
          }
        }
        data.sort(function (a, b) {
          return __cmp(a[0], b[0]);
        });
        return expect(data).to.eql([
          ["a", 1],
          ["b", 4],
          ["c", 9],
          ["d", 16]
        ]);
      }
    );
    it(
      "object iteration loop with value and index and literal object",
      function () {
        var _obj, data, i, j, k, v;
        data = [];
        j = 0;
        _obj = { a: 1, b: 4, c: 9, d: 16 };
        i = -1;
        for (k in _obj) {
          if (__owns.call(_obj, k)) {
            ++i;
            v = _obj[k];
            data.push([k, v]);
            expect(i).to.equal(j);
            ++j;
          }
        }
        expect(4).to.equal(j);
        data.sort(function (a, b) {
          return __cmp(a[0], b[0]);
        });
        return expect(data).to.eql([
          ["a", 1],
          ["b", 4],
          ["c", 9],
          ["d", 16]
        ]);
      }
    );
    it("object iteration loop with literal object", function () {
      var _else, _obj, hitElse, k, keys;
      keys = [];
      _obj = { a: 1, b: 4, c: 9, d: 16 };
      _else = true;
      for (k in _obj) {
        if (__owns.call(_obj, k)) {
          _else = false;
          keys.push(k);
        }
      }
      if (_else) {
        fail();
      }
      keys.sort();
      expect(keys).to.eql(["a", "b", "c", "d"]);
      hitElse = false;
      _obj = {};
      _else = true;
      for (k in _obj) {
        if (__owns.call(_obj, k)) {
          _else = false;
          fail();
        }
      }
      if (_else) {
        hitElse = true;
      }
      return expect(hitElse).to.be["true"];
    });
    it("object iteration loop only accesses object once", function () {
      var _obj, k, keys, obj;
      keys = [];
      obj = runOnce({ a: 1, b: 4, c: 9, d: 16 });
      _obj = obj();
      for (k in _obj) {
        if (__owns.call(_obj, k)) {
          keys.push(k);
        }
      }
      keys.sort();
      return expect(keys).to.eql(["a", "b", "c", "d"]);
    });
    it(
      "object iteration loop with value only accesses object once",
      function () {
        var _obj, data, k, obj, v;
        data = [];
        obj = runOnce({ a: 1, b: 4, c: 9, d: 16 });
        _obj = obj();
        for (k in _obj) {
          if (__owns.call(_obj, k)) {
            v = _obj[k];
            data.push([k, v]);
          }
        }
        data.sort(function (a, b) {
          return __cmp(a[0], b[0]);
        });
        return expect(data).to.eql([
          ["a", 1],
          ["b", 4],
          ["c", 9],
          ["d", 16]
        ]);
      }
    );
    it(
      "object iteration loop with value and index only accesses object once",
      function () {
        var _obj, data, i, j, k, obj, v;
        data = [];
        obj = runOnce({ a: 1, b: 4, c: 9, d: 16 });
        j = 0;
        _obj = obj();
        i = -1;
        for (k in _obj) {
          if (__owns.call(_obj, k)) {
            ++i;
            v = _obj[k];
            data.push([k, v]);
            expect(i).to.equal(j);
            ++j;
          }
        }
        expect(4).to.equal(j);
        data.sort(function (a, b) {
          return __cmp(a[0], b[0]);
        });
        return expect(data).to.eql([
          ["a", 1],
          ["b", 4],
          ["c", 9],
          ["d", 16]
        ]);
      }
    );
    it("object iteration loop with inheritance", function () {
      var k, keys;
      function Parent() {
        this.a = 1;
        this.b = 4;
      }
      Parent.prototype.c = 9;
      Parent.prototype.d = 16;
      keys = [];
      for (k in new Parent()) {
        keys.push(k);
      }
      keys.sort();
      return expect(keys).to.eql(["a", "b", "c", "d"]);
    });
    it("object iteration loop with inheritance and value", function () {
      var _obj, data, k, v;
      function Parent() {
        this.a = 1;
        this.b = 4;
      }
      Parent.prototype.c = 9;
      Parent.prototype.d = 16;
      data = [];
      _obj = new Parent();
      for (k in _obj) {
        v = _obj[k];
        data.push([k, v]);
      }
      data.sort(function (a, b) {
        return __cmp(a[0], b[0]);
      });
      return expect(data).to.eql([
        ["a", 1],
        ["b", 4],
        ["c", 9],
        ["d", 16]
      ]);
    });
    it(
      "object iteration loop with inheritance and value and index",
      function () {
        var _obj, data, i, j, k, v;
        function Parent() {
          this.a = 1;
          this.b = 4;
        }
        Parent.prototype.c = 9;
        Parent.prototype.d = 16;
        data = [];
        j = 0;
        _obj = new Parent();
        i = -1;
        for (k in _obj) {
          ++i;
          v = _obj[k];
          data.push([k, v]);
          expect(i).to.equal(j);
          ++j;
        }
        expect(j).to.equal(4);
        data.sort(function (a, b) {
          return __cmp(a[0], b[0]);
        });
        return expect(data).to.eql([
          ["a", 1],
          ["b", 4],
          ["c", 9],
          ["d", 16]
        ]);
      }
    );
    it("object iteration loop without inheritance", function () {
      var _obj, k, keys;
      function Parent() {
        this.a = 1;
        this.b = 4;
      }
      Parent.prototype.c = 9;
      Parent.prototype.d = 16;
      keys = [];
      _obj = new Parent();
      for (k in _obj) {
        if (__owns.call(_obj, k)) {
          keys.push(k);
        }
      }
      keys.sort();
      return expect(keys).to.eql(["a", "b"]);
    });
    it(
      "object iteration loop without inheritance and value",
      function () {
        var _obj, data, k, v;
        function Parent() {
          this.a = 1;
          this.b = 4;
        }
        Parent.prototype.c = 9;
        Parent.prototype.d = 16;
        data = [];
        _obj = new Parent();
        for (k in _obj) {
          if (__owns.call(_obj, k)) {
            v = _obj[k];
            data.push([k, v]);
          }
        }
        data.sort(function (a, b) {
          return __cmp(a[0], b[0]);
        });
        return expect(data).to.eql([
          ["a", 1],
          ["b", 4]
        ]);
      }
    );
    it(
      "object iteration loop without inheritance and value and index",
      function () {
        var _obj, data, i, j, k, v;
        function Parent() {
          this.a = 1;
          this.b = 4;
        }
        Parent.prototype.c = 9;
        Parent.prototype.d = 16;
        data = [];
        j = 0;
        _obj = new Parent();
        i = -1;
        for (k in _obj) {
          if (__owns.call(_obj, k)) {
            ++i;
            v = _obj[k];
            data.push([k, v]);
            expect(i).to.equal(j);
            ++j;
          }
        }
        expect(j).to.equal(2);
        data.sort(function (a, b) {
          return __cmp(a[0], b[0]);
        });
        return expect(data).to.eql([
          ["a", 1],
          ["b", 4]
        ]);
      }
    );
    it("iteration loop", function () {
      var _i, _len, arr, sum, value;
      sum = 0;
      arr = [1, 4, 9, 16];
      for (_i = 0, _len = arr.length; _i < _len; ++_i) {
        value = arr[_i];
        sum += __num(value);
      }
      return expect(sum).to.equal(30);
    });
    it("iteration loop with else", function () {
      var _i, _len, arr, hitElse, otherArr, sum, value;
      sum = 0;
      arr = [1, 4, 9, 16];
      for (_i = 0, _len = arr.length; _i < _len; ++_i) {
        value = arr[_i];
        sum += __num(value);
      }
      if (_i === 0) {
        fail();
      }
      expect(sum).to.equal(30);
      hitElse = false;
      otherArr = [];
      for (_i = 0, _len = otherArr.length; _i < _len; ++_i) {
        value = otherArr[_i];
        fail();
      }
      if (_i === 0) {
        hitElse = true;
      }
      return expect(hitElse).to.be["true"];
    });
    it("iteration loop with literal array", function () {
      var _arr, _i, _len, sum, value;
      sum = 0;
      for (_arr = [1, 4, 9, 16], _i = 0, _len = _arr.length; _i < _len; ++_i) {
        value = _arr[_i];
        sum += __num(value);
      }
      return expect(sum).to.equal(30);
    });
    it("iteration loop with literal array and else", function () {
      var _arr, _i, _len, hitElse, sum, value;
      sum = 0;
      for (_arr = [1, 4, 9, 16], _i = 0, _len = _arr.length; _i < _len; ++_i) {
        value = _arr[_i];
        sum += __num(value);
      }
      if (_i === 0) {
        fail();
      }
      expect(sum).to.equal(30);
      hitElse = false;
      for (_arr = [], _i = 0, _len = _arr.length; _i < _len; ++_i) {
        value = _arr[_i];
        fail();
      }
      if (_i === 0) {
        hitElse = true;
      }
      return expect(hitElse).to.be["true"];
    });
    it("iteration loop only calculates array once", function () {
      var _arr, _i, _len, arr, sum, value;
      arr = runOnce([1, 4, 9, 16]);
      sum = 0;
      for (_arr = __toArray(arr()), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        value = _arr[_i];
        sum += __num(value);
      }
      return expect(sum).to.equal(30);
    });
    it("iteration loop with index", function () {
      var _len, arr, index, j, sum, value;
      sum = 0;
      j = 0;
      arr = [1, 4, 9, 16];
      for (index = 0, _len = arr.length; index < _len; ++index) {
        value = arr[index];
        sum += __num(value);
        expect(index).to.equal(j);
        ++j;
      }
      return expect(sum).to.equal(30);
    });
    it("iteration loop with index and literal array", function () {
      var _arr, _len, index, j, sum, value;
      sum = 0;
      j = 0;
      for (_arr = [1, 4, 9, 16], index = 0, _len = _arr.length; index < _len; ++index) {
        value = _arr[index];
        sum += __num(value);
        expect(index).to.equal(j);
        ++j;
      }
      return expect(sum).to.equal(30);
    });
    it(
      "iteration loop with index only calculates array once",
      function () {
        var _arr, _len, arr, index, j, sum, value;
        arr = runOnce([1, 4, 9, 16]);
        sum = 0;
        j = 0;
        for (_arr = __toArray(arr()), index = 0, _len = _arr.length; index < _len; ++index) {
          value = _arr[index];
          sum += __num(value);
          expect(index).to.equal(j);
          ++j;
        }
        return expect(sum).to.equal(30);
      }
    );
    it("object iteration loop scope", function () {
      var _i, _len, _obj, factory, k, sum, valueFactories;
      valueFactories = [];
      _obj = { a: 1, b: 2, c: 3, d: 4 };
      function _f(k, v) {
        return valueFactories.push(function () {
          return v;
        });
      }
      for (k in _obj) {
        if (__owns.call(_obj, k)) {
          _f.call(this, k, _obj[k]);
        }
      }
      sum = 0;
      for (_i = 0, _len = valueFactories.length; _i < _len; ++_i) {
        factory = valueFactories[_i];
        sum += __num(factory());
      }
      return expect(sum).to.equal(10);
    });
    it("array iteration loop scope", function () {
      var _arr, _f, _i, _len, factory, sum, valueFactories;
      valueFactories = [];
      for (_arr = [1, 4, 9, 16], _i = 0, _len = _arr.length, _f = function (v) {
        return valueFactories.push(function () {
          return v;
        });
      }; _i < _len; ++_i) {
        _f.call(this, _arr[_i]);
      }
      sum = 0;
      for (_i = 0, _len = valueFactories.length; _i < _len; ++_i) {
        factory = valueFactories[_i];
        sum += __num(factory());
      }
      return expect(sum).to.equal(30);
    });
    it("iteration loop scope", function () {
      var _arr, _f, _len, funcs, i;
      funcs = [];
      for (_arr = ["alpha", "bravo", "charlie"], i = 0, _len = _arr.length, _f = function (alpha, i) {
        return funcs.push(function () {
          return [i, alpha];
        });
      }; i < _len; ++i) {
        _f.call(this, _arr[i], i);
      }
      expect(funcs[0]()).to.eql([0, "alpha"]);
      expect(funcs[1]()).to.eql([1, "bravo"]);
      return expect(funcs[2]()).to.eql([2, "charlie"]);
    });
    it("iteration loop scope with multiple", function () {
      var _arr, _f, _len, funcs, i;
      funcs = [];
      for (_arr = ["alpha", "bravo", "charlie"], i = 0, _len = _arr.length, _f = function (alpha, i) {
        var _arr, _f, _len, j;
        for (_arr = ["delta", "echo", "foxtrot"], j = 0, _len = _arr.length, _f = function (bravo, j) {
          return funcs.push(function () {
            return [i, alpha, j, bravo];
          });
        }; j < _len; ++j) {
          _f.call(this, _arr[j], j);
        }
      }; i < _len; ++i) {
        _f.call(this, _arr[i], i);
      }
      expect(funcs[0]()).to.eql([0, "alpha", 0, "delta"]);
      expect(funcs[4]()).to.eql([1, "bravo", 1, "echo"]);
      return expect(funcs[8]()).to.eql([2, "charlie", 2, "foxtrot"]);
    });
    it("object iteration loop scope", function () {
      var _i, _len, _obj, func, funcs, i, items, k;
      funcs = [];
      _obj = { alpha: "one", bravo: "two", charlie: "three" };
      function _f(k, v, i) {
        return funcs.push(function () {
          return [k, v, i];
        });
      }
      i = -1;
      for (k in _obj) {
        if (__owns.call(_obj, k)) {
          ++i;
          _f.call(this, k, _obj[k], i);
        }
      }
      items = [];
      for (_i = 0, _len = funcs.length; _i < _len; ++_i) {
        func = funcs[_i];
        items.push(func());
      }
      expect(items[0].pop()).to.equal(0);
      expect(items[1].pop()).to.equal(1);
      expect(items[2].pop()).to.equal(2);
      items.sort(function (a, b) {
        return __cmp(a[0], b[0]);
      });
      expect(items[0]).to.eql(["alpha", "one"]);
      expect(items[1]).to.eql(["bravo", "two"]);
      return expect(items[2]).to.eql(["charlie", "three"]);
    });
    it("object iteration loop scope with multiple", function () {
      var _i, _len, _obj, func, funcs, i, items, k;
      funcs = [];
      _obj = { alpha: "one", bravo: "two", charlie: "three" };
      function _f(k, v, i) {
        var _obj, j, k2;
        _obj = { delta: "four", echo: "five", foxtrot: "six" };
        function _f(k2, v2, j) {
          return funcs.push(function () {
            return [
              k,
              k2,
              v,
              v2,
              i,
              j
            ];
          });
        }
        j = -1;
        for (k2 in _obj) {
          if (__owns.call(_obj, k2)) {
            ++j;
            _f.call(this, k2, _obj[k2], j);
          }
        }
      }
      i = -1;
      for (k in _obj) {
        if (__owns.call(_obj, k)) {
          ++i;
          _f.call(this, k, _obj[k], i);
        }
      }
      items = [];
      for (_i = 0, _len = funcs.length; _i < _len; ++_i) {
        func = funcs[_i];
        items.push(func());
      }
      expect(items[0].splice(4, 2)).to.eql([0, 0]);
      expect(items[4].splice(4, 2)).to.eql([1, 1]);
      expect(items[8].splice(4, 2)).to.eql([2, 2]);
      items.sort(function (a, b) {
        return __cmp(a[0], b[0]) || __cmp(a[1], b[1]);
      });
      expect(items[0]).to.eql(["alpha", "delta", "one", "four"]);
      expect(items[4]).to.eql(["bravo", "echo", "two", "five"]);
      return expect(items[8]).to.eql(["charlie", "foxtrot", "three", "six"]);
    });
    it("single-line range loop", function () {
      var i, sum;
      sum = 0;
      for (i = 1; i < 10; ++i) {
        sum += i;
      }
      return expect(sum).to.equal(45);
    });
    it("Simple array comprehension", function () {
      var _arr, _arr2, _i, _len, n, nums;
      _arr = [];
      for (_arr2 = [
        1,
        2,
        3,
        4,
        5
      ], _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        n = _arr2[_i];
        _arr.push(__num(n) * __num(n));
      }
      nums = _arr;
      return expect(nums).to.eql([
        1,
        4,
        9,
        16,
        25
      ]);
    });
    it("Array comprehension with if", function () {
      var _arr, _arr2, _i, _len, n, nums;
      _arr = [];
      for (_arr2 = [
        1,
        2,
        3,
        4,
        5
      ], _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        n = _arr2[_i];
        if (__num(n) % 2 === 0) {
          _arr.push(__num(n) * __num(n));
        }
      }
      nums = _arr;
      return expect(nums).to.eql([4, 16]);
    });
    it("Range comprehension", function () {
      var _arr, _i, _len, i, j, num, nums;
      _arr = [];
      for (i = 1; i < 100; ++i) {
        _arr.push(i);
      }
      nums = _arr;
      j = 0;
      for (_i = 0, _len = nums.length; _i < _len; ++_i) {
        num = nums[_i];
        ++j;
        expect(j).to.equal(num);
      }
      return expect(j).to.equal(99);
    });
    it("Object comprehension", function () {
      var _arr, k, keys, obj;
      obj = { alpha: 1, bravo: 2, charlie: 3 };
      _arr = [];
      for (k in obj) {
        if (__owns.call(obj, k)) {
          _arr.push(k);
        }
      }
      keys = _arr;
      keys.sort();
      return expect(keys).to.eql(["alpha", "bravo", "charlie"]);
    });
    it("For-some in range", function () {
      var i;
      i = 0;
      expect((function () {
        var _some, x;
        _some = false;
        for (x = 1; x < 10; ++x) {
          ++i;
          expect(x).to.equal(i);
          if (x === 4) {
            _some = true;
            break;
          }
        }
        return _some;
      }())).to.be["true"];
      expect(i).to.equal(4);
      expect((function () {
        var _some, x;
        _some = false;
        for (x = 1; x < 10; ++x) {
          if (x > 10) {
            _some = true;
            break;
          }
        }
        return _some;
      }())).to.be["false"];
      return expect(function () {
        return gorilla.compileSync("let y = 0\nfor some x in 1 til 10\n  true\nelse\n  throw Error()");
      }).throws(gorilla.MacroError, /Cannot use a for loop with an else.*5:\d+/);
    });
    it("For-some in range as an if test", function () {
      if ((function () {
        var _some, x;
        _some = false;
        for (x = 0; x < 10; ++x) {
          if (x === 11) {
            _some = true;
            break;
          }
        }
        return _some;
      }())) {
        throw new Error();
      }
      if ((function () {
        var _some, x;
        _some = false;
        for (x = 0; x < 10; ++x) {
          if (x === 4) {
            _some = true;
            break;
          }
        }
        return !_some;
      }())) {
        throw new Error();
      }
    });
    it("For-every in range", function () {
      var i;
      i = 0;
      expect((function () {
        var _every, x;
        _every = true;
        for (x = 1; x < 10; ++x) {
          ++i;
          expect(x).to.equal(i);
          if (x > 4) {
            _every = false;
            break;
          }
        }
        return _every;
      }())).to.be["false"];
      expect(i).to.equal(5);
      expect((function () {
        var _every, x;
        _every = true;
        for (x = 1; x < 10; ++x) {
          if (x > 10) {
            _every = false;
            break;
          }
        }
        return _every;
      }())).to.be["true"];
      return expect(function () {
        return gorilla.compileSync("let y = 0\nfor every x in 1 til 10\n  true\nelse\n  throw Error()");
      }).throws(gorilla.MacroError, /Cannot use a for loop with an else.*5:\d+/);
    });
    it("For-every in range as an if test", function () {
      if ((function () {
        var _every, x;
        _every = true;
        for (x = 0; x < 10; ++x) {
          if (x >= 5) {
            _every = false;
            break;
          }
        }
        return _every;
      }())) {
        throw new Error();
      }
      if ((function () {
        var _every, x;
        _every = true;
        for (x = 0; x < 10; ++x) {
          if (x >= 10) {
            _every = false;
            break;
          }
        }
        return !_every;
      }())) {
        throw new Error();
      }
    });
    it("For-first in range", function () {
      expect((function () {
        var x;
        for (x = 1; x < 10; ++x) {
          if (x > 5) {
            return x * x;
          }
        }
      }())).to.equal(36);
      return expect((function () {
        var x;
        for (x = 1; x < 10; ++x) {
          if (x > 10) {
            return x * x;
          }
        }
        return 1000000;
      }())).to.equal(1000000);
    });
    it("For-filter in range", function () {
      var _arr, arr, i;
      _arr = [];
      for (i = 1; i < 10; ++i) {
        if (i % 2 !== 0) {
          _arr.push(i);
        }
      }
      arr = _arr;
      expect(arr).to.eql([
        1,
        3,
        5,
        7,
        9
      ]);
      return expect(function () {
        return gorilla.compileSync("let y = 0\nfor filter i in 1 til 10\n  true\nelse\n  throw Error()");
      }).throws(gorilla.MacroError, /Cannot use a for loop with an else.*5:\d+/);
    });
    it("For-reduce in range", function () {
      expect((function () {
        var i, sum;
        sum = 0;
        for (i = 1; i < 10; ++i) {
          sum = sum + i;
        }
        return sum;
      }())).to.equal(45);
      return expect(function () {
        return gorilla.compileSync("let y = 0\nfor reduce i in 1 til 10, sum = 0\n  sum + i\nelse\n  throw Error()");
      }).throws(gorilla.ParserError, /4:1/);
    });
    it("For-some in array", function () {
      expect((function () {
        var _arr, _i, _len, _some, x;
        _some = false;
        for (_arr = [
          function () {
            return 1;
          },
          function () {
            return 2;
          },
          fail
        ], _i = 0, _len = _arr.length; _i < _len; ++_i) {
          x = _arr[_i];
          if (x() === 2) {
            _some = true;
            break;
          }
        }
        return _some;
      }())).to.be["true"];
      expect((function () {
        var _arr, _i, _len, _some, x;
        _some = false;
        for (_arr = [
          function () {
            return 1;
          },
          function () {
            return 2;
          },
          function () {
            return 3;
          }
        ], _i = 0, _len = _arr.length; _i < _len; ++_i) {
          x = _arr[_i];
          if (x() === 4) {
            _some = true;
            break;
          }
        }
        return _some;
      }())).to.be["false"];
      return expect(function () {
        return gorilla.compileSync("let y = 0\nfor some x in [1, 2]\n  true\nelse\n  throw Error()");
      }).throws(gorilla.MacroError, /Cannot use a for loop with an else.*5:\d+/);
    });
    it("For-every in array", function () {
      expect((function () {
        var _arr, _every, _i, _len, x;
        _every = true;
        for (_arr = [
          function () {
            return 1;
          },
          function () {
            return 2;
          },
          fail
        ], _i = 0, _len = _arr.length; _i < _len; ++_i) {
          x = _arr[_i];
          if (__num(x()) >= 2) {
            _every = false;
            break;
          }
        }
        return _every;
      }())).to.be["false"];
      expect((function () {
        var _arr, _every, _i, _len, x;
        _every = true;
        for (_arr = [
          function () {
            return 1;
          },
          function () {
            return 2;
          },
          function () {
            return 3;
          }
        ], _i = 0, _len = _arr.length; _i < _len; ++_i) {
          x = _arr[_i];
          if (__num(x()) >= 4) {
            _every = false;
            break;
          }
        }
        return _every;
      }())).to.be["true"];
      return expect(function () {
        return gorilla.compileSync("let y = 0\nfor every x in [1, 2]\n  true\nelse\n  throw Error()");
      }).throws(gorilla.MacroError, /Cannot use a for loop with an else.*5:\d+/);
    });
    it("For-first in array", function () {
      expect((function () {
        var _arr, _i, _len, _ref, value, x;
        for (_arr = [
          function () {
            return 1;
          },
          function () {
            return 2;
          },
          fail
        ], _i = 0, _len = _arr.length; _i < _len; ++_i) {
          x = _arr[_i];
          value = x();
          if (__num(value) > 1) {
            return (_ref = __num(value)) * _ref;
          }
        }
      }())).to.equal(4);
      return expect((function () {
        var _arr, _i, _len, _ref, value, x;
        for (_arr = [
          function () {
            return 1;
          },
          function () {
            return 2;
          },
          function () {
            return 3;
          }
        ], _i = 0, _len = _arr.length; _i < _len; ++_i) {
          x = _arr[_i];
          value = x();
          if (__num(value) > 3) {
            return (_ref = __num(value)) * _ref;
          }
        }
        return 1000000;
      }())).to.equal(1000000);
    });
    it("For-filter in array", function () {
      var _arr, _arr2, _i, _len, arr, x;
      _arr = [];
      for (_arr2 = [
        1,
        4,
        9,
        16,
        25,
        36
      ], _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        x = _arr2[_i];
        if (__num(x) % 2 === 0) {
          _arr.push(x);
        }
      }
      arr = _arr;
      expect(arr).to.eql([4, 16, 36]);
      return expect(function () {
        return gorilla.compileSync("let y = 0\nfor filter x in [1, 4, 9, 16, 25, 36]\n  true\nelse\n  throw Error()");
      }).throws(gorilla.MacroError, /Cannot use a for loop with an else.*5:\d+/);
    });
    it("For-reduce in array", function () {
      expect((function () {
        var _arr, _i, _len, i, sum;
        sum = 0;
        for (_arr = [1, 2, 3, 4], _i = 0, _len = _arr.length; _i < _len; ++_i) {
          i = _arr[_i];
          sum = sum + __num(i);
        }
        return sum;
      }())).to.equal(10);
      return expect(function () {
        return gorilla.compileSync("let y = 0\nfor reduce i in [1, 2, 3, 4], sum = 0\n  sum + i\nelse\n  throw Error()");
      }).throws(gorilla.ParserError, /4:1/);
    });
    it("For-some of object", function () {
      expect((function () {
        var _obj, k, v;
        _obj = { a: 1, b: 2, c: 3 };
        for (k in _obj) {
          if (__owns.call(_obj, k)) {
            v = _obj[k];
            if (v === 2) {
              return true;
            }
          }
        }
        return false;
      }())).to.be["true"];
      expect((function () {
        var _obj, k, v;
        _obj = { a: 1, b: 2, c: 3 };
        for (k in _obj) {
          if (__owns.call(_obj, k)) {
            v = _obj[k];
            if (v === 4) {
              return true;
            }
          }
        }
        return false;
      }())).to.be["false"];
      return expect(function () {
        return gorilla.compileSync("let y = 0\nfor some k, v of {a:1, b:2, c:3}\n  true\nelse\n  throw Error()");
      }).throws(gorilla.MacroError, /Cannot use a for loop with an else.*5:\d+/);
    });
    it("For-every of object", function () {
      expect((function () {
        var _obj, k, v;
        _obj = { a: 1, b: 2, c: 3 };
        for (k in _obj) {
          if (__owns.call(_obj, k)) {
            v = _obj[k];
            if (__num(v) > 2) {
              return false;
            }
          }
        }
        return true;
      }())).to.be["false"];
      expect((function () {
        var _obj, k, v;
        _obj = { a: 1, b: 2, c: 3 };
        for (k in _obj) {
          if (__owns.call(_obj, k)) {
            v = _obj[k];
            if (__num(v) >= 4) {
              return false;
            }
          }
        }
        return true;
      }())).to.be["true"];
      return expect(function () {
        return gorilla.compileSync("let y = 0\nfor every k, v of {a:1, b:2, c:3}\n  true\nelse\n  throw Error()");
      }).throws(gorilla.MacroError, /Cannot use a for loop with an else.*5:\d+/);
    });
    it("For-first of object", function () {
      expect((function () {
        var _obj, _ref, k, v;
        _obj = { a: 1, b: 2, c: 3 };
        for (k in _obj) {
          if (__owns.call(_obj, k)) {
            v = _obj[k];
            if (__num(v) > 2) {
              return (_ref = __num(v)) * _ref;
            }
          }
        }
      }())).to.equal(9);
      return expect((function () {
        var _else, _obj, _ref, k, v;
        _obj = { a: 1, b: 2, c: 3 };
        _else = true;
        for (k in _obj) {
          if (__owns.call(_obj, k)) {
            _else = false;
            v = _obj[k];
            if (__num(v) > 3) {
              return (_ref = __num(v)) * _ref;
            }
          }
        }
        return 1000000;
      }())).to.equal(1000000);
    });
    it("For-reduce of object", function () {
      expect((function () {
        var _obj, k, sum, v;
        sum = 0;
        _obj = { a: 1, b: 2, c: 3 };
        for (k in _obj) {
          if (__owns.call(_obj, k)) {
            v = _obj[k];
            sum = sum + __num(v);
          }
        }
        return sum;
      }())).to.equal(6);
      return expect(function () {
        return gorilla.compileSync("let y = 0\nfor reduce k, v of {a:1, b:2, c:3}, sum = 0\n  sum + v\nelse\n  throw Error()");
      }).throws(gorilla.ParserError, /4:1/);
    });
    it("While-some", function () {
      var i;
      i = 0;
      expect((function () {
        var _some;
        _some = false;
        for (; i < 10; ++i) {
          if (i === 4) {
            _some = true;
            break;
          }
        }
        return _some;
      }())).to.be["true"];
      expect(i).to.equal(4);
      i = 0;
      expect((function () {
        var _some;
        _some = false;
        for (; i < 10; ++i) {
          if (i > 10) {
            _some = true;
            break;
          }
        }
        return _some;
      }())).to.be["false"];
      return expect(function () {
        return gorilla.compileSync("let mutable i = 0\nwhile some i < 10, i += 1\n  true\nelse\n  throw Error()");
      }).throws(gorilla.MacroError, /Cannot use a for loop with an else.*5:\d+/);
    });
    it("While-every", function () {
      var i;
      i = 0;
      expect((function () {
        var _every;
        _every = true;
        for (; i < 10; ++i) {
          if (i > 4) {
            _every = false;
            break;
          }
        }
        return _every;
      }())).to.be["false"];
      expect(i).to.equal(5);
      i = 0;
      expect((function () {
        var _every;
        _every = true;
        for (; i < 10; ++i) {
          if (i > 10) {
            _every = false;
            break;
          }
        }
        return _every;
      }())).to.be["true"];
      return expect(function () {
        return gorilla.compileSync("let mutable i = 0\nwhile every i < 10, i += 1\n  true\nelse\n  throw Error()");
      }).throws(gorilla.MacroError, /Cannot use a for loop with an else.*5:\d+/);
    });
    it("While-first", function () {
      var i;
      i = 0;
      expect((function () {
        for (; i < 10; ++i) {
          if (i > 5) {
            return i * i;
          }
        }
      }())).to.equal(36);
      i = 0;
      return expect((function () {
        for (; i < 10; ++i) {
          if (i > 10) {
            return i * i;
          }
        }
        return 1000000;
      }())).to.equal(1000000);
    });
    it("While-reduce", function () {
      var i;
      i = 0;
      expect((function () {
        var sum;
        sum = 0;
        for (; i < 10; ++i) {
          sum = sum + i;
        }
        return sum;
      }())).to.equal(45);
      return expect(function () {
        return gorilla.compileSync("let mutable i = 0\nwhile reduce i < 10, i += 1, sum = 0\n  sum + i\nelse\n  throw Error()");
      }).throws(gorilla.ParserError, /4:1/);
    });
    it("Variable inside loop should be reset to undefined", function () {
      var i, value;
      for (i = 1; i < 10; ++i) {
        value = void 0;
        if (i === 5) {
          value = "other";
        } else {
          expect(value).to.equal(void 0);
        }
      }
    });
    it("Variable outside loop should be reset to undefined", function () {
      var i, value;
      for (i = 1; i < 10; ++i) {
        value = void 0;
        if (i === 5) {
          value = "other";
        } else {
          expect(value).to.equal(void 0);
        }
      }
      return expect(value).to.equal(void 0);
    });
    it(
      "Variable outside loop should be expected value, even after setting to undefined",
      function () {
        var i, value;
        for (i = 1; i < 10; ++i) {
          if (i === 5) {
            value = "other";
            break;
          } else {
            expect(value).to.equal(void 0);
          }
        }
        expect(value).to.equal("other");
        value = void 0;
        return expect(value).to.equal(void 0);
      }
    );
    it(
      "a simple for loop without a return does not return an array",
      function () {
        function fun() {
          var i, x;
          x = 0;
          for (i = 1; i < 10; ++i);
        }
        return expect(fun()).to.equal(void 0);
      }
    );
    it("for loop in string", function () {
      var _len, array, i, item, j;
      array = "alpha".split("");
      j = 0;
      for (i = 0, _len = 5; i < _len; ++i) {
        item = "alpha".charAt(i);
        expect(i).to.equal(j);
        expect(item).to.equal(array[i]);
        ++j;
      }
      return expect(j).to.equal(5);
    });
    it("loop up til Infinity", function () {
      var i, j;
      j = 0;
      for (i = 0; ; ++i) {
        expect(i).to.equal(j);
        if (i === 10) {
          break;
        }
        ++j;
      }
      return expect(j).to.equal(10);
    });
    it("loop down til Infinity", function () {
      var i;
      for (i = 0; i > 1/0; --i) {
        fail();
      }
    });
    it("loop down til -Infinity", function () {
      var i, j;
      j = 0;
      for (i = 0; ; --i) {
        expect(i).to.equal(j);
        if (i === -10) {
          break;
        }
        --j;
      }
      return expect(j).to.equal(-10);
    });
    it("loop down til Infinity", function () {
      var i;
      for (i = 0; i > 1/0; --i) {
        fail();
      }
    });
    it("loop up til -Infinity", function () {
      var i;
      for (i = 0; i < -1/0; ++i) {
        fail();
      }
    });
    function arrayToIterator(array) {
      return {
        iterator: function () {
          return this;
        },
        next: function () {
          var element;
          if (!__lt(this.index, this.array.length)) {
            return { done: true, value: void 0 };
          } else {
            element = this.array[this.index];
            this.index = __num(this.index) + 1;
            return { done: false, value: element };
          }
        },
        array: array,
        index: 0
      };
    }
    it("iterator loop", function () {
      var _item, _iter, sum, value;
      sum = 0;
      try {
        for (_iter = __iter(arrayToIterator([1, 4, 9, 16])); ; ) {
          _item = _iter.next();
          if (_item.done) {
            break;
          }
          value = _item.value;
          sum += __num(value);
        }
      } finally {
        try {
          _iter.close();
        } catch (_e) {}
      }
      return expect(sum).to.equal(30);
    });
    it("iterator loop with else", function () {
      var _else, _item, _iter, hitElse, sum, value;
      sum = 0;
      try {
        for (_iter = __iter(arrayToIterator([1, 4, 9, 16])), _else = true; ; ) {
          _item = _iter.next();
          if (_item.done) {
            break;
          }
          value = _item.value;
          _else = false;
          sum += __num(value);
        }
        if (_else) {
          fail();
        }
      } finally {
        try {
          _iter.close();
        } catch (_e) {}
      }
      expect(sum).to.equal(30);
      hitElse = false;
      try {
        for (_iter = __iter(arrayToIterator([])), _else = true; ; ) {
          _item = _iter.next();
          if (_item.done) {
            break;
          }
          value = _item.value;
          _else = false;
          fail();
        }
        if (_else) {
          hitElse = true;
        }
      } finally {
        try {
          _iter.close();
        } catch (_e) {}
      }
      return expect(hitElse).to.be["true"];
    });
    it("iterator loop only calculates iterator once", function () {
      var _item, _iter, iterator, sum, value;
      iterator = runOnce(arrayToIterator([1, 4, 9, 16]));
      sum = 0;
      try {
        for (_iter = __iter(iterator()); ; ) {
          _item = _iter.next();
          if (_item.done) {
            break;
          }
          value = _item.value;
          sum += __num(value);
        }
      } finally {
        try {
          _iter.close();
        } catch (_e) {}
      }
      return expect(sum).to.equal(30);
    });
    it("iterator loop with index", function () {
      var _item, _iter, index, j, sum, value;
      sum = 0;
      j = 0;
      try {
        for (_iter = __iter(arrayToIterator([1, 4, 9, 16])), index = 0; ; ++index) {
          _item = _iter.next();
          if (_item.done) {
            break;
          }
          value = _item.value;
          sum += __num(value);
          expect(index).to.equal(j);
          ++j;
        }
      } finally {
        try {
          _iter.close();
        } catch (_e) {}
      }
      return expect(sum).to.equal(30);
    });
    it("iterator iteration loop scope", function () {
      var _f, _i, _item, _iter, _len, factory, sum, v, valueFactories;
      valueFactories = [];
      try {
        for (_iter = __iter(arrayToIterator([1, 4, 9, 16])), _f = function (v) {
          return valueFactories.push(function () {
            return v;
          });
        }; ; ) {
          _item = _iter.next();
          if (_item.done) {
            break;
          }
          v = _item.value;
          _f.call(this, v);
        }
      } finally {
        try {
          _iter.close();
        } catch (_e) {}
      }
      sum = 0;
      for (_i = 0, _len = valueFactories.length; _i < _len; ++_i) {
        factory = valueFactories[_i];
        sum += __num(factory());
      }
      return expect(sum).to.equal(30);
    });
    it("iterator iteration loop scope with multiple", function () {
      var _f, _item, _iter, alpha, funcs, i;
      funcs = [];
      try {
        for (_iter = __iter(arrayToIterator(["alpha", "bravo", "charlie"])), i = 0, _f = function (alpha, i) {
          var _f, _item, _iter, bravo, j;
          try {
            for (_iter = __iter(arrayToIterator(["delta", "echo", "foxtrot"])), j = 0, _f = function (bravo, j) {
              return funcs.push(function () {
                return [i, alpha, j, bravo];
              });
            }; ; ++j) {
              _item = _iter.next();
              if (_item.done) {
                break;
              }
              bravo = _item.value;
              _f.call(this, bravo, j);
            }
          } finally {
            try {
              _iter.close();
            } catch (_e) {}
          }
        }; ; ++i) {
          _item = _iter.next();
          if (_item.done) {
            break;
          }
          alpha = _item.value;
          _f.call(this, alpha, i);
        }
      } finally {
        try {
          _iter.close();
        } catch (_e) {}
      }
      expect(funcs[0]()).to.eql([0, "alpha", 0, "delta"]);
      expect(funcs[4]()).to.eql([1, "bravo", 1, "echo"]);
      return expect(funcs[8]()).to.eql([2, "charlie", 2, "foxtrot"]);
    });
    it("For-some in iteration loop", function () {
      expect((function () {
        var _item, _iter, _some, x;
        try {
          _some = false;
          for (_iter = __iter(arrayToIterator([
            function () {
              return 1;
            },
            function () {
              return 2;
            },
            fail
          ])); ; ) {
            _item = _iter.next();
            if (_item.done) {
              break;
            }
            x = _item.value;
            if (x() === 2) {
              _some = true;
              break;
            }
          }
          return _some;
        } finally {
          try {
            _iter.close();
          } catch (_e) {}
        }
      }())).to.be["true"];
      expect((function () {
        var _item, _iter, _some, x;
        try {
          _some = false;
          for (_iter = __iter(arrayToIterator([
            function () {
              return 1;
            },
            function () {
              return 2;
            },
            function () {
              return 3;
            }
          ])); ; ) {
            _item = _iter.next();
            if (_item.done) {
              break;
            }
            x = _item.value;
            if (x() === 4) {
              _some = true;
              break;
            }
          }
          return _some;
        } finally {
          try {
            _iter.close();
          } catch (_e) {}
        }
      }())).to.be["false"];
      return expect(function () {
        return gorilla.compileSync("let y = 0\nfor some x from array-to-iterator [1, 2]\n  true\nelse\n  throw Error()");
      }).throws(gorilla.MacroError, /Cannot use a for loop with an else.*5:\d+/);
    });
    it("For-every in iteration loop", function () {
      expect((function () {
        var _every, _item, _iter, x;
        try {
          _every = true;
          for (_iter = __iter(arrayToIterator([
            function () {
              return 1;
            },
            function () {
              return 2;
            },
            fail
          ])); ; ) {
            _item = _iter.next();
            if (_item.done) {
              break;
            }
            x = _item.value;
            if (__num(x()) >= 2) {
              _every = false;
              break;
            }
          }
          return _every;
        } finally {
          try {
            _iter.close();
          } catch (_e) {}
        }
      }())).to.be["false"];
      expect((function () {
        var _every, _item, _iter, x;
        try {
          _every = true;
          for (_iter = __iter(arrayToIterator([
            function () {
              return 1;
            },
            function () {
              return 2;
            },
            function () {
              return 3;
            }
          ])); ; ) {
            _item = _iter.next();
            if (_item.done) {
              break;
            }
            x = _item.value;
            if (__num(x()) >= 4) {
              _every = false;
              break;
            }
          }
          return _every;
        } finally {
          try {
            _iter.close();
          } catch (_e) {}
        }
      }())).to.be["true"];
      return expect(function () {
        return gorilla.compileSync("let y = 0\nfor every x from array-to-iterator [1, 2]\n  true\nelse\n  throw Error()");
      }).throws(gorilla.MacroError, /Cannot use a for loop with an else.*5:\d+/);
    });
    it("For-first in iteration loop", function () {
      expect((function () {
        var _iter;
        try {
          return (function () {
            var _item, _iter, _ref, value, x;
            for (_iter = __iter(arrayToIterator([
              function () {
                return 1;
              },
              function () {
                return 2;
              },
              fail
            ])); ; ) {
              _item = _iter.next();
              if (_item.done) {
                break;
              }
              x = _item.value;
              value = x();
              if (__num(value) > 1) {
                return (_ref = __num(value)) * _ref;
              }
            }
          }());
        } finally {
          try {
            _iter.close();
          } catch (_e) {}
        }
      }())).to.equal(4);
      return expect((function () {
        var _iter;
        try {
          return (function () {
            var _item, _iter, _ref, value, x;
            for (_iter = __iter(arrayToIterator([
              function () {
                return 1;
              },
              function () {
                return 2;
              },
              function () {
                return 3;
              }
            ])); ; ) {
              _item = _iter.next();
              if (_item.done) {
                break;
              }
              x = _item.value;
              value = x();
              if (__num(value) > 3) {
                return (_ref = __num(value)) * _ref;
              }
            }
            return 1000000;
          }());
        } finally {
          try {
            _iter.close();
          } catch (_e) {}
        }
      }())).to.equal(1000000);
    });
    it("For-filter in iteration loop", function () {
      var _arr, _item, _iter, arr, x;
      try {
        _arr = [];
        for (_iter = __iter(arrayToIterator([
          1,
          4,
          9,
          16,
          25,
          36
        ])); ; ) {
          _item = _iter.next();
          if (_item.done) {
            break;
          }
          x = _item.value;
          if (__num(x) % 2 === 0) {
            _arr.push(x);
          }
        }
        arr = _arr;
      } finally {
        try {
          _iter.close();
        } catch (_e) {}
      }
      expect(arr).to.eql([4, 16, 36]);
      return expect(function () {
        return gorilla.compileSync("let y = 0\nfor filter x from array-to-iterator [1, 4, 9, 16, 25, 36]\n  true\nelse\n  throw Error()");
      }).throws(gorilla.MacroError, /Cannot use a for loop with an else.*5:\d+/);
    });
    it("For-reduce in iteration loop", function () {
      expect((function () {
        var _item, _iter, i, sum;
        sum = 0;
        try {
          for (_iter = __iter(arrayToIterator([1, 2, 3, 4])); ; ) {
            _item = _iter.next();
            if (_item.done) {
              break;
            }
            i = _item.value;
            sum = sum + __num(i);
          }
        } finally {
          try {
            _iter.close();
          } catch (_e) {}
        }
        return sum;
      }())).to.equal(10);
      return expect(function () {
        return gorilla.compileSync("let y = 0\nfor reduce i from array-to-iterator([1, 2, 3, 4]), sum = 0\n  sum + i\nelse\n  throw Error()");
      }).throws(gorilla.ParserError, /4:1/);
    });
    it("C-style for loop", function () {
      var i, values;
      i = 0;
      values = [];
      for (i = 0; i < 10; ++i) {
        values.push(i);
      }
      return expect(values).to.eql([
        0,
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
    it("C-style for every loop", function () {
      var i;
      i = 0;
      expect((function () {
        var _every;
        _every = true;
        for (i = 0; i < 10; ++i) {
          if (i >= 5) {
            _every = false;
            break;
          }
        }
        return _every;
      }())).to.be["false"];
      return expect((function () {
        var _every;
        _every = true;
        for (i = 0; i < 10; ++i) {
          if (i >= 10) {
            _every = false;
            break;
          }
        }
        return _every;
      }())).to.be["true"];
    });
    it("C-style for some loop", function () {
      var i;
      i = 0;
      expect((function () {
        var _some;
        _some = false;
        for (i = 0; i < 10; ++i) {
          if (i === 10) {
            _some = true;
            break;
          }
        }
        return _some;
      }())).to.be["false"];
      return expect((function () {
        var _some;
        _some = false;
        for (i = 0; i < 10; ++i) {
          if (i === 5) {
            _some = true;
            break;
          }
        }
        return _some;
      }())).to.be["true"];
    });
    it("C-style for reduce loop", function () {
      var i;
      i = 0;
      return expect((function () {
        var sum;
        sum = 0;
        for (i = 0; i < 10; ++i) {
          sum = sum + i;
        }
        return sum;
      }())).to.equal(45);
    });
    it("For-in loop over a string", function () {
      var _i, _len, c, result;
      result = [];
      for (_i = 0, _len = 5; _i < _len; ++_i) {
        c = "hello".charAt(_i);
        result.push(c);
      }
      return expect(result).to.eql([
        "h",
        "e",
        "l",
        "l",
        "o"
      ]);
    });
    it("For-in loop over a string as expression", function () {
      var _arr, _i, _len, c, result;
      _arr = [];
      for (_i = 0, _len = 5; _i < _len; ++_i) {
        c = "hello".charAt(_i);
        _arr.push(c);
      }
      result = _arr;
      return expect(result).to.eql([
        "h",
        "e",
        "l",
        "l",
        "o"
      ]);
    });
    it("For-in literal array with step = 1", function () {
      var _arr, _len, i, result, v;
      result = [];
      for (_arr = [1, 4, 9, 16], i = 0, _len = _arr.length; i < _len; ++i) {
        v = _arr[i];
        result.push([v, i]);
      }
      return expect(result).to.eql([
        [1, 0],
        [4, 1],
        [9, 2],
        [16, 3]
      ]);
    });
    it("For-in literal array with step = -1", function () {
      var _arr, i, result, v;
      result = [];
      for (_arr = [1, 4, 9, 16], i = _arr.length; i--; ) {
        v = _arr[i];
        result.push([v, i]);
      }
      return expect(result).to.eql([
        [16, 3],
        [9, 2],
        [4, 1],
        [1, 0]
      ]);
    });
    it("For-in literal array with step = 2", function () {
      var _arr, _len, i, result, v;
      result = [];
      for (_arr = [1, 4, 9, 16], i = 0, _len = _arr.length; i < _len; i += 2) {
        v = _arr[i];
        result.push([v, i]);
      }
      return expect(result).to.eql([
        [1, 0],
        [9, 2]
      ]);
    });
    it("For-in literal array with step = -2", function () {
      var _arr, i, result, v;
      result = [];
      for (_arr = [1, 4, 9, 16], i = _arr.length - 1; i >= 0; i += -2) {
        v = _arr[i];
        result.push([v, i]);
      }
      return expect(result).to.eql([
        [16, 3],
        [4, 1]
      ]);
    });
    it("For-in literal array with dynamic step", function () {
      function run(step) {
        var _arr, _len, _step, getStep, i, result, v;
        getStep = runOnce(step);
        result = [];
        for (_arr = [1, 4, 9, 16], _step = __int(__nonzero(getStep())), _len = _arr.length, _step > 0 ? (i = 0) : (i = _len - 1); _step > 0 ? i < _len : i >= 0; i += _step) {
          v = _arr[i];
          result.push([v, i]);
        }
        return result;
      }
      expect(run(1)).to.eql([
        [1, 0],
        [4, 1],
        [9, 2],
        [16, 3]
      ]);
      expect(run(-1)).to.eql([
        [16, 3],
        [9, 2],
        [4, 1],
        [1, 0]
      ]);
      expect(run(2)).to.eql([
        [1, 0],
        [9, 2]
      ]);
      return expect(run(-2)).to.eql([
        [16, 3],
        [4, 1]
      ]);
    });
    it("For-in array with step = 1", function () {
      var _arr, _len, arr, i, result, v;
      result = [];
      arr = runOnce([1, 4, 9, 16]);
      for (_arr = __toArray(arr()), i = 0, _len = _arr.length; i < _len; ++i) {
        v = _arr[i];
        result.push([v, i]);
      }
      return expect(result).to.eql([
        [1, 0],
        [4, 1],
        [9, 2],
        [16, 3]
      ]);
    });
    it("For-in array with step = -1", function () {
      var _arr, arr, i, result, v;
      result = [];
      arr = runOnce([1, 4, 9, 16]);
      for (_arr = __toArray(arr()), i = _arr.length; i--; ) {
        v = _arr[i];
        result.push([v, i]);
      }
      return expect(result).to.eql([
        [16, 3],
        [9, 2],
        [4, 1],
        [1, 0]
      ]);
    });
    it("For-in array with step = 2", function () {
      var _arr, _len, arr, i, result, v;
      result = [];
      arr = runOnce([1, 4, 9, 16]);
      for (_arr = __toArray(arr()), i = 0, _len = _arr.length; i < _len; i += 2) {
        v = _arr[i];
        result.push([v, i]);
      }
      return expect(result).to.eql([
        [1, 0],
        [9, 2]
      ]);
    });
    it("For-in array with step = -2", function () {
      var _arr, arr, i, result, v;
      result = [];
      arr = runOnce([1, 4, 9, 16]);
      for (_arr = __toArray(arr()), i = _arr.length - 1; i >= 0; i += -2) {
        v = _arr[i];
        result.push([v, i]);
      }
      return expect(result).to.eql([
        [16, 3],
        [4, 1]
      ]);
    });
    it("For-in array with dynamic step", function () {
      function run(arr, step) {
        var _arr, _len, _step, getArr, getStep, i, result, v;
        getArr = runOnce(arr);
        getStep = runOnce(step);
        result = [];
        for (_arr = __toArray(getArr()), _step = __int(__nonzero(getStep())), _len = _arr.length, _step > 0 ? (i = 0) : (i = _len - 1); _step > 0 ? i < _len : i >= 0; i += _step) {
          v = _arr[i];
          result.push([v, i]);
        }
        return result;
      }
      expect(run(
        [1, 4, 9, 16],
        1
      )).to.eql([
        [1, 0],
        [4, 1],
        [9, 2],
        [16, 3]
      ]);
      expect(run(
        [1, 4, 9, 16],
        -1
      )).to.eql([
        [16, 3],
        [9, 2],
        [4, 1],
        [1, 0]
      ]);
      expect(run(
        [1, 4, 9, 16],
        2
      )).to.eql([
        [1, 0],
        [9, 2]
      ]);
      return expect(run(
        [1, 4, 9, 16],
        -2
      )).to.eql([
        [16, 3],
        [4, 1]
      ]);
    });
    it("For-in array with slice", function () {
      var _arr, _end, _len, arr, array, i, result, v;
      result = [];
      array = [1, 4, 9, 16];
      arr = runOnce(array);
      for (_arr = __toArray(arr()), i = 1, _len = _arr.length, _end = 3, _end > _len && (_end = _len); i < _end; ++i) {
        v = _arr[i];
        result.push([v, i]);
      }
      expect(result).to.eql([
        [4, 1],
        [9, 2]
      ]);
      result = [];
      arr = runOnce(array);
      for (_arr = __toArray(arr()), i = 0, _len = _arr.length; i < _len; ++i) {
        v = _arr[i];
        result.push([v, i]);
      }
      expect(result).to.eql([
        [1, 0],
        [4, 1],
        [9, 2],
        [16, 3]
      ]);
      result = [];
      arr = runOnce(array);
      for (_arr = __toArray(arr()), i = 1, _len = _arr.length, _end = -1, _end += _len, _end > _len && (_end = _len); i < _end; ++i) {
        v = _arr[i];
        result.push([v, i]);
      }
      expect(result).to.eql([
        [4, 1],
        [9, 2]
      ]);
      result = [];
      arr = runOnce(array);
      for (_arr = __toArray(arr()), _len = _arr.length, i = _len - 3, _end = -1, _end += _len, _end > _len && (_end = _len); i < _end; ++i) {
        v = _arr[i];
        result.push([v, i]);
      }
      expect(result).to.eql([
        [4, 1],
        [9, 2]
      ]);
      result = [];
      arr = runOnce(array);
      for (_arr = __toArray(arr()), _len = _arr.length, i = _len - 3; i < _len; ++i) {
        v = _arr[i];
        result.push([v, i]);
      }
      expect(result).to.eql([
        [4, 1],
        [9, 2],
        [16, 3]
      ]);
      result = [];
      arr = runOnce(array);
      for (_arr = __toArray(arr()), i = 3, _len = _arr.length, _end = 6, _end > _len && (_end = _len); i < _end; ++i) {
        v = _arr[i];
        result.push([v, i]);
      }
      return expect(result).to.eql([[16, 3]]);
    });
    it("For-in array with slice and step = -1", function () {
      var _arr, _len, arr, array, i, result, v;
      result = [];
      array = [1, 4, 9, 16];
      arr = runOnce(array);
      for (_arr = __toArray(arr()), _len = _arr.length, 2 < _len ? (i = 2) : (i = _len - 1); i >= 1; --i) {
        v = _arr[i];
        result.push([v, i]);
      }
      expect(result).to.eql([
        [9, 2],
        [4, 1]
      ]);
      result = [];
      arr = runOnce(array);
      for (_arr = __toArray(arr()), _len = _arr.length, i = _len - 2; i > 0; --i) {
        v = _arr[i];
        result.push([v, i]);
      }
      expect(result).to.eql([
        [9, 2],
        [4, 1]
      ]);
      result = [];
      arr = runOnce(array);
      for (_arr = __toArray(arr()), _len = _arr.length, i = _len - 2; i >= 1; --i) {
        v = _arr[i];
        result.push([v, i]);
      }
      expect(result).to.eql([
        [9, 2],
        [4, 1]
      ]);
      result = [];
      arr = runOnce(array);
      for (_arr = __toArray(arr()), _len = _arr.length, i = _len - 1; i >= -3 + _len; --i) {
        v = _arr[i];
        result.push([v, i]);
      }
      expect(result).to.eql([
        [16, 3],
        [9, 2],
        [4, 1]
      ]);
      result = [];
      arr = runOnce(array);
      for (_arr = __toArray(arr()), _len = _arr.length, 6 < _len ? (i = 6) : (i = _len - 1); i >= -2 + _len; --i) {
        v = _arr[i];
        result.push([v, i]);
      }
      return expect(result).to.eql([
        [16, 3],
        [9, 2]
      ]);
    });
    return it("For-in array with dynamic slice and step", function () {
      function run(array, start, end, step) {
        var _arr, _end, _len, _ref, _step, getArray, getEnd, getStart, getStep,
            i, result, v;
        getArray = runOnce(array);
        getStart = runOnce(start);
        getEnd = runOnce(end);
        getStep = runOnce(step);
        result = [];
        for (_arr = __toArray(getArray()), _step = __int(__nonzero(getStep())), _len = _arr.length, i = getStart(), i < 0 ? (i += _len)
          : _step < 0 ? (i > _len ? (i = _len) : i)
          : void 0, _end = __num(getEnd()), _end < 0 ? (_end += _len)
          : _step > 0 ? (_end > (_ref = _len - 1) ? (_end = _ref) : _end)
          : _end < 0 ? (_end = 0)
          : _end; _step > 0 ? i <= _end : i >= _end; i += _step) {
          v = _arr[i];
          result.push([v, i]);
        }
        return result;
      }
      expect(run(
        [1, 4, 9, 16],
        0,
        -1,
        1
      )).to.eql([
        [1, 0],
        [4, 1],
        [9, 2],
        [16, 3]
      ]);
      expect(run(
        [1, 4, 9, 16],
        0,
        -2,
        1
      )).to.eql([
        [1, 0],
        [4, 1],
        [9, 2]
      ]);
      expect(run(
        [1, 4, 9, 16],
        0,
        10,
        1
      )).to.eql([
        [1, 0],
        [4, 1],
        [9, 2],
        [16, 3]
      ]);
      expect(run(
        [1, 4, 9, 16],
        -1,
        10,
        1
      )).to.eql([[16, 3]]);
      expect(run(
        [1, 4, 9, 16],
        -1,
        2,
        1
      )).to.eql([]);
      expect(run(
        [1, 4, 9, 16],
        -1,
        0,
        -1
      )).to.eql([
        [16, 3],
        [9, 2],
        [4, 1],
        [1, 0]
      ]);
      expect(run(
        [1, 4, 9, 16],
        0,
        -1,
        2
      )).to.eql([
        [1, 0],
        [9, 2]
      ]);
      expect(run(
        [1, 4, 9, 16],
        -1,
        0,
        -2
      )).to.eql([
        [16, 3],
        [4, 1]
      ]);
      expect(run(
        [1, 4, 9, 16],
        -2,
        0,
        -2
      )).to.eql([
        [9, 2],
        [1, 0]
      ]);
      return expect(run(
        [1, 4, 9, 16],
        -2,
        3,
        -2
      )).to.eql([]);
    });
  });
  describe("spreading a loop", function () {
    it("within an invocation", function () {
      var fun, result;
      fun = stub().withArgs(
        0,
        1,
        4,
        9,
        16,
        25
      ).returns("alpha");
      result = fun.apply(void 0, [0].concat(
        (function () {
          var _arr, _arr2, _i, _len, x;
          _arr = [];
          for (_arr2 = [1, 2, 3, 4], _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            x = _arr2[_i];
            _arr.push(__num(x) * __num(x));
          }
          return _arr;
        }()),
        [25]
      ));
      expect(fun).to.be.calledOnce;
      return expect(result).to.equal("alpha");
    });
    return it("within an array", function () {
      var result;
      result = [0].concat(
        (function () {
          var _arr, _arr2, _i, _len, x;
          _arr = [];
          for (_arr2 = [1, 2, 3, 4], _i = 0, _len = _arr2.length; _i < _len; ++_i) {
            x = _arr2[_i];
            _arr.push(__num(x) * __num(x));
          }
          return _arr;
        }()),
        [25]
      );
      return expect(result).to.eql([
        0,
        1,
        4,
        9,
        16,
        25
      ]);
    });
  });
}.call(this));
