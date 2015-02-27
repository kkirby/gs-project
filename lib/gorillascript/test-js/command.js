(function () {
  "use strict";
  var __strnum, __typeof, _ref, exec, expect, fs, gorillaBin, inspect, os, path,
      spawn;
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
  _ref = require("child_process");
  spawn = _ref.spawn;
  exec = _ref.exec;
  _ref = null;
  path = require("path");
  fs = require("fs");
  os = require("os");
  inspect = require("util").inspect;
  gorillaBin = path.join(__dirname, "..", "bin", "gorilla");
  function execWithStdin(binary, argv, stdin, callback) {
    var proc, stderr, stdout;
    proc = spawn(binary, argv);
    stdout = "";
    proc.stdout.on("data", function (data) {
      return stdout += data.toString();
    });
    stderr = "";
    proc.stderr.on("data", function (data) {
      return stderr += data.toString();
    });
    proc.on("exit", function (code, signal) {
      var err;
      if (code !== 0) {
        err = new Error(__strnum(binary) + " exited with code " + String(code) + " and signal " + String(signal));
        err.code = code;
        err.signal = signal;
      }
      return callback(err, stdout, stderr);
    });
    proc.stdin.write(stdin);
    return proc.stdin.end();
  }
  describe("gorilla binary", function () {
    describe("command-line interface", function () {
      describe("passing in an expression with -e", function () {
        it("should work with a single word", function (cb) {
          var _once;
          return exec(__strnum(gorillaBin) + " -e 1234", (_once = false, function (error, stdout, stderr) {
            if (_once) {
              throw new Error("Attempted to call function more than once");
            } else {
              _once = true;
            }
            expect(error).to.not.exist;
            expect(stderr).to.be.empty;
            expect(stdout.trim()).to.equal("1234");
            return cb();
          }));
        });
        return it("should work with multiple words", function (cb) {
          var _once;
          return exec(__strnum(gorillaBin) + " -e '1 + 2 + 3'", (_once = false, function (error, stdout, stderr) {
            if (_once) {
              throw new Error("Attempted to call function more than once");
            } else {
              _once = true;
            }
            expect(error).to.not.exist;
            expect(stderr).to.be.empty;
            expect(stdout.trim()).to.equal("6");
            return cb();
          }));
        });
      });
      return describe("passing in code with --stdin", function () {
        return it("should be able to run a simple program", function (cb) {
          var _once;
          return execWithStdin(gorillaBin, ["--stdin"], "console.log 'Hello, world!'", (_once = false, function (error, stdout, stderr) {
            if (_once) {
              throw new Error("Attempted to call function more than once");
            } else {
              _once = true;
            }
            expect(error).to.not.exist;
            expect(stderr).to.be.empty;
            expect(stdout.trim()).to.equal("Hello, world!");
            return cb();
          }));
        });
      });
    });
    describe("when used as the binary to launch a file", function () {
      describe("as the shebang", function () {
        return it("should have the expected process.argv", function (cb) {
          var _once, code, tmpBinary;
          code = "#!/usr/bin/env " + __strnum(gorillaBin) + "\nconsole.log process.argv\n";
          tmpBinary = path.join(fs.realpathSync(os.tmpdir()), "command-shebang-argv.gs");
          return fs.writeFile(
            tmpBinary,
            code,
            { encoding: "utf8", mode: 511 },
            (_once = false, function (_e) {
              var _once2;
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              if (_e != null) {
                return cb(_e);
              }
              return exec(__strnum(tmpBinary) + " alpha bravo charlie", (_once2 = false, function (error, stdout, stderr) {
                var _once3;
                if (_once2) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once2 = true;
                }
                expect(error).to.not.exist;
                expect(stderr).to.be.empty;
                expect(stdout.trim()).to.equal(inspect([
                  "gorilla",
                  tmpBinary,
                  "alpha",
                  "bravo",
                  "charlie"
                ]));
                return exec(__strnum(tmpBinary) + " alpha --bravo charlie", (_once3 = false, function (error, stdout, stderr) {
                  var _once4;
                  if (_once3) {
                    throw new Error("Attempted to call function more than once");
                  } else {
                    _once3 = true;
                  }
                  expect(error).to.not.exist;
                  expect(stderr).to.be.empty;
                  expect(stdout.trim()).to.equal(inspect([
                    "gorilla",
                    tmpBinary,
                    "alpha",
                    "--bravo",
                    "charlie"
                  ]));
                  return fs.unlink(tmpBinary, (_once4 = false, function (_e2) {
                    if (_once4) {
                      throw new Error("Attempted to call function more than once");
                    } else {
                      _once4 = true;
                    }
                    if (_e2 != null) {
                      return cb(_e2);
                    }
                    return cb();
                  }));
                }));
              }));
            })
          );
        });
      });
      describe("called with the gorilla command", function () {
        return it("should have the expected process.argv", function (cb) {
          var _once, code, tmpBinary;
          code = "console.log process.argv\n";
          tmpBinary = path.join(fs.realpathSync(os.tmpdir()), "command-argv.gs");
          return fs.writeFile(
            tmpBinary,
            code,
            { encoding: "utf8", mode: 511 },
            (_once = false, function (_e) {
              var _once2;
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              if (_e != null) {
                return cb(_e);
              }
              return exec(__strnum(gorillaBin) + " " + __strnum(tmpBinary) + " alpha bravo charlie", (_once2 = false, function (error, stdout, stderr) {
                var _once3;
                if (_once2) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once2 = true;
                }
                expect(error).to.not.exist;
                expect(stderr).to.be.empty;
                expect(stdout.trim()).to.equal(inspect([
                  "gorilla",
                  tmpBinary,
                  "alpha",
                  "bravo",
                  "charlie"
                ]));
                return exec(__strnum(gorillaBin) + " " + __strnum(tmpBinary) + " alpha --bravo charlie", (_once3 = false, function (error, stdout, stderr) {
                  var _once4;
                  if (_once3) {
                    throw new Error("Attempted to call function more than once");
                  } else {
                    _once3 = true;
                  }
                  expect(error).to.not.exist;
                  expect(stderr).to.be.empty;
                  expect(stdout.trim()).to.equal(inspect([
                    "gorilla",
                    tmpBinary,
                    "alpha",
                    "--bravo",
                    "charlie"
                  ]));
                  return exec(__strnum(gorillaBin) + ' --options=\'{"x":"y"}\' ' + __strnum(tmpBinary) + " alpha --bravo charlie", (_once4 = false, function (error, stdout, stderr) {
                    var _once5;
                    if (_once4) {
                      throw new Error("Attempted to call function more than once");
                    } else {
                      _once4 = true;
                    }
                    expect(error).to.not.exist;
                    expect(stderr).to.be.empty;
                    expect(stdout.trim()).to.equal(inspect([
                      "gorilla",
                      tmpBinary,
                      "alpha",
                      "--bravo",
                      "charlie"
                    ]));
                    return fs.unlink(tmpBinary, (_once5 = false, function (_e2) {
                      if (_once5) {
                        throw new Error("Attempted to call function more than once");
                      } else {
                        _once5 = true;
                      }
                      if (_e2 != null) {
                        return cb(_e2);
                      }
                      return cb();
                    }));
                  }));
                }));
              }));
            })
          );
        });
      });
      return describe("compiling a file", function () {
        return it(
          "should have the expected process.argv in the compiled file",
          function (cb) {
            var _once, code, tmpBinaryGs, tmpBinaryJs;
            code = "console.log process.argv\n";
            tmpBinaryGs = path.join(fs.realpathSync(os.tmpdir()), "command-argv.gs");
            tmpBinaryJs = path.join(fs.realpathSync(os.tmpdir()), "command-argv.js");
            return fs.writeFile(tmpBinaryGs, code, "utf8", (_once = false, function (_e) {
              var _once2;
              if (_once) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once = true;
              }
              if (_e != null) {
                return cb(_e);
              }
              return exec(__strnum(gorillaBin) + " -c " + __strnum(tmpBinaryGs), (_once2 = false, function (error, stdout, stderr) {
                var _once3;
                if (_once2) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once2 = true;
                }
                expect(error).to.not.exist;
                expect(stderr).to.be.empty;
                expect(stdout.trim()).to.match(new RegExp("Compiling " + __strnum(path.basename(tmpBinaryGs)) + " \\.\\.\\. \\d+\\.\\d+ seconds", ""));
                return exec("node " + __strnum(tmpBinaryJs) + " alpha bravo charlie", (_once3 = false, function (error, stdout, stderr) {
                  var _once4;
                  if (_once3) {
                    throw new Error("Attempted to call function more than once");
                  } else {
                    _once3 = true;
                  }
                  expect(error).to.not.exist;
                  expect(stderr).to.be.empty;
                  expect(stdout.trim()).to.equal(inspect([
                    "node",
                    tmpBinaryJs,
                    "alpha",
                    "bravo",
                    "charlie"
                  ]));
                  return fs.unlink(tmpBinaryGs, (_once4 = false, function (_e2) {
                    var _once5;
                    if (_once4) {
                      throw new Error("Attempted to call function more than once");
                    } else {
                      _once4 = true;
                    }
                    if (_e2 != null) {
                      return cb(_e2);
                    }
                    return fs.unlink(tmpBinaryJs, (_once5 = false, function (_e3) {
                      if (_once5) {
                        throw new Error("Attempted to call function more than once");
                      } else {
                        _once5 = true;
                      }
                      if (_e3 != null) {
                        return cb(_e3);
                      }
                      return cb();
                    }));
                  }));
                }));
              }));
            }));
          }
        );
      });
    });
    return describe("compiling", function () {
      it("a single file", function (cb) {
        var _once, code, tmpOutputGs, tmpOutputJs;
        code = '@message := "Hello, world!"';
        tmpOutputGs = path.join(fs.realpathSync(os.tmpdir()), "hello.gs");
        tmpOutputJs = path.join(fs.realpathSync(os.tmpdir()), "hello.js");
        return fs.writeFile(tmpOutputGs, code, "utf8", (_once = false, function (_e) {
          var _once2;
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (_e != null) {
            return cb(_e);
          }
          return exec(__strnum(gorillaBin) + " -c " + __strnum(tmpOutputGs), (_once2 = false, function (error, stdout, stderr) {
            var _once3;
            if (_once2) {
              throw new Error("Attempted to call function more than once");
            } else {
              _once2 = true;
            }
            expect(error).to.not.exist;
            expect(stderr).to.be.empty;
            expect(stdout.trim()).to.match(new RegExp("Compiling " + __strnum(path.basename(tmpOutputGs)) + " \\.\\.\\. \\d+\\.\\d+ seconds", ""));
            return fs.readFile(tmpOutputJs, "utf8", (_once3 = false, function (_e2, jsCode) {
              var _once4;
              if (_once3) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once3 = true;
              }
              if (_e2 != null) {
                return cb(_e2);
              }
              return fs.unlink(tmpOutputGs, (_once4 = false, function (_e3) {
                var _once5;
                if (_once4) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once4 = true;
                }
                if (_e3 != null) {
                  return cb(_e3);
                }
                return fs.unlink(tmpOutputJs, (_once5 = false, function (_e4) {
                  var obj;
                  if (_once5) {
                    throw new Error("Attempted to call function more than once");
                  } else {
                    _once5 = true;
                  }
                  if (typeof _e4 !== "undefined" && _e4 !== null) {
                    return cb(_e4);
                  }
                  obj = {};
                  Function(jsCode).call(obj);
                  expect(obj.message).to.equal("Hello, world!");
                  return cb();
                }));
              }));
            }));
          }));
        }));
      });
      it("a multiple files, compiled separately", function (cb) {
        var _once, alphaCode, bravoCode, tmpAlphaGs, tmpAlphaJs, tmpBravoGs,
            tmpBravoJs;
        alphaCode = '@alpha := "Hello"';
        bravoCode = '@bravo := "World!"';
        tmpAlphaGs = path.join(fs.realpathSync(os.tmpdir()), "alpha.gs");
        tmpAlphaJs = path.join(fs.realpathSync(os.tmpdir()), "alpha.js");
        tmpBravoGs = path.join(fs.realpathSync(os.tmpdir()), "bravo.gs");
        tmpBravoJs = path.join(fs.realpathSync(os.tmpdir()), "bravo.js");
        return fs.writeFile(tmpAlphaGs, alphaCode, "utf8", (_once = false, function (_e) {
          var _once2;
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (_e != null) {
            return cb(_e);
          }
          return fs.writeFile(tmpBravoGs, bravoCode, "utf8", (_once2 = false, function (_e2) {
            var _once3;
            if (_once2) {
              throw new Error("Attempted to call function more than once");
            } else {
              _once2 = true;
            }
            if (_e2 != null) {
              return cb(_e2);
            }
            return exec(__strnum(gorillaBin) + " -c " + __strnum(tmpAlphaGs) + " " + __strnum(tmpBravoGs), (_once3 = false, function (error, stdout, stderr) {
              var _once4;
              if (_once3) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once3 = true;
              }
              expect(error).to.not.exist;
              expect(stderr).to.be.empty;
              expect(stdout.trim()).to.match(new RegExp("Compiling " + __strnum(path.basename(tmpAlphaGs)) + " \\.\\.\\. \\d+\\.\\d+ seconds", ""));
              expect(stdout.trim()).to.match(new RegExp("Compiling " + __strnum(path.basename(tmpBravoGs)) + " \\.\\.\\. \\d+\\.\\d+ seconds", ""));
              return fs.readFile(tmpAlphaJs, "utf8", (_once4 = false, function (_e3, alphaJsCode) {
                var _once5;
                if (_once4) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once4 = true;
                }
                if (_e3 != null) {
                  return cb(_e3);
                }
                return fs.readFile(tmpBravoJs, "utf8", (_once5 = false, function (_e4, bravoJsCode) {
                  var _once6;
                  if (_once5) {
                    throw new Error("Attempted to call function more than once");
                  } else {
                    _once5 = true;
                  }
                  if (_e4 != null) {
                    return cb(_e4);
                  }
                  return fs.unlink(tmpAlphaGs, (_once6 = false, function (_e5) {
                    var _once7;
                    if (_once6) {
                      throw new Error("Attempted to call function more than once");
                    } else {
                      _once6 = true;
                    }
                    if (_e5 != null) {
                      return cb(_e5);
                    }
                    return fs.unlink(tmpAlphaJs, (_once7 = false, function (_e6) {
                      var _once8;
                      if (_once7) {
                        throw new Error("Attempted to call function more than once");
                      } else {
                        _once7 = true;
                      }
                      if (_e6 != null) {
                        return cb(_e6);
                      }
                      return fs.unlink(tmpBravoGs, (_once8 = false, function (_e7) {
                        var _once9;
                        if (_once8) {
                          throw new Error("Attempted to call function more than once");
                        } else {
                          _once8 = true;
                        }
                        if (_e7 != null) {
                          return cb(_e7);
                        }
                        return fs.unlink(tmpBravoJs, (_once9 = false, function (_e8) {
                          var objAlpha, objBravo;
                          if (_once9) {
                            throw new Error("Attempted to call function more than once");
                          } else {
                            _once9 = true;
                          }
                          if (typeof _e8 !== "undefined" && _e8 !== null) {
                            return cb(_e8);
                          }
                          objAlpha = {};
                          Function(alphaJsCode).call(objAlpha);
                          expect(objAlpha.alpha).to.equal("Hello");
                          objBravo = {};
                          Function(bravoJsCode).call(objBravo);
                          expect(objBravo.bravo).to.equal("World!");
                          return cb();
                        }));
                      }));
                    }));
                  }));
                }));
              }));
            }));
          }));
        }));
      });
      return it("a multiple files, compiled as joined output", function (cb) {
        var _once, alphaCode, bravoCode, tmpAlphaGs, tmpBravoGs, tmpOutputJs;
        alphaCode = '@alpha := "Hello"';
        bravoCode = '@bravo := "World!"';
        tmpAlphaGs = path.join(fs.realpathSync(os.tmpdir()), "alpha.gs");
        tmpBravoGs = path.join(fs.realpathSync(os.tmpdir()), "bravo.gs");
        tmpOutputJs = path.join(fs.realpathSync(os.tmpdir()), "output.js");
        return fs.writeFile(tmpAlphaGs, alphaCode, "utf8", (_once = false, function (_e) {
          var _once2;
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          if (_e != null) {
            return cb(_e);
          }
          return fs.writeFile(tmpBravoGs, bravoCode, "utf8", (_once2 = false, function (_e2) {
            var _once3;
            if (_once2) {
              throw new Error("Attempted to call function more than once");
            } else {
              _once2 = true;
            }
            if (_e2 != null) {
              return cb(_e2);
            }
            return exec(__strnum(gorillaBin) + " -c " + __strnum(tmpAlphaGs) + " " + __strnum(tmpBravoGs) + " -j -o " + __strnum(tmpOutputJs), (_once3 = false, function (error, stdout, stderr) {
              var _once4;
              if (_once3) {
                throw new Error("Attempted to call function more than once");
              } else {
                _once3 = true;
              }
              expect(error).to.not.exist;
              expect(stderr).to.be.empty;
              expect(stdout.trim()).to.match(new RegExp("Compiling " + __strnum(path.basename(tmpAlphaGs)) + ", " + __strnum(path.basename(tmpBravoGs)) + " \\.\\.\\. \\d+\\.\\d+ seconds", ""));
              return fs.readFile(tmpOutputJs, "utf8", (_once4 = false, function (_e3, jsCode) {
                var _once5;
                if (_once4) {
                  throw new Error("Attempted to call function more than once");
                } else {
                  _once4 = true;
                }
                if (_e3 != null) {
                  return cb(_e3);
                }
                return fs.unlink(tmpAlphaGs, (_once5 = false, function (_e4) {
                  var _once6;
                  if (_once5) {
                    throw new Error("Attempted to call function more than once");
                  } else {
                    _once5 = true;
                  }
                  if (_e4 != null) {
                    return cb(_e4);
                  }
                  return fs.unlink(tmpBravoGs, (_once6 = false, function (_e5) {
                    var _once7;
                    if (_once6) {
                      throw new Error("Attempted to call function more than once");
                    } else {
                      _once6 = true;
                    }
                    if (_e5 != null) {
                      return cb(_e5);
                    }
                    return fs.unlink(tmpOutputJs, (_once7 = false, function (_e6) {
                      var obj;
                      if (_once7) {
                        throw new Error("Attempted to call function more than once");
                      } else {
                        _once7 = true;
                      }
                      if (typeof _e6 !== "undefined" && _e6 !== null) {
                        return cb(_e6);
                      }
                      obj = {};
                      Function(jsCode).call(obj);
                      expect(obj.alpha).to.equal("Hello");
                      expect(obj.bravo).to.equal("World!");
                      return cb();
                    }));
                  }));
                }));
              }));
            }));
          }));
        }));
      });
    });
  });
}.call(this));
