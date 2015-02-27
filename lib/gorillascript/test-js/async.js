(function (GLOBAL) {
  "use strict";
  var __arrayToIter, __async, __asyncIter, __cmp, __create, __curry, __isArray,
      __iter, __keys, __lt, __num, __once, __owns, __slice, __toArray, __typeof,
      _ref, expect, setImmediate, spy, stub;
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
  __async = function (limit, length, hasResult, onValue, onComplete) {
    var broken, completed, index, result, slotsUsed, sync;
    if (typeof limit !== "number") {
      throw new TypeError("Expected limit to be a Number, got " + __typeof(limit));
    }
    if (typeof length !== "number") {
      throw new TypeError("Expected length to be a Number, got " + __typeof(length));
    }
    if (hasResult == null) {
      hasResult = false;
    } else if (typeof hasResult !== "boolean") {
      throw new TypeError("Expected hasResult to be a Boolean, got " + __typeof(hasResult));
    }
    if (typeof onValue !== "function") {
      throw new TypeError("Expected onValue to be a Function, got " + __typeof(onValue));
    }
    if (typeof onComplete !== "function") {
      throw new TypeError("Expected onComplete to be a Function, got " + __typeof(onComplete));
    }
    if (hasResult) {
      result = [];
    } else {
      result = null;
    }
    if (length <= 0) {
      return onComplete(null, result);
    }
    if (limit < 1 || limit !== limit) {
      limit = 1/0;
    }
    broken = null;
    slotsUsed = 0;
    sync = false;
    completed = false;
    function onValueCallback(err, value) {
      if (completed) {
        return;
      }
      --slotsUsed;
      if (err != null && broken == null) {
        broken = err;
      }
      if (hasResult && broken == null && arguments.length > 1) {
        result.push(value);
      }
      if (!sync) {
        next();
      }
    }
    index = -1;
    function next() {
      while (!completed && broken == null && slotsUsed < limit && ++index < length) {
        ++slotsUsed;
        sync = true;
        onValue(index, __once(onValueCallback));
        sync = false;
      }
      if (!completed && (broken != null || slotsUsed === 0)) {
        completed = true;
        if (broken != null) {
          onComplete(broken);
        } else {
          onComplete(null, result);
        }
      }
    }
    next();
  };
  __asyncIter = function (limit, iterator, hasResult, onValue, onComplete) {
    var broken, close, completed, index, iterStopped, result, slotsUsed, sync;
    if (typeof limit !== "number") {
      throw new TypeError("Expected limit to be a Number, got " + __typeof(limit));
    }
    if (typeof iterator !== "object" || iterator === null) {
      throw new TypeError("Expected iterator to be an Object, got " + __typeof(iterator));
    } else if (typeof iterator.next !== "function") {
      throw new TypeError("Expected iterator.next to be a Function, got " + __typeof(iterator.next));
    }
    if (hasResult == null) {
      hasResult = false;
    } else if (typeof hasResult !== "boolean") {
      throw new TypeError("Expected hasResult to be a Boolean, got " + __typeof(hasResult));
    }
    if (typeof onValue !== "function") {
      throw new TypeError("Expected onValue to be a Function, got " + __typeof(onValue));
    }
    if (typeof onComplete !== "function") {
      throw new TypeError("Expected onComplete to be a Function, got " + __typeof(onComplete));
    }
    if (limit < 1 || limit !== limit) {
      limit = 1/0;
    }
    broken = null;
    slotsUsed = 0;
    sync = false;
    if (hasResult) {
      result = [];
    } else {
      result = null;
    }
    completed = false;
    function onValueCallback(err, value) {
      if (completed) {
        return;
      }
      --slotsUsed;
      if (err != null && broken == null) {
        broken = err;
      }
      if (hasResult && broken == null && arguments.length > 1) {
        result.push(value);
      }
      if (!sync) {
        next();
      }
    }
    index = -1;
    iterStopped = false;
    close = function () {
      close = function () {};
      try {
        return iterator.close();
      } catch (e) {}
    };
    function next() {
      var item;
      while (!completed && broken == null && slotsUsed < limit && !iterStopped) {
        try {
          item = iterator.next();
        } catch (e) {
          broken = e;
          break;
        }
        if (item.done) {
          iterStopped = true;
          break;
        }
        ++slotsUsed;
        sync = true;
        try {
          onValue(item.value, ++index, __once(onValueCallback));
        } catch (e) {
          close();
          throw e;
        }
        sync = false;
      }
      if (!completed && (broken != null || slotsUsed === 0)) {
        completed = true;
        close();
        if (broken != null) {
          onComplete(broken);
        } else {
          onComplete(null, result);
        }
      }
    }
    next();
  };
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
  __keys = typeof Object.keys === "function" ? Object.keys
    : function (x) {
      var key, keys;
      keys = [];
      for (key in x) {
        if (__owns.call(x, key)) {
          keys.push(key);
        }
      }
      return keys;
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
  __num = function (num) {
    if (typeof num !== "number") {
      throw new TypeError("Expected a number, got " + __typeof(num));
    } else {
      return num;
    }
  };
  __once = (function () {
    function replacement() {
      throw new Error("Attempted to call function more than once");
    }
    function doNothing() {}
    return function (func, silentFail) {
      if (typeof func !== "function") {
        throw new TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      if (silentFail == null) {
        silentFail = false;
      } else if (typeof silentFail !== "boolean") {
        throw new TypeError("Expected silentFail to be a Boolean, got " + __typeof(silentFail));
      }
      return function () {
        var f;
        f = func;
        if (silentFail) {
          func = doNothing;
        } else {
          func = replacement;
        }
        return f.apply(this, arguments);
      };
    };
  }());
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
  setImmediate = typeof GLOBAL.setImmediate === "function" ? GLOBAL.setImmediate
    : typeof process !== "undefined" && typeof process.nextTick === "function"
    ? (function (nextTick) {
      return function (func) {
        var args;
        if (typeof func !== "function") {
          throw new TypeError("Expected func to be a Function, got " + __typeof(func));
        }
        args = __slice.call(arguments, 1);
        if (args.length) {
          return nextTick(function () {
            func.apply(void 0, __toArray(args));
          });
        } else {
          return nextTick(func);
        }
      };
    }(process.nextTick))
    : function (func) {
      var args;
      if (typeof func !== "function") {
        throw new TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      args = __slice.call(arguments, 1);
      if (args.length) {
        return setTimeout(
          function () {
            func.apply(void 0, args);
          },
          0
        );
      } else {
        return setTimeout(func, 0);
      }
    };
  expect = require("chai").expect;
  _ref = require("sinon");
  stub = _ref.stub;
  spy = _ref.spy;
  _ref = null;
  function now() {
    var _i, args, cb;
    _i = __num(arguments.length) - 1;
    if (_i > 0) {
      args = __slice.call(arguments, 0, _i);
    } else {
      _i = 0;
      args = [];
    }
    cb = arguments[_i];
    return cb.apply(void 0, args);
  }
  function soon() {
    var _i, args, cb;
    _i = __num(arguments.length) - 1;
    if (_i > 0) {
      args = __slice.call(arguments, 0, _i);
    } else {
      _i = 0;
      args = [];
    }
    cb = arguments[_i];
    return setImmediate.apply(void 0, [cb].concat(args));
  }
  describe("async statement", function () {
    it("receives expected values", function (cb) {
      var _once;
      return soon("a", "b", "c", (_once = false, function (x, y, z) {
        if (_once) {
          throw new Error("Attempted to call function more than once");
        } else {
          _once = true;
        }
        expect(x).to.equal("a");
        expect(y).to.equal("b");
        expect(z).to.equal("c");
        return cb();
      }));
    });
    return it("preserves this", function (cb) {
      function f() {
        var _once, _this, self;
        _this = this;
        self = this;
        return soon((_once = false, function () {
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          expect(_this).to.equal(self);
          return cb();
        }));
      }
      return f.call({});
    });
  });
  describe("async! statement", function () {
    it(
      "calls the provided function if an existing argument is provided",
      function (cb) {
        var _once, err;
        err = spy();
        function handler(x) {
          expect(x).to.equal(err);
          return cb();
        }
        return soon(err, (_once = false, function (_e) {
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (_e != null) {
            return handler(_e);
          }
          throw new Error("never reached");
        }));
      }
    );
    it(
      "does not call the provided function if an existing argument is not provided",
      function (cb) {
        var _once, handler;
        handler = stub();
        return soon(null, (_once = false, function (_e) {
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (typeof _e !== "undefined" && _e !== null) {
            return handler(_e);
          }
          expect(handler).to.not.be.called;
          return cb();
        }));
      }
    );
    it("receives expected values", function (cb) {
      var _once, handler;
      handler = stub();
      return soon(
        null,
        "a",
        "b",
        "c",
        (_once = false, function (_e, x, y, z) {
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (typeof _e !== "undefined" && _e !== null) {
            return handler(_e);
          }
          expect(handler).to.not.be.called;
          expect(x).to.equal("a");
          expect(y).to.equal("b");
          expect(z).to.equal("c");
          return cb();
        })
      );
    });
    it("preserves this", function (cb) {
      function f() {
        var _once, _this, handler, self;
        _this = this;
        handler = stub();
        self = this;
        return soon(null, (_once = false, function (_e) {
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (typeof _e !== "undefined" && _e !== null) {
            return handler(_e);
          }
          expect(handler).to.not.be.called;
          expect(_this).to.equal(self);
          return cb();
        }));
      }
      return f.call({});
    });
    return it("throws with async! throw", function (cb) {
      var err;
      err = new Error();
      function f() {
        var _once;
        return now(err, (_once = false, function (_e) {
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (_e != null) {
            throw _e;
          }
          throw new Error("never reached");
        }));
      }
      expect(f).to["throw"](err);
      return cb();
    });
  });
  describe("asyncfor", function () {
    describe("C-style", function () {
      it("can count up to 45", function (cb) {
        var _first, i, sum;
        i = 0;
        sum = 0;
        _first = true;
        function next(_err) {
          var _once;
          if (typeof _err !== "undefined" && _err !== null) {
            return _done(_err);
          }
          if (_first) {
            _first = false;
          } else {
            ++i;
          }
          if (i >= 10) {
            return _done(null);
          }
          return soon((_once = false, function () {
            if (_once) {
              throw new Error("Attempted to call function more than once");
            } else {
              _once = true;
            }
            sum += i;
            return next();
          }));
        }
        function _done(_err) {
          expect(sum).to.equal(45);
          return cb();
        }
        return next();
      });
      it("preserves this", function (cb) {
        function f() {
          var _first, _this, i, self;
          _this = this;
          self = this;
          i = 0;
          _first = true;
          function next(_err) {
            var _once;
            if (typeof _err !== "undefined" && _err !== null) {
              return _done(_err);
            }
            if (_first) {
              _first = false;
            } else {
              ++i;
            }
            if (i >= 10) {
              return _done(null);
            }
            expect(_this).to.equal(self);
            return soon((_once = false, function () {
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              expect(_this).to.equal(self);
              return next();
            }));
          }
          function _done(_err) {
            return cb();
          }
          return next();
        }
        return f.call({});
      });
      it("breaks when an error is passed to the callback", function (cb) {
        var _first, err, i;
        i = 0;
        err = spy();
        _first = true;
        function next(e) {
          var _once;
          if (typeof e !== "undefined" && e !== null) {
            return _done(e);
          }
          if (_first) {
            _first = false;
          } else {
            ++i;
          }
          if (i >= 10) {
            return _done(null);
          }
          return soon((_once = false, function () {
            if (_once) {
              throw new Error("Attempted to call function more than once");
            } else {
              _once = true;
            }
            if (i === 3) {
              return next(err);
            } else {
              return next();
            }
          }));
        }
        function _done(e) {
          expect(e).to.equal(err);
          expect(i).to.equal(3);
          return cb();
        }
        return next();
      });
      it(
        "breaks when an error is passed to the callback, if a result is expected",
        function (cb) {
          var _arr, _first, err, i;
          i = 0;
          err = spy();
          _first = true;
          _arr = [];
          function next(e, _value) {
            var _once;
            if (typeof e !== "undefined" && e !== null) {
              return _done(e);
            }
            if (_first) {
              _first = false;
            } else {
              ++i;
              if (arguments.length > 1) {
                _arr.push(_value);
              }
            }
            if (i >= 10) {
              return _done(null, _arr);
            }
            return soon((_once = false, function () {
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              if (i === 3) {
                return next(err);
              } else {
                return next();
              }
            }));
          }
          function _done(e, result) {
            expect(e).to.equal(err);
            expect(i).to.equal(3);
            expect(result).to.not.exist;
            return cb();
          }
          return next();
        }
      );
      return it("produces an array if a result is expected", function (cb) {
        var _arr, _first, i;
        i = 0;
        _first = true;
        _arr = [];
        function next(e, _value) {
          var _once;
          if (typeof e !== "undefined" && e !== null) {
            return _done(e);
          }
          if (_first) {
            _first = false;
          } else {
            ++i;
            if (arguments.length > 1) {
              _arr.push(_value);
            }
          }
          if (i >= 10) {
            return _done(null, _arr);
          }
          return soon((_once = false, function () {
            if (_once) {
              throw new Error("Attempted to call function more than once");
            } else {
              _once = true;
            }
            return next(null, i * i);
          }));
        }
        function _done(e, result) {
          expect(e).to.not.exist;
          expect(result).to.eql([
            0,
            1,
            4,
            9,
            16,
            25,
            36,
            49,
            64,
            81
          ]);
          return cb();
        }
        return next();
      });
    });
    describe("in range", function () {
      it("can count up to 45", function (cb) {
        var sum;
        sum = 0;
        return __async(
          1,
          10,
          false,
          function (_i, next) {
            var _once, i;
            i = +_i;
            return soon((_once = false, function () {
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              sum += i;
              return next();
            }));
          },
          function (_err) {
            expect(sum).to.equal(45);
            return cb();
          }
        );
      });
      it("preserves this", function (cb) {
        function f() {
          var _this, self;
          _this = this;
          self = this;
          return __async(
            1,
            10,
            false,
            function (_i, next) {
              var _once, i;
              i = +_i;
              expect(_this).to.equal(self);
              return soon((_once = false, function () {
                if (_once) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once = true;
                }
                expect(_this).to.equal(self);
                return next();
              }));
            },
            function (_err) {
              return cb();
            }
          );
        }
        return f.call({});
      });
      it("breaks when an error is passed to the callback", function (cb) {
        var err, maximum;
        maximum = 0;
        err = spy();
        return __async(
          1,
          10,
          false,
          function (_i, next) {
            var _once, i;
            i = +_i;
            maximum = i;
            return soon((_once = false, function () {
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              if (i === 3) {
                return next(err);
              } else {
                return next();
              }
            }));
          },
          function (e) {
            expect(e).to.equal(err);
            expect(maximum).to.equal(3);
            return cb();
          }
        );
      });
      it(
        "breaks when an error is passed to the callback, if a result is expected",
        function (cb) {
          var err, maximum;
          maximum = 0;
          err = spy();
          return __async(
            1,
            10,
            true,
            function (_i, next) {
              var _once, i;
              i = +_i;
              maximum = i;
              return soon((_once = false, function () {
                if (_once) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once = true;
                }
                if (i === 3) {
                  return next(err);
                } else {
                  return next();
                }
              }));
            },
            function (e, result) {
              expect(e).to.equal(err);
              expect(maximum).to.equal(3);
              expect(result).to.not.exist;
              return cb();
            }
          );
        }
      );
      return it("produces an array if a result is expected", function (cb) {
        return __async(
          1,
          10,
          true,
          function (_i, next) {
            var _once, i;
            i = +_i;
            return soon((_once = false, function () {
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              return next(null, i * i);
            }));
          },
          function (e, result) {
            expect(e).to.not.exist;
            expect(result).to.eql([
              0,
              1,
              4,
              9,
              16,
              25,
              36,
              49,
              64,
              81
            ]);
            return cb();
          }
        );
      });
    });
    describe("in array", function () {
      it("can sum the values", function (cb) {
        var _arr, sum;
        sum = 0;
        _arr = [1, 2, 4, 8];
        return __async(
          1,
          _arr.length,
          false,
          function (_i, next) {
            var _once, i;
            i = _arr[_i];
            return soon((_once = false, function () {
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              sum += __num(i);
              return next();
            }));
          },
          function (_err) {
            expect(sum).to.equal(15);
            return cb();
          }
        );
      });
      it("preserves this", function (cb) {
        function f() {
          var _arr, _this, self;
          _this = this;
          self = this;
          _arr = [1, 2, 4, 8];
          return __async(
            1,
            _arr.length,
            false,
            function (_i, next) {
              var _once, i;
              i = _arr[_i];
              expect(_this).to.equal(self);
              return soon((_once = false, function () {
                if (_once) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once = true;
                }
                expect(_this).to.equal(self);
                return next();
              }));
            },
            function (_err) {
              return cb();
            }
          );
        }
        return f.call({});
      });
      it("breaks when an error is passed to the callback", function (cb) {
        var _arr, err, maximum;
        maximum = 0;
        err = spy();
        _arr = [1, 2, 4, 8];
        return __async(
          1,
          _arr.length,
          false,
          function (_i, next) {
            var _once, i;
            i = _arr[_i];
            maximum = i;
            return soon((_once = false, function () {
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              if (i === 4) {
                return next(err);
              } else {
                return next();
              }
            }));
          },
          function (e) {
            expect(e).to.equal(err);
            expect(maximum).to.equal(4);
            return cb();
          }
        );
      });
      it(
        "breaks when an error is passed to the callback, if a result is expected",
        function (cb) {
          var _arr, err, maximum;
          maximum = 0;
          err = spy();
          _arr = [1, 2, 4, 8];
          return __async(
            1,
            _arr.length,
            true,
            function (_i, next) {
              var _once, i;
              i = _arr[_i];
              maximum = i;
              return soon((_once = false, function () {
                if (_once) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once = true;
                }
                if (i === 4) {
                  return next(err);
                } else {
                  return next();
                }
              }));
            },
            function (e, result) {
              expect(e).to.equal(err);
              expect(maximum).to.equal(4);
              expect(result).to.not.exist;
              return cb();
            }
          );
        }
      );
      return it("produces an array if a result is expected", function (cb) {
        var _arr;
        _arr = [1, 2, 4, 8];
        return __async(
          1,
          _arr.length,
          true,
          function (_i, next) {
            var _once, i;
            i = _arr[_i];
            return soon((_once = false, function () {
              var _ref;
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              return next(null, (_ref = __num(i)) * _ref);
            }));
          },
          function (e, result) {
            expect(e).to.not.exist;
            expect(result).to.eql([1, 4, 16, 64]);
            return cb();
          }
        );
      });
    });
    describe("of object", function () {
      it("can sum the values", function (cb) {
        var _keys, _obj, sum;
        sum = 0;
        _obj = { a: 1, b: 2, c: 4, d: 8 };
        _keys = __keys(_obj);
        return __async(
          1,
          _keys.length,
          false,
          function (_i, next) {
            var _once, k, v;
            k = _keys[_i];
            v = _obj[k];
            return soon((_once = false, function () {
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              sum += __num(v);
              return next();
            }));
          },
          function (_err) {
            expect(sum).to.equal(15);
            return cb();
          }
        );
      });
      it("preserves this", function (cb) {
        function f() {
          var _keys, _obj, _this, self;
          _this = this;
          self = this;
          _obj = { a: 1, b: 2, c: 4, d: 8 };
          _keys = __keys(_obj);
          return __async(
            1,
            _keys.length,
            false,
            function (_i, next) {
              var _once, k, v;
              k = _keys[_i];
              v = _obj[k];
              expect(_this).to.equal(self);
              return soon((_once = false, function () {
                if (_once) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once = true;
                }
                expect(_this).to.equal(self);
                return next();
              }));
            },
            function (_err) {
              return cb();
            }
          );
        }
        return f.call({});
      });
      it("breaks when an error is passed to the callback", function (cb) {
        var _keys, _obj, err;
        err = spy();
        _obj = { a: 1, b: 2, c: 4, d: 8 };
        _keys = __keys(_obj);
        return __async(
          1,
          _keys.length,
          false,
          function (_i, next) {
            var _once, k, v;
            k = _keys[_i];
            v = _obj[k];
            return soon((_once = false, function () {
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              if (v === 4) {
                return next(err);
              } else {
                return next();
              }
            }));
          },
          function (e) {
            expect(e).to.equal(err);
            return cb();
          }
        );
      });
      it(
        "breaks when an error is passed to the callback, if a result is expected",
        function (cb) {
          var _keys, _obj, err;
          err = spy();
          _obj = { a: 1, b: 2, c: 4, d: 8 };
          _keys = __keys(_obj);
          return __async(
            1,
            _keys.length,
            true,
            function (_i, next) {
              var _once, k, v;
              k = _keys[_i];
              v = _obj[k];
              return soon((_once = false, function () {
                if (_once) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once = true;
                }
                if (v === 4) {
                  return next(err);
                } else {
                  return next();
                }
              }));
            },
            function (e, result) {
              expect(e).to.equal(err);
              return cb();
            }
          );
        }
      );
      return it("produces an array if a result is expected", function (cb) {
        var _keys, _obj;
        _obj = { a: 1, b: 2, c: 4, d: 8 };
        _keys = __keys(_obj);
        return __async(
          1,
          _keys.length,
          true,
          function (_i, next) {
            var _once, k, v;
            k = _keys[_i];
            v = _obj[k];
            return soon((_once = false, function () {
              var _ref;
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              return next(null, (_ref = __num(v)) * _ref);
            }));
          },
          function (e, result) {
            expect(e).to.not.exist;
            expect(result.sort(__curry(2, function (x, y) {
              return __cmp(x, y);
            }))).to.eql([1, 4, 16, 64]);
            return cb();
          }
        );
      });
    });
    return describe("from iterator", function () {
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
      it("can sum the values", function (cb) {
        var sum;
        sum = 0;
        return __asyncIter(
          1,
          __iter(arrayToIterator([1, 2, 4, 8])),
          false,
          function (i, _i, next) {
            var _once;
            return soon((_once = false, function () {
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              sum += __num(i);
              return next();
            }));
          },
          function (_err) {
            expect(sum).to.equal(15);
            return cb();
          }
        );
      });
      it("preserves this", function (cb) {
        function f() {
          var _this, self;
          _this = this;
          self = this;
          return __asyncIter(
            1,
            __iter(arrayToIterator([1, 2, 4, 8])),
            false,
            function (i, _i, next) {
              var _once;
              expect(_this).to.equal(self);
              return soon((_once = false, function () {
                if (_once) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once = true;
                }
                expect(_this).to.equal(self);
                return next();
              }));
            },
            function (_err) {
              return cb();
            }
          );
        }
        return f.call({});
      });
      it("breaks when an error is passed to the callback", function (cb) {
        var err, maximum;
        maximum = 0;
        err = spy();
        return __asyncIter(
          1,
          __iter(arrayToIterator([1, 2, 4, 8])),
          false,
          function (i, _i, next) {
            var _once;
            maximum = i;
            return soon((_once = false, function () {
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              if (i === 4) {
                return next(err);
              } else {
                return next();
              }
            }));
          },
          function (e) {
            expect(e).to.equal(err);
            expect(maximum).to.equal(4);
            return cb();
          }
        );
      });
      it(
        "breaks when an error is passed to the callback, if a result is expected",
        function (cb) {
          var err, maximum;
          maximum = 0;
          err = spy();
          return __asyncIter(
            1,
            __iter(arrayToIterator([1, 2, 4, 8])),
            true,
            function (i, _i, next) {
              var _once;
              maximum = i;
              return soon((_once = false, function () {
                if (_once) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once = true;
                }
                if (i === 4) {
                  return next(err);
                } else {
                  return next();
                }
              }));
            },
            function (e, result) {
              expect(e).to.equal(err);
              expect(maximum).to.equal(4);
              expect(result).to.not.exist;
              return cb();
            }
          );
        }
      );
      return it("produces an array if a result is expected", function (cb) {
        return __asyncIter(
          1,
          __iter(arrayToIterator([1, 2, 4, 8])),
          true,
          function (i, _i, next) {
            var _once;
            return soon((_once = false, function () {
              var _ref;
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              return next(null, (_ref = __num(i)) * _ref);
            }));
          },
          function (e, result) {
            expect(e).to.not.exist;
            expect(result).to.eql([1, 4, 16, 64]);
            return cb();
          }
        );
      });
    });
  });
  describe("asyncwhile", function () {
    it("can count up to 45", function (cb) {
      var _first, i, sum;
      i = 0;
      sum = 0;
      _first = true;
      function next(_err) {
        var _once;
        if (typeof _err !== "undefined" && _err !== null) {
          return _done(_err);
        }
        if (_first) {
          _first = false;
        } else {
          ++i;
        }
        if (i >= 10) {
          return _done(null);
        }
        return soon((_once = false, function () {
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          sum += i;
          return next();
        }));
      }
      function _done(_err) {
        expect(sum).to.equal(45);
        return cb();
      }
      return next();
    });
    it("preserves this", function (cb) {
      function f() {
        var _first, _this, i, self;
        _this = this;
        self = this;
        i = 0;
        _first = true;
        function next(_err) {
          var _once;
          if (typeof _err !== "undefined" && _err !== null) {
            return _done(_err);
          }
          if (_first) {
            _first = false;
          } else {
            ++i;
          }
          if (i >= 10) {
            return _done(null);
          }
          expect(_this).to.equal(self);
          return soon((_once = false, function () {
            if (_once) {
              throw new Error("Attempted to call function more than once");
            } else {
              _once = true;
            }
            expect(_this).to.equal(self);
            return next();
          }));
        }
        function _done(_err) {
          return cb();
        }
        return next();
      }
      return f.call({});
    });
    it("breaks when an error is passed to the callback", function (cb) {
      var _first, err, i;
      i = 0;
      err = spy();
      _first = true;
      function next(e) {
        var _once;
        if (typeof e !== "undefined" && e !== null) {
          return _done(e);
        }
        if (_first) {
          _first = false;
        } else {
          ++i;
        }
        if (i >= 10) {
          return _done(null);
        }
        return soon((_once = false, function () {
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (i === 3) {
            return next(err);
          } else {
            return next();
          }
        }));
      }
      function _done(e) {
        expect(e).to.equal(err);
        expect(i).to.equal(3);
        return cb();
      }
      return next();
    });
    it(
      "breaks when an error is passed to the callback, if a result is expected",
      function (cb) {
        var _arr, _first, err, i;
        i = 0;
        err = spy();
        _first = true;
        _arr = [];
        function next(e, _value) {
          var _once;
          if (typeof e !== "undefined" && e !== null) {
            return _done(e);
          }
          if (_first) {
            _first = false;
          } else {
            ++i;
            if (arguments.length > 1) {
              _arr.push(_value);
            }
          }
          if (i >= 10) {
            return _done(null, _arr);
          }
          return soon((_once = false, function () {
            if (_once) {
              throw new Error("Attempted to call function more than once");
            } else {
              _once = true;
            }
            if (i === 3) {
              return next(err);
            } else {
              return next();
            }
          }));
        }
        function _done(e, result) {
          expect(e).to.equal(err);
          expect(i).to.equal(3);
          expect(result).to.not.exist;
          return cb();
        }
        return next();
      }
    );
    return it("produces an array if a result is expected", function (cb) {
      var _arr, _first, i;
      i = 0;
      _first = true;
      _arr = [];
      function next(e, _value) {
        var _once;
        if (typeof e !== "undefined" && e !== null) {
          return _done(e);
        }
        if (_first) {
          _first = false;
        } else {
          ++i;
          if (arguments.length > 1) {
            _arr.push(_value);
          }
        }
        if (i >= 10) {
          return _done(null, _arr);
        }
        return soon((_once = false, function () {
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          return next(null, i * i);
        }));
      }
      function _done(e, result) {
        expect(e).to.not.exist;
        expect(result).to.eql([
          0,
          1,
          4,
          9,
          16,
          25,
          36,
          49,
          64,
          81
        ]);
        return cb();
      }
      return next();
    });
  });
  describe("asyncif", function () {
    describe("without else", function () {
      it("runs the when-true clause", function (cb) {
        var _once;
        function run(check, callback) {
          var inTrue;
          inTrue = false;
          return (check
            ? function (next) {
              var _once2;
              return soon((_once2 = false, function () {
                if (_once2) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once2 = true;
                }
                inTrue = true;
                return next();
              }));
            }
            : function (next) {
              return next();
            })(function () {
            return callback(inTrue);
          });
        }
        return run(1, (_once = false, function (value) {
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          expect(value).to.be["true"];
          return cb();
        }));
      });
      it("skips the when-true clause", function (cb) {
        var _once;
        function run(check, callback) {
          var inTrue;
          inTrue = false;
          return (check
            ? function (next) {
              var _once2;
              return soon((_once2 = false, function () {
                if (_once2) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once2 = true;
                }
                inTrue = true;
                return next();
              }));
            }
            : function (next) {
              return next();
            })(function () {
            return callback(inTrue);
          });
        }
        return run(0, (_once = false, function (value) {
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          expect(value).to.be["false"];
          return cb();
        }));
      });
      return it("preserves this inside and after", function (cb) {
        function run(check) {
          var _this, self;
          _this = this;
          self = this;
          return (check
            ? function (next) {
              expect(_this).to.equal(self);
              return next();
            }
            : function (next) {
              return next();
            })(function () {
            expect(_this).to.equal(self);
            return cb();
          });
        }
        return run.call({}, true);
      });
    });
    return describe("with else", function () {
      it("runs the when-true clause", function (cb) {
        var _once;
        function run(check, callback) {
          var inTrue;
          return (check
            ? function (next) {
              var _once2;
              return soon((_once2 = false, function () {
                if (_once2) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once2 = true;
                }
                inTrue = true;
                return next();
              }));
            }
            : function (next) {
              throw new Error("Never reached");
            })(function () {
            return callback(inTrue);
          });
        }
        return run(1, (_once = false, function (value) {
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          expect(value).to.be["true"];
          return cb();
        }));
      });
      it("runs the when-false clause", function (cb) {
        var _once;
        function run(check, callback) {
          var inTrue;
          return (check
            ? function (next) {
              throw new Error("Never reached");
            }
            : function (next) {
              var _once2;
              return soon((_once2 = false, function () {
                if (_once2) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once2 = true;
                }
                inTrue = false;
                return next();
              }));
            })(function () {
            return callback(inTrue);
          });
        }
        return run(0, (_once = false, function (value) {
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          expect(value).to.be["false"];
          return cb();
        }));
      });
      return it("preserves this inside and after", function (cb) {
        var _once;
        function run(check, callback) {
          var _this, self;
          _this = this;
          self = this;
          return (check
            ? function (next) {
              expect(_this).to.equal(self);
              return next();
            }
            : function (next) {
              expect(_this).to.equal(self);
              return next();
            })(function () {
            expect(_this).to.equal(self);
            return callback();
          });
        }
        return run.call({}, true, (_once = false, function () {
          var _once2;
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          return run.call({}, false, (_once2 = false, function () {
            if (_once2) {
              throw new Error("Attempted to call function more than once");
            } else {
              _once2 = true;
            }
            return cb();
          }));
        }));
      });
    });
  });
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
