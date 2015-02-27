(function () {
  "use strict";
  describe("debugger", function () {
    it("can be used in a statement", function () {
      function f(x) {
        if (x) {
          debugger;
        }
      }
      return f(false);
    });
    return it("can be used as an expression", function () {
      function f(x) {
        return x && (function () {
          debugger;
        }());
      }
      return f(false);
    });
  });
}.call(this));
