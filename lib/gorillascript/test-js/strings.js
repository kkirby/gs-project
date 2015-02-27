(function () {
  "use strict";
  var __typeof, expect, gorilla, spy;
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
  spy = require("sinon").spy;
  gorilla = require("../index");
  function reverse(x) {
    if (typeof x !== "string") {
      throw new TypeError("Expected x to be a String, got " + __typeof(x));
    }
    return x.split("").reverse().join("");
  }
  function numWords(x) {
    if (typeof x !== "string") {
      throw new TypeError("Expected x to be a String, got " + __typeof(x));
    }
    return x.trim().split(/\s+/).length;
  }
  describe("Double-quoted strings", function () {
    it("can be empty", function () {
      return expect("").to.be.a("string").and.be.empty;
    });
    it("has an expected length", function () {
      return expect("hello").to.be.a("string").to.have.length(5);
    });
    it("is the expected reverse value", function () {
      return expect(reverse("hello")).to.equal("olleh");
    });
    it("retains // comments", function () {
      var value;
      value = "hello // there";
      expect(value).to.be.a("string").and.have.length(14);
      return expect(reverse(value)).to.equal("ereht // olleh");
    });
    it("retains /* */ comments", function () {
      var value;
      value = "hello /* there */ friend";
      expect(value).to.be.a("string").and.have.length(24);
      return expect(reverse(value)).to.equal("dneirf /* ereht */ olleh");
    });
    it("can have interpolation", function () {
      var a, b, value;
      value = 5;
      expect("value: " + value).to.equal("value: 5");
      expect("value: " + value).to.equal("value: 5");
      expect("" + value).to.equal("5");
      expect("" + value).to.equal("5");
      expect(" ").to.equal(" ");
      expect("").to.equal("");
      expect("").to.equal("");
      expect("$(value)").to.equal("$(value)");
      expect("$value").to.equal("$value");
      expect("start $(value)").to.equal("start $(value)");
      expect("start $value").to.equal("start $value");
      expect("start $(value) end").to.equal("start $(value) end");
      expect("start $value end").to.equal("start $value end");
      expect("start " + value + " end").to.equal("start 5 end");
      expect("start " + value + " end").to.equal("start 5 end");
      expect("$(value) end").to.equal("$(value) end");
      expect("$value end").to.equal("$value end");
      expect("" + value + value * value).to.equal("525");
      expect(value + " * " + value + " = " + value * value).to.equal("5 * 5 = 25");
      expect("value:\n" + value).to.equal("value:\n5");
      expect("value:\n" + value).to.equal("value:\n5");
      a = 1;
      b = 2;
      expect("" + a + b).to.equal("12");
      expect("" + a + b + "c").to.equal("12c");
      expect("c" + a + b).to.equal("c12");
      return expect("c" + a + b + "c").to.equal("c12c");
    });
    return it("can be indexed", function () {
      expect("hello".toString).to.equal(String.prototype.toString);
      return expect("hello".toString).to.equal(String.prototype.toString);
    });
  });
  describe("Single-quoted strings", function () {
    it("can be empty", function () {
      return expect("").to.be.a("string").and.to.be.empty;
    });
    it("has an expected length", function () {
      return expect("hello").to.be.a("string").and.to.have.length(5);
    });
    it("is the expected reverse value", function () {
      return expect(reverse("hello")).to.equal("olleh");
    });
    it("retains // comments", function () {
      var value;
      value = "hello // there";
      expect(value).to.be.a("string").and.have.length(14);
      return expect(reverse(value)).to.equal("ereht // olleh");
    });
    it("retains /* */ comments", function () {
      var value;
      value = "hello /* there */ friend";
      expect(value).to.be.a("string").and.have.length(24);
      return expect(reverse(value)).to.equal("dneirf /* ereht */ olleh");
    });
    it("ignores interpolation", function () {
      expect(reverse("$(value)")).to.equal(")eulav($");
      return expect(reverse("$value")).to.equal("eulav$");
    });
    return it("can be indexed", function () {
      expect("hello".toString).to.equal(String.prototype.toString);
      return expect("hello".toString).to.equal(String.prototype.toString);
    });
  });
  describe("Triple-double-quoted strings", function () {
    it("can be empty", function () {
      return expect("").to.be.a("string").and.be.empty;
    });
    describe("Lorem ipsum", function () {
      var paragraph;
      paragraph = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\ntempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim\nveniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\ncommodo consequat. Duis aute irure dolor in reprehenderit in voluptate\nvelit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat\ncupidatat non proident, sunt in culpa qui officia deserunt mollit anim id\nest laborum.";
      it("ignores the first line of whitespace", function () {
        return expect(paragraph).to.match(/^Lorem /);
      });
      it("ignores the last line of whitespace", function () {
        return expect(paragraph).to.match(/ laborum\.$/);
      });
      return it("has the expected amount of words", function () {
        return expect(numWords(paragraph)).to.equal(69);
      });
    });
    it("can contain double quotes", function () {
      return expect('Hello, "friend".').to.equal('Hello, "friend".');
    });
    it("converts any newlines to \\n", function () {
      expect("Hello, friend!\nI am well today.").to.equal("Hello, friend!\nI am well today.");
      return expect(gorilla.evalSync('"""alpha\r\nbravo"""')).to.equal("alpha\nbravo");
    });
    it(
      "only ignores one line of whitespace on start and end",
      function () {
        return expect("\nAlpha\n\nBravo\nCharlie\n\nDelta\n").to.equal("\nAlpha\n\nBravo\nCharlie\n\nDelta\n");
      }
    );
    it("retains indentation", function () {
      return expect("Alpha\n  Bravo\n    Charlie\n  Delta\nEcho").to.equal("Alpha\n  Bravo\n    Charlie\n  Delta\nEcho");
    });
    it("can end quote on same line as text", function () {
      return expect("Alpha\nBravo\nCharlie").to.equal("Alpha\nBravo\nCharlie");
    });
    it("can start text immediately after quote", function () {
      return expect("Alpha\nBravo\nCharlie").to.equal("Alpha\nBravo\nCharlie");
    });
    it("retains // comments", function () {
      var value;
      value = "hello // there";
      expect(value).to.be.a("string").and.have.length(14);
      return expect(reverse(value)).to.equal("ereht // olleh");
    });
    it("retains /* */ comments", function () {
      var value;
      value = "hello /* there */ friend";
      expect(value).to.be.a("string").and.have.length(24);
      return expect(reverse(value)).to.equal("dneirf /* ereht */ olleh");
    });
    it("can have interpolation", function () {
      var value;
      value = 5;
      expect("value: " + value).to.equal("value: 5");
      return expect("value: " + value).to.equal("value: 5");
    });
    return it("can be indexed", function () {
      expect("hello".toString).to.equal(String.prototype.toString);
      return expect("hello".toString).to.equal(String.prototype.toString);
    });
  });
  describe("Triple-single-quoted strings", function () {
    it("can be empty", function () {
      return expect("").to.be.a("string").and.be.empty;
    });
    describe("Lorem ipsum", function () {
      var paragraph;
      paragraph = "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\ntempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim\nveniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea\ncommodo consequat. Duis aute irure dolor in reprehenderit in voluptate\nvelit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat\ncupidatat non proident, sunt in culpa qui officia deserunt mollit anim id\nest laborum.";
      it("ignores the first line of whitespace", function () {
        return expect(paragraph).to.match(/^Lorem /);
      });
      it("ignores the last line of whitespace", function () {
        return expect(paragraph).to.match(/ laborum\.$/);
      });
      return it("has the expected amount of words", function () {
        return expect(numWords(paragraph)).to.equal(69);
      });
    });
    it("can contain double quotes", function () {
      return expect('Hello, "friend".').to.equal('Hello, "friend".');
    });
    it("converts any newlines to \\n", function () {
      expect("Hello, friend!\nI am well today.").to.equal("Hello, friend!\nI am well today.");
      return expect(gorilla.evalSync("'''alpha\r\nbravo'''")).to.equal("alpha\nbravo");
    });
    it(
      "only ignores one line of whitespace on start and end",
      function () {
        return expect("\nAlpha\n\nBravo\nCharlie\n\nDelta\n").to.equal("\nAlpha\n\nBravo\nCharlie\n\nDelta\n");
      }
    );
    it("retains indentation", function () {
      return expect("Alpha\n  Bravo\n    Charlie\n  Delta\nEcho").to.equal("Alpha\n  Bravo\n    Charlie\n  Delta\nEcho");
    });
    it("can end quote on same line as text", function () {
      return expect("Alpha\nBravo\nCharlie").to.equal("Alpha\nBravo\nCharlie");
    });
    it("can start text immediately after quote", function () {
      return expect("Alpha\nBravo\nCharlie").to.equal("Alpha\nBravo\nCharlie");
    });
    it("retains // comments", function () {
      var value;
      value = "hello // there";
      expect(value).to.be.a("string").and.have.length(14);
      return expect(reverse(value)).to.equal("ereht // olleh");
    });
    it("retains /* */ comments", function () {
      var value;
      value = "hello /* there */ friend";
      expect(value).to.be.a("string").and.have.length(24);
      return expect(reverse(value)).to.equal("dneirf /* ereht */ olleh");
    });
    it("ignores interpolation", function () {
      expect(reverse("$(value)")).to.equal(")eulav($");
      return expect(reverse("$value")).to.equal("eulav$");
    });
    return it("can be indexed", function () {
      expect("hello".toString).to.equal(String.prototype.toString);
      return expect("hello".toString).to.equal(String.prototype.toString);
    });
  });
  describe("Escape codes", function () {
    var C;
    C = String.fromCharCode;
    it(
      "handle escaping the quote used to create the string",
      function () {
        expect('Hello, "friend"').to.equal('Hello, "friend"');
        return expect("Hello, 'friend'").to.equal("Hello, 'friend'");
      }
    );
    it("can be 2-octet hex escapes", function () {
      expect("\u0000").to.equal(C(0));
      expect("\u000f").to.equal(C(15));
      expect("\u00ff").to.equal(C(255));
      return expect("0\u00ff0").to.equal("0" + C(255) + "0");
    });
    it("can be 4-octet hex escapes", function () {
      expect("\u0000").to.equal(C(0));
      expect("\u000f").to.equal(C(15));
      expect("\u00ff").to.equal(C(255));
      expect("\u0fff").to.equal(C(4095));
      expect("\uffff").to.equal(C(65535));
      return expect("0\uffff0").to.equal("0" + C(65535) + "0");
    });
    it("can be 1 to 6-octet hex escapes", function () {
      expect("\u0000").to.equal(C(0));
      expect("\u0000").to.equal(C(0));
      expect("\u0000").to.equal(C(0));
      expect("\u0000").to.equal(C(0));
      expect("\u0000").to.equal(C(0));
      expect("\u0000").to.equal(C(0));
      expect("\u000f").to.equal(C(15));
      expect("\u000f").to.equal(C(15));
      expect("\u000f").to.equal(C(15));
      expect("\u000f").to.equal(C(15));
      expect("\u000f").to.equal(C(15));
      expect("\u000f").to.equal(C(15));
      expect("\u00ff").to.equal(C(255));
      expect("\u00ff").to.equal(C(255));
      expect("\u00ff").to.equal(C(255));
      expect("\u00ff").to.equal(C(255));
      expect("\u00ff").to.equal(C(255));
      expect("\u0fff").to.equal(C(4095));
      expect("\u0fff").to.equal(C(4095));
      expect("\u0fff").to.equal(C(4095));
      expect("\u0fff").to.equal(C(4095));
      expect("\uffff").to.equal(C(65535));
      expect("\uffff").to.equal(C(65535));
      expect("\uffff").to.equal(C(65535));
      expect("\uffff").to.have.length(1);
      expect("\ud800\udc00").to.have.length(2);
      expect("\udbff\udfff").to.have.length(2);
      expect(function () {
        return gorilla.compileSync('let x = 0\nlet y = "\\u{110000}"');
      }).throws(gorilla.ParserError, /Unicode escape sequence too large.*?\b2:\d+/);
      expect("\ud842\udfb7").to.have.length(2);
      return expect("\ud842\udfb7").to.equal("\ud842\udfb7");
    });
    it(
      "implements all ECMAScript 5.1 standard single-char escape codes",
      function () {
        expect("\b").to.equal(C(8));
        expect("\t").to.equal(C(9));
        expect("\n").to.equal(C(10));
        expect("\u000b").to.equal(C(11));
        expect("\f").to.equal(C(12));
        expect("\r").to.equal(C(13));
        expect('"').to.equal(C(34));
        expect("'").to.equal(C(39));
        expect('"').to.equal(C(34));
        expect("'").to.equal(C(39));
        expect("\\").to.equal(C(92));
        return expect("\\").to.equal(C(92));
      }
    );
    return it("implements \\0", function () {
      return expect("\u0000").to.equal(C(0));
    });
  });
  describe("Backslash strings", function () {
    it("can be keywords", function () {
      expect("null").to.equal("null");
      expect("void").to.equal("void");
      return expect("undefined").to.equal("undefined");
    });
    it("converts to camelCase", function () {
      expect("helloThere").to.equal("helloThere");
      return expect("helloThereEveryone").to.equal("helloThereEveryone");
    });
    it("can have trailing digits", function () {
      expect("trailing1").to.equal("trailing1");
      return expect("trailing1234").to.equal("trailing1234");
    });
    it("can contain digits", function () {
      return expect("start1234End").to.equal("start1234End");
    });
    return it("can be indexed", function () {
      expect("hello".toString).to.equal(String.prototype.toString);
      return expect("hello".toString).to.equal(String.prototype.toString);
    });
  });
  describe("Array strings", function () {
    it("can be empty", function () {
      return expect([]).to.be.an("array").and.be.empty;
    });
    it(
      "should be a single-valued array with no interpolation",
      function () {
        return expect(["hello"]).to.eql(["hello"]);
      }
    );
    it(
      "should include interpolations verbatim as their own values",
      function () {
        var x;
        x = spy();
        expect(["hello", x]).to.eql(["hello", x]);
        return expect(["hello ", x, " friend"]).to.eql(["hello ", x, " friend"]);
      }
    );
    it("should only place interpolations at odd indices", function () {
      var x, y;
      x = spy();
      y = spy();
      return expect(["", x, "", y]).to.eql(["", x, "", y]);
    });
    return it("should allow triple-quoted strings", function () {
      var obj, other;
      expect([]).to.eql([]);
      obj = spy();
      other = spy();
      return expect([
        "Alpha\n  ",
        obj,
        "\n    Charlie\n  ",
        other,
        "\nEcho"
      ]).to.eql([
        "Alpha\n  ",
        obj,
        "\n    Charlie\n  ",
        other,
        "\nEcho"
      ]);
    });
  });
}.call(this));
