(function (GLOBAL) {
  "use strict";
  var __arrayToIter, __cmp, __create, __curry, __defer, __delay, __everyPromise,
      __fromPromise, __generator, __generatorToPromise, __isArray, __iter,
      __keys, __new, __num, __owns, __promise, __promiseIter, __promiseLoop,
      __range, __slice, __somePromise, __toArray, __toPromise, __toPromiseArray,
      __typeof, expect, setImmediate;
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
  __defer = (function () {
    function __defer() {
      var deferred, isError, value;
      isError = false;
      value = null;
      deferred = [];
      function complete(newIsError, newValue) {
        var funcs;
        if (deferred) {
          funcs = deferred;
          deferred = null;
          isError = newIsError;
          value = newValue;
          if (funcs.length) {
            setImmediate(function () {
              var _end, i;
              for (i = 0, _end = funcs.length; i < _end; ++i) {
                funcs[i]();
              }
            });
          }
        }
      }
      return {
        promise: {
          then: function (onFulfilled, onRejected, allowSync) {
            var _ref, fulfill, promise, reject;
            if (allowSync !== true) {
              allowSync = void 0;
            }
            _ref = __defer();
            promise = _ref.promise;
            fulfill = _ref.fulfill;
            reject = _ref.reject;
            _ref = null;
            function step() {
              var f, result;
              try {
                if (isError) {
                  f = onRejected;
                } else {
                  f = onFulfilled;
                }
                if (typeof f === "function") {
                  result = f(value);
                  if (result && typeof result.then === "function") {
                    result.then(fulfill, reject, allowSync);
                  } else {
                    fulfill(result);
                  }
                } else {
                  (isError ? reject : fulfill)(value);
                }
              } catch (e) {
                reject(e);
              }
            }
            if (deferred) {
              deferred.push(step);
            } else if (allowSync) {
              step();
            } else {
              setImmediate(step);
            }
            return promise;
          },
          sync: function () {
            var result, state;
            state = 0;
            result = 0;
            this.then(
              function (ret) {
                state = 1;
                result = ret;
              },
              function (err) {
                state = 2;
                result = err;
              },
              true
            );
            switch (state) {
            case 0: throw new Error("Promise did not execute synchronously");
            case 1: return result;
            case 2: throw result;
            default: throw new Error("Unknown state");
            }
          }
        },
        fulfill: function (value) {
          complete(false, value);
        },
        reject: function (reason) {
          complete(true, reason);
        }
      };
    }
    __defer.fulfilled = function (value) {
      var d;
      d = __defer();
      d.fulfill(value);
      return d.promise;
    };
    __defer.rejected = function (reason) {
      var d;
      d = __defer();
      d.reject(reason);
      return d.promise;
    };
    return __defer;
  }());
  __delay = function (milliseconds, value) {
    var _ref, fulfill, promise;
    if (typeof milliseconds !== "number") {
      throw new TypeError("Expected milliseconds to be a Number, got " + __typeof(milliseconds));
    }
    if (milliseconds <= 0) {
      return __defer.fulfilled(value);
    } else {
      _ref = __defer();
      fulfill = _ref.fulfill;
      promise = _ref.promise;
      _ref = null;
      setTimeout(
        function () {
          fulfill(value);
        },
        milliseconds
      );
      return promise;
    }
  };
  __everyPromise = function (promises) {
    var _arr, _ref, fulfill, i, isArray, k, promise, reject, remaining, result,
        resultPromise;
    if (typeof promises !== "object" || promises === null) {
      throw new TypeError("Expected promises to be an Object, got " + __typeof(promises));
    }
    isArray = __isArray(promises);
    _ref = __defer();
    resultPromise = _ref.promise;
    fulfill = _ref.fulfill;
    reject = _ref.reject;
    _ref = null;
    if (isArray) {
      result = [];
    } else {
      result = {};
    }
    remaining = 1;
    function dec() {
      if (--remaining === 0) {
        fulfill(result);
      }
    }
    function handle(key, promise) {
      promise.then(
        function (value) {
          result[key] = value;
          dec();
        },
        reject
      );
    }
    if (isArray) {
      for (_arr = __toArray(promises), i = _arr.length; i--; ) {
        promise = _arr[i];
        ++remaining;
        handle(i, promise);
      }
    } else {
      for (k in promises) {
        if (__owns.call(promises, k)) {
          promise = promises[k];
          ++remaining;
          handle(k, promise);
        }
      }
    }
    dec();
    return resultPromise;
  };
  __fromPromise = function (promise) {
    if (typeof promise !== "object" || promise === null) {
      throw new TypeError("Expected promise to be an Object, got " + __typeof(promise));
    } else if (typeof promise.then !== "function") {
      throw new TypeError("Expected promise.then to be a Function, got " + __typeof(promise.then));
    }
    return function (callback) {
      if (typeof callback !== "function") {
        throw new TypeError("Expected callback to be a Function, got " + __typeof(callback));
      }
      promise.then(
        function (value) {
          return setImmediate(callback, null, value);
        },
        function (reason) {
          return setImmediate(callback, reason);
        }
      );
    };
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
  __generatorToPromise = function (generator, allowSync) {
    if (typeof generator !== "object" || generator === null) {
      throw new TypeError("Expected generator to be an Object, got " + __typeof(generator));
    } else {
      if (typeof generator.send !== "function") {
        throw new TypeError("Expected generator.send to be a Function, got " + __typeof(generator.send));
      }
      if (typeof generator["throw"] !== "function") {
        throw new TypeError("Expected generator.throw to be a Function, got " + __typeof(generator["throw"]));
      }
    }
    if (allowSync == null) {
      allowSync = false;
    } else if (typeof allowSync !== "boolean") {
      throw new TypeError("Expected allowSync to be a Boolean, got " + __typeof(allowSync));
    }
    function continuer(verb, arg) {
      var item;
      try {
        item = generator[verb](arg);
      } catch (e) {
        return __defer.rejected(e);
      }
      if (item.done) {
        return __defer.fulfilled(item.value);
      } else {
        return item.value.then(callback, errback, allowSync);
      }
    }
    function callback(value) {
      return continuer("send", value);
    }
    function errback(value) {
      return continuer("throw", value);
    }
    return callback(void 0);
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
  __promise = function (value, allowSync) {
    var factory;
    if (allowSync == null) {
      allowSync = false;
    } else if (typeof allowSync !== "boolean") {
      throw new TypeError("Expected allowSync to be a Boolean, got " + __typeof(allowSync));
    }
    if (typeof value === "function") {
      factory = function () {
        return __generatorToPromise(value.apply(this, arguments));
      };
      factory.sync = function () {
        return __generatorToPromise(
          value.apply(this, arguments),
          true
        ).sync();
      };
      factory.maybeSync = function () {
        return __generatorToPromise(
          value.apply(this, arguments),
          true
        );
      };
      return factory;
    } else {
      return __generatorToPromise(value, allowSync);
    }
  };
  __promiseIter = function (limit, iterator, body) {
    var _ref, done, fulfill, index, iterStopped, promise, reject, result,
        slotsUsed;
    if (typeof limit !== "number") {
      throw new TypeError("Expected limit to be a Number, got " + __typeof(limit));
    }
    if (typeof iterator !== "object" || iterator === null) {
      throw new TypeError("Expected iterator to be an Object, got " + __typeof(iterator));
    } else if (typeof iterator.next !== "function") {
      throw new TypeError("Expected iterator.next to be a Function, got " + __typeof(iterator.next));
    }
    if (typeof body !== "function") {
      throw new TypeError("Expected body to be a Function, got " + __typeof(body));
    }
    if (limit < 1 || limit !== limit) {
      limit = 1/0;
    }
    result = [];
    done = false;
    slotsUsed = 0;
    _ref = __defer();
    reject = _ref.reject;
    fulfill = _ref.fulfill;
    promise = _ref.promise;
    _ref = null;
    index = 0;
    iterStopped = false;
    function handle(item, index) {
      ++slotsUsed;
      return body(item, index).then(
        function (value) {
          result[index] = value;
          --slotsUsed;
          return flush();
        },
        function (reason) {
          done = true;
          return reject(reason);
        }
      );
    }
    function flush() {
      var item;
      while (!done && !iterStopped && slotsUsed < limit) {
        item = void 0;
        try {
          item = iterator.next();
        } catch (e) {
          done = true;
          reject(e);
          return;
        }
        if (item.done) {
          iterStopped = true;
          break;
        }
        handle(item.value, index++);
      }
      if (!done && slotsUsed === 0 && iterStopped) {
        done = true;
        return fulfill(result);
      }
    }
    setImmediate(flush);
    return promise;
  };
  __promiseLoop = function (limit, length, body) {
    var _ref, done, fulfill, index, promise, reject, result, slotsUsed;
    if (typeof limit !== "number") {
      throw new TypeError("Expected limit to be a Number, got " + __typeof(limit));
    }
    if (typeof length !== "number") {
      throw new TypeError("Expected length to be a Number, got " + __typeof(length));
    }
    if (typeof body !== "function") {
      throw new TypeError("Expected body to be a Function, got " + __typeof(body));
    }
    if (limit < 1 || limit !== limit) {
      limit = 1/0;
    }
    result = [];
    done = false;
    slotsUsed = 0;
    _ref = __defer();
    fulfill = _ref.fulfill;
    reject = _ref.reject;
    promise = _ref.promise;
    _ref = null;
    index = 0;
    function handle(index) {
      ++slotsUsed;
      return body(index).then(
        function (value) {
          result[index] = value;
          --slotsUsed;
          return flush();
        },
        function (reason) {
          done = true;
          return reject(reason);
        }
      );
    }
    function flush() {
      for (; !done && slotsUsed < limit && index < length; ++index) {
        handle(index);
      }
      if (!done && index >= length && slotsUsed === 0) {
        done = true;
        return fulfill(result);
      }
    }
    setImmediate(flush);
    return promise;
  };
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
  __somePromise = function (promises) {
    var _i, defer, promise;
    if (!__isArray(promises)) {
      throw new TypeError("Expected promises to be an Array, got " + __typeof(promises));
    }
    defer = __defer();
    for (_i = promises.length; _i--; ) {
      promise = promises[_i];
      promise.then(defer.fulfill, defer.reject);
    }
    return defer.promise;
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
  __toPromise = function (func, context, args) {
    var _ref, fulfill, promise, reject;
    if (typeof func !== "function") {
      throw new TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    _ref = __defer();
    promise = _ref.promise;
    reject = _ref.reject;
    fulfill = _ref.fulfill;
    _ref = null;
    func.apply(context, __toArray(args).concat([
      function (err, value) {
        if (err != null) {
          reject(err);
        } else {
          fulfill(value);
        }
      }
    ]));
    return promise;
  };
  __toPromiseArray = function (func, context, args) {
    var _ref, fulfill, promise, reject;
    if (typeof func !== "function") {
      throw new TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    _ref = __defer();
    promise = _ref.promise;
    reject = _ref.reject;
    fulfill = _ref.fulfill;
    _ref = null;
    func.apply(context, __toArray(args).concat([
      function (err) {
        var values;
        values = __slice.call(arguments, 1);
        if (err != null) {
          reject(err);
        } else {
          fulfill(values);
        }
      }
    ]));
    return promise;
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
  function randomWait(value, maxTime) {
    var defer;
    if (maxTime == null) {
      maxTime = 10;
    }
    defer = __defer();
    setTimeout(
      function () {
        return defer.fulfill(value);
      },
      Math.floor(Math.random() * __num(maxTime))
    );
    return defer.promise;
  }
  describe("promise!", function () {
    describe("on a generator function", function () {
      it("can create a promise factory", function (cb) {
        var makePromise;
        makePromise = __promise(function () {
          var _e, _send, _state, _step, _throw, alpha, charlie, d, echo;
          _state = 0;
          function _close() {
            _state = 3;
          }
          function _step(_received) {
            while (true) {
              switch (_state) {
              case 0:
                d = __defer();
                d.fulfill("bravo");
                ++_state;
                return { done: false, value: d.promise };
              case 1:
                alpha = _received;
                expect(alpha).to.equal("bravo");
                charlie = __defer();
                setImmediate(function () {
                  return charlie.fulfill("delta");
                });
                ++_state;
                return { done: false, value: charlie.promise };
              case 2:
                echo = _received;
                expect(echo).to.equal("delta");
                ++_state;
                return { done: true, value: "foxtrot" };
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
        });
        makePromise().then(function (value) {
          expect(value).to.equal("foxtrot");
          return cb();
        }).then(null, cb);
      });
      it("can work on a simple generator", function (cb) {
        var makePromise;
        makePromise = __promise(__generator(function () {
          return "alpha";
        }));
        makePromise().then(function (value) {
          expect(value).to.equal("alpha");
          return cb();
        }).then(null, cb);
      });
      it("can work on a reference to a generator function", function (cb) {
        function generator() {
          var _e, _send, _state, _step, _throw, alpha, charlie, d, echo;
          _state = 0;
          function _close() {
            _state = 3;
          }
          function _step(_received) {
            while (true) {
              switch (_state) {
              case 0:
                d = __defer();
                d.fulfill("bravo");
                ++_state;
                return { done: false, value: d.promise };
              case 1:
                alpha = _received;
                expect(alpha).to.equal("bravo");
                charlie = __defer();
                setImmediate(function () {
                  return charlie.fulfill("delta");
                });
                ++_state;
                return { done: false, value: charlie.promise };
              case 2:
                echo = _received;
                expect(echo).to.equal("delta");
                ++_state;
                return { done: true, value: "foxtrot" };
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
        __promise(generator)().then(function (value) {
          expect(value).to.equal("foxtrot");
          return cb();
        }).then(null, cb);
      });
      return it(
        "can work on a reference to a simple generator function",
        function (cb) {
          var generator;
          generator = __generator(function () {
            return "foxtrot";
          });
          __promise(generator)().then(function (value) {
            expect(value).to.equal("foxtrot");
            return cb();
          }).then(null, cb);
        }
      );
    });
    it(
      "can create a promise factory from a generator function",
      function (cb) {
        var makePromise;
        function generator() {
          var _e, _send, _state, _step, _throw, alpha, charlie, d, echo;
          _state = 0;
          function _close() {
            _state = 3;
          }
          function _step(_received) {
            while (true) {
              switch (_state) {
              case 0:
                d = __defer();
                d.fulfill("bravo");
                ++_state;
                return { done: false, value: d.promise };
              case 1:
                alpha = _received;
                expect(alpha).to.equal("bravo");
                charlie = __defer();
                setImmediate(function () {
                  return charlie.fulfill("delta");
                });
                ++_state;
                return { done: false, value: charlie.promise };
              case 2:
                echo = _received;
                expect(echo).to.equal("delta");
                ++_state;
                return { done: true, value: "foxtrot" };
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
        makePromise = __promise(generator);
        makePromise().then(function (value) {
          expect(value).to.equal("foxtrot");
          return cb();
        }).then(null, cb);
      }
    );
    describe("on a generator instance", function () {
      it("can create a promise from a generator instance", function (cb) {
        var promise;
        function generator() {
          var _e, _send, _state, _step, _throw, alpha, charlie, d, echo;
          _state = 0;
          function _close() {
            _state = 3;
          }
          function _step(_received) {
            while (true) {
              switch (_state) {
              case 0:
                d = __defer();
                d.fulfill("bravo");
                ++_state;
                return { done: false, value: d.promise };
              case 1:
                alpha = _received;
                expect(alpha).to.equal("bravo");
                charlie = __defer();
                setImmediate(function () {
                  return charlie.fulfill("delta");
                });
                ++_state;
                return { done: false, value: charlie.promise };
              case 2:
                echo = _received;
                expect(echo).to.equal("delta");
                ++_state;
                return { done: true, value: "foxtrot" };
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
        promise = __promise(generator());
        promise.then(function (value) {
          expect(value).to.equal("foxtrot");
          return cb();
        }).then(null, cb);
      });
      return it("can work on a simple generator", function (cb) {
        var generator, promise;
        generator = __generator(function () {
          return "foxtrot";
        });
        promise = __promise(generator());
        promise.then(function (value) {
          expect(value).to.equal("foxtrot");
          return cb();
        }).then(null, cb);
      });
    });
    return it("can create a one-off promise", function (cb) {
      var promise;
      promise = __generatorToPromise((function () {
        var _e, _send, _state, _step, _throw, alpha, charlie, d, echo;
        _state = 0;
        function _close() {
          _state = 3;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              d = __defer();
              d.fulfill("bravo");
              ++_state;
              return { done: false, value: d.promise };
            case 1:
              alpha = _received;
              expect(alpha).to.equal("bravo");
              charlie = __defer();
              setImmediate(function () {
                return charlie.fulfill("delta");
              });
              ++_state;
              return { done: false, value: charlie.promise };
            case 2:
              echo = _received;
              expect(echo).to.equal("delta");
              ++_state;
              return { done: true, value: "foxtrot" };
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
      }()));
      promise.then(function (value) {
        expect(value).to.equal("foxtrot");
        return cb();
      }).then(null, cb);
    });
  });
  describe("to-promise!", function () {
    describe("with a standard function call", function () {
      function getArgs() {
        var _i, args, callback;
        _i = __num(arguments.length) - 1;
        if (_i > 0) {
          args = __slice.call(arguments, 0, _i);
        } else {
          _i = 0;
          args = [];
        }
        callback = arguments[_i];
        return callback(null, args);
      }
      function error(err, callback) {
        return callback(err);
      }
      describe("without a spread", function () {
        it("works with the resolved state", function (cb) {
          var promise;
          promise = __toPromise(getArgs, void 0, ["alpha", "bravo", "charlie"]);
          promise.then(function (value) {
            expect(value).to.eql(["alpha", "bravo", "charlie"]);
            return cb();
          }).then(null, cb);
        });
        return it("works with the rejected state", function (cb) {
          var err, promise;
          err = {};
          promise = __toPromise(error, void 0, [err]);
          promise.then(null, function (reason) {
            expect(reason).to.equal(err);
            return cb();
          }).then(null, cb);
        });
      });
      return describe("with a spread", function () {
        it("works with the resolved state", function (cb) {
          var args, promise;
          args = ["alpha", "bravo"];
          promise = __toPromise(getArgs, void 0, args.concat(["charlie"]));
          promise.then(function (value) {
            expect(value).to.eql(["alpha", "bravo", "charlie"]);
            return cb();
          }).then(null, cb);
        });
        return it("works with the rejected state", function (cb) {
          var args, err, promise;
          err = {};
          args = [err];
          promise = __toPromise(error, void 0, __slice.call(args));
          promise.then(null, function (reason) {
            expect(reason).to.equal(err);
            return cb();
          }).then(null, cb);
        });
      });
    });
    describe("with a method call", function () {
      var obj;
      obj = {
        getArgs: function () {
          var _i, args, callback;
          _i = __num(arguments.length) - 1;
          if (_i > 0) {
            args = __slice.call(arguments, 0, _i);
          } else {
            _i = 0;
            args = [];
          }
          callback = arguments[_i];
          expect(this).to.equal(obj);
          return callback(null, args);
        },
        error: function (err, callback) {
          expect(this).to.equal(obj);
          return callback(err);
        }
      };
      describe("without a spread", function () {
        it("works with the resolved state", function (cb) {
          var promise;
          promise = __toPromise(obj.getArgs, obj, ["alpha", "bravo", "charlie"]);
          promise.then(function (value) {
            expect(value).to.eql(["alpha", "bravo", "charlie"]);
            return cb();
          }).then(null, cb);
        });
        return it("works with the rejected state", function (cb) {
          var err, promise;
          err = {};
          promise = __toPromise(obj.error, obj, [err]);
          promise.then(null, function (reason) {
            expect(reason).to.equal(err);
            return cb();
          }).then(null, cb);
        });
      });
      return describe("with a spread", function () {
        it("works with the resolved state", function (cb) {
          var args, promise;
          args = ["alpha", "bravo"];
          promise = __toPromise(obj.getArgs, obj, args.concat(["charlie"]));
          promise.then(function (value) {
            expect(value).to.eql(["alpha", "bravo", "charlie"]);
            return cb();
          }).then(null, cb);
        });
        return it("works with the rejected state", function (cb) {
          var args, err, promise;
          err = {};
          args = [err];
          promise = __toPromise(obj.error, obj, __slice.call(args));
          promise.then(null, function (reason) {
            expect(reason).to.equal(err);
            return cb();
          }).then(null, cb);
        });
      });
    });
    describe("with an apply call", function () {
      var obj;
      obj = {};
      function getArgs() {
        var _i, args, callback;
        _i = __num(arguments.length) - 1;
        if (_i > 0) {
          args = __slice.call(arguments, 0, _i);
        } else {
          _i = 0;
          args = [];
        }
        callback = arguments[_i];
        expect(this).to.equal(obj);
        return callback(null, args);
      }
      function error(err, callback) {
        expect(this).to.equal(obj);
        return callback(err);
      }
      describe("without a spread", function () {
        it("works with the resolved state", function (cb) {
          var promise;
          promise = __toPromise(getArgs, obj, ["alpha", "bravo", "charlie"]);
          promise.then(function (value) {
            expect(value).to.eql(["alpha", "bravo", "charlie"]);
            return cb();
          }).then(null, cb);
        });
        return it("works with the rejected state", function (cb) {
          var err, promise;
          err = {};
          promise = __toPromise(error, obj, [err]);
          promise.then(null, function (reason) {
            expect(reason).to.equal(err);
            return cb();
          }).then(null, cb);
        });
      });
      return describe("with a spread", function () {
        it("works with the resolved state", function (cb) {
          var _ref, args, promise;
          args = [obj, "alpha", "bravo"];
          promise = __toPromise(getArgs, (_ref = args.concat(["charlie"]))[0], _ref.slice(1));
          promise.then(function (value) {
            expect(value).to.eql(["alpha", "bravo", "charlie"]);
            return cb();
          }).then(null, cb);
        });
        return it("works with the rejected state", function (cb) {
          var _ref, args, err, promise;
          err = {};
          args = [obj, err];
          promise = __toPromise(error, (_ref = __slice.call(args))[0], _ref.slice(1));
          promise.then(null, function (reason) {
            expect(reason).to.equal(err);
            return cb();
          }).then(null, cb);
        });
      });
    });
    return describe("with a new call", function () {
      function getArgs() {
        var _i, args, callback;
        _i = __num(arguments.length) - 1;
        if (_i > 0) {
          args = __slice.call(arguments, 0, _i);
        } else {
          _i = 0;
          args = [];
        }
        callback = arguments[_i];
        expect(this).to.be.an["instanceof"](getArgs);
        return callback(null, args);
      }
      function error(err, callback) {
        expect(this).to.be.an["instanceof"](error);
        return callback(err);
      }
      describe("without a spread", function () {
        it("works with the resolved state", function (cb) {
          var promise;
          promise = __toPromise(__new, getArgs, ["alpha", "bravo", "charlie"]);
          promise.then(function (value) {
            expect(value).to.eql(["alpha", "bravo", "charlie"]);
            return cb();
          }).then(null, cb);
        });
        return it("works with the rejected state", function (cb) {
          var err, promise;
          err = {};
          promise = __toPromise(__new, error, [err]);
          promise.then(null, function (reason) {
            expect(reason).to.equal(err);
            return cb();
          }).then(null, cb);
        });
      });
      return describe("with a spread", function () {
        it("works with the resolved state", function (cb) {
          var args, promise;
          args = ["alpha", "bravo"];
          promise = __toPromise(__new, getArgs, args.concat(["charlie"]));
          promise.then(function (value) {
            expect(value).to.eql(["alpha", "bravo", "charlie"]);
            return cb();
          }).then(null, cb);
        });
        return it("works with the rejected state", function (cb) {
          var args, err, promise;
          err = {};
          args = [err];
          promise = __toPromise(__new, error, __slice.call(args));
          promise.then(null, function (reason) {
            expect(reason).to.equal(err);
            return cb();
          }).then(null, cb);
        });
      });
    });
  });
  describe("to-promise-array!", function () {
    describe("with a standard function call", function () {
      function getArgs() {
        var _i, args, callback;
        _i = __num(arguments.length) - 1;
        if (_i > 0) {
          args = __slice.call(arguments, 0, _i);
        } else {
          _i = 0;
          args = [];
        }
        callback = arguments[_i];
        return callback.apply(void 0, [null].concat(args));
      }
      function error(err, callback) {
        return callback(err);
      }
      describe("without a spread", function () {
        it("works with the resolved state", function (cb) {
          var promise;
          promise = __toPromiseArray(getArgs, void 0, ["alpha", "bravo", "charlie"]);
          promise.then(function (value) {
            expect(value).to.eql(["alpha", "bravo", "charlie"]);
            return cb();
          }).then(null, cb);
        });
        return it("works with the rejected state", function (cb) {
          var err, promise;
          err = {};
          promise = __toPromiseArray(error, void 0, [err]);
          promise.then(null, function (reason) {
            expect(reason).to.equal(err);
            return cb();
          }).then(null, cb);
        });
      });
      return describe("with a spread", function () {
        it("works with the resolved state", function (cb) {
          var args, promise;
          args = ["alpha", "bravo"];
          promise = __toPromiseArray(getArgs, void 0, args.concat(["charlie"]));
          promise.then(function (value) {
            expect(value).to.eql(["alpha", "bravo", "charlie"]);
            return cb();
          }).then(null, cb);
        });
        return it("works with the rejected state", function (cb) {
          var args, err, promise;
          err = {};
          args = [err];
          promise = __toPromiseArray(error, void 0, __slice.call(args));
          promise.then(null, function (reason) {
            expect(reason).to.equal(err);
            return cb();
          }).then(null, cb);
        });
      });
    });
    describe("with a method call", function () {
      var obj;
      obj = {
        getArgs: function () {
          var _i, args, callback;
          _i = __num(arguments.length) - 1;
          if (_i > 0) {
            args = __slice.call(arguments, 0, _i);
          } else {
            _i = 0;
            args = [];
          }
          callback = arguments[_i];
          expect(this).to.equal(obj);
          return callback.apply(void 0, [null].concat(args));
        },
        error: function (err, callback) {
          expect(this).to.equal(obj);
          return callback(err);
        }
      };
      describe("without a spread", function () {
        it("works with the resolved state", function (cb) {
          var promise;
          promise = __toPromiseArray(obj.getArgs, obj, ["alpha", "bravo", "charlie"]);
          promise.then(function (value) {
            expect(value).to.eql(["alpha", "bravo", "charlie"]);
            return cb();
          }).then(null, cb);
        });
        return it("works with the rejected state", function (cb) {
          var err, promise;
          err = {};
          promise = __toPromiseArray(obj.error, obj, [err]);
          promise.then(null, function (reason) {
            expect(reason).to.equal(err);
            return cb();
          }).then(null, cb);
        });
      });
      return describe("with a spread", function () {
        it("works with the resolved state", function (cb) {
          var args, promise;
          args = ["alpha", "bravo"];
          promise = __toPromiseArray(obj.getArgs, obj, args.concat(["charlie"]));
          promise.then(function (value) {
            expect(value).to.eql(["alpha", "bravo", "charlie"]);
            return cb();
          }).then(null, cb);
        });
        return it("works with the rejected state", function (cb) {
          var args, err, promise;
          err = {};
          args = [err];
          promise = __toPromiseArray(obj.error, obj, __slice.call(args));
          promise.then(null, function (reason) {
            expect(reason).to.equal(err);
            return cb();
          }).then(null, cb);
        });
      });
    });
    describe("with an apply call", function () {
      var obj;
      obj = {};
      function getArgs() {
        var _i, args, callback;
        _i = __num(arguments.length) - 1;
        if (_i > 0) {
          args = __slice.call(arguments, 0, _i);
        } else {
          _i = 0;
          args = [];
        }
        callback = arguments[_i];
        expect(this).to.equal(obj);
        return callback.apply(void 0, [null].concat(args));
      }
      function error(err, callback) {
        expect(this).to.equal(obj);
        return callback(err);
      }
      describe("without a spread", function () {
        it("works with the resolved state", function (cb) {
          var promise;
          promise = __toPromiseArray(getArgs, obj, ["alpha", "bravo", "charlie"]);
          promise.then(function (value) {
            expect(value).to.eql(["alpha", "bravo", "charlie"]);
            return cb();
          }).then(null, cb);
        });
        return it("works with the rejected state", function (cb) {
          var err, promise;
          err = {};
          promise = __toPromiseArray(error, obj, [err]);
          promise.then(null, function (reason) {
            expect(reason).to.equal(err);
            return cb();
          }).then(null, cb);
        });
      });
      return describe("with a spread", function () {
        it("works with the resolved state", function (cb) {
          var _ref, args, promise;
          args = [obj, "alpha", "bravo"];
          promise = __toPromiseArray(getArgs, (_ref = args.concat(["charlie"]))[0], _ref.slice(1));
          promise.then(function (value) {
            expect(value).to.eql(["alpha", "bravo", "charlie"]);
            return cb();
          }).then(null, cb);
        });
        return it("works with the rejected state", function (cb) {
          var _ref, args, err, promise;
          err = {};
          args = [obj, err];
          promise = __toPromiseArray(error, (_ref = __slice.call(args))[0], _ref.slice(1));
          promise.then(null, function (reason) {
            expect(reason).to.equal(err);
            return cb();
          }).then(null, cb);
        });
      });
    });
    return describe("with a new call", function () {
      function getArgs() {
        var _i, args, callback;
        _i = __num(arguments.length) - 1;
        if (_i > 0) {
          args = __slice.call(arguments, 0, _i);
        } else {
          _i = 0;
          args = [];
        }
        callback = arguments[_i];
        expect(this).to.be.an["instanceof"](getArgs);
        return callback.apply(void 0, [null].concat(args));
      }
      function error(err, callback) {
        expect(this).to.be.an["instanceof"](error);
        return callback(err);
      }
      describe("without a spread", function () {
        it("works with the resolved state", function (cb) {
          var promise;
          promise = __toPromiseArray(__new, getArgs, ["alpha", "bravo", "charlie"]);
          promise.then(function (value) {
            expect(value).to.eql(["alpha", "bravo", "charlie"]);
            return cb();
          }).then(null, cb);
        });
        return it("works with the rejected state", function (cb) {
          var err, promise;
          err = {};
          promise = __toPromiseArray(__new, error, [err]);
          promise.then(null, function (reason) {
            expect(reason).to.equal(err);
            return cb();
          }).then(null, cb);
        });
      });
      return describe("with a spread", function () {
        it("works with the resolved state", function (cb) {
          var args, promise;
          args = ["alpha", "bravo"];
          promise = __toPromiseArray(__new, getArgs, args.concat(["charlie"]));
          promise.then(function (value) {
            expect(value).to.eql(["alpha", "bravo", "charlie"]);
            return cb();
          }).then(null, cb);
        });
        return it("works with the rejected state", function (cb) {
          var args, err, promise;
          err = {};
          args = [err];
          promise = __toPromiseArray(__new, error, __slice.call(args));
          promise.then(null, function (reason) {
            expect(reason).to.equal(err);
            return cb();
          }).then(null, cb);
        });
      });
    });
  });
  describe("fulfilled!", function () {
    return it("produces an already-fulfilled promise", function (cb) {
      var alpha;
      alpha = __defer.fulfilled("bravo");
      alpha.then(function (value) {
        expect(value).to.equal("bravo");
        return cb();
      }).then(null, cb);
    });
  });
  describe("rejected!", function () {
    return it("produces an already-rejected promise", function (cb) {
      var alpha;
      alpha = __defer.rejected("bravo");
      alpha.then(null, function (reason) {
        expect(reason).to.equal("bravo");
        return cb();
      }).then(null, cb);
    });
  });
  describe("from-promise!", function () {
    return describe(
      "converts a normal promise into a function which takes a single callback",
      function () {
        it("works on an already-fulfilled promise", function (cb) {
          var alpha, fun;
          alpha = __defer.fulfilled("bravo");
          fun = __fromPromise(alpha);
          fun(function (err, value) {
            try {
              expect(err).to.not.exist;
              expect(value).to.equal("bravo");
              return cb();
            } catch (e) {
              return cb(e);
            }
          });
        });
        it("works on an already-rejected promise", function (cb) {
          var alpha, fun;
          alpha = __defer.rejected("bravo");
          fun = __fromPromise(alpha);
          fun(function (err, value) {
            try {
              expect(err).to.equal("bravo");
              expect(value).to.not.exist;
              return cb();
            } catch (e) {
              return cb(e);
            }
          });
        });
        it("works on a promise that is fulfilled later", function (cb) {
          var alpha, fun;
          alpha = __defer();
          fun = __fromPromise(alpha.promise);
          fun(function (err, value) {
            try {
              expect(err).to.not.exist;
              expect(value).to.equal("bravo");
              return cb();
            } catch (e) {
              return cb(e);
            }
          });
          alpha.fulfill("bravo");
        });
        return it("works on a promise that is rejected later", function (cb) {
          var alpha, fun;
          alpha = __defer();
          fun = __fromPromise(alpha.promise);
          fun(function (err, value) {
            try {
              expect(err).to.equal("bravo");
              expect(value).to.not.exist;
              return cb();
            } catch (e) {
              return cb(e);
            }
          });
          alpha.reject("bravo");
        });
      }
    );
  });
  describe("some-promise!", function () {
    it("succeeds when the first promise is fulfilled", function (cb) {
      var alpha, bravo, charlie;
      alpha = __defer();
      bravo = __defer();
      charlie = __defer();
      __somePromise([alpha.promise, bravo.promise, charlie.promise]).then(function (value) {
        expect(value).to.equal("delta");
        return cb();
      }).then(null, cb);
      bravo.fulfill("delta");
      alpha.reject("echo");
      charlie.reject("foxtrot");
    });
    return it("fails when the first promise is rejected", function (cb) {
      var alpha, bravo, charlie;
      alpha = __defer();
      bravo = __defer();
      charlie = __defer();
      __somePromise([alpha.promise, bravo.promise, charlie.promise]).then(null, function (reason) {
        expect(reason).to.equal("delta");
        return cb();
      }).then(null, cb);
      alpha.reject("delta");
      bravo.fulfill("echo");
      charlie.reject("foxtrot");
    });
  });
  describe("every-promise!", function () {
    describe("with an array", function () {
      it("succeeds when the all promises are fulfilled", function (cb) {
        var alpha, bravo, charlie;
        alpha = __defer();
        bravo = __defer();
        charlie = __defer.fulfilled("delta");
        __everyPromise([alpha.promise, bravo.promise, charlie]).then(function (value) {
          expect(value).to.eql(["echo", "foxtrot", "delta"]);
          return cb();
        }).then(null, cb);
        alpha.fulfill("echo");
        bravo.fulfill("foxtrot");
      });
      it("fails when the first promise is rejected", function (cb) {
        var alpha, bravo, charlie;
        alpha = __defer();
        bravo = __defer();
        charlie = __defer.fulfilled("delta");
        __everyPromise([alpha.promise, bravo.promise, charlie]).then(null, function (reason) {
          expect(reason).to.equal("echo");
          return cb();
        }).then(null, cb);
        alpha.reject("echo");
        bravo.fulfill("foxtrot");
      });
      return it("succeeds immediately if array is empty", function (cb) {
        __everyPromise([]).then(function (value) {
          expect(value).to.eql([]);
          return cb();
        }).then(null, cb);
      });
    });
    return describe("with an object", function () {
      it("succeeds when the all promises are fulfilled", function (cb) {
        var alpha, bravo, charlie;
        alpha = __defer();
        bravo = __defer();
        charlie = __defer.fulfilled("delta");
        __everyPromise({ alpha: alpha.promise, bravo: bravo.promise, charlie: charlie }).then(function (value) {
          expect(value).to.eql({ alpha: "echo", bravo: "foxtrot", charlie: "delta" });
          return cb();
        }).then(null, cb);
        alpha.fulfill("echo");
        bravo.fulfill("foxtrot");
      });
      it("fails when the first promise is rejected", function (cb) {
        var alpha, bravo, charlie;
        alpha = __defer();
        bravo = __defer();
        charlie = __defer.fulfilled("delta");
        __everyPromise({ alpha: alpha.promise, bravo: bravo.promise, charlie: charlie }).then(null, function (reason) {
          expect(reason).to.equal("echo");
          return cb();
        }).then(null, cb);
        alpha.reject("echo");
        bravo.fulfill("foxtrot");
      });
      return it("succeeds immediately if the object is empty", function (cb) {
        __everyPromise({}).then(function (value) {
          expect(value).to.eql({});
          return cb();
        }).then(null, cb);
      });
    });
  });
  describe("promisefor", function () {
    describe("in a range", function () {
      return it("returns a promise which fulfills with an array", function (cb) {
        var items, loop;
        items = [];
        loop = __promiseLoop(3, 10, __promise(function (_i) {
          var _e, _send, _state, _step, _throw, i, j;
          _state = 0;
          function _close() {
            _state = 2;
          }
          function _step(_received) {
            while (true) {
              switch (_state) {
              case 0:
                i = +_i;
                ++_state;
                return { done: false, value: randomWait(i * i) };
              case 1:
                j = _received;
                items.push(i);
                ++_state;
                return { done: true, value: j };
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
        }));
        loop.then(function (value) {
          expect(value).to.eql([
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
          expect(items.sort(__curry(2, function (x, y) {
            return __cmp(x, y);
          }))).to.eql(__range(0, 10, 1, false));
          return cb();
        }).then(null, cb);
      });
    });
    describe("in an array", function () {
      return it("returns a promise which fulfills with an array", function (cb) {
        var arr, items, loop;
        items = [];
        arr = __range(0, 10, 1, false);
        loop = __promiseLoop(3, arr.length, __promise(function (_i) {
          var _e, _send, _state, _step, _throw, i, j;
          _state = 0;
          function _close() {
            _state = 2;
          }
          function _step(_received) {
            while (true) {
              switch (_state) {
              case 0:
                i = arr[_i];
                ++_state;
                return { done: false, value: randomWait(__num(i) * __num(i)) };
              case 1:
                j = _received;
                items.push(i);
                ++_state;
                return { done: true, value: j };
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
        }));
        loop.then(function (value) {
          expect(value).to.eql([
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
          expect(items.sort(__curry(2, function (x, y) {
            return __cmp(x, y);
          }))).to.eql(__range(0, 10, 1, false));
          return cb();
        }).then(null, cb);
      });
    });
    describe("of an object", function () {
      return it("returns a promise which fulfills with an array", function (cb) {
        var _keys, _obj, items, loop;
        items = [];
        _obj = {
          a: "b",
          c: "d",
          e: "f",
          g: "h",
          i: "j",
          k: "l",
          m: "n"
        };
        _keys = __keys(_obj);
        loop = __promiseLoop(3, _keys.length, __promise(function (_i) {
          var _e, _send, _state, _step, _throw, k, u, v;
          _state = 0;
          function _close() {
            _state = 2;
          }
          function _step(_received) {
            while (true) {
              switch (_state) {
              case 0:
                k = _keys[_i];
                v = _obj[k];
                ++_state;
                return { done: false, value: randomWait(v.toUpperCase()) };
              case 1:
                u = _received;
                items.push([k, v]);
                ++_state;
                return { done: true, value: u };
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
        }));
        loop.then(function (value) {
          expect(value.sort()).to.eql([
            "B",
            "D",
            "F",
            "H",
            "J",
            "L",
            "N"
          ]);
          expect(items.sort(function (a, b) {
            return __cmp(a[0], b[0]);
          })).to.eql([
            ["a", "b"],
            ["c", "d"],
            ["e", "f"],
            ["g", "h"],
            ["i", "j"],
            ["k", "l"],
            ["m", "n"]
          ]);
          return cb();
        }).then(null, cb);
      });
    });
    return describe("from an iterator", function () {
      return it("returns a promise which fulfills with an array", function (cb) {
        var items, loop;
        function iter() {
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
              case 1:
                _state = i < 10 ? 2 : 4;
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
        items = [];
        loop = __promiseIter(3, __iter(iter()), __promise(function (i, j) {
          var _e, _send, _state, _step, _throw, k;
          _state = 0;
          function _close() {
            _state = 2;
          }
          function _step(_received) {
            while (true) {
              switch (_state) {
              case 0:
                expect(i).to.equal(j);
                ++_state;
                return { done: false, value: randomWait(__num(i) * __num(i)) };
              case 1:
                k = _received;
                items.push(i);
                ++_state;
                return { done: true, value: k };
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
        }));
        loop.then(function (value) {
          expect(value).to.eql([
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
          expect(items.sort(__curry(2, function (x, y) {
            return __cmp(x, y);
          }))).to.eql(__range(0, 10, 1, false));
          return cb();
        }).then(null, cb);
      });
    });
  });
  describe("delay!", function () {
    describe("with a value", function () {
      it("works for time <= 0", function (cb) {
        var alpha;
        alpha = __defer.fulfilled("bravo");
        alpha.then(function (value) {
          expect(value).to.equal("bravo");
          return cb();
        }).then(null, cb);
      });
      it(
        "waits at least the specified time before fulfilling",
        function (cb) {
          var alpha, start;
          start = new Date().getTime();
          alpha = __delay(200, "bravo");
          alpha.then(function (value) {
            var elapsed;
            expect(value).to.equal("bravo");
            elapsed = new Date().getTime();
            expect(elapsed).to.be.at.least(200);
            return cb();
          }).then(null, cb);
        }
      );
      return it(
        "can be used with some-promise! as a timeout mechanism",
        function (cb) {
          var neverFinish, timeout;
          neverFinish = __defer().promise;
          timeout = {};
          __somePromise([
            neverFinish,
            __delay(50, timeout)
          ]).then(function (value) {
            expect(value).to.equal(timeout);
            return cb();
          }).then(null, cb);
        }
      );
    });
    return describe("without a value", function () {
      it("works for time <= 0", function (cb) {
        var alpha;
        alpha = __defer.fulfilled();
        alpha.then(function (value) {
          expect(value).to.equal(void 0);
          return cb();
        }).then(null, cb);
      });
      return it(
        "waits at least the specified time before fulfilling",
        function (cb) {
          var alpha, start;
          start = new Date().getTime();
          alpha = __delay(200);
          alpha.then(function (value) {
            var elapsed;
            expect(value).to.equal(void 0);
            elapsed = new Date().getTime();
            expect(elapsed).to.be.at.least(200);
            return cb();
          }).then(null, cb);
        }
      );
    });
  });
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
