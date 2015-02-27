(function () {
  "use strict";
  var __create, expect;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  expect = require("chai").expect;
  describe("with statement", function () {
    it("replaces this", function () {
      var obj;
      obj = {};
      return (function () {
        return expect(this).to.equal(obj);
      }.call(obj));
    });
    it("can be nested", function () {
      var obj, other;
      obj = {};
      other = {};
      return (function () {
        expect(this).to.equal(obj);
        (function () {
          return expect(this).to.equal(other);
        }.call(other));
        return expect(this).to.equal(obj);
      }.call(obj));
    });
    return it("can have a class whose name includes this", function () {
      var obj;
      obj = {};
      (function () {
        var _this, c;
        _this = this;
        expect(this).to.equal(obj);
        c = this.Class = (function () {
          var _Class_prototype;
          _Class_prototype = Class.prototype;
          Class.displayName = "Class";
          function Class() {
            if (this instanceof Class) {
              return this;
            } else {
              return __create(_Class_prototype);
            }
          }
          _Class_prototype.alpha = function () {
            return "bravo";
          };
          return Class;
        }());
        expect(this).to.equal(obj);
        return expect(obj.Class).to.equal(c);
      }.call(obj));
      return expect(new (obj.Class)().alpha()).to.equal("bravo");
    });
  });
}.call(this));
