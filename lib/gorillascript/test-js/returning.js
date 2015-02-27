(function () {
  "use strict";
  var expect;
  expect = require("chai").expect;
  describe("returning", function () {
    it("returns without any other statements", function () {
      var obj;
      obj = {};
      function f() {
        return obj;
      }
      return expect(f()).to.equal(obj);
    });
    it("returns a specific value given other statements", function () {
      var obj;
      obj = {};
      function f() {
        return obj;
      }
      return expect(f()).to.equal(obj);
    });
    it("is co-opted by a trailing return", function () {
      function f() {
        return true;
      }
      return expect(f()).to.be["true"];
    });
    return it("plays nicely with async statement", function () {
      var obj;
      obj = {};
      function fakeAsync(cb) {
        return cb();
      }
      function f() {
        var _once;
        fakeAsync((_once = false, function () {
          if (_once) {
            throw new Error("Attempted to call function more than once");
          } else {
            _once = true;
          }
          return true;
        }));
        return obj;
      }
      return expect(f()).to.equal(obj);
    });
  });
}.call(this));
