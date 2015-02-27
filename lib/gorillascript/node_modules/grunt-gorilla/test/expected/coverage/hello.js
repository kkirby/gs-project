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
++_$jscoverage["test/fixtures/hello.gs"][1];
(function () {
  "use strict";
  console.log("Hello, world!");
}.call(this));
