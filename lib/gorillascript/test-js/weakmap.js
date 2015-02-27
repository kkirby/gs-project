(function (GLOBAL) {
  "use strict";
  var __create, __owns, expect, WeakMap;
  __create = typeof Object.create === "function" ? Object.create
    : function (x) {
      function F() {}
      F.prototype = x;
      return new F();
    };
  __owns = Object.prototype.hasOwnProperty;
  WeakMap = typeof GLOBAL.WeakMap === "function" ? GLOBAL.WeakMap
    : (WeakMap = (function () {
      var _WeakMap_prototype, defProp, isExtensible;
      function WeakMap() {
        var _this;
        _this = this instanceof WeakMap ? this : __create(_WeakMap_prototype);
        _this._keys = [];
        _this._values = [];
        _this._chilly = [];
        _this._uid = createUid();
        return _this;
      }
      _WeakMap_prototype = WeakMap.prototype;
      WeakMap.displayName = "WeakMap";
      function uidRand() {
        return Math.random().toString(36).slice(2);
      }
      function createUid() {
        return uidRand() + "-" + new Date().getTime() + "-" + uidRand() + "-" + uidRand();
      }
      isExtensible = Object.isExtensible || function () {
        return true;
      };
      function check(key) {
        var chilly, uid;
        uid = this._uid;
        if (__owns.call(key, uid)) {
          chilly = this._chilly;
          if (chilly.indexOf(key) === -1) {
            chilly.push(key);
            this._keys.push(key);
            this._values.push(key[uid]);
          }
        }
      }
      _WeakMap_prototype.get = function (key) {
        var _ref, index;
        if (Object(key) !== key) {
          throw new TypeError("Invalid value used as weak map key");
        }
        if (isExtensible(key)) {
          if (__owns.call(key, _ref = this._uid)) {
            return key[_ref];
          }
        } else {
          check.call(this, key);
          index = this._keys.indexOf(key);
          if (index !== -1) {
            return this._values[index];
          }
        }
      };
      _WeakMap_prototype.has = function (key) {
        if (Object(key) !== key) {
          throw new TypeError("Invalid value used as weak map key");
        }
        if (isExtensible(key)) {
          return __owns.call(key, this._uid);
        } else {
          check.call(this, key);
          return this._keys.indexOf(key) !== -1;
        }
      };
      if (typeof Object.defineProperty === "function") {
        defProp = Object.defineProperty;
      } else {
        defProp = function (o, k, d) {
          o[k] = d.value;
        };
      }
      _WeakMap_prototype.set = function (key, value) {
        var index, keys;
        if (Object(key) !== key) {
          throw new TypeError("Invalid value used as weak map key");
        }
        if (isExtensible(key)) {
          defProp(key, this._uid, { configurable: true, writable: true, enumerable: false, value: value });
        } else {
          check.call(this, key);
          keys = this._keys;
          index = keys.indexOf(key);
          if (index === -1) {
            index = keys.length;
            keys[index] = key;
          }
          this._values[index] = value;
        }
      };
      _WeakMap_prototype["delete"] = function (key) {
        var index, keys;
        if (Object(key) !== key) {
          throw new TypeError("Invalid value used as weak map key");
        }
        if (isExtensible(key)) {
          delete key[this._uid];
        } else {
          check.call(this, key);
          keys = this._keys;
          index = keys.indexOf(key);
          if (index !== -1) {
            keys.splice(index, 1);
            this._values.splice(index, 1);
          }
        }
      };
      return WeakMap;
    }()));
  expect = require("chai").expect;
  describe("WeakMap", function () {
    var hasFrozen;
    it("should handle mutable object keys", function () {
      var obj, wm;
      wm = WeakMap();
      obj = {};
      expect(wm.get(obj)).to.be["undefined"];
      expect(wm.has(obj)).to.be["false"];
      wm.set(obj, "hello");
      expect(wm.get(obj)).to.equal("hello");
      expect(wm.has(obj)).to.be["true"];
      wm.set(obj, "there");
      expect(wm.get(obj)).to.equal("there");
      expect(wm.has(obj)).to.be["true"];
      wm["delete"](obj);
      expect(wm.get(obj)).to.be["undefined"];
      return expect(wm.has(obj)).to.be["false"];
    });
    hasFrozen = typeof Object.freeze === "function" && typeof Object.isFrozen === "function" && Object.isFrozen(Object.freeze({}));
    it("should handle frozen keys", function () {
      var obj, wm;
      wm = WeakMap();
      obj = Object.freeze({});
      expect(wm.get(obj)).to.be["undefined"];
      expect(wm.has(obj)).to.be["false"];
      wm.set(obj, "hello");
      expect(wm.get(obj)).to.equal("hello");
      expect(wm.has(obj)).to.be["true"];
      wm.set(obj, "there");
      expect(wm.get(obj)).to.equal("there");
      expect(wm.has(obj)).to.be["true"];
      wm["delete"](obj);
      expect(wm.get(obj)).to.be["undefined"];
      return expect(wm.has(obj)).to.be["false"];
    });
    return it(
      "should handle keys which are frozen after placed into WeakMap",
      function () {
        var obj, wm;
        wm = WeakMap();
        obj = Object.freeze({});
        expect(wm.get(obj)).to.be["undefined"];
        expect(wm.has(obj)).to.be["false"];
        wm.set(obj, "hello");
        expect(wm.get(obj)).to.equal("hello");
        expect(wm.has(obj)).to.be["true"];
        Object.freeze(obj);
        wm.set(obj, "there");
        expect(wm.get(obj)).to.equal("there");
        expect(wm.has(obj)).to.be["true"];
        wm["delete"](obj);
        expect(wm.get(obj)).to.be["undefined"];
        return expect(wm.has(obj)).to.be["false"];
      }
    );
  });
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
