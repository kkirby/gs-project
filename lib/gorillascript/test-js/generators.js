(function () {
  "use strict";
  var __allkeys, __arrayToIter, __cmp, __create, __generator, __isArray, __iter,
      __new, __num, __owns, __slice, __strnum, __toArray, __typeof, expect,
      gorilla, stub;
  __allkeys = function (x) {
    var key, keys;
    keys = [];
    for (key in x) {
      keys.push(key);
    }
    return keys;
  };
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
  __generator = function (func) {
    return function () {
      var args, self;
      self = this;
      args = arguments;
      return {
        iterator: function () {
          return this;
        },
        send: function () {
          var value;
          if (args) {
            value = func.apply(self, __toArray(args));
            self = null;
            args = null;
          }
          return { done: true, value: value };
        },
        next: function () {
          return this.send();
        },
        "throw": function (err) {
          self = null;
          args = null;
          throw err;
        }
      };
    };
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
  __new = (function () {
    var newCreators;
    newCreators = [];
    return function () {
      var creator, func, i, length;
      if (typeof this !== "function") {
        throw new Error("Expected this to be a Function, got " + (typeof this === "undefined" ? "Undefined" : __typeof(this)));
      }
      length = arguments.length;
      creator = newCreators[length];
      if (!creator) {
        func = ["return new C("];
        for (i = 0, __num(length); i < length; ++i) {
          if (i > 0) {
            func.push(", ");
          }
          func.push("a[", i, "]");
        }
        func.push(");");
        newCreators[length] = creator = Function("C", "a", func.join(""));
      }
      return creator(this, arguments);
    };
  }());
  __num = function (num) {
    if (typeof num !== "number") {
      throw new TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
  };
  __owns = Object.prototype.hasOwnProperty;
  __slice = Array.prototype.slice;
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
  expect = require("chai").expect;
  stub = require("sinon").stub;
  gorilla = require("../index");
  function toArray(iterator, values) {
    var arr, item;
    if (values == null) {
      values = [];
    }
    values.reverse();
    values.push(void 0);
    arr = [];
    while (true) {
      if (iterator.send) {
        item = iterator.send(values.pop());
      } else {
        item = iterator.next();
      }
      if (item.done) {
        if (item.value != null) {
          return { arr: arr, value: item.value };
        } else {
          return arr;
        }
      }
      arr.push(item.value);
    }
  }
  function orderList() {
    var list;
    list = [];
    function f(value) {
      list.push(value);
      return value;
    }
    f.list = list;
    return f;
  }
  describe("single-value yield", function () {
    describe("yielding value", function () {
      function fun(value) {
        var _e, _send, _state, _step, _throw;
        _state = 0;
        function _close() {
          _state = 2;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: value };
            case 1:
              ++_state;
              return { done: true, value: _received };
            case 2:
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
      it("produces as single result", function () {
        expect(toArray(fun("alpha"))).to.eql(["alpha"]);
        return expect(toArray(fun("bravo"))).to.eql(["bravo"]);
      });
      return it("on complete, always returns done", function () {
        var i, iter;
        iter = fun("value");
        expect(iter.next()).to.eql({ done: false, value: "value" });
        for (i = 0; i < 10; ++i) {
          expect(iter.next()).to.eql({ done: true, value: void 0 });
        }
      });
    });
    describe("yielding this", function () {
      function fun() {
        var _e, _send, _state, _step, _this, _throw;
        _this = this;
        _state = 0;
        function _close() {
          _state = 2;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: _this };
            case 1:
              ++_state;
              return { done: true, value: _received };
            case 2:
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
      return it("produces as single result", function () {
        var obj;
        obj = {};
        return expect(toArray(fun.call(obj))).to.eql([obj]);
      });
    });
    return describe("yielding bound this", function () {
      function getIter() {
        var _this, fun;
        _this = this;
        return fun = function () {
          var _e, _send, _state, _step, _throw;
          _state = 0;
          function _close() {
            _state = 2;
          }
          function _step(_received) {
            while (true) {
              switch (_state) {
              case 0:
                ++_state;
                return { done: false, value: _this };
              case 1:
                ++_state;
                return { done: true, value: _received };
              case 2:
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
      }
      return it("produces as single result", function () {
        var obj;
        obj = {};
        return expect(toArray(getIter.call(obj).call({}))).to.eql([obj]);
      });
    });
  });
  describe("multi-valued yield", function () {
    function fun() {
      var _e, _send, _state, _step, _throw;
      _state = 0;
      function _close() {
        _state = 4;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: "alpha" };
          case 1:
            ++_state;
            return { done: false, value: "bravo" };
          case 2:
            ++_state;
            return { done: false, value: "charlie" };
          case 3:
            ++_state;
            return { done: true, value: _received };
          case 4:
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
    it("yields expected items", function () {
      return expect(toArray(fun())).to.eql(["alpha", "bravo", "charlie"]);
    });
    return it("on complete, always returns done", function () {
      var i, iter;
      iter = fun();
      toArray(iter);
      for (i = 0; i < 10; ++i) {
        expect(iter.next()).to.eql({ done: true, value: void 0 });
      }
    });
  });
  describe("yield with conditional", function () {
    function fun(value) {
      var _e, _send, _state, _step, _throw;
      _state = 0;
      function _close() {
        _state = 5;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: "alpha" };
          case 1:
            _state = value ? 2 : 3;
            break;
          case 2:
            ++_state;
            return { done: false, value: "bravo" };
          case 3:
            ++_state;
            return { done: false, value: "charlie" };
          case 4:
            ++_state;
            return { done: true, value: _received };
          case 5:
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
    return it("yields expected items", function () {
      expect(toArray(fun(true))).to.eql(["alpha", "bravo", "charlie"]);
      return expect(toArray(fun(false))).to.eql(["alpha", "charlie"]);
    });
  });
  describe("yield with variables", function () {
    function fun() {
      var _e, _send, _state, _step, _throw, i;
      _state = 0;
      function _close() {
        _state = 4;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            i = 0;
            ++_state;
            return { done: false, value: i };
          case 1:
            ++i;
            ++_state;
            return { done: false, value: i };
          case 2:
            ++i;
            ++_state;
            return { done: false, value: i };
          case 3:
            ++_state;
            return { done: true, value: _received };
          case 4:
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
    return it("yields expected items", function () {
      return expect(toArray(fun())).to.eql([0, 1, 2]);
    });
  });
  describe("yield with conditional that has no inner yields", function () {
    function fun(value) {
      var _e, _send, _state, _step, _throw, next;
      _state = 0;
      function _close() {
        _state = 3;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: "alpha" };
          case 1:
            if (value) {
              next = "bravo";
            } else {
              next = "charlie";
            }
            ++_state;
            return { done: false, value: next };
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
    return it("yields expected items", function () {
      expect(toArray(fun(true))).to.eql(["alpha", "bravo"]);
      return expect(toArray(fun(false))).to.eql(["alpha", "charlie"]);
    });
  });
  describe("yield with while", function () {
    function fun() {
      var _e, _send, _state, _step, _throw, i;
      _state = 0;
      function _close() {
        _state = 7;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: 0 };
          case 1:
            i = 1;
            ++_state;
          case 2:
            _state = i < 10 ? 3 : 5;
            break;
          case 3:
            ++_state;
            return { done: false, value: i };
          case 4:
            ++i;
            _state = 2;
            break;
          case 5:
            ++_state;
            return { done: false, value: 10 };
          case 6:
            ++_state;
            return { done: true, value: _received };
          case 7:
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
    return it("yields expected items", function () {
      return expect(toArray(fun())).to.eql([
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10
      ]);
    });
  });
  describe("yield with while and increment", function () {
    function fun() {
      var _e, _send, _state, _step, _throw, i;
      _state = 0;
      function _close() {
        _state = 7;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: 0 };
          case 1:
            i = 1;
            ++_state;
          case 2:
            _state = i < 10 ? 3 : 5;
            break;
          case 3:
            ++_state;
            return { done: false, value: i };
          case 4:
            ++i;
            _state = 2;
            break;
          case 5:
            ++_state;
            return { done: false, value: 10 };
          case 6:
            ++_state;
            return { done: true, value: _received };
          case 7:
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
    return it("yields expected items", function () {
      return expect(toArray(fun())).to.eql([
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10
      ]);
    });
  });
  describe("yield with while and break", function () {
    function fun() {
      var _e, _send, _state, _step, _throw, i;
      _state = 0;
      function _close() {
        _state = 8;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: 0 };
          case 1:
            i = 1;
            ++_state;
          case 2:
            _state = i < 10 ? 3 : 6;
            break;
          case 3:
            _state = i > 5 ? 6 : 4;
            break;
          case 4:
            ++_state;
            return { done: false, value: i };
          case 5:
            ++i;
            _state = 2;
            break;
          case 6:
            ++_state;
            return { done: false, value: 10 };
          case 7:
            ++_state;
            return { done: true, value: _received };
          case 8:
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
    return it("yields expected items", function () {
      return expect(toArray(fun())).to.eql([
        0,
        1,
        2,
        3,
        4,
        5,
        10
      ]);
    });
  });
  describe("yield with labeled while and break", function () {
    function fun() {
      var _e, _send, _state, _step, _throw, i;
      _state = 0;
      function _close() {
        _state = 8;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: 0 };
          case 1:
            i = 1;
            ++_state;
          case 2:
            _state = i < 10 ? 3 : 6;
            break;
          case 3:
            _state = i > 5 ? 6 : 4;
            break;
          case 4:
            ++_state;
            return { done: false, value: i };
          case 5:
            ++i;
            _state = 2;
            break;
          case 6:
            ++_state;
            return { done: false, value: 10 };
          case 7:
            ++_state;
            return { done: true, value: _received };
          case 8:
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
    return it("yields expected items", function () {
      return expect(toArray(fun())).to.eql([
        0,
        1,
        2,
        3,
        4,
        5,
        10
      ]);
    });
  });
  describe(
    "yield with labeled while and break with nested while",
    function () {
      function fun() {
        var _e, _send, _state, _step, _throw, i;
        _state = 0;
        function _close() {
          _state = 9;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: 0 };
            case 1:
              i = 1;
              ++_state;
            case 2: ++_state;
            case 3:
              _state = i < 10 ? 4 : 2;
              break;
            case 4:
              _state = i > 5 ? 7 : 5;
              break;
            case 5:
              ++_state;
              return { done: false, value: i };
            case 6:
              ++i;
              _state = 3;
              break;
            case 7:
              ++_state;
              return { done: false, value: 10 };
            case 8:
              ++_state;
              return { done: true, value: _received };
            case 9:
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
      return it("yields expected items", function () {
        return expect(toArray(fun())).to.eql([
          0,
          1,
          2,
          3,
          4,
          5,
          10
        ]);
      });
    }
  );
  describe(
    "yield with while and break that has no inner yields",
    function () {
      function fun(value) {
        var _e, _send, _state, _step, _throw, i;
        _state = 0;
        function _close() {
          _state = 7;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: 0 };
            case 1:
              i = 1;
              ++_state;
            case 2:
              _state = i < 10 ? 3 : 5;
              break;
            case 3:
              _state = i > 5 ? 5 : 4;
              break;
            case 4:
              ++i;
              _state = 2;
              break;
            case 5:
              ++_state;
              return { done: false, value: i };
            case 6:
              ++_state;
              return { done: true, value: _received };
            case 7:
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
      return it("yields expected items", function () {
        return expect(toArray(fun())).to.eql([0, 6]);
      });
    }
  );
  describe("yield with while and increment and continue", function () {
    function fun() {
      var _e, _send, _state, _step, _throw, i;
      _state = 0;
      function _close() {
        _state = 9;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: 0 };
          case 1:
            i = 1;
            ++_state;
          case 2:
            _state = i < 10 ? 3 : 7;
            break;
          case 3:
            _state = i === 5 ? 4 : 5;
            break;
          case 4:
            i = 6;
            _state = 6;
            break;
          case 5:
            ++_state;
            return { done: false, value: i };
          case 6:
            ++i;
            _state = 2;
            break;
          case 7:
            ++_state;
            return { done: false, value: 10 };
          case 8:
            ++_state;
            return { done: true, value: _received };
          case 9:
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
    return it("yields expected items", function () {
      return expect(toArray(fun())).to.eql([
        0,
        1,
        2,
        3,
        4,
        7,
        8,
        9,
        10
      ]);
    });
  });
  describe(
    "yield with labeled while and increment and continue",
    function () {
      function fun() {
        var _e, _send, _state, _step, _throw, i;
        _state = 0;
        function _close() {
          _state = 9;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: 0 };
            case 1:
              i = 1;
              ++_state;
            case 2:
              _state = i < 10 ? 3 : 7;
              break;
            case 3:
              _state = i === 5 ? 4 : 5;
              break;
            case 4:
              i = 6;
              _state = 6;
              break;
            case 5:
              ++_state;
              return { done: false, value: i };
            case 6:
              ++i;
              _state = 2;
              break;
            case 7:
              ++_state;
              return { done: false, value: 10 };
            case 8:
              ++_state;
              return { done: true, value: _received };
            case 9:
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
      return it("yields expected items", function () {
        return expect(toArray(fun())).to.eql([
          0,
          1,
          2,
          3,
          4,
          7,
          8,
          9,
          10
        ]);
      });
    }
  );
  describe(
    "yield with labeled while and increment and continue with nested while",
    function () {
      function fun() {
        var _e, _send, _state, _step, _throw, i;
        _state = 0;
        function _close() {
          _state = 10;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: 0 };
            case 1:
              i = 1;
              ++_state;
            case 2:
              _state = i < 10 ? 3 : 8;
              break;
            case 3:
              _state = i < 10 ? 4 : 7;
              break;
            case 4:
              _state = i === 5 ? 7 : 5;
              break;
            case 5:
              ++_state;
              return { done: false, value: i };
            case 6:
              i += 2;
              _state = 3;
              break;
            case 7:
              ++i;
              _state = 2;
              break;
            case 8:
              ++_state;
              return { done: false, value: 10 };
            case 9:
              ++_state;
              return { done: true, value: _received };
            case 10:
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
      return it("yields expected items", function () {
        return expect(toArray(fun())).to.eql([
          0,
          1,
          3,
          6,
          8,
          10
        ]);
      });
    }
  );
  describe("yield with for-in", function () {
    function fun(arr) {
      var _arr, _e, _i, _len, _send, _state, _step, _throw, x;
      _state = 0;
      function _close() {
        _state = 7;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: "start" };
          case 1:
            _arr = __toArray(arr);
            _i = 0;
            _len = _arr.length;
            ++_state;
          case 2:
            _state = _i < _len ? 3 : 5;
            break;
          case 3:
            x = _arr[_i];
            ++_state;
            return { done: false, value: x };
          case 4:
            ++_i;
            _state = 2;
            break;
          case 5:
            ++_state;
            return { done: false, value: "end" };
          case 6:
            ++_state;
            return { done: true, value: _received };
          case 7:
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
    return it("yields expected items", function () {
      return expect(toArray(fun([
        "a",
        "b",
        "c",
        "d",
        "e"
      ]))).to.eql([
        "start",
        "a",
        "b",
        "c",
        "d",
        "e",
        "end"
      ]);
    });
  });
  describe("yield with for-range", function () {
    function fun(start, finish) {
      var _e, _send, _state, _step, _throw, i;
      _state = 0;
      function _close() {
        _state = 7;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: start };
          case 1:
            i = __num(start) + 1;
            __num(finish);
            ++_state;
          case 2:
            _state = i < finish ? 3 : 5;
            break;
          case 3:
            ++_state;
            return { done: false, value: i };
          case 4:
            ++i;
            _state = 2;
            break;
          case 5:
            ++_state;
            return { done: false, value: finish };
          case 6:
            ++_state;
            return { done: true, value: _received };
          case 7:
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
    return it("yields expected items", function () {
      return expect(toArray(fun(1, 6))).to.eql([
        1,
        2,
        3,
        4,
        5,
        6
      ]);
    });
  });
  describe("yield with for-of", function () {
    function fun(obj) {
      var _e, _i, _keys, _len, _send, _state, _step, _throw, k, v;
      _state = 0;
      function _close() {
        _state = 8;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return {
              done: false,
              value: ["start", 0]
            };
          case 1:
            _keys = __allkeys(obj);
            _i = 0;
            _len = _keys.length;
            ++_state;
          case 2:
            _state = _i < _len ? 3 : 6;
            break;
          case 3:
            k = _keys[_i];
            _state = __owns.call(obj, k) ? 4 : 5;
            break;
          case 4:
            v = obj[k];
            ++_state;
            return {
              done: false,
              value: [k, v]
            };
          case 5:
            ++_i;
            _state = 2;
            break;
          case 6:
            ++_state;
            return {
              done: false,
              value: ["end", 1]
            };
          case 7:
            ++_state;
            return { done: true, value: _received };
          case 8:
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
    return it("yields expected items", function () {
      return expect(toArray(fun({ alpha: "bravo", charlie: "delta", echo: "foxtrot" })).sort(function (a, b) {
        return __cmp(a[0], b[0]);
      })).to.eql([
        ["alpha", "bravo"],
        ["charlie", "delta"],
        ["echo", "foxtrot"],
        ["end", 1],
        ["start", 0]
      ]);
    });
  });
  describe("yield with for-of with inheritance", function () {
    function fun(obj) {
      var _e, _i, _keys, _len, _send, _state, _step, _throw, k, v;
      _state = 0;
      function _close() {
        _state = 8;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return {
              done: false,
              value: ["start", 0]
            };
          case 1:
            _keys = __allkeys(obj);
            _i = 0;
            _len = _keys.length;
            ++_state;
          case 2:
            _state = _i < _len ? 3 : 6;
            break;
          case 3:
            k = _keys[_i];
            _state = __owns.call(obj, k) ? 4 : 5;
            break;
          case 4:
            v = obj[k];
            ++_state;
            return {
              done: false,
              value: [k, v]
            };
          case 5:
            ++_i;
            _state = 2;
            break;
          case 6:
            ++_state;
            return {
              done: false,
              value: ["end", 1]
            };
          case 7:
            ++_state;
            return { done: true, value: _received };
          case 8:
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
    return it("yields expected items", function () {
      function Class() {
        this.alpha = "bravo";
      }
      Class.prototype.charlie = "delta";
      return expect(toArray(fun(new Class())).sort(function (a, b) {
        return __cmp(a[0], b[0]);
      })).to.eql([
        ["alpha", "bravo"],
        ["end", 1],
        ["start", 0]
      ]);
    });
  });
  describe("yield with for-ofall with inheritance", function () {
    function fun(obj) {
      var _e, _i, _keys, _len, _send, _state, _step, _throw, k, v;
      _state = 0;
      function _close() {
        _state = 7;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return {
              done: false,
              value: ["start", 0]
            };
          case 1:
            _keys = __allkeys(obj);
            _i = 0;
            _len = _keys.length;
            ++_state;
          case 2:
            _state = _i < _len ? 3 : 5;
            break;
          case 3:
            k = _keys[_i];
            v = obj[k];
            ++_state;
            return {
              done: false,
              value: [k, v]
            };
          case 4:
            ++_i;
            _state = 2;
            break;
          case 5:
            ++_state;
            return {
              done: false,
              value: ["end", 1]
            };
          case 6:
            ++_state;
            return { done: true, value: _received };
          case 7:
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
    return it("yields expected items", function () {
      function Class() {
        this.alpha = "bravo";
      }
      Class.prototype.charlie = "delta";
      return expect(toArray(fun(new Class())).sort(function (a, b) {
        return __cmp(a[0], b[0]);
      })).to.eql([
        ["alpha", "bravo"],
        ["charlie", "delta"],
        ["end", 1],
        ["start", 0]
      ]);
    });
  });
  describe("yield with try-catch", function () {
    var obj;
    obj = {};
    function fun(value) {
      var _e, _send, _state, _step, _throw, e;
      _state = 0;
      function _close() {
        _state = 6;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: "alpha" };
          case 1:
            ++_state;
            return { done: false, value: "bravo" };
          case 2:
            if (value) {
              throw obj;
            }
            _state = 4;
            return { done: false, value: "charlie" };
          case 3:
            expect(e).to.equal(obj);
            ++_state;
            return { done: false, value: "delta" };
          case 4:
            ++_state;
            return { done: false, value: "echo" };
          case 5:
            ++_state;
            return { done: true, value: _received };
          case 6:
            return { done: true, value: void 0 };
          default: throw new Error("Unknown state: " + _state);
          }
        }
      }
      function _throw(_e) {
        if (_state === 1 || _state === 2) {
          e = _e;
          _state = 3;
        } else {
          _close();
          throw _e;
        }
      }
      function _send(_received) {
        while (true) {
          try {
            return _step(_received);
          } catch (_e) {
            _throw(_e);
          }
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
    return it("yields expected items", function () {
      expect(toArray(fun(true))).to.eql(["alpha", "bravo", "delta", "echo"]);
      return expect(toArray(fun(false))).to.eql(["alpha", "bravo", "charlie", "echo"]);
    });
  });
  describe("yield with return in try-catch", function () {
    var obj;
    obj = {};
    function fun(value) {
      var _e, _send, _state, _step, _throw, e;
      _state = 0;
      function _close() {
        _state = 6;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: "alpha" };
          case 1:
            ++_state;
            return { done: false, value: "bravo" };
          case 2:
            if (value) {
              throw obj;
            }
            _state = 4;
            return { done: false, value: "charlie" };
          case 3:
            expect(e).to.equal(obj);
            _state = 6;
            return { done: false, value: "delta" };
          case 4:
            ++_state;
            return { done: false, value: "foxtrot" };
          case 5:
            ++_state;
            return { done: true, value: _received };
          case 6:
            return { done: true, value: void 0 };
          default: throw new Error("Unknown state: " + _state);
          }
        }
      }
      function _throw(_e) {
        if (_state === 1 || _state === 2) {
          e = _e;
          _state = 3;
        } else {
          _close();
          throw _e;
        }
      }
      function _send(_received) {
        while (true) {
          try {
            return _step(_received);
          } catch (_e) {
            _throw(_e);
          }
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
    return it("yields expected items", function () {
      expect(toArray(fun(true))).to.eql(["alpha", "bravo", "delta"]);
      return expect(toArray(fun(false))).to.eql(["alpha", "bravo", "charlie", "foxtrot"]);
    });
  });
  describe("yield with try-finally", function () {
    var funThis, obj;
    obj = new Error();
    funThis = {};
    function fun(cleanup) {
      var _e, _finallies, _send, _state, _step, _this, _throw;
      _this = this;
      _state = 0;
      _finallies = [];
      function _finally() {
        expect(_this).to.equal(funThis);
        cleanup();
      }
      function _close() {
        var _f;
        _state = 4;
        _f = _finallies.pop();
        if (_f) {
          try {
            _f();
          } finally {
            _close();
          }
        }
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            expect(_this).to.equal(funThis);
            ++_state;
            return { done: false, value: "alpha" };
          case 1:
            _finallies.push(_finally);
            expect(_this).to.equal(funThis);
            ++_state;
            return { done: false, value: "bravo" };
          case 2: throw obj;
          case 3:
            ++_state;
            return { done: true, value: _received };
          case 4:
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
        } finally {
          if (_state === 4) {
            _close();
          }
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
    return it(
      "yields expected items and calls cleanup at expected time",
      function () {
        var cleanup, g, i;
        cleanup = stub();
        g = fun.call(funThis, cleanup);
        expect(g.next()).to.eql({ done: false, value: "alpha" });
        expect(g.next()).to.eql({ done: false, value: "bravo" });
        expect(cleanup).to.not.be.called;
        expect(function () {
          return g.next();
        }).throws(obj);
        expect(cleanup).to.be.calledOnce;
        for (i = 0; i < 10; ++i) {
          expect(g.next()).to.eql({ done: true, value: void 0 });
        }
        return expect(cleanup).to.be.calledOnce;
      }
    );
  });
  describe("yield with return in try-finally", function () {
    var funThis, obj;
    obj = new Error();
    funThis = {};
    function fun(cleanup) {
      var _e, _finallies, _send, _state, _step, _this, _throw;
      _this = this;
      _state = 0;
      _finallies = [];
      function _finally() {
        expect(_this).to.equal(funThis);
        cleanup();
      }
      function _close() {
        var _f;
        _state = 4;
        _f = _finallies.pop();
        if (_f) {
          try {
            _f();
          } finally {
            _close();
          }
        }
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            expect(_this).to.equal(funThis);
            ++_state;
            return { done: false, value: "alpha" };
          case 1:
            _finallies.push(_finally);
            expect(_this).to.equal(funThis);
            ++_state;
            return { done: false, value: "bravo" };
          case 2:
            _state = 4;
            return { done: true, value: "charlie" };
          case 3:
            ++_state;
            return { done: true, value: _received };
          case 4:
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
        } finally {
          if (_state === 4) {
            _close();
          }
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
    return it(
      "yields expected items and calls cleanup at expected time",
      function () {
        var cleanup, g, i;
        cleanup = stub();
        g = fun.call(funThis, cleanup);
        expect(g.next()).to.eql({ done: false, value: "alpha" });
        expect(g.next()).to.eql({ done: false, value: "bravo" });
        expect(cleanup).to.not.be.called;
        expect(g.next()).to.eql({ done: true, value: "charlie" });
        expect(cleanup).to.be.calledOnce;
        for (i = 0; i < 10; ++i) {
          expect(g.next()).to.eql({ done: true, value: void 0 });
        }
        return expect(cleanup).to.be.calledOnce;
      }
    );
  });
  describe("yield with switch", function () {
    function fun(getValue) {
      var _e, _send, _state, _step, _throw;
      _state = 0;
      function _close() {
        _state = 13;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            switch (getValue()) {
            case 0:
              _state = 1;
              break;
            case 1:
              _state = 3;
              break;
            case 2:
              _state = 6;
              break;
            case 3:
              _state = 7;
              break;
            default: _state = 10;
            }
            break;
          case 1:
            ++_state;
            return { done: false, value: 0 };
          case 2:
            _state = 13;
            return { done: true, value: _received };
          case 3:
            ++_state;
            return { done: false, value: 1 };
          case 4:
            ++_state;
            return { done: false, value: 2 };
          case 5:
            _state = 13;
            return { done: true, value: _received };
          case 6:
            ++_state;
            return { done: false, value: 3 };
          case 7:
            ++_state;
            return { done: false, value: 4 };
          case 8:
            ++_state;
            return { done: false, value: 5 };
          case 9:
            _state = 13;
            return { done: true, value: _received };
          case 10:
            ++_state;
            return { done: false, value: 6 };
          case 11:
            ++_state;
            return { done: false, value: 7 };
          case 12:
            ++_state;
            return { done: true, value: _received };
          case 13:
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
    return it("yields expected items", function () {
      function run(value) {
        var getValue, iter, result;
        getValue = stub().returns(value);
        iter = fun(getValue);
        expect(getValue).to.not.be.called;
        result = toArray(iter);
        expect(getValue).to.be.calledOnce;
        return result;
      }
      expect(run(0)).to.eql([0]);
      expect(run(1)).to.eql([1, 2]);
      expect(run(2)).to.eql([3, 4, 5]);
      expect(run(3)).to.eql([4, 5]);
      return expect(run(4)).to.eql([6, 7]);
    });
  });
  describe("yield with for-from", function () {
    function range(start, finish) {
      var _e, _send, _state, _step, _throw, i;
      _state = 0;
      function _close() {
        _state = 4;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            i = __num(start);
            __num(finish);
            ++_state;
          case 1:
            _state = i < finish ? 2 : 4;
            break;
          case 2:
            ++_state;
            return { done: false, value: i };
          case 3:
            ++i;
            _state = 1;
            break;
          case 4:
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
    function fun() {
      var _e, _finallies, _item, _iter, _send, _state, _step, _throw, item;
      _state = 0;
      _finallies = [];
      function _finally() {
        try {
          _iter.close();
        } catch (_e) {}
      }
      function _close() {
        var _f;
        _state = 7;
        _f = _finallies.pop();
        if (_f) {
          try {
            _f();
          } finally {
            _close();
          }
        }
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: 0 };
          case 1:
            _finallies.push(_finally);
            _iter = __iter(range(1, 10));
            ++_state;
          case 2: ++_state;
          case 3:
            _item = _iter.next();
            _state = _item.done ? 5 : 4;
            break;
          case 4:
            item = _item.value;
            _state = 2;
            return { done: false, value: item };
          case 5:
            _finallies.pop()();
            ++_state;
            return { done: false, value: 10 };
          case 6:
            ++_state;
            return { done: true, value: _received };
          case 7:
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
        } finally {
          if (_state === 7) {
            _close();
          }
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
    return it("yields expected items", function () {
      return expect(toArray(fun())).to.eql([
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10
      ]);
    });
  });
  describe("yield* iterator", function () {
    function range(start, finish) {
      var _e, _send, _state, _step, _throw, i;
      _state = 0;
      function _close() {
        _state = 4;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            i = __num(start);
            __num(finish);
            ++_state;
          case 1:
            _state = i < finish ? 2 : 4;
            break;
          case 2:
            ++_state;
            return { done: false, value: i };
          case 3:
            ++i;
            _state = 1;
            break;
          case 4:
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
    function fun() {
      var _e, _e2, _item, _iter, _send, _state, _step, _throw, _tmp;
      _state = 0;
      function _close() {
        _state = 9;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: 0 };
          case 1:
            _iter = __iter(range(1, 10));
            _tmp = void 0;
            _send = true;
            ++_state;
          case 2: ++_state;
          case 3:
            if (_send) {
              _item = _iter.send(_tmp);
            } else {
              _item = _iter["throw"](_tmp);
            }
            _state = _item.done ? 7 : 4;
            break;
          case 4:
            ++_state;
            return { done: false, value: _item.value };
          case 5:
            _tmp = _received;
            _send = true;
            _state = 2;
            break;
          case 6:
            _tmp = _e;
            _send = false;
            _state = 2;
            break;
          case 7:
            try {
              _iter.close();
            } catch (_e) {}
            _item.value;
            ++_state;
            return { done: false, value: 10 };
          case 8:
            ++_state;
            return { done: true, value: _received };
          case 9:
            return { done: true, value: void 0 };
          default: throw new Error("Unknown state: " + _state);
          }
        }
      }
      function _throw(_e2) {
        if (_state === 4 || _state === 5) {
          _e = _e2;
          _state = 6;
        } else {
          _close();
          throw _e2;
        }
      }
      function _send(_received) {
        while (true) {
          try {
            return _step(_received);
          } catch (_e2) {
            _throw(_e2);
          }
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
        "throw": function (_e2) {
          _throw(_e2);
          return _send(void 0);
        }
      };
    }
    return it("yields expected items", function () {
      return expect(toArray(fun())).to.eql([
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10
      ]);
    });
  });
  describe("yield* array", function () {
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
    function fun() {
      var _e, _i, _len, _send, _state, _step, _throw;
      _state = 0;
      function _close() {
        _state = 7;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: 0 };
          case 1:
            _i = 0;
            _len = arr.length;
            ++_state;
          case 2:
            _state = _i < _len ? 3 : 5;
            break;
          case 3:
            ++_state;
            return { done: false, value: arr[_i] };
          case 4:
            ++_i;
            _state = 2;
            break;
          case 5:
            ++_state;
            return { done: false, value: 10 };
          case 6:
            ++_state;
            return { done: true, value: _received };
          case 7:
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
    return it("yields expected items", function () {
      return expect(toArray(fun())).to.eql([
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10
      ]);
    });
  });
  describe("yield in let statement", function () {
    function fun() {
      var _e, _send, _state, _step, _throw, x;
      _state = 0;
      function _close() {
        _state = 3;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: 1 };
          case 1:
            x = _received;
            ++_state;
            return { done: false, value: x };
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
    return it("yields expected items", function () {
      return expect(toArray(fun(), [2])).to.eql([1, 2]);
    });
  });
  describe("yield in assign statement", function () {
    return it("yields expected items", function () {
      var obj, order;
      order = orderList();
      obj = {};
      function fun() {
        var _e, _send, _state, _step, _throw, _tmp;
        _state = 0;
        function _close() {
          _state = 3;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _tmp = order("key");
              ++_state;
              return { done: false, value: order("value") };
            case 1:
              obj[_tmp] = _received;
              obj[_tmp];
              expect(order.list).to.eql(["key", "value"]);
              ++_state;
              return { done: false, value: obj.key };
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
      return expect(toArray(fun(), ["alpha"])).to.eql(["value", "alpha"]);
    });
  });
  describe("yield as throw expression", function () {
    return it("yields expected items", function () {
      var generator, i, obj, order;
      order = orderList();
      function fun() {
        var _e, _send, _state, _step, _throw;
        _state = 0;
        function _close() {
          _state = 2;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: order("value") };
            case 1: throw _received;
            case 2:
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
      generator = fun();
      expect(order.list).to.eql([]);
      expect(generator.send(void 0)).to.eql({ done: false, value: "value" });
      expect(order.list).to.eql(["value"]);
      obj = new Error();
      expect(function () {
        return generator.send(obj);
      }).throws(obj);
      expect(order.list).to.eql(["value"]);
      for (i = 0; i < 10; ++i) {
        expect(generator.send(void 0)).to.eql({ done: true, value: void 0 });
      }
    });
  });
  describe("yield in call statement", function () {
    return it("yields expected items", function () {
      var order, ran;
      order = orderList();
      ran = stub();
      function func() {
        var args;
        args = __slice.call(arguments);
        expect(args).to.eql(["alpha", "echo", "charlie"]);
        return ran();
      }
      function fun() {
        var _arr, _e, _send, _state, _step, _throw, _tmp;
        _state = 0;
        function _close() {
          _state = 3;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _tmp = order(func);
              _arr = [order("alpha")];
              ++_state;
              return { done: false, value: order("bravo") };
            case 1:
              _arr.push(_received);
              _arr.push(order("charlie"));
              _tmp.apply(void 0, _arr);
              expect(order.list).to.eql([func, "alpha", "bravo", "charlie"]);
              ++_state;
              return { done: false, value: "delta" };
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
      expect(toArray(fun(), ["echo"])).to.eql(["bravo", "delta"]);
      return expect(ran).to.be.calledOnce;
    });
  });
  describe("yield in call statement, yield as func", function () {
    return it("yields expected items", function () {
      var obj, order, ran;
      order = orderList();
      obj = {};
      ran = stub();
      function func() {
        var args;
        args = __slice.call(arguments);
        expect(args).to.eql(["bravo", "charlie", "delta"]);
        ran();
      }
      function fun() {
        var _arr, _arr2, _e, _send, _state, _step, _throw, _tmp;
        _state = 0;
        function _close() {
          _state = 3;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: "alpha" };
            case 1:
              _tmp = order(_received);
              _tmp(order("bravo"), order("charlie"), order("delta"));
              expect(order.list).to.eql([func, "bravo", "charlie", "delta"]);
              ++_state;
              return { done: false, value: "delta" };
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
      expect(toArray(fun(), [func])).to.eql(["alpha", "delta"]);
      return expect(ran).to.be.calledOnce;
    });
  });
  describe("yield in call expression", function () {
    return it("yields expected items", function () {
      var obj, order;
      order = orderList();
      obj = {};
      function getArgs() {
        var args;
        args = __slice.call(arguments);
        return args;
      }
      function fun() {
        var _arr, _e, _send, _state, _step, _throw, _tmp, value;
        _state = 0;
        function _close() {
          _state = 3;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _tmp = order(getArgs);
              _arr = [order("alpha")];
              ++_state;
              return { done: false, value: order("bravo") };
            case 1:
              _arr.push(_received);
              _arr.push(order("charlie"));
              value = _tmp.apply(void 0, _arr);
              expect(order.list).to.eql([getArgs, "alpha", "bravo", "charlie"]);
              expect(value).to.eql(["alpha", "echo", "charlie"]);
              ++_state;
              return { done: false, value: "delta" };
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
      return expect(toArray(fun(), ["echo"])).to.eql(["bravo", "delta"]);
    });
  });
  describe("multiple yields in call expression", function () {
    return it("yields expected items", function () {
      var obj, order;
      order = orderList();
      obj = {};
      function getArgs() {
        var args;
        args = __slice.call(arguments);
        return args;
      }
      function fun() {
        var _arr, _e, _send, _state, _step, _throw, _tmp, value;
        _state = 0;
        function _close() {
          _state = 4;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _tmp = order(getArgs);
              _arr = [order("alpha")];
              ++_state;
              return { done: false, value: order("bravo") };
            case 1:
              _arr.push(_received);
              ++_state;
              return { done: false, value: order("charlie") };
            case 2:
              _arr.push(_received);
              _arr.push(order("delta"));
              value = _tmp.apply(void 0, _arr);
              expect(order.list).to.eql([
                getArgs,
                "alpha",
                "bravo",
                "charlie",
                "delta"
              ]);
              expect(value).to.eql(["alpha", "foxtrot", "golf", "delta"]);
              ++_state;
              return { done: false, value: "echo" };
            case 3:
              ++_state;
              return { done: true, value: _received };
            case 4:
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
      return expect(toArray(fun(), ["foxtrot", "golf"])).to.eql(["bravo", "charlie", "echo"]);
    });
  });
  describe("yield in access", function () {
    return it("yields expected items", function () {
      function fun() {
        var _e, _send, _state, _step, _throw, _tmp, value;
        _state = 0;
        function _close() {
          _state = 4;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: "alpha" };
            case 1:
              _tmp = _received;
              ++_state;
              return { done: false, value: "bravo" };
            case 2:
              value = _tmp[_received];
              ++_state;
              return { done: false, value: value };
            case 3:
              ++_state;
              return { done: true, value: _received };
            case 4:
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
      return expect(toArray(fun(), [{ charlie: "delta" }, "charlie"])).to.eql(["alpha", "bravo", "delta"]);
    });
  });
  describe("yield in array", function () {
    return it("yields expected items", function () {
      function fun() {
        var _e, _send, _state, _step, _throw, value;
        _state = 0;
        function _close() {
          _state = 4;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              value = ["alpha"];
              ++_state;
              return { done: false, value: "bravo" };
            case 1:
              value.push(_received);
              value.push("charlie");
              ++_state;
              return { done: false, value: "delta" };
            case 2:
              value.push(_received);
              value.push("echo");
              ++_state;
              return { done: false, value: value };
            case 3:
              ++_state;
              return { done: true, value: _received };
            case 4:
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
      return expect(toArray(fun(), ["foxtrot", "golf"])).to.eql([
        "bravo",
        "delta",
        [
          "alpha",
          "foxtrot",
          "charlie",
          "golf",
          "echo"
        ]
      ]);
    });
  });
  describe("yield in array with spread", function () {
    return it("yields expected items", function () {
      var arr1, arr2;
      arr1 = ["alpha", "bravo"];
      arr2 = ["charlie", "delta"];
      function fun() {
        var _e, _send, _state, _step, _throw, value;
        _state = 0;
        function _close() {
          _state = 4;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              value = ["echo"];
              ++_state;
              return { done: false, value: "foxtrot" };
            case 1:
              value.push(_received);
              value.push.apply(value, __toArray(arr1));
              ++_state;
              return { done: false, value: "golf" };
            case 2:
              value.push.apply(value, __toArray(_received));
              value.push.apply(value, __toArray(arr2));
              value.push("hotel");
              ++_state;
              return { done: false, value: value };
            case 3:
              ++_state;
              return { done: true, value: _received };
            case 4:
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
      return expect(toArray(fun(), [
        "india",
        ["juliet", "kilo"]
      ])).to.eql([
        "foxtrot",
        "golf",
        [
          "echo",
          "india",
          "alpha",
          "bravo",
          "juliet",
          "kilo",
          "charlie",
          "delta",
          "hotel"
        ]
      ]);
    });
  });
  describe("yield in binary expression", function () {
    return it("yields expected items", function () {
      function fun() {
        var _arr, _arr2, _arr3, _e, _send, _state, _step, _throw, _tmp, value;
        _state = 0;
        function _close() {
          _state = 5;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: 1 };
            case 1:
              _tmp = __num(_received);
              ++_state;
              return { done: false, value: 2 };
            case 2:
              _tmp = _tmp + __num(_received);
              ++_state;
              return { done: false, value: 3 };
            case 3:
              value = _tmp + __num(_received);
              ++_state;
              return { done: false, value: value };
            case 4:
              ++_state;
              return { done: true, value: _received };
            case 5:
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
      return expect(toArray(fun(), [4, 5, 6])).to.eql([1, 2, 3, 15]);
    });
  });
  describe("yield in binary and", function () {
    return it("yields expected items", function () {
      function fun() {
        var _e, _send, _state, _step, _throw, value;
        _state = 0;
        function _close() {
          _state = 8;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: 1 };
            case 1:
              value = _received;
              _state = value ? 2 : 6;
              break;
            case 2:
              ++_state;
              return { done: false, value: 2 };
            case 3:
              value = _received;
              _state = value ? 4 : 6;
              break;
            case 4:
              ++_state;
              return { done: false, value: 3 };
            case 5:
              value = _received;
              ++_state;
            case 6:
              ++_state;
              return { done: false, value: value };
            case 7:
              ++_state;
              return { done: true, value: _received };
            case 8:
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
      expect(toArray(fun(), [true, true, true])).to.eql([1, 2, 3, true]);
      expect(toArray(fun(), [true, true, false])).to.eql([1, 2, 3, false]);
      expect(toArray(fun(), [true, false])).to.eql([1, 2, false]);
      return expect(toArray(fun(), [false])).to.eql([1, false]);
    });
  });
  describe("yield in binary or", function () {
    return it("yields expected items", function () {
      function fun() {
        var _e, _send, _state, _step, _throw, value;
        _state = 0;
        function _close() {
          _state = 8;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: 1 };
            case 1:
              value = _received;
              _state = value ? 6 : 2;
              break;
            case 2:
              ++_state;
              return { done: false, value: 2 };
            case 3:
              value = _received;
              _state = value ? 6 : 4;
              break;
            case 4:
              ++_state;
              return { done: false, value: 3 };
            case 5:
              value = _received;
              ++_state;
            case 6:
              ++_state;
              return { done: false, value: value };
            case 7:
              ++_state;
              return { done: true, value: _received };
            case 8:
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
      expect(toArray(fun(), [false, false, false])).to.eql([1, 2, 3, false]);
      expect(toArray(fun(), [false, false, true])).to.eql([1, 2, 3, true]);
      expect(toArray(fun(), [false, true])).to.eql([1, 2, true]);
      return expect(toArray(fun(), [true])).to.eql([1, true]);
    });
  });
  describe("yield in call expression with spread", function () {
    return it("yields expected items", function () {
      var arr1, arr2;
      function getArgs() {
        var args;
        args = __slice.call(arguments);
        return args;
      }
      arr1 = ["alpha", "bravo"];
      arr2 = ["charlie", "delta"];
      function fun() {
        var _arr, _e, _send, _state, _step, _throw, value;
        _state = 0;
        function _close() {
          _state = 4;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _arr = ["echo"];
              ++_state;
              return { done: false, value: "foxtrot" };
            case 1:
              _arr.push(_received);
              _arr.push.apply(_arr, __toArray(arr1));
              ++_state;
              return { done: false, value: "golf" };
            case 2:
              _arr.push.apply(_arr, __toArray(_received));
              _arr.push.apply(_arr, __toArray(arr2));
              _arr.push("hotel");
              value = getArgs.apply(void 0, _arr);
              ++_state;
              return { done: false, value: value };
            case 3:
              ++_state;
              return { done: true, value: _received };
            case 4:
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
      return expect(toArray(fun(), [
        "india",
        ["juliet", "kilo"]
      ])).to.eql([
        "foxtrot",
        "golf",
        [
          "echo",
          "india",
          "alpha",
          "bravo",
          "juliet",
          "kilo",
          "charlie",
          "delta",
          "hotel"
        ]
      ]);
    });
  });
  describe("yield in method call expression with spread", function () {
    return it("yields expected items", function () {
      var arr1, arr2, obj;
      obj = {
        getArgs: function () {
          var args;
          args = __slice.call(arguments);
          expect(this).to.equal(obj);
          return args;
        }
      };
      arr1 = ["alpha", "bravo"];
      arr2 = ["charlie", "delta"];
      function fun() {
        var _arr, _e, _send, _state, _step, _throw, value;
        _state = 0;
        function _close() {
          _state = 4;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _arr = ["echo"];
              ++_state;
              return { done: false, value: "foxtrot" };
            case 1:
              _arr.push(_received);
              _arr.push.apply(_arr, __toArray(arr1));
              ++_state;
              return { done: false, value: "golf" };
            case 2:
              _arr.push.apply(_arr, __toArray(_received));
              _arr.push.apply(_arr, __toArray(arr2));
              _arr.push("hotel");
              value = obj.getArgs.apply(obj, _arr);
              ++_state;
              return { done: false, value: value };
            case 3:
              ++_state;
              return { done: true, value: _received };
            case 4:
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
      return expect(toArray(fun(), [
        "india",
        ["juliet", "kilo"]
      ])).to.eql([
        "foxtrot",
        "golf",
        [
          "echo",
          "india",
          "alpha",
          "bravo",
          "juliet",
          "kilo",
          "charlie",
          "delta",
          "hotel"
        ]
      ]);
    });
  });
  describe("yield in new call expression", function () {
    return it("yields expected items", function () {
      var arr1, arr2;
      function MyType() {
        var args;
        args = __slice.call(arguments);
        expect(this).to.be.an["instanceof"](MyType);
        this.args = args;
      }
      arr1 = ["alpha", "bravo"];
      arr2 = ["charlie", "delta"];
      function fun() {
        var _arr, _e, _send, _state, _step, _throw, value;
        _state = 0;
        function _close() {
          _state = 4;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _arr = ["echo"];
              ++_state;
              return { done: false, value: "foxtrot" };
            case 1:
              _arr.push(_received);
              _arr.push.apply(_arr, __toArray(arr1));
              ++_state;
              return { done: false, value: "golf" };
            case 2:
              _arr.push.apply(_arr, __toArray(_received));
              _arr.push.apply(_arr, __toArray(arr2));
              _arr.push("hotel");
              value = __new.apply(MyType, _arr);
              expect(value).to.be.an["instanceof"](MyType);
              ++_state;
              return { done: false, value: value.args };
            case 3:
              ++_state;
              return { done: true, value: _received };
            case 4:
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
      return expect(toArray(fun(), [
        "india",
        ["juliet", "kilo"]
      ])).to.eql([
        "foxtrot",
        "golf",
        [
          "echo",
          "india",
          "alpha",
          "bravo",
          "juliet",
          "kilo",
          "charlie",
          "delta",
          "hotel"
        ]
      ]);
    });
  });
  describe("yield in apply call expression", function () {
    return it("yields expected items", function () {
      var arr1, arr2, obj;
      obj = {};
      function getArgs() {
        var args;
        args = __slice.call(arguments);
        expect(this).to.equal(obj);
        return args;
      }
      arr1 = ["alpha", "bravo"];
      arr2 = ["charlie", "delta"];
      function fun() {
        var _arr, _e, _send, _state, _step, _throw, value;
        _state = 0;
        function _close() {
          _state = 4;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _arr = ["echo"];
              ++_state;
              return { done: false, value: "foxtrot" };
            case 1:
              _arr.push(_received);
              _arr.push.apply(_arr, __toArray(arr1));
              ++_state;
              return { done: false, value: "golf" };
            case 2:
              _arr.push.apply(_arr, __toArray(_received));
              _arr.push.apply(_arr, __toArray(arr2));
              _arr.push("hotel");
              value = getArgs.apply(obj, _arr);
              ++_state;
              return { done: false, value: value };
            case 3:
              ++_state;
              return { done: true, value: _received };
            case 4:
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
      return expect(toArray(fun(), [
        "india",
        ["juliet", "kilo"]
      ])).to.eql([
        "foxtrot",
        "golf",
        [
          "echo",
          "india",
          "alpha",
          "bravo",
          "juliet",
          "kilo",
          "charlie",
          "delta",
          "hotel"
        ]
      ]);
    });
  });
  describe("yield in apply method call expression", function () {
    return it("yields expected items", function () {
      var arr1, arr2, obj, other;
      obj = {};
      other = {
        getArgs: function () {
          var args;
          args = __slice.call(arguments);
          expect(this).to.equal(obj);
          return args;
        }
      };
      arr1 = ["alpha", "bravo"];
      arr2 = ["charlie", "delta"];
      function fun() {
        var _arr, _e, _send, _state, _step, _throw, _tmp, value;
        _state = 0;
        function _close() {
          _state = 4;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _tmp = other.getArgs;
              _arr = ["echo"];
              ++_state;
              return { done: false, value: "foxtrot" };
            case 1:
              _arr.push(_received);
              _arr.push.apply(_arr, __toArray(arr1));
              ++_state;
              return { done: false, value: "golf" };
            case 2:
              _arr.push.apply(_arr, __toArray(_received));
              _arr.push.apply(_arr, __toArray(arr2));
              _arr.push("hotel");
              value = _tmp.apply(obj, _arr);
              ++_state;
              return { done: false, value: value };
            case 3:
              ++_state;
              return { done: true, value: _received };
            case 4:
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
      return expect(toArray(fun(), [
        "india",
        ["juliet", "kilo"]
      ])).to.eql([
        "foxtrot",
        "golf",
        [
          "echo",
          "india",
          "alpha",
          "bravo",
          "juliet",
          "kilo",
          "charlie",
          "delta",
          "hotel"
        ]
      ]);
    });
  });
  describe("yield in eval", function () {
    function fun() {
      var _e, _send, _state, _step, _throw, x, y;
      _state = 0;
      function _close() {
        _state = 4;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: "alpha" };
          case 1:
            x = _received;
            ++_state;
            return { done: false, value: "bravo" };
          case 2:
            y = eval(_received);
            ++_state;
            return { done: false, value: y };
          case 3:
            ++_state;
            return { done: true, value: _received };
          case 4:
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
    return it("yields expected items", function () {
      return expect(toArray(fun(), ["charlie", "x"])).to.eql(["alpha", "bravo", "charlie"]);
    });
  });
  describe("yield in unary expression", function () {
    function fun() {
      var _e, _send, _state, _step, _throw, value;
      _state = 0;
      function _close() {
        _state = 3;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: "alpha" };
          case 1:
            value = !_received;
            ++_state;
            return { done: false, value: value };
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
    return it("yields expected items", function () {
      return expect(toArray(fun(), [false])).to.eql(["alpha", true]);
    });
  });
  describe("yield in string interpolation", function () {
    function fun() {
      var _arr, _arr2, _e, _send, _state, _step, _throw, _tmp, value;
      _state = 0;
      function _close() {
        _state = 4;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: "alpha" };
          case 1:
            _tmp = __strnum(_received);
            _tmp = _tmp + " ";
            ++_state;
            return { done: false, value: "bravo" };
          case 2:
            value = _tmp + __strnum(_received);
            ++_state;
            return { done: false, value: value };
          case 3:
            ++_state;
            return { done: true, value: _received };
          case 4:
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
    return it("yields expected items", function () {
      return expect(toArray(fun(), ["charlie", "delta"])).to.eql(["alpha", "bravo", "charlie delta"]);
    });
  });
  describe("yield in regexp interpolation", function () {
    function fun() {
      var _arr, _arr2, _arr3, _e, _send, _state, _step, _throw, _tmp, value;
      _state = 0;
      function _close() {
        _state = 4;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: "alpha" };
          case 1:
            _tmp = __strnum(_received);
            _tmp = _tmp + " ";
            ++_state;
            return { done: false, value: "bravo" };
          case 2:
            value = __new.apply(RegExp, [_tmp + __strnum(_received), "g"]);
            ++_state;
            return { done: false, value: value };
          case 3:
            ++_state;
            return { done: true, value: _received };
          case 4:
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
    return it("yields expected items", function () {
      var arr;
      arr = toArray(fun(), ["charlie", "delta"]);
      return expect(arr).to.eql(["alpha", "bravo", /charlie delta/g]);
    });
  });
  describe("yield yield", function () {
    function fun() {
      var _e, _send, _state, _step, _throw, value;
      _state = 0;
      function _close() {
        _state = 4;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: "alpha" };
          case 1:
            ++_state;
            return { done: false, value: _received };
          case 2:
            value = _received;
            ++_state;
            return { done: false, value: value };
          case 3:
            ++_state;
            return { done: true, value: _received };
          case 4:
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
    return it("yields expected items", function () {
      return expect(toArray(fun(), ["bravo", "charlie"])).to.eql(["alpha", "bravo", "charlie"]);
    });
  });
  describe("yielding a call which has a yield", function () {
    function fun(func) {
      var _arr, _e, _send, _state, _step, _throw;
      _state = 0;
      function _close() {
        _state = 3;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            _arr = [];
            ++_state;
            return { done: false, value: "alpha" };
          case 1:
            _arr.push(_received);
            ++_state;
            return { done: false, value: "bravo" };
          case 2:
            _arr.push(_received);
            ++_state;
            return {
              done: false,
              value: func.apply(void 0, _arr)
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
    }
    return it("yields expected items", function () {
      var func;
      func = stub().withArgs("charlie", "delta").returns("echo");
      return expect(toArray(fun(func), ["charlie", "delta"])).to.eql(["alpha", "bravo", "echo"]);
    });
  });
  describe("return in generator", function () {
    function fun(returnEarly) {
      var _e, _send, _state, _step, _throw;
      _state = 0;
      function _close() {
        _state = 4;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: "alpha" };
          case 1:
            _state = returnEarly ? 4 : 2;
            break;
          case 2:
            ++_state;
            return { done: false, value: "bravo" };
          case 3:
            ++_state;
            return { done: true, value: _received };
          case 4:
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
    return it("yields expected items", function () {
      expect(toArray(fun(true))).to.eql(["alpha"]);
      return expect(toArray(fun(false))).to.eql(["alpha", "bravo"]);
    });
  });
  describe("return with value in generator", function () {
    function fun(value) {
      var _e, _send, _state, _step, _throw;
      _state = 0;
      function _close() {
        _state = 5;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: "alpha" };
          case 1:
            _state = value != null ? 2 : 3;
            break;
          case 2:
            _state = 5;
            return { done: true, value: value };
          case 3:
            ++_state;
            return { done: false, value: "bravo" };
          case 4:
            ++_state;
            return { done: true, value: _received };
          case 5:
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
    return it("yields expected items", function () {
      var i, iter;
      iter = fun("charlie");
      expect(toArray(iter)).to.eql({ arr: ["alpha"], value: "charlie" });
      for (i = 0; i < 10; ++i) {
        expect(iter.next()).to.eql({ done: true, value: void 0 });
      }
      iter = fun();
      expect(toArray(iter)).to.eql(["alpha", "bravo"]);
      for (i = 0; i < 10; ++i) {
        expect(iter.next()).to.eql({ done: true, value: void 0 });
      }
    });
  });
  describe("auto-return", function () {
    it("works with if statement", function () {
      var i, iter;
      function fun(check) {
        var _e, _send, _state, _step, _throw;
        _state = 0;
        function _close() {
          _state = 4;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: "alpha" };
            case 1:
              _state = check ? 2 : 3;
              break;
            case 2:
              _state = 4;
              return { done: true, value: "bravo" };
            case 3:
              ++_state;
              return { done: true, value: "charlie" };
            case 4:
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
      iter = fun(true);
      expect(toArray(iter)).to.eql({ arr: ["alpha"], value: "bravo" });
      for (i = 0; i < 10; ++i) {
        expect(iter.next()).to.eql({ done: true, value: void 0 });
      }
      iter = fun(false);
      expect(toArray(iter)).to.eql({ arr: ["alpha"], value: "charlie" });
      for (i = 0; i < 10; ++i) {
        expect(iter.next()).to.eql({ done: true, value: void 0 });
      }
    });
    it("works with switch statement", function () {
      var i, iter;
      function fun(check) {
        var _e, _send, _state, _step, _throw;
        _state = 0;
        function _close() {
          _state = 8;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: "alpha" };
            case 1:
              switch (check) {
              case 0:
                _state = 2;
                break;
              case 1:
                _state = 4;
                break;
              case 2:
                _state = 5;
                break;
              default: _state = 7;
              }
              break;
            case 2:
              ++_state;
              return { done: false, value: "bravo" };
            case 3:
              _state = 8;
              return { done: true, value: "charlie" };
            case 4:
              ++_state;
              return { done: false, value: "delta" };
            case 5:
              ++_state;
              return { done: false, value: "echo" };
            case 6:
              _state = 8;
              return { done: true, value: "foxtrot" };
            case 7:
              ++_state;
              return { done: true, value: "golf" };
            case 8:
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
      iter = fun(0);
      expect(toArray(iter)).to.eql({
        arr: ["alpha", "bravo"],
        value: "charlie"
      });
      for (i = 0; i < 10; ++i) {
        expect(iter.next()).to.eql({ done: true, value: void 0 });
      }
      iter = fun(1);
      expect(toArray(iter)).to.eql({
        arr: ["alpha", "delta", "echo"],
        value: "foxtrot"
      });
      for (i = 0; i < 10; ++i) {
        expect(iter.next()).to.eql({ done: true, value: void 0 });
      }
      iter = fun(2);
      expect(toArray(iter)).to.eql({
        arr: ["alpha", "echo"],
        value: "foxtrot"
      });
      for (i = 0; i < 10; ++i) {
        expect(iter.next()).to.eql({ done: true, value: void 0 });
      }
      iter = fun(3);
      expect(toArray(iter)).to.eql({ arr: ["alpha"], value: "golf" });
      for (i = 0; i < 10; ++i) {
        expect(iter.next()).to.eql({ done: true, value: void 0 });
      }
    });
    it("works with try-catch statement", function () {
      var i, iter;
      function fun(err) {
        var _e, _err, _send, _state, _step, _throw;
        _state = 0;
        function _close() {
          _state = 5;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: "alpha" };
            case 1:
              ++_state;
              return { done: false, value: "bravo" };
            case 2:
              if (err != null) {
                throw err;
              }
              _state = 5;
              return { done: true, value: "charlie" };
            case 3:
              ++_state;
              return { done: false, value: "delta" };
            case 4:
              ++_state;
              return { done: true, value: "echo" };
            case 5:
              return { done: true, value: void 0 };
            default: throw new Error("Unknown state: " + _state);
            }
          }
        }
        function _throw(_e) {
          if (_state === 1 || _state === 2) {
            _err = _e;
            _state = 3;
          } else {
            _close();
            throw _e;
          }
        }
        function _send(_received) {
          while (true) {
            try {
              return _step(_received);
            } catch (_e) {
              _throw(_e);
            }
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
      iter = fun();
      expect(toArray(iter)).to.eql({
        arr: ["alpha", "bravo"],
        value: "charlie"
      });
      for (i = 0; i < 10; ++i) {
        expect(iter.next()).to.eql({ done: true, value: void 0 });
      }
      iter = fun({});
      expect(toArray(iter)).to.eql({
        arr: ["alpha", "bravo", "delta"],
        value: "echo"
      });
      for (i = 0; i < 10; ++i) {
        expect(iter.next()).to.eql({ done: true, value: void 0 });
      }
    });
    it("works with try-finally statement", function () {
      var done, i, iter, obj;
      done = stub();
      function fun(err) {
        var _e, _finallies, _send, _state, _step, _throw;
        _state = 0;
        _finallies = [];
        function _finally() {
          done();
        }
        function _close() {
          var _f;
          _state = 3;
          _f = _finallies.pop();
          if (_f) {
            try {
              _f();
            } finally {
              _close();
            }
          }
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: "alpha" };
            case 1:
              _finallies.push(_finally);
              ++_state;
              return { done: false, value: "bravo" };
            case 2:
              if (err != null) {
                throw err;
              }
              ++_state;
              return { done: true, value: "charlie" };
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
          } finally {
            if (_state === 3) {
              _close();
            }
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
      iter = fun();
      expect(toArray(iter)).to.eql({
        arr: ["alpha", "bravo"],
        value: "charlie"
      });
      for (i = 0; i < 10; ++i) {
        expect(iter.next()).to.eql({ done: true, value: void 0 });
      }
      expect(done).to.be.calledOnce;
      obj = {};
      iter = fun(obj);
      expect(iter.next()).to.eql({ done: false, value: "alpha" });
      expect(iter.next()).to.eql({ done: false, value: "bravo" });
      expect(done).to.be.calledOnce;
      expect(function () {
        return iter.next();
      }).to["throw"](obj);
      expect(done).to.be.calledTwice;
      for (i = 0; i < 10; ++i) {
        expect(iter.next()).to.eql({ done: true, value: void 0 });
      }
    });
    return it("auto-returning a yield", function () {
      var iter;
      function fun() {
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
              return { done: false, value: "alpha" };
            case 1:
              ++_state;
              return { done: false, value: "bravo" };
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
      iter = fun();
      expect(iter.send(void 0)).to.eql({ done: false, value: "alpha" });
      expect(iter.send(void 0)).to.eql({ done: false, value: "bravo" });
      return expect(iter.send("charlie")).to.eql({ done: true, value: "charlie" });
    });
  });
  describe(
    "yield with an uncaught error returns that it's done after error",
    function () {
      function fun(obj) {
        var _e, _send, _state, _step, _throw;
        _state = 0;
        function _close() {
          _state = 2;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: "alpha" };
            case 1: throw obj;
            case 2:
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
      return it("yields expected items", function () {
        var err, i, iter;
        err = new Error();
        iter = fun(err);
        expect(iter.next()).to.eql({ done: false, value: "alpha" });
        expect(function () {
          return iter.next();
        }).throws(err);
        for (i = 0; i < 10; ++i) {
          expect(iter.next()).to.eql({ done: true, value: void 0 });
        }
      });
    }
  );
  describe("a generator without yield statements", function () {
    it("has no items", function () {
      var fun, i, iter, ran;
      ran = stub();
      fun = __generator(function () {
        return ran();
      });
      iter = fun();
      for (i = 0; i < 10; ++i) {
        expect(iter.next()).to.eql({ done: true, value: void 0 });
      }
      return expect(ran).to.be.calledOnce;
    });
    it("is not executed until the first .next call", function () {
      var fun, iter, ran;
      ran = stub();
      fun = __generator(function () {
        return ran();
      });
      iter = fun();
      expect(ran).to.not.be.called;
      iter.next();
      return expect(ran).to.be.calledOnce;
    });
    it("has a result if value is returned", function () {
      var fun, i, iter, ran;
      ran = stub();
      fun = __generator(function () {
        ran();
        return "hello";
      });
      iter = fun();
      expect(iter.next()).to.eql({ done: true, value: "hello" });
      for (i = 0; i < 10; ++i) {
        expect(iter.next()).to.eql({ done: true, value: void 0 });
      }
      return expect(ran).to.be.calledOnce;
    });
    it("has a result if value is auto-returned", function () {
      var fun, i, iter, ran;
      ran = stub();
      fun = __generator(function () {
        ran();
        return "hello";
      });
      iter = fun();
      expect(iter.next()).to.eql({ done: true, value: "hello" });
      for (i = 0; i < 10; ++i) {
        expect(iter.next()).to.eql({ done: true, value: void 0 });
      }
      return expect(ran).to.be.calledOnce;
    });
    it("has no result if function does not auto-return", function () {
      var fun, i, iter, ran;
      ran = stub();
      fun = __generator(function () {
        ran();
      });
      iter = fun();
      expect(iter.next()).to.eql({ done: true, value: void 0 });
      for (i = 0; i < 10; ++i) {
        expect(iter.next()).to.eql({ done: true, value: void 0 });
      }
      return expect(ran).to.be.calledOnce;
    });
    it("has the expected this value", function () {
      var fun, iter, obj, ran;
      obj = {};
      ran = stub();
      fun = __generator(function () {
        var _this;
        _this = this;
        ran();
        return expect(_this).to.equal(obj);
      });
      iter = fun.call(obj);
      iter.next();
      return expect(ran).to.be.calledOnce;
    });
    return it("receives expected arguments", function () {
      var fun, iter, ran;
      ran = stub();
      fun = __generator(function () {
        var args;
        args = __slice.call(arguments);
        ran();
        return expect(args).to.eql(["alpha", "bravo", "charlie"]);
      });
      iter = fun("alpha", "bravo", "charlie");
      iter.next();
      return expect(ran).to.be.calledOnce;
    });
  });
  describe("yield without a value", function () {
    return it("should be the same as yield void", function () {
      var finish, iter, middle, start;
      start = stub();
      middle = stub();
      finish = stub();
      function fun() {
        var _e, _send, _state, _step, _throw, x;
        _state = 0;
        function _close() {
          _state = 3;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              start();
              ++_state;
              return { done: false, value: void 0 };
            case 1:
              middle();
              ++_state;
              return { done: false, value: void 0 };
            case 2:
              x = _received;
              finish();
              ++_state;
              return { done: true, value: x };
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
      iter = fun();
      expect(start).to.not.be.called;
      expect(iter.next()).to.be.eql({ done: false, value: void 0 });
      expect(start).to.be.called;
      expect(middle).to.not.be.called;
      expect(iter.next()).to.be.eql({ done: false, value: void 0 });
      expect(middle).to.be.called;
      expect(finish).to.not.be.called;
      expect(iter.send("hello")).to.be.eql({ done: true, value: "hello" });
      expect(start).to.be.calledOnce;
      expect(middle).to.be.calledOnce;
      return expect(finish).to.be.calledOnce;
    });
  });
  it("yield* returns the expected expression", function () {
    function iter() {
      var _e, _send, _state, _step, _throw;
      _state = 0;
      function _close() {
        _state = 4;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: "alpha" };
          case 1:
            ++_state;
            return { done: false, value: "bravo" };
          case 2:
            ++_state;
            return { done: false, value: "charlie" };
          case 3:
            ++_state;
            return { done: true, value: "delta" };
          case 4:
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
    function fun() {
      var _e, _e2, _item, _iter, _send, _state, _step, _throw, _tmp, x;
      _state = 0;
      function _close() {
        _state = 9;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            ++_state;
            return { done: false, value: "echo" };
          case 1:
            _iter = __iter(iter());
            _tmp = void 0;
            _send = true;
            ++_state;
          case 2: ++_state;
          case 3:
            if (_send) {
              _item = _iter.send(_tmp);
            } else {
              _item = _iter["throw"](_tmp);
            }
            _state = _item.done ? 7 : 4;
            break;
          case 4:
            ++_state;
            return { done: false, value: _item.value };
          case 5:
            _tmp = _received;
            _send = true;
            _state = 2;
            break;
          case 6:
            _tmp = _e;
            _send = false;
            _state = 2;
            break;
          case 7:
            try {
              _iter.close();
            } catch (_e) {}
            x = _item.value;
            ++_state;
            return { done: false, value: x };
          case 8:
            ++_state;
            return { done: true, value: _received };
          case 9:
            return { done: true, value: void 0 };
          default: throw new Error("Unknown state: " + _state);
          }
        }
      }
      function _throw(_e2) {
        if (_state === 4 || _state === 5) {
          _e = _e2;
          _state = 6;
        } else {
          _close();
          throw _e2;
        }
      }
      function _send(_received) {
        while (true) {
          try {
            return _step(_received);
          } catch (_e2) {
            _throw(_e2);
          }
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
        "throw": function (_e2) {
          _throw(_e2);
          return _send(void 0);
        }
      };
    }
    return expect(toArray(fun())).to.eql([
      "echo",
      "alpha",
      "bravo",
      "charlie",
      "delta"
    ]);
  });
  describe("variables set to undefined", function () {
    it("inside loop should be reset to undefined", function () {
      function iter() {
        var _e, _send, _state, _step, _throw, i, value;
        _state = 0;
        function _close() {
          _state = 7;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              i = 1;
              ++_state;
            case 1:
              _state = i < 10 ? 2 : 6;
              break;
            case 2:
              value = void 0;
              _state = i === 5 ? 3 : 4;
              break;
            case 3:
              value = "other";
              _state = 5;
              return { done: false, value: value };
            case 4:
              expect(value).to.equal(void 0);
              ++_state;
            case 5:
              ++i;
              _state = 1;
              break;
            case 6:
              ++_state;
              return { done: false, value: "done" };
            case 7:
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
      return expect(toArray(iter())).to.eql(["other", "done"]);
    });
    it("outside loop should be reset to undefined", function () {
      function iter() {
        var _e, _send, _state, _step, _throw, i, value;
        _state = 0;
        function _close() {
          _state = 7;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              i = 1;
              ++_state;
            case 1:
              _state = i < 10 ? 2 : 6;
              break;
            case 2:
              value = void 0;
              _state = i === 5 ? 3 : 4;
              break;
            case 3:
              value = "other";
              _state = 5;
              return { done: false, value: value };
            case 4:
              expect(value).to.equal(void 0);
              ++_state;
            case 5:
              ++i;
              _state = 1;
              break;
            case 6:
              expect(value).to.equal(void 0);
              ++_state;
              return { done: false, value: "done" };
            case 7:
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
      return expect(toArray(iter())).to.eql(["other", "done"]);
    });
    return it(
      "outside loop should be expected value, even after setting to undefined",
      function () {
        function iter() {
          var _e, _send, _state, _step, _throw, i, value;
          _state = 0;
          function _close() {
            _state = 7;
          }
          function _step(_received) {
            while (true) {
              switch (_state) {
              case 0:
                i = 1;
                ++_state;
              case 1:
                _state = i < 10 ? 2 : 6;
                break;
              case 2:
                _state = i === 5 ? 3 : 4;
                break;
              case 3:
                value = "other";
                _state = 6;
                return { done: false, value: value };
              case 4:
                expect(value).to.equal(void 0);
                ++_state;
              case 5:
                ++i;
                _state = 1;
                break;
              case 6:
                expect(value).to.equal("other");
                value = void 0;
                expect(value).to.equal(void 0);
                ++_state;
                return { done: false, value: "done" };
              case 7:
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
        return expect(toArray(iter())).to.eql(["other", "done"]);
      }
    );
  });
  describe("yield within a spread", function () {
    it("as a normal statement", function () {
      var f, iter;
      f = stub().withArgs("bravo", "charlie");
      function fun() {
        var _arr, _e, _send, _state, _step, _throw;
        _state = 0;
        function _close() {
          _state = 2;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _arr = [];
              ++_state;
              return { done: false, value: "alpha" };
            case 1:
              _arr.push.apply(_arr, __toArray(_received));
              f.apply(void 0, _arr);
              ++_state;
            case 2:
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
      iter = fun();
      expect(iter.send(void 0)).to.eql({ done: false, value: "alpha" });
      expect(iter.send(["bravo", "charlie"])).to.eql({ done: true, value: void 0 });
      return expect(f).to.be.calledOnce;
    });
    return it("as the return statement", function () {
      var f, iter;
      f = stub().withArgs("bravo", "charlie").returns("delta");
      function fun() {
        var _arr, _e, _send, _state, _step, _throw;
        _state = 0;
        function _close() {
          _state = 2;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              _arr = [];
              ++_state;
              return { done: false, value: "alpha" };
            case 1:
              _arr.push.apply(_arr, __toArray(_received));
              ++_state;
              return {
                done: true,
                value: f.apply(void 0, _arr)
              };
            case 2:
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
      iter = fun();
      expect(iter.send(void 0)).to.eql({ done: false, value: "alpha" });
      expect(iter.send(["bravo", "charlie"])).to.eql({ done: true, value: "delta" });
      return expect(f).to.be.calledOnce;
    });
  });
  describe("function declaration hoisting", function () {
    return it(
      "hoists function declarations to the generator's scope rather than inside the send method",
      function () {
        return expect(gorilla.compileSync('let generator()!*\n  let my-func()\n    "hello"\n  yield my-func()').code).to.match(/function myFunc\(\)/);
      }
    );
  });
}.call(this));
