try {
  if (typeof top === "object" && top !== null && typeof top.opener === "object" && top.opener !== null && !top.opener._$jscoverage) {
    top.opener._$jscoverage = {};
  }
} catch (e) {}
try {
  if (typeof top === "object" && top !== null) {
    try {
      if (typeof top.opener === "object" && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    } catch (e) {}
    if (!top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
} catch (e) {}
try {
  if (typeof top === "object" && top !== null) {
    top._$jscoverage;
  }
} catch (e) {}
if (typeof _$jscoverage !== "object") {
  _$jscoverage = {};
}
if (!_$jscoverage["test/fixtures/hello.gs"]) {
  (function () {
    var cov, i, lines;
    _$jscoverage["test/fixtures/hello.gs"] = cov = [];
    for (i = 0, lines = [1]; i < 1; ++i) {
      cov[lines[i]] = 0;
    }
    cov.source = ['console.log "Hello, world!"', ""];
  }());
}
if (!_$jscoverage["test/fixtures/loop.gs"]) {
  (function () {
    var cov, i, lines;
    _$jscoverage["test/fixtures/loop.gs"] = cov = [];
    for (i = 0, lines = [1, 2]; i < 2; ++i) {
      cov[lines[i]] = 0;
    }
    cov.source = ["for x in [1, 2, 3, 4, 5]", "  console.log x", ""];
  }());
}
(function () {
  "use strict";
  ++_$jscoverage["test/fixtures/hello.gs"][1];
  (function () {
    console.log("Hello, world!");
  }());
  ++_$jscoverage["test/fixtures/loop.gs"][1];
  (function () {
    var _arr, _i, _len, x;
    for (_arr = [
      1,
      2,
      3,
      4,
      5
    ], _i = 0, _len = _arr.length; _i < _len; ++_i) {
      x = _arr[_i];
      ++_$jscoverage["test/fixtures/loop.gs"][2];
      console.log(x);
    }
  }());
}.call(this));
