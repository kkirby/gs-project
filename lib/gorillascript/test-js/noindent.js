(function () {
  "use strict";
  var expect, gorilla;
  expect = require("chai").expect;
  gorilla = require("../index");
  describe("compilation without indentation", function () {
    it(
      "works with a series of statements that wouldn't be indented",
      function () {
        return expect(gorilla.evalSync(
          "let mutable a = 0\nlet b = 2\na += b\na *= b\na ^= b\na",
          { noindent: true }
        )).to.equal(16);
      }
    );
    it(
      "works with a series of statements with improper indentation",
      function () {
        return expect(gorilla.evalSync(
          "let mutable a = 0\n  let b = 2\na += b\n    a *= b\na ^= b\n  a",
          { noindent: true }
        )).to.equal(16);
      }
    );
    it("allows function declarations", function () {
      return expect(gorilla.evalSync(
        'let f():\n"hello"\nend\nf()',
        { noindent: true }
      )).to.equal("hello");
    });
    it("allows for a single-line function declaration", function () {
      return expect(gorilla.evalSync(
        'let f() -> "hello"\nf()',
        { noindent: true }
      )).to.equal("hello");
    });
    it(
      "allows for anonymous functions to be used in expressions",
      function () {
        return expect(gorilla.evalSync(
          'let call(f) -> f()\ncall #:\n"hello"\nend',
          { noindent: true }
        )).to.equal("hello");
      }
    );
    it("allows for do blocks", function () {
      return expect(gorilla.evalSync(
        'do:\n"hello"\nend',
        { noindent: true }
      )).to.equal("hello");
    });
    it("allows if expressions", function () {
      expect(gorilla.evalSync(
        'let same(q) -> q\nlet x = 5\nsame(if x == 5 then "yes" else "no")',
        { noindent: true }
      )).to.equal("yes");
      return expect(gorilla.evalSync(
        'let same(q) -> q\nlet x = 6\nsame(if x == 5 then "yes" else "no")',
        { noindent: true }
      )).to.equal("no");
    });
    it("allows if statements", function () {
      return expect(gorilla.evalSync(
        'let x = 5\nif x == 5:\n"yes"\nend',
        { noindent: true }
      )).to.equal("yes");
    });
    it("allows if-else statements", function () {
      return expect(gorilla.evalSync(
        'let x = 5\nif x == 6:\n"yes"\nelse:\n"no"\nend',
        { noindent: true }
      )).to.equal("no");
    });
    it("allows for C-style for loops", function () {
      return expect(gorilla.evalSync(
        "let mutable i = 0\nlet mutable sum = 0\nfor ; i < 10; i += 1:\nsum += i\nend\nsum",
        { noindent: true }
      )).to.equal(45);
    });
    it("allows while loops", function () {
      return expect(gorilla.evalSync(
        "let mutable i = 0\nlet mutable sum = 0\nwhile i < 10, i += 1:\nsum += i\nend\nsum",
        { noindent: true }
      )).to.equal(45);
    });
    it("allows for-in loops", function () {
      return expect(gorilla.evalSync(
        "let mutable sum = 0\nfor x in [1, 2, 3]:\nsum += x\nend\nsum",
        { noindent: true }
      )).to.equal(6);
    });
    it("allows single-line for-in loops", function () {
      return expect(gorilla.evalSync(
        "let mutable sum = 0\nfor x in [1, 2, 3]; sum += x; end\nsum",
        { noindent: true }
      )).to.equal(6);
    });
    it("allows for-in-else loops", function () {
      expect(gorilla.evalSync(
        "let mutable sum = 0\nlet arr = [1, 2, 3]\nfor x in arr:\nsum += x\nelse:\nthrow Error()\nend\nsum",
        { noindent: true }
      )).to.equal(6);
      return expect(gorilla.evalSync(
        'let mutable sum = 0\nlet arr = []\nfor x in arr:\nsum += x\nelse:\nreturn "none"\nend\nsum',
        { noindent: true }
      )).to.equal("none");
    });
    it("allows for-from loops", function () {
      return expect(gorilla.evalSync(
        "let mutable sum = 0\nfor x from [1, 2, 3]:\nsum += x\nend\nsum",
        { noindent: true }
      )).to.equal(6);
    });
    it("allows for-from loops, single-line", function () {
      return expect(gorilla.evalSync(
        "let mutable sum = 0\nfor x from [1, 2, 3]; sum += x; end\nsum",
        { noindent: true }
      )).to.equal(6);
    });
    it("allows for-from-else loops", function () {
      expect(gorilla.evalSync(
        "let mutable sum = 0\nlet arr = [1, 2, 3]\nfor x from arr:\nsum += x\nelse:\nthrow Error()\nend\nsum",
        { noindent: true }
      )).to.equal(6);
      return expect(gorilla.evalSync(
        'let mutable sum = 0\nlet arr = []\nfor x from arr:\nsum += x\nelse:\nreturn "none"\nend\nsum',
        { noindent: true }
      )).to.equal("none");
    });
    it("allows try statements", function () {
      expect(gorilla.evalSync(
        'let o = {}\ntry:\nthrow o\ncatch e:\n"caught"\nelse:\nreturn "nope"\nend',
        { noindent: true }
      )).to.equal("caught");
      return expect(gorilla.evalSync(
        'let o = {}\ntry:\no.blah := true\ncatch e:\n"caught"\nelse:\nreturn "nope"\nend',
        { noindent: true }
      )).to.equal("nope");
    });
    it("allows switch statements", function () {
      expect(gorilla.evalSync(
        'let x = 4\nswitch x\ncase 0, 1:\n  "alpha"\ncase 2, 3; "bravo"\ncase 4; "charlie"\nend',
        { noindent: true }
      )).to.equal("charlie");
      return expect(gorilla.evalSync(
        'let x = 5\nswitch x\ncase 0, 1:\n  "alpha"\ncase 2, 3; "bravo"\ncase 4; "charlie"\ndefault:\n  "delta"\nend',
        { noindent: true }
      )).to.equal("delta");
    });
    it("allows topicless switch statements", function () {
      expect(gorilla.evalSync(
        'let x = 2\nswitch\ncase x == 0:\n  "alpha"\ncase x == 1; "bravo"\ncase x == 2; "charlie"\nend',
        { noindent: true }
      )).to.equal("charlie");
      return expect(gorilla.evalSync(
        'let x = 3\nswitch x\ncase x == 0:\n  "alpha"\ncase x == 1; "bravo"\ncase x == 2; "charlie"\ndefault:\n  "delta"\nend',
        { noindent: true }
      )).to.equal("delta");
    });
    it("allows macros", function () {
      expect(gorilla.evalSync(
        "macro double(value):\nASTE $value * 2\nend\ndouble 5",
        { noindent: true }
      )).to.equal(10);
      return expect(gorilla.evalSync(
        'macro boom:\nsyntax "goes", "the", "dynamite":\nASTE "BOOM!"\nend\nend\nboom goes the dynamite',
        { noindent: true }
      )).to.equal("BOOM!");
    });
    it("allows improperly indented array literals", function () {
      return expect(gorilla.evalSync(
        "let arr = [1\n2, 3\n      4\n5]\narr.length",
        { noindent: true }
      )).to.equal(5);
    });
    it("allows improperly indented object literals", function () {
      return expect(gorilla.evalSync(
        "let obj = { a: 1\n  b: 2\nc: 3\n      d: 4\n  e: 5\n}\nobj.d",
        { noindent: true }
      )).to.equal(4);
    });
    it("allows unclosed object literals", function () {
      return expect(gorilla.evalSync(
        "let obj = a: 1, b: 2, c: 3\nobj.b",
        { noindent: true }
      )).to.equal(2);
    });
    it("allows do blocks in do blocks", function () {
      return expect(gorilla.evalSync(
        "let a = 1\ndo:\nlet b = 2\ndo:\na + b\nend\nend",
        { noindent: true }
      )).to.equal(3);
    });
    it("allows async macro use", function () {
      return expect(gorilla.evalSync(
        'let f(cb) -> cb "hello"\nasync x <- f()\nx',
        { noindent: true }
      )).to.equal("hello");
    });
    return it("allows async macro use in a do block", function () {
      return expect(gorilla.evalSync(
        'let f(cb) -> cb "hello"\ndo:\nasync x <- f()\nx\nend',
        { noindent: true }
      )).to.equal("hello");
    });
  });
}.call(this));
