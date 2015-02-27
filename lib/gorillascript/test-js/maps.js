(function (GLOBAL) {
  "use strict";
  var __arrayToIter, __cmp, __create, __indexOfIdentical, __isArray, __iter,
      __slice, __toArray, __typeof, expect, Map;
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
  Map = typeof GLOBAL.Map === "function" ? GLOBAL.Map
    : (Map = (function () {
      var _Map_prototype;
      function Map(iterable) {
        var _item, _iter, _this, x;
        _this = this instanceof Map ? this : __create(_Map_prototype);
        _this._keys = [];
        _this._values = [];
        if (iterable != null) {
          try {
            for (_iter = __iter(iterable); ; ) {
              _item = _iter.next();
              if (_item.done) {
                break;
              }
              x = _item.value;
              _this.set(x[0], x[1]);
            }
          } finally {
            try {
              _iter.close();
            } catch (_e) {}
          }
        }
        return _this;
      }
      _Map_prototype = Map.prototype;
      Map.displayName = "Map";
      _Map_prototype.get = function (key) {
        var index;
        index = __indexOfIdentical(this._keys, key);
        if (index !== -1) {
          return this._values[index];
        }
      };
      _Map_prototype.has = function (key) {
        return __indexOfIdentical(this._keys, key) !== -1;
      };
      _Map_prototype.set = function (key, value) {
        var index, keys;
        keys = this._keys;
        index = __indexOfIdentical(keys, key);
        if (index === -1) {
          index = keys.length;
          keys[index] = key;
        }
        this._values[index] = value;
      };
      _Map_prototype["delete"] = function (key) {
        var index, keys;
        keys = this._keys;
        index = __indexOfIdentical(keys, key);
        if (index === -1) {
          return false;
        } else {
          keys.splice(index, 1);
          return this._values.splice(index, 1);
        }
      };
      _Map_prototype.keys = function () {
        var _arr, _e, _i, _send, _state, _step, _this, _throw, key;
        _this = this;
        _state = 0;
        function _close() {
          _state = 3;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _arr = __toArray(_this._keys);
              _i = _arr.length;
              ++_state;
            case 1:
              _state = _i-- ? 2 : 3;
              break;
            case 2:
              key = _arr[_i];
              _state = 1;
              return { done: false, value: key };
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
      _Map_prototype.values = function () {
        var _arr, _e, _i, _send, _state, _step, _this, _throw, value;
        _this = this;
        _state = 0;
        function _close() {
          _state = 3;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _arr = __toArray(_this._values);
              _i = _arr.length;
              ++_state;
            case 1:
              _state = _i-- ? 2 : 3;
              break;
            case 2:
              value = _arr[_i];
              _state = 1;
              return { done: false, value: value };
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
      _Map_prototype.items = function () {
        var _arr, _e, _send, _state, _step, _this, _throw, i, key, values;
        _this = this;
        _state = 0;
        function _close() {
          _state = 3;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              values = _this._values;
              _arr = __toArray(_this._keys);
              i = _arr.length;
              ++_state;
            case 1:
              _state = i-- ? 2 : 3;
              break;
            case 2:
              key = _arr[i];
              _state = 1;
              return {
                done: false,
                value: [key, values[i]]
              };
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
      _Map_prototype.iterator = Map.prototype.items;
      return Map;
    }()));
  expect = require("chai").expect;
  function cmp(a, b) {
    var _ref;
    if ((_ref = typeof a) === "string" || _ref === "number") {
      return __cmp(a, b);
    } else {
      return __cmp(a.value, b.value);
    }
  }
  function mapToArray(map, knownKeys) {
    var _arr, _i, _item, _iter, _len, item, items, key, keys;
    if (knownKeys == null) {
      knownKeys = [];
    }
    expect(map).to.be.an["instanceof"](Map);
    keys = [];
    if (typeof map.keys === "function") {
      try {
        for (_iter = __iter(map.keys()); ; ) {
          _item = _iter.next();
          if (_item.done) {
            break;
          }
          key = _item.value;
          keys.push(key);
        }
      } finally {
        try {
          _iter.close();
        } catch (_e) {}
      }
    } else if (typeof map.items === "function") {
      try {
        for (_iter = __iter(map.items()); ; ) {
          _item = _iter.next();
          if (_item.done) {
            break;
          }
          item = _item.value;
          keys.push(item[0]);
        }
      } finally {
        try {
          _iter.close();
        } catch (_e) {}
      }
    } else if (typeof map.forEach === "function") {
      map.forEach(function (key) {
        keys.push(key);
      });
    } else {
      for (_arr = __toArray(knownKeys), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        key = _arr[_i];
        if (map.has(key)) {
          keys.push(key);
        }
      }
    }
    items = [];
    for (_arr = keys.sort(cmp), _i = 0, _len = _arr.length; _i < _len; ++_i) {
      key = _arr[_i];
      items.push([key, map.get(key)]);
    }
    return items;
  }
  describe("single-line syntax", function () {
    it("should handle empty case", function () {
      var _m, map;
      map = _m = new Map();
      return expect(mapToArray(map, ["x"])).to.be.empty;
    });
    it("should work with string keys", function () {
      var _m, map;
      _m = new Map();
      _m.set("a", 1);
      _m.set("b", 2);
      _m.set("c", 3);
      map = _m;
      return expect(mapToArray(map, ["a", "b", "c", "x"])).to.eql([
        ["a", 1],
        ["b", 2],
        ["c", 3]
      ]);
    });
    it("should work with quoted string keys", function () {
      var _m, map;
      _m = new Map();
      _m.set("a", 1);
      _m.set("b", 2);
      _m.set("c", 3);
      map = _m;
      return expect(mapToArray(map, ["a", "b", "c", "x"])).to.eql([
        ["a", 1],
        ["b", 2],
        ["c", 3]
      ]);
    });
    return it("should work with object keys", function () {
      var _m, a, b, c, map;
      a = { value: 0 };
      b = { value: 2 };
      c = { value: 1 };
      _m = new Map();
      _m.set(a, 1);
      _m.set(b, 2);
      _m.set(c, 3);
      map = _m;
      return expect(mapToArray(map, [a, b, c, "x"])).to.eql([
        [a, 1],
        [c, 3],
        [b, 2]
      ]);
    });
  });
  describe("multi-line syntax", function () {
    return it("should work", function () {
      var _m, a, b, c, map;
      a = { value: 0 };
      b = { value: 2 };
      c = { value: 1 };
      _m = new Map();
      _m.set(a, 1);
      _m.set(b, 2);
      _m.set(c, 3);
      map = _m;
      return expect(mapToArray(map, [a, b, c, "x"])).to.eql([
        [a, 1],
        [c, 3],
        [b, 2]
      ]);
    });
  });
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
