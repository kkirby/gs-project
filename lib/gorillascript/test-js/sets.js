(function (GLOBAL) {
  "use strict";
  var __arrayToIter, __cmp, __create, __indexOfIdentical, __isArray, __iter,
      __slice, __toArray, __typeof, expect, Set;
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
  __indexOfIdentical = function (array, item) {
    var _arr, check, i, inf;
    if (typeof item === "number") {
      if (item !== item) {
        for (_arr = __toArray(array), i = _arr.length; i--; ) {
          check = _arr[i];
          if (check !== check) {
            return i;
          }
        }
        return -1;
      } else if (item === 0) {
        inf = 1 / item;
        for (_arr = __toArray(array), i = _arr.length; i--; ) {
          check = _arr[i];
          if (check === 0 && 1 / check === inf) {
            return i;
          }
        }
        return -1;
      }
    }
    return array.indexOf(item);
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
  Set = typeof GLOBAL.Set === "function" ? GLOBAL.Set
    : (Set = (function () {
      var _Set_prototype;
      function Set(iterable) {
        var _item, _iter, _this, item;
        _this = this instanceof Set ? this : __create(_Set_prototype);
        _this._items = [];
        if (iterable != null) {
          try {
            for (_iter = __iter(iterable); ; ) {
              _item = _iter.next();
              if (_item.done) {
                break;
              }
              item = _item.value;
              _this.add(item);
            }
          } finally {
            try {
              _iter.close();
            } catch (_e) {}
          }
        }
        return _this;
      }
      _Set_prototype = Set.prototype;
      Set.displayName = "Set";
      _Set_prototype.has = function (item) {
        return __indexOfIdentical(this._items, item) !== -1;
      };
      _Set_prototype.add = function (item) {
        var items;
        items = this._items;
        if (__indexOfIdentical(items, item) === -1) {
          items.push(item);
        }
      };
      _Set_prototype["delete"] = function (item) {
        var index, items;
        items = this._items;
        index = __indexOfIdentical(items, item);
        if (index !== -1) {
          items.splice(index, 1);
        }
      };
      _Set_prototype.values = function () {
        var _arr, _e, _i, _send, _state, _step, _this, _throw, item;
        _this = this;
        _state = 0;
        function _close() {
          _state = 3;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _arr = __toArray(_this._items);
              _i = _arr.length;
              ++_state;
            case 1:
              _state = _i-- ? 2 : 3;
              break;
            case 2:
              item = _arr[_i];
              _state = 1;
              return { done: false, value: item };
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
      };
      _Set_prototype.iterator = Set.prototype.values;
      return Set;
    }()));
  expect = require("chai").expect;
  function setToArray(set, knownValues) {
    var _arr, _i, _item, _iter, _len, value, values;
    if (knownValues == null) {
      knownValues = [];
    }
    expect(set).to.be.an["instanceof"](Set);
    values = [];
    if (typeof set.values === "function") {
      try {
        for (_iter = __iter(set.values()); ; ) {
          _item = _iter.next();
          if (_item.done) {
            break;
          }
          value = _item.value;
          values.push(value);
        }
      } finally {
        try {
          _iter.close();
        } catch (_e) {}
      }
    } else if (typeof set.iterator === "function") {
      try {
        for (_iter = __iter(set); ; ) {
          _item = _iter.next();
          if (_item.done) {
            break;
          }
          value = _item.value;
          values.push(value);
        }
      } finally {
        try {
          _iter.close();
        } catch (_e) {}
      }
    } else if (typeof set.forEach === "function") {
      set.forEach(function (value) {
        values.push(value);
      });
    } else {
      for (_arr = __toArray(knownValues), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        value = _arr[_i];
        if (set.has(value)) {
          values.push(value);
        }
      }
    }
    return values.sort(function (a, b) {
      return __cmp(typeof a, typeof b) || __cmp(a, b);
    });
  }
  describe("single-line syntax", function () {
    it("should handle empty case", function () {
      var set;
      set = Set();
      return expect(setToArray(set, ["x"])).to.be.empty;
    });
    return it("should handle mixed values", function () {
      var _s, obj, set;
      obj = {};
      _s = Set();
      _s.add(1);
      _s.add("alpha");
      _s.add(obj);
      set = _s;
      return expect(setToArray(set, [1, "alpha", obj, "x"])).to.eql([1, obj, "alpha"]);
    });
  });
  describe("multi-line syntax", function () {
    it("should handle mixed commas", function () {
      var _s, set;
      _s = Set();
      _s.add("alpha");
      _s.add("bravo");
      _s.add("charlie");
      set = _s;
      return expect(setToArray(set, ["alpha", "bravo", "charlie", "x"])).to.eql(["alpha", "bravo", "charlie"]);
    });
    return it("should handle matrix-style", function () {
      var _s, set;
      _s = Set();
      _s.add(1);
      _s.add(2);
      _s.add(3);
      _s.add(4);
      _s.add(5);
      _s.add(6);
      _s.add(7);
      _s.add(8);
      _s.add(9);
      set = _s;
      return expect(setToArray(set, [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        "x"
      ])).to.eql([
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
  });
  describe("spread", function () {
    return it("should handle spread in set construction", function () {
      var _i, _len, _s, _x, set, x;
      x = ["bravo", "charlie"];
      _s = Set();
      _s.add("alpha");
      for (_i = 0, _len = x.length; _i < _len; ++_i) {
        _x = x[_i];
        _s.add(_x);
      }
      _s.add("delta");
      set = _s;
      return expect(setToArray(set, [
        "alpha",
        "bravo",
        "charlie",
        "delta",
        "x"
      ])).to.eql(["alpha", "bravo", "charlie", "delta"]);
    });
  });
  describe("literal access", function () {
    return it("should handle access on its literal", function () {
      var _s;
      expect((_s = Set(), _s.add("alpha"), _s).has("alpha")).to.be["true"];
      return expect((_s = Set(), _s.add("alpha"), _s).has("bravo")).to.be["false"];
    });
  });
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
