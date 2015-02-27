(function (GLOBAL) {
  "use strict";
  var __isArray, __slice, __toArray, __typeof, expect, gorilla, setImmediate,
      stub;
  __isArray = typeof Array.isArray === "function" ? Array.isArray
    : (function (_toString) {
      return function (x) {
        return _toString.call(x) === "[object Array]";
      };
    }(Object.prototype.toString));
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
  stub = require("sinon").stub;
  gorilla = require("../index");
  describe("embedded compilation", function () {
    it("works with simple text and calculated value", function () {
      var f, text;
      f = gorilla.evalSync('Hello, <%= "wor" & "ld" %>!', { embedded: true, noindent: true });
      text = [];
      f(function (x, escape) {
        return text.push(x);
      });
      return expect(text.join("")).to.equal("Hello, world!");
    });
    it("allows for access from the context", function () {
      var f, text;
      f = gorilla.evalSync("Hello, <%= name %>!", { embedded: true, noindent: true });
      text = [];
      f(
        function (x, escape) {
          return text.push(x);
        },
        { name: "world" }
      );
      return expect(text.join("")).to.equal("Hello, world!");
    });
    it("allows for a function call from a context helper", function () {
      var f, text;
      f = gorilla.evalSync("Hello, <%= get-name() %>!", { embedded: true, noindent: true });
      text = [];
      f(
        function (x, escape) {
          return text.push(x);
        },
        {
          getName: function () {
            return "world";
          }
        }
      );
      return expect(text.join("")).to.equal("Hello, world!");
    });
    it("allows if statements", function () {
      var f, text;
      f = gorilla.evalSync(
        "<% if name: %>\nHello, <%= name %>!\n<% end %>",
        { embedded: true, noindent: true }
      );
      text = [];
      f(
        function (x, escape) {
          return text.push(x);
        },
        { name: "world" }
      );
      expect(text.join("").trim()).to.equal("Hello, world!");
      text.length = 0;
      f(
        function (x, escape) {
          return text.push(x);
        },
        null
      );
      return expect(text.join("").trim()).to.equal("");
    });
    it("allows if-else statements", function () {
      var f, text;
      f = gorilla.evalSync(
        "<% if name: %>\nHello, <%= name %>!\n<% else: %>\nHello!\n<% end %>",
        { embedded: true, noindent: true }
      );
      text = [];
      f(
        function (x, escape) {
          return text.push(x);
        },
        { name: "world" }
      );
      expect(text.join("").trim()).to.equal("Hello, world!");
      text.length = 0;
      f(
        function (x, escape) {
          return text.push(x);
        },
        null
      );
      return expect(text.join("").trim()).to.equal("Hello!");
    });
    it("allows for loops", function () {
      var f, text;
      f = gorilla.evalSync(
        "<% for item in items: %>\n<%= item.name %>: $<%= item.price.to-fixed(2) %>\n<% end %>",
        { embedded: true, noindent: true }
      );
      text = [];
      f(
        function (x, escape) {
          return text.push(x);
        },
        {
          items: [
            { name: "Apple", price: 1.23 },
            { name: "Banana", price: 0.5 },
            { name: "Cherry", price: 1 }
          ]
        }
      );
      return expect(text.join("").trim()).to.equal("Apple: $1.23\n\nBanana: $0.50\n\nCherry: $1.00");
    });
    it("allows custom escaping", function () {
      var template, text;
      template = gorilla.evalSync("Hello, <%= name %>", { embedded: true, noindent: true });
      text = [];
      function write(x, escape) {
        var part;
        if (escape) {
          part = String(x).toUpperCase();
        } else {
          part = String(x);
        }
        text.push(part);
      }
      template(write, { name: "Bob" });
      return expect(text.join("")).to.equal("Hello, BOB");
    });
    it("allows calling async helpers", function (cb) {
      var bodyRan, inBody, template, text;
      template = gorilla.evalSync(
        "<% async <- soon() %>\nHello, <%= name %>!\n<% done() %>",
        { embedded: true, noindent: true }
      );
      text = [];
      inBody = stub();
      bodyRan = false;
      return template(
        function (x) {
          return text.push(x);
        },
        {
          name: "world",
          soon: setImmediate,
          done: function () {
            expect(text.join("").trim()).equal("Hello, world!");
            return cb();
          }
        }
      );
    });
    it("allows calling an async helper in a block", function (cb) {
      var bodyRan, inBody, template, text;
      template = gorilla.evalSync(
        "<% do: %>\n  <% async <- soon() %>\n  Hello, <%= name %>!\n  <% done() %>\n<% end %>",
        { embedded: true, noindent: true }
      );
      text = [];
      inBody = stub();
      bodyRan = false;
      return template(
        function (x) {
          return text.push(x);
        },
        {
          name: "world",
          soon: setImmediate,
          done: function () {
            expect(text.join("").trim()).equal("Hello, world!");
            return cb();
          }
        }
      );
    });
    it("allows comments", function () {
      var template, text;
      template = gorilla.evalSync(
        "<%-- ignore() --%>\nHello<%-- this isn't even correct syntax. --%>, world!\n<% /* these comments should work, too */ %>",
        { embedded: true, noindent: true }
      );
      text = [];
      template(function (x) {
        return text.push(x);
      });
      return expect(text.join("").trim()).equal("Hello, world!");
    });
    it("allows non-standard tokens", function () {
      var template, text;
      template = gorilla.evalSync(
        "{* ignore() *}\nHello{* ignore() *}, world!\n{% if test: %}\nPass, {{ name }}\n{% else: %}\nFail\n{% end %}\n{@{{ name }}@}",
        {
          embedded: true,
          noindent: true,
          embeddedOpen: "{%",
          embeddedClose: "%}",
          embeddedOpenWrite: "{{",
          embeddedCloseWrite: "}}",
          embeddedOpenComment: "{*",
          embeddedCloseComment: "*}",
          embeddedOpenLiteral: "{@",
          embeddedCloseLiteral: "@}"
        }
      );
      text = [];
      template(
        function (x) {
          return text.push(x);
        },
        { test: true, name: "friend" }
      );
      expect(text.join("").trim().replace(/\s+/g, " ")).to.equal("Hello, world! Pass, friend {{ name }}");
      text.length = 0;
      template(
        function (x) {
          return text.push(x);
        },
        { test: false }
      );
      return expect(text.join("").trim().replace(/\s+/g, " ")).to.equal("Hello, world! Fail {{ name }}");
    });
    it("allows generators with yield statements", function () {
      var template, text;
      template = gorilla.evalSync(
        '<% let f()*: %>\n  [ <% yield "Alpha" %> ]\n  [ <% yield "Bravo" %> ]\n<% end %>\n<% for item from f(): %>\n  <%= item.to-upper-case() %>\n<% end %>',
        { embedded: true, noindent: true }
      );
      text = [];
      function write(x) {
        text.push(String(x));
      }
      template(write, {});
      return expect(text.join("").trim().replace(/\s+/g, " ")).to.equal("[ ALPHA ] [ BRAVO ]");
    });
    it("allows generators with yield expressions", function () {
      var template, text;
      template = gorilla.evalSync(
        '<% let f()*: %>\n  [ <%= yield "Alpha" %> ]\n  [ <%= yield "Bravo" %> ]\n<% end %>\n<% let iter = f()\n   let mutable next-value = void\n   while true:\n     let item = iter.send(next-value)\n     if item.done:\n       break\n     end %>\n       <%= item.value.to-upper-case() %>\n  <% next-value := item.value.to-lower-case()\n   end %>',
        { embedded: true, noindent: true }
      );
      text = [];
      function write(x) {
        text.push(String(x));
      }
      template(write, {});
      return expect(text.join("").trim().replace(/\s+/g, " ")).to.equal("[ ALPHA alpha ] [ BRAVO bravo ]");
    });
    it(
      "as a generator, should allow yield in the main body",
      function () {
        var i, iter, template, text;
        template = gorilla.evalSync('Hello, <%= yield "name" %>. How are you today?', { embedded: true, noindent: true, embeddedGenerator: true });
        text = [];
        function write(x) {
          text.push(String(x));
        }
        iter = template(write, {});
        expect(iter).to.have.property("iterator").that.is.a("function");
        expect(iter).to.have.property("next").that.is.a("function");
        expect(iter).to.have.property("send").that.is.a("function");
        expect(iter).to.have.property("throw").that.is.a("function");
        expect(text).to.be.empty;
        expect(iter.send(void 0)).to.eql({ done: false, value: "name" });
        expect(text.join("").trim().replace(/\s+/g, " ")).to.equal("Hello,");
        expect(iter.send("world")).to.eql({ done: true, value: write });
        expect(text.join("").trim().replace(/\s+/g, " ")).to.equal("Hello, world. How are you today?");
        for (i = 0; i < 10; ++i) {
          expect(iter.send(void 0)).to.eql({ done: true, value: void 0 });
        }
        return expect(text.join("").trim().replace(/\s+/g, " ")).to.equal("Hello, world. How are you today?");
      }
    );
    it(
      "as a generator, should allow yield* in the main body",
      function () {
        var i, iter, template, text;
        template = gorilla.evalSync(
          '<% let generator()*:\n     yield "hello"\n     yield "there"\n   end %>\nHello, <%= yield* generator() %>. How are you today?',
          { embedded: true, noindent: true, embeddedGenerator: true }
        );
        text = [];
        function write(x) {
          text.push(String(x));
        }
        iter = template(write, {});
        expect(iter).to.have.property("iterator").that.is.a("function");
        expect(iter).to.have.property("next").that.is.a("function");
        expect(iter).to.have.property("send").that.is.a("function");
        expect(iter).to.have.property("throw").that.is.a("function");
        expect(text).to.be.empty;
        expect(iter.send(void 0)).to.eql({ done: false, value: "hello" });
        expect(text.join("").trim().replace(/\s+/g, " ")).to.equal("Hello,");
        expect(iter.send(void 0)).to.eql({ done: false, value: "there" });
        expect(text.join("").trim().replace(/\s+/g, " ")).to.equal("Hello,");
        expect(iter.send("world")).to.eql({ done: true, value: write });
        expect(text.join("").trim().replace(/\s+/g, " ")).to.equal("Hello, world. How are you today?");
        for (i = 0; i < 10; ++i) {
          expect(iter.send(void 0)).to.eql({ done: true, value: void 0 });
        }
        return expect(text.join("").trim().replace(/\s+/g, " ")).to.equal("Hello, world. How are you today?");
      }
    );
    it("should allow a for loop within an embed write", function () {
      var i, iter, template, text;
      template = gorilla.evalSync(
        "Hello, <%= for x in [1, 2, 3]:\n  x\nend %>. How are you today?",
        { embedded: true, noindent: true, embeddedGenerator: true }
      );
      text = [];
      function write(x) {
        text.push(String(x));
      }
      iter = template(write, {});
      expect(iter).to.have.property("iterator").that.is.a("function");
      expect(iter).to.have.property("next").that.is.a("function");
      expect(iter).to.have.property("send").that.is.a("function");
      expect(iter).to.have.property("throw").that.is.a("function");
      expect(text).to.be.empty;
      expect(iter.send(void 0)).to.eql({ done: true, value: write });
      expect(text.join("").trim().replace(/\s+/g, " ")).to.equal("Hello, 1,2,3. How are you today?");
      for (i = 0; i < 10; ++i) {
        expect(iter.send(void 0)).to.eql({ done: true, value: void 0 });
      }
      return expect(text.join("").trim().replace(/\s+/g, " ")).to.equal("Hello, 1,2,3. How are you today?");
    });
    return it("allows literal segments", function () {
      var f, text;
      f = gorilla.evalSync('Hello, <%@<%= "wor" & "ld" %>@%>!', { embedded: true, noindent: true });
      text = [];
      f(function (x, escape) {
        return text.push(x);
      });
      return expect(text.join("")).to.equal('Hello, <%= "wor" & "ld" %>!');
    });
  });
}.call(this, typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this));
