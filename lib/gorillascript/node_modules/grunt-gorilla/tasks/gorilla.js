(function (GLOBAL) {
  "use strict";
  var __defer, __generatorToPromise, __in, __isArray, __lte, __num, __owns,
      __promise, __slice, __strnum, __toArray, __toPromise, __typeof, fs, path,
      setImmediate;
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
                return result = ret;
              },
              function (err) {
                state = 2;
                return result = err;
              },
              true
            );
            switch (state) {
            case 0: throw Error("Promise did not execute synchronously");
            case 1: return result;
            case 2: throw result;
            default: throw Error("Unknown state");
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
  __generatorToPromise = function (generator, allowSync) {
    if (typeof generator !== "object" || generator === null) {
      throw TypeError("Expected generator to be an Object, got " + __typeof(generator));
    } else {
      if (typeof generator.send !== "function") {
        throw TypeError("Expected generator.send to be a Function, got " + __typeof(generator.send));
      }
      if (typeof generator["throw"] !== "function") {
        throw TypeError("Expected generator.throw to be a Function, got " + __typeof(generator["throw"]));
      }
    }
    if (allowSync == null) {
      allowSync = false;
    } else if (typeof allowSync !== "boolean") {
      throw TypeError("Expected allowSync to be a Boolean, got " + __typeof(allowSync));
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
  __in = typeof Array.prototype.indexOf === "function"
    ? (function () {
      var indexOf;
      indexOf = Array.prototype.indexOf;
      return function (child, parent) {
        return indexOf.call(parent, child) !== -1;
      };
    }())
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
    : (function () {
      var _toString;
      _toString = Object.prototype.toString;
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }());
  __lte = function (x, y) {
    var type;
    type = typeof x;
    if (type !== "number" && type !== "string") {
      throw TypeError("Cannot compare a non-number/string: " + type);
    } else if (type !== typeof y) {
      throw TypeError("Cannot compare elements of different types: " + type + " vs " + typeof y);
    } else {
      return x <= y;
    }
  };
  __num = function (num) {
    if (typeof num !== "number") {
      throw TypeError("Expected a number, got " + __typeof(num));
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
      throw TypeError("Expected allowSync to be a Boolean, got " + __typeof(allowSync));
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
      return factory;
    } else {
      return __generatorToPromise(value, allowSync);
    }
  };
  __slice = Array.prototype.slice;
  __strnum = function (strnum) {
    var type;
    type = typeof strnum;
    if (type === "string") {
      return strnum;
    } else if (type === "number") {
      return String(strnum);
    } else {
      throw TypeError("Expected a string or number, got " + __typeof(strnum));
    }
  };
  __toArray = function (x) {
    if (x == null) {
      throw TypeError("Expected an object, got " + __typeof(x));
    } else if (__isArray(x)) {
      return x;
    } else if (typeof x === "string") {
      return x.split("");
    } else if (typeof x.length === "number") {
      return __slice.call(x);
    } else {
      throw TypeError("Expected an object with a length property, got " + __typeof(x));
    }
  };
  __toPromise = function (func, context, args) {
    var d;
    if (typeof func !== "function") {
      throw TypeError("Expected func to be a Function, got " + __typeof(func));
    }
    d = __defer();
    func.apply(context, __toArray(args).concat([
      function (err, value) {
        if (err != null) {
          d.reject(err);
        } else {
          d.fulfill(value);
        }
      }
    ]));
    return d.promise;
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
    ? (function () {
      var nextTick;
      nextTick = process.nextTick;
      return function (func) {
        var args;
        if (typeof func !== "function") {
          throw TypeError("Expected func to be a Function, got " + __typeof(func));
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
    }())
    : function (func) {
      var args;
      if (typeof func !== "function") {
        throw TypeError("Expected func to be a Function, got " + __typeof(func));
      }
      args = __slice.call(arguments, 1);
      if (args.length) {
        return setTimeout(
          function () {
            func.apply(void 0, __toArray(args));
          },
          0
        );
      } else {
        return setTimeout(func, 0);
      }
    };
  /*!
   * grunt-gorilla
   * https://github.com/ckknight/grunt-gorilla
   *
   * Copyright (c) 2013 Cameron Kenneth Knight
   * Licensed under the MIT license.
   */
  path = require("path");
  fs = require("fs");
  module.exports = function (grunt) {
    var compile, hasExpectedExtensions, needsCompiling;
    grunt.registerMultiTask("gorilla", "Compile GorillaScript files into JavaScript.", function () {
      var _this, done, options, promise, verbose;
      _this = this;
      options = this.options({
        bare: false,
        sourceMap: null,
        linefeed: grunt.util.linefeed,
        encoding: grunt.file.defaultEncoding,
        verbose: false,
        overwrite: false,
        coverage: false
      });
      grunt.verbose.writeflags(options, "Options");
      verbose = grunt.option("verbose") || options.verbose;
      done = this.async();
      promise = __generatorToPromise((function () {
        var _arr, _e, _i, _len, _ref, _send, _state, _step, _throw, _tmp, file,
            k, maxNameLength, name, numCompiled, progressCounts, progressTotals,
            startTime, v, validFiles;
        _state = 0;
        function _close() {
          _state = 15;
        }
        function _step(_received) {
          while (true) {
            switch (_state) {
            case 0:
              ++_state;
              return { done: false, value: require("gorillascript").init() };
            case 1:
              maxNameLength = calculateMaxNameLength(_this.files);
              startTime = Date.now();
              if (verbose) {
                grunt.log.write(grunt.util.repeat(maxNameLength, " "));
                grunt.log.writeln("     parse     macro     reduce    translate compile |   total");
              }
              progressTotals = {};
              numCompiled = 0;
              _arr = __toArray(_this.files);
              _i = 0;
              _len = _arr.length;
              ++_state;
            case 2:
              _state = _i < _len ? 3 : 13;
              break;
            case 3:
              file = _arr[_i];
              validFiles = removeInvalidFiles(file);
              _state = !hasExpectedExtensions(validFiles) ? 12 : 4;
              break;
            case 4:
              _state = validFiles.length === 0 ? 12 : 5;
              break;
            case 5:
              _tmp = options.overwrite;
              _state = _tmp ? 8 : 6;
              break;
            case 6:
              ++_state;
              return {
                done: false,
                value: needsCompiling(validFiles, file.dest)
              };
            case 7:
              _tmp = _received;
              ++_state;
            case 8:
              _state = _tmp ? 9 : 11;
              break;
            case 9:
              ++numCompiled;
              ++_state;
              return {
                done: false,
                value: compile(
                  validFiles,
                  options,
                  file.dest,
                  maxNameLength,
                  verbose
                )
              };
            case 10:
              progressCounts = _received;
              if (verbose) {
                for (k in progressCounts) {
                  if (__owns.call(progressCounts, k)) {
                    v = progressCounts[k];
                    if ((_ref = progressTotals[k]) == null) {
                      progressTotals[k] = 0;
                    }
                    progressTotals[k] = __num(progressTotals[k]) + __num(v);
                  }
                }
              }
              _state = 12;
              break;
            case 11:
              if (verbose) {
                grunt.log.writeln(__strnum(validFiles.join(", ")) + ": Skipping");
              } else {
                grunt.log.writeln("Skipping " + __strnum(validFiles.join(", ")));
              }
              ++_state;
            case 12:
              ++_i;
              _state = 2;
              break;
            case 13:
              _state = verbose && numCompiled > 1 ? 14 : 15;
              break;
            case 14:
              grunt.log.write(grunt.util.repeat(__num(maxNameLength) + 53, "-"));
              grunt.log.writeln("+----------");
              grunt.log.write(grunt.util.repeat(__num(maxNameLength) + 2, " "));
              for (_arr = [
                "parse",
                "macroExpand",
                "reduce",
                "translate",
                "compile"
              ], _i = 0, _len = _arr.length; _i < _len; ++_i) {
                name = _arr[_i];
                grunt.log.write(" ");
                grunt.log.write(padLeft(9, __strnum((__num(progressTotals[name]) / 1000).toFixed(3)) + " s"));
              }
              grunt.log.write(" | ");
              ++_state;
              return {
                done: true,
                value: grunt.log.writeln(padLeft(9, __strnum(((Date.now() - startTime) / 1000).toFixed(3)) + " s"))
              };
            case 15:
              return { done: true, value: void 0 };
            default: throw Error("Unknown state: " + _state);
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
      promise.then(
        function () {
          return done();
        },
        function (e) {
          grunt.log.error("Got an unexpected exception: " + String(e != null && e.stack || e));
          return done(false);
        }
      );
    });
    needsCompiling = __promise(function (inputs, output) {
      var _arr, _arr2, _arr3, _arr4, _arr5, _arr6, _e, _err, _i, _len, _send,
          _state, _step, _throw, _tmp, gorillaMtimeP, input, inputStatP,
          inputStatsP, outputStat, outputStatP;
      _state = 0;
      function _close() {
        _state = 16;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            for (_arr = [], _arr2 = __toArray(inputs), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
              input = _arr2[_i];
              _arr.push(__toPromise(fs.stat, fs, [input]));
            }
            inputStatsP = _arr;
            outputStatP = __toPromise(fs.stat, fs, [output]);
            gorillaMtimeP = require("gorillascript").getMtime();
            ++_state;
          case 1:
            ++_state;
            return { done: false, value: outputStatP };
          case 2:
            outputStat = _received;
            _state = 4;
            break;
          case 3:
            _state = 16;
            return { done: true, value: true };
          case 4:
            _arr = [];
            ++_state;
            return { done: false, value: gorillaMtimeP };
          case 5:
            _tmp = _received;
            _arr.push(_tmp.getTime.call(_tmp));
            ++_state;
            return { done: false, value: outputStatP };
          case 6:
            _tmp = _received;
            _tmp = _tmp.mtime;
            _arr.push(_tmp.getTime.call(_tmp));
            _tmp = !__lte.apply(void 0, _arr);
            _state = _tmp ? 7 : 8;
            break;
          case 7:
            _state = 16;
            return { done: true, value: true };
          case 8:
            _i = 0;
            _len = inputStatsP.length;
            ++_state;
          case 9:
            _state = _i < _len ? 10 : 15;
            break;
          case 10:
            inputStatP = inputStatsP[_i];
            _arr4 = [];
            ++_state;
            return { done: false, value: inputStatP };
          case 11:
            _tmp = _received;
            _tmp = _tmp.mtime;
            _arr4.push(_tmp.getTime.call(_tmp));
            ++_state;
            return { done: false, value: outputStatP };
          case 12:
            _tmp = _received;
            _tmp = _tmp.mtime;
            _arr4.push(_tmp.getTime.call(_tmp));
            _tmp = !__lte.apply(void 0, _arr4);
            _state = _tmp ? 13 : 14;
            break;
          case 13:
            _state = 16;
            return { done: true, value: true };
          case 14:
            ++_i;
            _state = 9;
            break;
          case 15:
            ++_state;
            return { done: true, value: false };
          case 16:
            return { done: true, value: void 0 };
          default: throw Error("Unknown state: " + _state);
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
    });
    function calculateMaxNameLength(fileses) {
      var _arr, _arr2, _i, _i2, _len, _len2, _ref, file, files, maxNameLength;
      maxNameLength = 0;
      for (_arr = __toArray(fileses), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        files = _arr[_i];
        for (_arr2 = __toArray(files.src), _i2 = 0, _len2 = _arr2.length; _i2 < _len2; ++_i2) {
          file = _arr2[_i2];
          if (maxNameLength < __num(_ref = file.length)) {
            maxNameLength = _ref;
          }
        }
      }
      return maxNameLength;
    }
    function removeInvalidFiles(files) {
      var _arr, _arr2, _i, _len, filepath;
      for (_arr = [], _arr2 = __toArray(files.src), _i = 0, _len = _arr2.length; _i < _len; ++_i) {
        filepath = _arr2[_i];
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn("Source file '" + __strnum(filepath) + "' not found.");
        } else {
          _arr.push(filepath);
        }
      }
      return _arr;
    }
    function padRight(desiredLength, text) {
      if (typeof desiredLength !== "number") {
        throw TypeError("Expected desiredLength to be a Number, got " + __typeof(desiredLength));
      }
      if (typeof text !== "string") {
        throw TypeError("Expected text to be a String, got " + __typeof(text));
      }
      if (text.length < desiredLength) {
        return text + __strnum(grunt.util.repeat(desiredLength - text.length, " "));
      } else {
        return text;
      }
    }
    function padLeft(desiredLength, text) {
      if (typeof desiredLength !== "number") {
        throw TypeError("Expected desiredLength to be a Number, got " + __typeof(desiredLength));
      }
      if (typeof text !== "string") {
        throw TypeError("Expected text to be a String, got " + __typeof(text));
      }
      if (text.length < desiredLength) {
        return __strnum(grunt.util.repeat(desiredLength - text.length, " ")) + text;
      } else {
        return text;
      }
    }
    compile = __promise(function (files, options, dest, maxNameLength, verbose) {
      var _e, _ref, _send, _state, _step, _throw, compileOptions, destDir, e,
          gorilla, numSpaces, progressCounts, startTime;
      _state = 0;
      function _close() {
        _state = 5;
      }
      function _step(_received) {
        while (true) {
          switch (_state) {
          case 0:
            destDir = path.dirname(dest);
            compileOptions = {
              input: files,
              output: dest,
              encoding: options.encoding,
              linefeed: options.linefeed,
              bare: options.bare,
              coverage: options.coverage,
              sourceMap: options.sourceMap
                ? {
                  file: path.join(destDir, __strnum(path.basename(dest, path.extname(dest))) + ".js.map"),
                  sourceRoot: options.sourceRoot || ""
                }
                : null
            };
            gorilla = require("gorillascript");
            ++_state;
            return { done: false, value: gorilla.init() };
          case 1:
            startTime = Date.now();
            progressCounts = {};
            if (!verbose) {
              grunt.log.write("Compiling " + __strnum(files.join(", ")) + " ...");
            } else {
              if (__num(files.length) > 1) {
                grunt.log.write(files.join(", "));
                grunt.log.writeln(": ");
                grunt.log.write(grunt.util.repeat(__num(maxNameLength) + 2, " "));
              } else {
                grunt.log.write(padRight(__num(maxNameLength) + 1, __strnum(files[0]) + ":"));
                grunt.log.write(" ");
              }
              compileOptions.progress = function (name, time) {
                grunt.log.write(" ");
                grunt.log.write(padLeft(9, __strnum((__num(time) / 1000).toFixed(3)) + " s"));
                return progressCounts[name] = time;
              };
            }
            ++_state;
          case 2:
            _state = 4;
            return { done: false, value: gorilla.compileFile(compileOptions) };
          case 3:
            grunt.log.writeln();
            if (typeof e === "undefined" || e === null || e.line == null || e.column == null) {
              grunt.log.error("Got an unexpected exception from the gorillascript compiler. The original exception was: " + String(typeof e !== "undefined" && e !== null && e.stack || e));
            } else {
              grunt.log.error(e);
            }
            grunt.fail.warn("GorillaScript failed to compile.");
            ++_state;
          case 4:
            if (!verbose) {
              if ((_ref = __num(maxNameLength) - __num(files.join(", ").length)) < 60) {
                numSpaces = _ref;
              } else {
                numSpaces = 60;
              }
              if (numSpaces > 0) {
                grunt.log.write(grunt.util.repeat(numSpaces, " "));
              }
              grunt.log.write(" ");
            } else {
              grunt.log.write(" | ");
            }
            grunt.log.writeln(padLeft(9, __strnum(((Date.now() - startTime) / 1000).toFixed(3)) + " s"));
            ++_state;
            return { done: true, value: progressCounts };
          case 5:
            return { done: true, value: void 0 };
          default: throw Error("Unknown state: " + _state);
          }
        }
      }
      function _throw(_e) {
        if (_state === 2) {
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
    });
    return hasExpectedExtensions = function (files) {
      var _arr, _i, _len, badExtensions, ext, file;
      badExtensions = [];
      for (_arr = __toArray(files), _i = 0, _len = _arr.length; _i < _len; ++_i) {
        file = _arr[_i];
        ext = path.extname(file);
        if (ext !== ".gs" && !__in(ext, badExtensions)) {
          badExtensions.push(ext);
        }
      }
      if (badExtensions.length) {
        grunt.fail.warn("Expected to only work with .gs files (found " + __strnum(extensions.join(", ")) + ").");
        return false;
      } else {
        return true;
      }
    };
  };
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
