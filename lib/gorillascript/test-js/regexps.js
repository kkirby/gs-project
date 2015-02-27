(function () {
  "use strict";
  var expect, gorilla;
  expect = require("chai").expect;
  gorilla = require("../index");
  describe("regular expressions", function () {
    it("can be single-quoted", function () {
      expect(/a/).to.be.an["instanceof"](RegExp);
      expect("a".match(/a/)).to.be.an("array");
      expect("a".match(/a/g)).to.be.an("array");
      expect(/a/.test("a")).to.be["true"];
      return expect(/a/g.test("a")).to.be["true"];
    });
    it("can be double-quoted", function () {
      expect(/a/).to.be.an["instanceof"](RegExp);
      expect("a".match(/a/)).to.be.an("array");
      expect("a".match(/a/g)).to.be.an("array");
      expect(/a/.test("a")).to.be["true"];
      return expect(/a/g.test("a")).to.be["true"];
    });
    it("should be indexable", function () {
      expect(/0/.source).to.equal("0");
      expect(/0/.source).to.equal("0");
      expect(/0/.source).to.equal("0");
      expect(/$(0)/.source).to.equal("$(0)");
      expect(/0/.source).to.equal("0");
      expect(/0/.source).to.equal("0");
      expect(/0/.source).to.equal("0");
      return expect(/$(0)/.source).to.equal("$(0)");
    });
    it("should have expected flags set", function () {
      expect(/asdf/g.global).to.be["true"];
      expect(/asdf/g.ignoreCase).to.be["false"];
      expect(/asdf/g.multiline).to.be["false"];
      expect(/asdf/i.global).to.be["false"];
      expect(/asdf/i.ignoreCase).to.be["true"];
      expect(/asdf/i.multiline).to.be["false"];
      expect(/asdf/m.global).to.be["false"];
      expect(/asdf/m.ignoreCase).to.be["false"];
      expect(/asdf/m.multiline).to.be["true"];
      expect(/asdf/gim.global).to.be["true"];
      expect(/asdf/gim.ignoreCase).to.be["true"];
      return expect(/asdf/gim.multiline).to.be["true"];
    });
    it("should allow slashes", function () {
      expect(/^a\/b$/.test("a/b")).to.be["true"];
      expect(/^a\/b$/.test("a/b")).to.be["true"];
      expect(/^a\/b$/.test("a/b")).to.be["true"];
      expect(/^a\\\/b$/.test("a\\/b")).to.be["true"];
      return expect(/^a\\\/b$/.test("a\\/b")).to.be["true"];
    });
    it("will properly escape backslashes", function () {
      return expect(/\\/.source).to.equal("\\\\");
    });
    it(
      "will ignore whitespace and comments in triple-quoted string",
      function () {
        expect(/Ihavenowhitespace/.source).to.equal("Ihavenowhitespace");
        return expect(/Ihavenowhitespace/.source).to.equal("Ihavenowhitespace");
      }
    );
    it("can have interpolation when triple-double-quoted", function () {
      var value;
      value = "bravo";
      return expect(new RegExp("alpha" + value + "charlie", "").source).to.equal("alphabravocharlie");
    });
    it("doesn't interpolate when triple-single-quoted", function () {
      var value;
      value = "bravo";
      return expect(/alpha$valuecharlie/.source).to.equal("alpha$valuecharlie");
    });
    it("allows for empty regex", function () {
      var match, regex;
      regex = /(?:)/;
      match = regex.exec("test");
      return expect(regex.exec("test")).to.be.ok.and.have.property(0).that.equal("");
    });
    it("throws an exception if the regex is improper", function () {
      expect(function () {
        return gorilla.compileSync("let x = 0\nlet y = r'+'");
      }).throws(gorilla.ParserError, /Invalid regular expression.*?\b2:\d+/);
      expect(function () {
        return gorilla.compileSync("let x = 0\nlet y = r'x'gg");
      }).throws(gorilla.ParserError, /Invalid regular expression.*?\b2:\d+/);
      return expect(function () {
        return gorilla.compileSync("let x = 0\nlet y = r'x'q");
      }).throws(gorilla.ParserError, /Invalid regular expression.*?\b2:\d+/);
    });
    return it("allows the sticky flag", function () {
      return expect(gorilla.compileSync("let y = r'x'y")).to.be.ok;
    });
  });
}.call(this));
