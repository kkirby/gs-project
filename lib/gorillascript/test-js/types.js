(function () {
  "use strict";
  var expect, T;
  expect = require("chai").expect;
  T = require(process.env.GORILLA_COV ? "../lib-cov/types" : "../lib/types");
  describe("Types", function () {
    it("Basic string representation", function () {
      expect(T["undefined"].toString()).to.equal("undefined");
      expect(T["null"].toString()).to.equal("null");
      expect(T.string.toString()).to.equal("String");
      expect(T.number.toString()).to.equal("Number");
      expect(T.boolean.toString()).to.equal("Boolean");
      expect(T["function"].toString()).to.equal("->");
      expect(T.object.toString()).to.equal("{}");
      expect(T.array.toString()).to.equal("[]");
      expect(T.args.toString()).to.equal("Arguments");
      expect(T.any.toString()).to.equal("any");
      expect(T.none.toString()).to.equal("none");
      expect(T.regexp.toString()).to.equal("RegExp");
      expect(T.stringOrNumber.toString()).to.equal("(Number|String)");
      expect(T.arrayLike.toString()).to.equal("([]|Arguments)");
      expect(T.undefinedOrNull.toString()).to.equal("(null|undefined)");
      expect(T.notUndefinedOrNull.toString()).to.equal("any \\ (null|undefined)");
      expect(T.primitive.toString()).to.equal("(Boolean|Number|String|null|undefined)");
      expect(T.nonPrimitive.toString()).to.equal("any \\ (Boolean|Number|String|null|undefined)");
      expect(T.alwaysFalsy.toString()).to.equal("(null|undefined)");
      expect(T.potentiallyTruthy.toString()).to.equal("any \\ (null|undefined)");
      expect(T.potentiallyFalsy.toString()).to.equal("(Boolean|Number|String|null|undefined)");
      expect(T.alwaysTruthy.toString()).to.equal("any \\ (Boolean|Number|String|null|undefined)");
      expect(T.makeObject({ x: T.number }).toString()).to.equal("{x: Number}");
      expect(T.makeObject({ x: T.number, y: T.string }).toString()).to.equal("{x: Number, y: String}");
      expect(T.makeObject({ y: T.string, x: T.number }).toString()).to.equal("{x: Number, y: String}");
      expect(T.generic("Thing", T.string).toString()).to.equal("Thing<String>");
      expect(T.generic("Thing", T.number).toString()).to.equal("Thing<Number>");
      expect(T.generic("Thing", T.stringOrNumber).toString()).to.equal("Thing<(Number|String)>");
      expect(T.generic("Thing", T.string, T.boolean).toString()).to.equal("Thing<String, Boolean>");
      expect(T.generic("Thing", T.number, T.boolean).toString()).to.equal("Thing<Number, Boolean>");
      expect(T.generic("Thing", T.stringOrNumber, T.boolean).toString()).to.equal("Thing<(Number|String), Boolean>");
      expect(T.generic("Thing", T.any).toString()).to.equal("Thing<>");
      expect(T.generic("Thing", T.any, T.boolean).toString()).to.equal("Thing<,Boolean>");
      expect(T.generic("Thing", T.boolean, T.any).toString()).to.equal("Thing<Boolean,>");
      return expect(T.generic("Thing", T.any, T.any).toString()).to.equal("Thing<,>");
    });
    it("Complement", function () {
      expect(T.none.complement()).to.equal(T.any);
      expect(T.any.complement()).to.equal(T.none);
      expect(T.boolean.complement().toString()).to.equal("any \\ Boolean");
      expect(T["function"].complement().toString()).to.equal("any \\ ->");
      expect(T.boolean.union(T["function"]).complement().toString()).to.equal("any \\ (->|Boolean)");
      expect(T.boolean.array().complement().toString()).to.equal("any \\ [Boolean]");
      expect(T.array.complement().toString()).to.equal("any \\ []");
      expect(T.boolean.complement().complement()).to.equal(T.boolean);
      expect(T.boolean.union(T["function"]).complement().complement().equals(T.boolean.union(T["function"]))).to.be["true"];
      expect(T.boolean.array().complement().complement()).to.equal(T.boolean.array());
      expect(T.boolean.complement().union(T.string.complement())).to.equal(T.any);
      return expect(T.boolean.union(T.string).complement().equals(T.boolean.complement().intersect(T.string.complement()))).to.be["true"];
    });
    it("Subset of simple", function () {
      expect(T.number.isSubsetOf(T.number), "N \u2286 N").to.be["true"];
      expect(T.number.isSubsetOf(T.string), "N \u2286 S").to.be["false"];
      expect(T.number.isSubsetOf(T.stringOrNumber), "N \u2286 (S \u222a N)").to.be["true"];
      expect(T.number.isSubsetOf(T.string.complement()), "N \u2286 !S").to.be["true"];
      expect(T.number.isSubsetOf(T.number.complement()), "N \u2286 !N").to.be["false"];
      expect(T.number.isSubsetOf(T.any), "N \u2286 *").to.be["true"];
      expect(T.number.isSubsetOf(T.none), "N \u2286 0").to.be["false"];
      expect(T.number.isSubsetOf(T.number.array()), "N \u2286 [N]").to.be["false"];
      expect(T.number.isSubsetOf(T.number["function"]()), "N \u2286 -> N").to.be["false"];
      expect(T.number.isSubsetOf(T.object), "N \u2286 {}").to.be["false"];
      return expect(
        T.number.isSubsetOf(T.generic("Thing", T.number)),
        "N \u2286 X<N>"
      ).to.be["false"];
    });
    it("Subset of union", function () {
      expect(T.stringOrNumber.isSubsetOf(T.number), "(S \u222a N) \u2286 N").to.be["false"];
      expect(T.stringOrNumber.isSubsetOf(T.stringOrNumber), "(S \u222a N) \u2286 (S \u222a N)").to.be["true"];
      expect(T.stringOrNumber.isSubsetOf(T.number.union(T.boolean)), "(S \u222a N) \u2286 (N|B)").to.be["false"];
      expect(T.stringOrNumber.isSubsetOf(T.boolean.union(T.stringOrNumber)), "(S \u222a N) \u2286 (S|N|B)").to.be["true"];
      expect(T.stringOrNumber.isSubsetOf(T.any), "(S \u222a N) \u2286 *").to.be["true"];
      expect(T.stringOrNumber.isSubsetOf(T.none), "(S \u222a N) \u2286 0").to.be["false"];
      expect(T.stringOrNumber.isSubsetOf(T.number.array()), "(S \u222a N) \u2286 [N]").to.be["false"];
      expect(T.stringOrNumber.isSubsetOf(T.stringOrNumber.array()), "(S \u222a N) \u2286 [(S \u222a N)]").to.be["false"];
      expect(T.stringOrNumber.isSubsetOf(T.stringOrNumber["function"]()), "(S \u222a N) \u2286 -> (S \u222a N)").to.be["false"];
      expect(T.stringOrNumber.isSubsetOf(T.boolean.complement()), "(S \u222a N) \u2286 !B").to.be["true"];
      expect(T.stringOrNumber.isSubsetOf(T.number.complement()), "(S \u222a N) \u2286 !N").to.be["false"];
      expect(T.stringOrNumber.isSubsetOf(T.string.complement()), "(S \u222a N) \u2286 !S").to.be["false"];
      expect(T.stringOrNumber.isSubsetOf(T.stringOrNumber.complement()), "(S \u222a N) \u2286 !(S \u222a N)").to.be["false"];
      expect(T.stringOrNumber.isSubsetOf(T.object), "(S \u222a N) \u2286 {}").to.be["false"];
      return expect(
        T.stringOrNumber.isSubsetOf(T.generic("Thing", T.number)),
        "(S \u222a N) \u2286 X<N>"
      ).to.be["false"];
    });
    it("Subset of complement", function () {
      expect(T.number.complement().isSubsetOf(T.number), "!N \u2286 N").to.be["false"];
      expect(T.number.complement().isSubsetOf(T.string), "!N \u2286 S").to.be["false"];
      expect(T.number.complement().isSubsetOf(T.stringOrNumber), "!N \u2286 (S \u222a N)").to.be["false"];
      expect(T.number.complement().isSubsetOf(T.boolean.union(T.string)), "!N \u2286 (S|B)").to.be["false"];
      expect(T.number.complement().isSubsetOf(T.any), "!N \u2286 *").to.be["true"];
      expect(T.number.complement().isSubsetOf(T.none), "!N \u2286 0").to.be["false"];
      expect(T.number.complement().isSubsetOf(T.array), "!N \u2286 [*]").to.be["false"];
      expect(T.number.complement().isSubsetOf(T.number.array()), "!N \u2286 [N]").to.be["false"];
      expect(T.number.complement().isSubsetOf(T.number.array().complement()), "!N \u2286 [!N]").to.be["false"];
      expect(T.number.complement().isSubsetOf(T.number["function"]()), "!N \u2286 -> N").to.be["false"];
      expect(T.number.complement().isSubsetOf(T.number["function"]().complement()), "!N \u2286 -> !N").to.be["false"];
      expect(T.number.complement().isSubsetOf(T.number.complement()), "!N \u2286 !N").to.be["true"];
      expect(T.number.complement().isSubsetOf(T.string.complement()), "!N \u2286 !S").to.be["false"];
      expect(T.number.complement().isSubsetOf(T.object), "!N \u2286 {}").to.be["false"];
      return expect(
        T.number.complement().isSubsetOf(T.generic("Thing", T.number)),
        "!N \u2286 X<N>"
      ).to.be["false"];
    });
    it("Subset of none", function () {
      expect(T.none.isSubsetOf(T.number), "0 \u2286 N").to.be["true"];
      expect(T.none.isSubsetOf(T.stringOrNumber), "0 \u2286 (S \u222a N)").to.be["true"];
      expect(T.none.isSubsetOf(T.any), "0 \u2286 *").to.be["true"];
      expect(T.none.isSubsetOf(T.none), "0 \u2286 0").to.be["true"];
      expect(T.none.isSubsetOf(T.array), "0 \u2286 [*]").to.be["true"];
      expect(T.none.isSubsetOf(T.number.array()), "0 \u2286 [N]").to.be["true"];
      expect(T.none.isSubsetOf(T.number["function"]()), "0 \u2286 -> N").to.be["true"];
      expect(T.none.isSubsetOf(T.number.complement()), "0 \u2286 !N").to.be["true"];
      expect(T.none.isSubsetOf(T.object), "0 \u2286 {}").to.be["true"];
      return expect(
        T.none.isSubsetOf(T.generic("Thing", T.number)),
        "0 \u2286 X<N>"
      ).to.be["true"];
    });
    it("Subset of any", function () {
      expect(T.any.isSubsetOf(T.number), "* \u2286 N").to.be["false"];
      expect(T.any.isSubsetOf(T.stringOrNumber), "* \u2286 (S \u222a N)").to.be["false"];
      expect(T.any.isSubsetOf(T.any), "* \u2286 *").to.be["true"];
      expect(T.any.isSubsetOf(T.none), "* \u2286 0").to.be["false"];
      expect(T.any.isSubsetOf(T.array), "* \u2286 [*]").to.be["false"];
      expect(T.any.isSubsetOf(T.number.array()), "* \u2286 [N]").to.be["false"];
      expect(T.any.isSubsetOf(T.number["function"]()), "* \u2286 -> N").to.be["false"];
      expect(T.any.isSubsetOf(T.number.complement()), "* \u2286 !N").to.be["false"];
      expect(T.any.isSubsetOf(T.object), "* \u2286 {}").to.be["false"];
      return expect(
        T.any.isSubsetOf(T.generic("Thing", T.number)),
        "* \u2286 X<N>"
      ).to.be["false"];
    });
    it("Subset of specialized array", function () {
      expect(T.number.array().isSubsetOf(T.number), "[N] \u2286 N").to.be["false"];
      expect(T.number.array().isSubsetOf(T.string), "[N] \u2286 S").to.be["false"];
      expect(T.number.array().isSubsetOf(T.stringOrNumber), "[N] \u2286 (S \u222a N)").to.be["false"];
      expect(T.number.array().isSubsetOf(T.any), "[N] \u2286 *").to.be["true"];
      expect(T.number.array().isSubsetOf(T.none), "[N] \u2286 0").to.be["false"];
      expect(T.number.array().isSubsetOf(T.array), "[N] \u2286 [*]").to.be["true"];
      expect(T.number.array().isSubsetOf(T.number.array()), "[N] \u2286 [N]").to.be["true"];
      expect(T.number.array().isSubsetOf(T.string.array()), "[N] \u2286 [S]").to.be["false"];
      expect(T.number.array().isSubsetOf(T.number.complement()), "[N] \u2286 !N").to.be["true"];
      expect(T.number.array().isSubsetOf(T.number["function"]()), "[N] \u2286 -> N").to.be["false"];
      expect(T.number.array().isSubsetOf(T.object), "[N] \u2286 {}").to.be["false"];
      return expect(
        T.number.array().isSubsetOf(T.generic("Thing", T.number)),
        "[N] \u2286 X<N>"
      ).to.be["false"];
    });
    it("Subset of array", function () {
      expect(T.array.isSubsetOf(T.number), "[*] \u2286 N").to.be["false"];
      expect(T.array.isSubsetOf(T.string), "[*] \u2286 S").to.be["false"];
      expect(T.array.isSubsetOf(T.stringOrNumber), "[*] \u2286 (S \u222a N)").to.be["false"];
      expect(T.array.isSubsetOf(T.any), "[*] \u2286 *").to.be["true"];
      expect(T.array.isSubsetOf(T.none), "[*] \u2286 0").to.be["false"];
      expect(T.array.isSubsetOf(T.array), "[*] \u2286 [*]").to.be["true"];
      expect(T.array.isSubsetOf(T.number.array()), "[*] \u2286 [N]").to.be["false"];
      expect(T.array.isSubsetOf(T.number.complement()), "[*] \u2286 !N").to.be["true"];
      expect(T.array.isSubsetOf(T.number["function"]()), "[*] \u2286 -> N").to.be["false"];
      expect(T.array.isSubsetOf(T.object), "[*] \u2286 {}").to.be["false"];
      return expect(
        T.array.isSubsetOf(T.generic("Thing", T.any)),
        "[*] \u2286 X<*>"
      ).to.be["false"];
    });
    it("Subset of specialized function", function () {
      expect(T.number["function"]().isSubsetOf(T.number), "-> N \u2286 N").to.be["false"];
      expect(T.number["function"]().isSubsetOf(T.string), "-> N \u2286 S").to.be["false"];
      expect(T.number["function"]().isSubsetOf(T.stringOrNumber), "-> N \u2286 (S \u222a N)").to.be["false"];
      expect(T.number["function"]().isSubsetOf(T.any), "-> N \u2286 *").to.be["true"];
      expect(T.number["function"]().isSubsetOf(T.none), "-> N \u2286 0").to.be["false"];
      expect(T.number["function"]().isSubsetOf(T["function"]), "-> N \u2286 [*]").to.be["true"];
      expect(T.number["function"]().isSubsetOf(T.number["function"]()), "-> N \u2286 -> N").to.be["true"];
      expect(T.number["function"]().isSubsetOf(T.string["function"]()), "-> N \u2286 -> S").to.be["false"];
      expect(T.number["function"]().isSubsetOf(T.number.complement()), "-> N \u2286 !N").to.be["true"];
      expect(T.number["function"]().isSubsetOf(T.number.array()), "-> N \u2286 [N]").to.be["false"];
      expect(T.number["function"]().isSubsetOf(T.object), "-> N \u2286 {}").to.be["false"];
      return expect(
        T.number["function"]().isSubsetOf(T.generic("Thing", T.number)),
        "-> N \u2286 X<N>"
      ).to.be["false"];
    });
    it("Subset of function", function () {
      expect(T["function"].isSubsetOf(T.number), "-> * \u2286 N").to.be["false"];
      expect(T["function"].isSubsetOf(T.string), "-> * \u2286 S").to.be["false"];
      expect(T["function"].isSubsetOf(T.stringOrNumber), "-> * \u2286 (S \u222a N)").to.be["false"];
      expect(T["function"].isSubsetOf(T.any), "-> * \u2286 *").to.be["true"];
      expect(T["function"].isSubsetOf(T.none), "-> * \u2286 0").to.be["false"];
      expect(T["function"].isSubsetOf(T["function"]), "-> * \u2286 -> *").to.be["true"];
      expect(T["function"].isSubsetOf(T.number["function"]()), "-> * \u2286 [N]").to.be["false"];
      expect(T["function"].isSubsetOf(T.number.complement()), "-> * \u2286 !N").to.be["true"];
      expect(T["function"].isSubsetOf(T.array), "-> * \u2286 [N]").to.be["false"];
      expect(T["function"].isSubsetOf(T.number.array()), "-> * \u2286 [N]").to.be["false"];
      expect(T["function"].isSubsetOf(T.object), "-> * \u2286 {}").to.be["false"];
      return expect(
        T["function"].isSubsetOf(T.generic("Thing", T.any)),
        "-> * \u2286 X<*>"
      ).to.be["false"];
    });
    it("Subset of specialized object", function () {
      var myObject;
      myObject = T.makeObject({ x: T.number });
      expect(myObject.isSubsetOf(T.number), "{x:N} \u2286 N").to.be["false"];
      expect(myObject.isSubsetOf(T.string), "{x:N} \u2286 S").to.be["false"];
      expect(myObject.isSubsetOf(T.stringOrNumber), "{x:N} \u2286 (S \u222a N)").to.be["false"];
      expect(myObject.isSubsetOf(T.any), "{x:N} \u2286 *").to.be["true"];
      expect(myObject.isSubsetOf(T.none), "{x:N} \u2286 0").to.be["false"];
      expect(myObject.isSubsetOf(T["function"]), "{x:N} \u2286 {x:N}").to.be["false"];
      expect(myObject.isSubsetOf(T.number["function"]()), "{x:N} \u2286 [N]").to.be["false"];
      expect(myObject.isSubsetOf(T.number.complement()), "{x:N} \u2286 !N").to.be["true"];
      expect(myObject.isSubsetOf(T.array), "{x:N} \u2286 [N]").to.be["false"];
      expect(myObject.isSubsetOf(T.number.array()), "{x:N} \u2286 [N]").to.be["false"];
      expect(myObject.isSubsetOf(T.object), "{x:N} \u2286 {}").to.be["true"];
      expect(myObject.isSubsetOf(myObject), "{x:N} \u2286 {x:N}").to.be["true"];
      expect(myObject.isSubsetOf(T.makeObject({ x: T.number })), "{x:N} \u2286 {x:N}").to.be["true"];
      expect(myObject.isSubsetOf(T.makeObject({ x: T.string })), "{x:N} \u2286 {x:S}").to.be["false"];
      return expect(
        myObject.isSubsetOf(T.generic("Thing", T.number)),
        "{x:N} \u2286 X<N>"
      ).to.be["false"];
    });
    it("Subset of object", function () {
      expect(T.object.isSubsetOf(T.number), "{} \u2286 N").to.be["false"];
      expect(T.object.isSubsetOf(T.string), "{} \u2286 S").to.be["false"];
      expect(T.object.isSubsetOf(T.stringOrNumber), "{} \u2286 (S \u222a N)").to.be["false"];
      expect(T.object.isSubsetOf(T.any), "{} \u2286 *").to.be["true"];
      expect(T.object.isSubsetOf(T.none), "{} \u2286 0").to.be["false"];
      expect(T.object.isSubsetOf(T["function"]), "{} \u2286 -> *").to.be["false"];
      expect(T.object.isSubsetOf(T.number["function"]()), "{} \u2286 -> N").to.be["false"];
      expect(T.object.isSubsetOf(T.number.complement()), "{} \u2286 !N").to.be["true"];
      expect(T.object.isSubsetOf(T.array), "{} \u2286 [N]").to.be["false"];
      expect(T.object.isSubsetOf(T.number.array()), "{} \u2286 [N]").to.be["false"];
      expect(T.object.isSubsetOf(T.object), "{} \u2286 {}").to.be["true"];
      expect(T.object.isSubsetOf(T.makeObject({ x: T.number })), "{} \u2286 {x:N}").to.be["false"];
      return expect(
        T.object.isSubsetOf(T.generic("Thing", T.number)),
        "{} \u2286 X<N>"
      ).to.be["false"];
    });
    it("Subset of generic", function () {
      var myGeneric;
      myGeneric = T.generic("Thing", T.number);
      expect(myGeneric.isSubsetOf(T.number), "X<N> \u2286 N").to.be["false"];
      expect(myGeneric.isSubsetOf(T.string), "X<N> \u2286 S").to.be["false"];
      expect(myGeneric.isSubsetOf(T.stringOrNumber), "X<N> \u2286 (S \u222a N)").to.be["false"];
      expect(myGeneric.isSubsetOf(T.any), "X<N> \u2286 *").to.be["true"];
      expect(myGeneric.isSubsetOf(T.none), "X<N> \u2286 0").to.be["false"];
      expect(myGeneric.isSubsetOf(T["function"]), "X<N> \u2286 -> *").to.be["false"];
      expect(myGeneric.isSubsetOf(T.number["function"]()), "X<N> \u2286 -> N").to.be["false"];
      expect(myGeneric.isSubsetOf(T.number.complement()), "X<N> \u2286 !N").to.be["true"];
      expect(myGeneric.isSubsetOf(T.array), "X<N> \u2286 [N]").to.be["false"];
      expect(myGeneric.isSubsetOf(T.number.array()), "X<N> \u2286 [N]").to.be["false"];
      expect(myGeneric.isSubsetOf(T.object), "X<N> \u2286 {}").to.be["false"];
      expect(myGeneric.isSubsetOf(T.makeObject({ x: T.number })), "X<N> \u2286 {x:N}").to.be["false"];
      expect(myGeneric.isSubsetOf(myGeneric), "X<N> \u2286 X<N>").to.be["true"];
      expect(
        myGeneric.isSubsetOf(T.generic("Other", T.number)),
        "X<N> \u2286 Y<N>"
      ).to.be["false"];
      expect(
        myGeneric.isSubsetOf(T.generic("Thing", T.number)),
        "X<N> \u2286 Z<N>"
      ).to.be["false"];
      expect(
        myGeneric.isSubsetOf(T.generic(myGeneric.base, T.number)),
        "X<N> \u2286 X<N>"
      ).to.be["true"];
      return expect(
        myGeneric.isSubsetOf(T.generic(myGeneric.base, T.stringOrNumber)),
        "X<N> \u2286 X<S \u222a N>"
      ).to.be["true"];
    });
    it("Overlap of simple", function () {
      expect(T.number.overlaps(T.number), "N \u2229 N").to.be["true"];
      expect(!T.number.overlaps(T.string), "N \u2229 S").to.be["true"];
      expect(T.number.overlaps(T.stringOrNumber), "N \u2229 (S \u222a N)").to.be["true"];
      expect(T.number.overlaps(T.string.complement()), "N \u2229 !S").to.be["true"];
      expect(!T.number.overlaps(T.number.complement()), "N \u2229 !N").to.be["true"];
      expect(T.number.overlaps(T.any), "N \u2229 *").to.be["true"];
      expect(!T.number.overlaps(T.none), "N \u2229 0").to.be["true"];
      expect(!T.number.overlaps(T.number.array()), "N \u2229 [N]").to.be["true"];
      expect(!T.number.overlaps(T.number["function"]()), "N \u2229 -> N").to.be["true"];
      expect(!T.number.overlaps(T.object), "N \u2229 {}").to.be["true"];
      return expect(
        !T.number.overlaps(T.generic("Thing", T.number)),
        "N \u2229 X<N>"
      ).to.be["true"];
    });
    it("Overlap of union", function () {
      expect(T.stringOrNumber.overlaps(T.number), "(S \u222a N) \u2229 N").to.be["true"];
      expect(T.stringOrNumber.overlaps(T.stringOrNumber), "(S \u222a N) \u2229 (S \u222a N)").to.be["true"];
      expect(T.stringOrNumber.overlaps(T.number.union(T.boolean)), "(S \u222a N) \u2229 (N|B)").to.be["true"];
      expect(T.stringOrNumber.overlaps(T.boolean.union(T.stringOrNumber)), "(S \u222a N) \u2229 (S|N|B)").to.be["true"];
      expect(!T.stringOrNumber.overlaps(T.boolean.union(T["function"])), "(S \u222a N) \u2229 (B|F)").to.be["true"];
      expect(T.stringOrNumber.overlaps(T.any), "(S \u222a N) \u2229 *").to.be["true"];
      expect(!T.stringOrNumber.overlaps(T.none), "(S \u222a N) \u2229 0").to.be["true"];
      expect(!T.stringOrNumber.overlaps(T.number.array()), "(S \u222a N) \u2229 [N]").to.be["true"];
      expect(!T.stringOrNumber.overlaps(T.stringOrNumber.array()), "(S \u222a N) \u2229 [(S \u222a N)]").to.be["true"];
      expect(T.stringOrNumber.overlaps(T.boolean.complement()), "(S \u222a N) \u2229 !B").to.be["true"];
      expect(T.stringOrNumber.overlaps(T.number.complement()), "(S \u222a N) \u2229 !N").to.be["true"];
      expect(T.stringOrNumber.overlaps(T.string.complement()), "(S \u222a N) \u2229 !S").to.be["true"];
      expect(!T.stringOrNumber.overlaps(T.stringOrNumber.complement()), "(S \u222a N) \u2229 !(S \u222a N)").to.be["true"];
      expect(!T.stringOrNumber.overlaps(T.stringOrNumber["function"]()), "(S \u222a N) \u2229 -> (S \u222a N)").to.be["true"];
      expect(!T.stringOrNumber.overlaps(T.object), "(S \u222a N) \u2229 {}").to.be["true"];
      return expect(
        !T.stringOrNumber.overlaps(T.generic("Thing", T.number)),
        "(S \u222a N) \u2229 X<N>"
      ).to.be["true"];
    });
    it("Overlap of complement", function () {
      expect(!T.number.complement().overlaps(T.number), "!N \u2229 N").to.be["true"];
      expect(T.number.complement().overlaps(T.string), "!N \u2229 S").to.be["true"];
      expect(T.number.complement().overlaps(T.stringOrNumber), "!N \u2229 (S \u222a N)").to.be["true"];
      expect(T.number.complement().overlaps(T.boolean.union(T.string)), "!N \u2229 (S|B)").to.be["true"];
      expect(T.number.complement().overlaps(T.any), "!N \u2229 *").to.be["true"];
      expect(!T.number.complement().overlaps(T.none), "!N \u2229 0").to.be["true"];
      expect(T.number.complement().overlaps(T.array), "!N \u2229 [*]").to.be["true"];
      expect(T.number.complement().overlaps(T.number.array()), "!N \u2229 [N]").to.be["true"];
      expect(T.number.complement().overlaps(T.number.array().complement()), "!N \u2229 [!N]").to.be["true"];
      expect(T.number.complement().overlaps(T.number.complement()), "!N \u2229 !N").to.be["true"];
      expect(T.number.complement().overlaps(T.string.complement()), "!N \u2229 !S").to.be["true"];
      expect(T.number.complement().overlaps(T.number["function"]()), "!N \u2229 -> N").to.be["true"];
      expect(T.number.complement().overlaps(T.object), "!N \u2229 {}").to.be["true"];
      return expect(
        T.number.complement().overlaps(T.generic("Thing", T.number)),
        "!N \u2229 X<N>"
      ).to.be["true"];
    });
    it("Overlap of none", function () {
      expect(!T.none.overlaps(T.number), "0 \u2229 N").to.be["true"];
      expect(!T.none.overlaps(T.stringOrNumber), "0 \u2229 (S \u222a N)").to.be["true"];
      expect(!T.none.overlaps(T.any), "0 \u2229 *").to.be["true"];
      expect(!T.none.overlaps(T.none), "0 \u2229 0").to.be["true"];
      expect(!T.none.overlaps(T.array), "0 \u2229 [*]").to.be["true"];
      expect(!T.none.overlaps(T.number.array()), "0 \u2229 [N]").to.be["true"];
      expect(!T.none.overlaps(T.number.complement()), "0 \u2229 !N").to.be["true"];
      expect(!T.none.overlaps(T.number["function"]()), "0 \u2229 -> N").to.be["true"];
      expect(!T.none.overlaps(T.object), "0 \u2229 {}").to.be["true"];
      return expect(
        !T.none.overlaps(T.generic("Thing", T.number)),
        "0 \u2229 X<N>"
      ).to.be["true"];
    });
    it("Overlap of any", function () {
      expect(T.any.overlaps(T.number), "* \u2229 N").to.be["true"];
      expect(T.any.overlaps(T.stringOrNumber), "* \u2229 (S \u222a N)").to.be["true"];
      expect(T.any.overlaps(T.any), "* \u2229 *").to.be["true"];
      expect(T.any.overlaps(T.none), "* \u2229 0").to.be["true"];
      expect(T.any.overlaps(T.array), "* \u2229 [*]").to.be["true"];
      expect(T.any.overlaps(T.number.array()), "* \u2229 [N]").to.be["true"];
      expect(T.any.overlaps(T.number.complement()), "* \u2229 !N").to.be["true"];
      expect(T.any.overlaps(T.number["function"]()), "* \u2229 -> N").to.be["true"];
      expect(T.any.overlaps(T.object), "* \u2229 {}").to.be["true"];
      return expect(
        T.any.overlaps(T.generic("Thing", T.number)),
        "* \u2229 X<N>"
      ).to.be["true"];
    });
    it("Overlap of specialized array", function () {
      expect(!T.number.array().overlaps(T.number), "[N] \u2229 N").to.be["true"];
      expect(!T.number.array().overlaps(T.string), "[N] \u2229 S").to.be["true"];
      expect(!T.number.array().overlaps(T.stringOrNumber), "[N] \u2229 (S \u222a N)").to.be["true"];
      expect(T.number.array().overlaps(T.any), "[N] \u2229 *").to.be["true"];
      expect(!T.number.array().overlaps(T.none), "[N] \u2229 0").to.be["true"];
      expect(T.number.array().overlaps(T.array), "[N] \u2229 [*]").to.be["true"];
      expect(T.number.array().overlaps(T.number.array()), "[N] \u2229 [N]").to.be["true"];
      expect(T.number.array().overlaps(T.string.array()), "[N] \u2229 [S]").to.be["true"];
      expect(T.number.array().overlaps(T.number.complement()), "[N] \u2229 !N").to.be["true"];
      expect(!T.number.array().overlaps(T.number["function"]()), "[N] \u2229 -> N").to.be["true"];
      expect(!T.number.array().overlaps(T.object), "[N] \u2229 {}").to.be["true"];
      return expect(
        !T.number.array().overlaps(T.generic("Thing", T.number)),
        "[N] \u2229 X<N>"
      ).to.be["true"];
    });
    it("Overlap of array", function () {
      expect(!T.array.overlaps(T.number), "[*] \u2229 N").to.be["true"];
      expect(!T.array.overlaps(T.string), "[*] \u2229 S").to.be["true"];
      expect(!T.array.overlaps(T.stringOrNumber), "[*] \u2229 (S \u222a N)").to.be["true"];
      expect(T.array.overlaps(T.any), "[*] \u2229 *").to.be["true"];
      expect(!T.array.overlaps(T.none), "[*] \u2229 0").to.be["true"];
      expect(T.array.overlaps(T.array), "[*] \u2229 [*]").to.be["true"];
      expect(T.array.overlaps(T.number.array()), "[*] \u2229 [N]").to.be["true"];
      expect(T.array.overlaps(T.number.complement()), "[*] \u2229 !N").to.be["true"];
      expect(!T.array.overlaps(T.number["function"]()), "[*] \u2229 -> N").to.be["true"];
      expect(!T.array.overlaps(T.object), "[*] \u2229 {}").to.be["true"];
      return expect(
        !T.array.overlaps(T.generic("Thing", T.any)),
        "[*] \u2229 X<*>"
      ).to.be["true"];
    });
    it("Overlap of specialized function", function () {
      expect(!T.number["function"]().overlaps(T.number), "-> N \u2229 N").to.be["true"];
      expect(!T.number["function"]().overlaps(T.string), "-> N \u2229 S").to.be["true"];
      expect(!T.number["function"]().overlaps(T.stringOrNumber), "-> N \u2229 (S \u222a N)").to.be["true"];
      expect(T.number["function"]().overlaps(T.any), "-> N \u2229 *").to.be["true"];
      expect(!T.number["function"]().overlaps(T.none), "-> N \u2229 0").to.be["true"];
      expect(!T.number["function"]().overlaps(T.array), "-> N \u2229 [*]").to.be["true"];
      expect(T.number["function"]().overlaps(T["function"]), "-> N \u2229 -> *").to.be["true"];
      expect(T.number["function"]().overlaps(T.number["function"]()), "-> N \u2229 -> N").to.be["true"];
      expect(T.number["function"]().overlaps(T.string["function"]()), "-> N \u2229 -> S").to.be["true"];
      expect(T.number["function"]().overlaps(T.number.complement()), "-> N \u2229 !N").to.be["true"];
      expect(!T.number["function"]().overlaps(T.number.array()), "-> N \u2229 -> N").to.be["true"];
      expect(!T.number["function"]().overlaps(T.object), "-> N \u2229 {}").to.be["true"];
      return expect(
        !T.number["function"]().overlaps(T.generic("Thing", T.number)),
        "[*] \u2229 X<N>"
      ).to.be["true"];
    });
    it("Overlap of function", function () {
      expect(!T["function"].overlaps(T.number), "-> * \u2229 N").to.be["true"];
      expect(!T["function"].overlaps(T.string), "-> * \u2229 S").to.be["true"];
      expect(!T["function"].overlaps(T.stringOrNumber), "-> * \u2229 (S \u222a N)").to.be["true"];
      expect(T["function"].overlaps(T.any), "-> * \u2229 *").to.be["true"];
      expect(!T["function"].overlaps(T.none), "-> * \u2229 0").to.be["true"];
      expect(!T["function"].overlaps(T.array), "-> * \u2229 [*]").to.be["true"];
      expect(!T["function"].overlaps(T.number.array()), "-> * \u2229 [N]").to.be["true"];
      expect(T["function"].overlaps(T.number.complement()), "-> * \u2229 !N").to.be["true"];
      expect(T["function"].overlaps(T.number["function"]()), "-> * \u2229 -> N").to.be["true"];
      expect(T["function"].overlaps(T["function"]), "-> * \u2229 -> *").to.be["true"];
      expect(!T["function"].overlaps(T.object), "-> * \u2229 {}").to.be["true"];
      return expect(
        !T["function"].overlaps(T.generic("Thing", T.any)),
        "-> * \u2229 X<*>"
      ).to.be["true"];
    });
    it("Overlap of specialized object", function () {
      var myObject;
      myObject = T.makeObject({ x: T.number });
      expect(!myObject.overlaps(T.number), "{x:N} \u2229 N").to.be["true"];
      expect(!myObject.overlaps(T.string), "{x:N} \u2229 S").to.be["true"];
      expect(!myObject.overlaps(T.stringOrNumber), "{x:N} \u2229 (S \u222a N)").to.be["true"];
      expect(myObject.overlaps(T.any), "{x:N} \u2229 *").to.be["true"];
      expect(!myObject.overlaps(T.none), "{x:N} \u2229 0").to.be["true"];
      expect(!myObject.overlaps(T.array), "{x:N} \u2229 [*]").to.be["true"];
      expect(!myObject.overlaps(T["function"]), "{x:N} \u2229 -> *").to.be["true"];
      expect(!myObject.overlaps(T.number["function"]()), "{x:N} \u2229 -> N").to.be["true"];
      expect(!myObject.overlaps(T.string["function"]()), "{x:N} \u2229 -> S").to.be["true"];
      expect(myObject.overlaps(T.number.complement()), "{x:N} \u2229 !N").to.be["true"];
      expect(!myObject.overlaps(myObject.complement()), "{x:N} \u2229 !{x:N}").to.be["true"];
      expect(!myObject.overlaps(T.makeObject({ x: T.number }).complement()), "{x:N} \u2229 !{x:N}").to.be["true"];
      expect(myObject.overlaps(T.makeObject({ x: T.string }).complement()), "{x:N} \u2229 !{x:S}").to.be["true"];
      expect(myObject.overlaps(T.makeObject({ y: T.string }).complement()), "{x:N} \u2229 !{y:S}").to.be["true"];
      expect(!myObject.overlaps(T.object.complement()), "{x:N} \u2229 !{}").to.be["true"];
      expect(!myObject.overlaps(T.number.array()), "{x:N} \u2229 -> N").to.be["true"];
      expect(myObject.overlaps(T.object), "{x:N} \u2229 {}").to.be["true"];
      expect(myObject.overlaps(myObject), "{x:N} \u2229 {x:N}").to.be["true"];
      expect(myObject.overlaps(T.makeObject({ x: T.number })), "{x:N} \u2229 {x:N}").to.be["true"];
      expect(myObject.overlaps(T.makeObject({ x: T.string })), "{x:N} \u2229 {x:S}").to.be["true"];
      expect(myObject.overlaps(T.makeObject({ y: T.string })), "{x:N} \u2229 {y:S}").to.be["true"];
      return expect(
        !myObject.overlaps(T.generic("Thing", T.number)),
        "{x:N} \u2229 X<N>"
      ).to.be["true"];
    });
    it("Overlap of object", function () {
      expect(!T.object.overlaps(T.number), "{} \u2229 N").to.be["true"];
      expect(!T.object.overlaps(T.string), "{} \u2229 S").to.be["true"];
      expect(!T.object.overlaps(T.stringOrNumber), "{} \u2229 (S \u222a N)").to.be["true"];
      expect(T.object.overlaps(T.any), "{} \u2229 *").to.be["true"];
      expect(!T.object.overlaps(T.none), "{} \u2229 0").to.be["true"];
      expect(!T.object.overlaps(T.array), "{} \u2229 [*]").to.be["true"];
      expect(!T.object.overlaps(T.number.array()), "{} \u2229 [N]").to.be["true"];
      expect(T.object.overlaps(T.number.complement()), "{} \u2229 !N").to.be["true"];
      expect(!T.object.overlaps(T.object.complement()), "{} \u2229 !{}").to.be["true"];
      expect(T.object.overlaps(T.makeObject({ x: T.number }).complement()), "{} \u2229 !{x:N}").to.be["true"];
      expect(!T.object.overlaps(T.number["function"]()), "{} \u2229 -> N").to.be["true"];
      expect(!T.object.overlaps(T["function"]), "{} \u2229 -> *").to.be["true"];
      expect(T.object.overlaps(T.object), "{} \u2229 {}").to.be["true"];
      expect(T.object.overlaps(T.makeObject({ x: T.number })), "{} \u2229 {x:N}").to.be["true"];
      return expect(
        !T.object.overlaps(T.generic("Thing", T.number)),
        "{} \u2229 X<N>"
      ).to.be["true"];
    });
    it("Overlap of generic", function () {
      var myGeneric;
      myGeneric = T.generic("Thing", T.number);
      expect(!myGeneric.overlaps(T.number), "X<N> \u2229 N").to.be["true"];
      expect(!myGeneric.overlaps(T.string), "X<N> \u2229 S").to.be["true"];
      expect(!myGeneric.overlaps(T.stringOrNumber), "X<N> \u2229 (S \u222a N)").to.be["true"];
      expect(myGeneric.overlaps(T.any), "X<N> \u2229 *").to.be["true"];
      expect(!myGeneric.overlaps(T.none), "X<N> \u2229 0").to.be["true"];
      expect(!myGeneric.overlaps(T.array), "X<N> \u2229 [*]").to.be["true"];
      expect(!myGeneric.overlaps(T["function"]), "X<N> \u2229 -> *").to.be["true"];
      expect(!myGeneric.overlaps(T.number["function"]()), "X<N> \u2229 -> N").to.be["true"];
      expect(!myGeneric.overlaps(T.string["function"]()), "X<N> \u2229 -> S").to.be["true"];
      expect(myGeneric.overlaps(T.number.complement()), "X<N> \u2229 !N").to.be["true"];
      expect(myGeneric.overlaps(T.makeObject({ x: T.number }).complement()), "X<N> \u2229 !X<N>").to.be["true"];
      expect(myGeneric.overlaps(T.object.complement()), "X<N> \u2229 !{}").to.be["true"];
      expect(!myGeneric.overlaps(T.number.array()), "X<N> \u2229 [N]").to.be["true"];
      expect(!myGeneric.overlaps(T.object), "X<N> \u2229 {}").to.be["true"];
      expect(myGeneric.overlaps(myGeneric), "X<N> \u2229 X<N>").to.be["true"];
      expect(
        !myGeneric.overlaps(T.generic("Other", T.number)),
        "X<N> \u2229 Y<N>"
      ).to.be["true"];
      expect(
        !myGeneric.overlaps(T.generic("Thing", T.number)),
        "X<N> \u2229 Z<N>"
      ).to.be["true"];
      expect(
        myGeneric.overlaps(T.generic(myGeneric.base, T.number)),
        "X<N> \u2229 X<N>"
      ).to.be["true"];
      return expect(
        myGeneric.overlaps(T.generic(myGeneric.base, T.string)),
        "X<N> \u2229 X<S>"
      ).to.be["true"];
    });
    it("Union of simple", function () {
      expect(T.number.union(T.number)).to.equal(T.number, "N \u222a N");
      expect(T.number.union(T.string).equals(T.stringOrNumber), "N \u222a S").to.be["true"];
      expect(T.number.union(T.stringOrNumber).equals(T.stringOrNumber), "N \u222a (S \u222a N)").to.be["true"];
      expect(T.number.union(T.string.complement()).equals(T.string.complement()), "N \u222a !S").to.be["true"];
      expect(T.number.union(T.number.complement())).to.equal(T.any, "N \u222a !N");
      expect(T.number.union(T.any)).to.equal(T.any, "N \u222a *");
      expect(T.number.union(T.none)).to.equal(T.number, "N \u222a 0");
      expect(T.number.union(T.number.array()).equals(T.number.array().union(T.number)), "N \u222a [N]").to.be["true"];
      expect(T.number.union(T.number.array()).toString()).to.equal("([Number]|Number)");
      expect(T.number.union(T.number["function"]()).equals(T.number["function"]().union(T.number)), "N \u222a -> N").to.be["true"];
      expect(T.number.union(T.number["function"]()).toString()).to.equal("(-> Number|Number)");
      expect(T.number.union(T.object).equals(T.object.union(T.number)), "N \u222a {}").to.be["true"];
      expect(T.number.union(T.object).toString()).to.equal("({}|Number)");
      expect(T.number.union(T.makeObject({ x: T.number })).toString()).to.equal("({x: Number}|Number)");
      return expect(T.number.union(T.generic("Thing", T.number)).toString()).to.equal("(Thing<Number>|Number)");
    });
    it("Union of union", function () {
      expect(T.stringOrNumber.union(T.number)).to.equal(T.stringOrNumber, "(S \u222a N) \u222a N");
      expect(T.stringOrNumber.union(T.stringOrNumber)).to.equal(T.stringOrNumber, "(S \u222a N) \u222a (S \u222a N)");
      expect(T.stringOrNumber.union(T.number.union(T.boolean)).equals(T.string.union(T.number).union(T.boolean)), "(S \u222a N) \u222a (N|B)").to.be["true"];
      expect(T.stringOrNumber.union(T.boolean.union(T.stringOrNumber)).equals(T.string.union(T.number).union(T.boolean)), "(S \u222a N) \u222a (S|N|B)").to.be["true"];
      expect(T.stringOrNumber.union(T.any)).to.equal(T.any, "(S \u222a N) \u222a *");
      expect(T.stringOrNumber.union(T.none)).to.equal(T.stringOrNumber, "(S \u222a N) \u222a 0");
      expect(T.stringOrNumber.union(T.number.array()).equals(T.string.union(T.number).union(T.number.array())), "(S \u222a N) \u222a [N]").to.be["true"];
      expect(T.string.union(T.number).union(T.number.array()).toString()).to.equal("([Number]|Number|String)");
      expect(T.stringOrNumber.union(T.stringOrNumber.array()).equals(T.string.union(T.number).union(T.number.union(T.string).array())), "(S \u222a N) \u222a [(S \u222a N)]").to.be["true"];
      expect(T.stringOrNumber.union(T.stringOrNumber.array()).toString()).to.equal("([(Number|String)]|Number|String)");
      expect(T.stringOrNumber.union(T.number["function"]()).equals(T.string.union(T.number).union(T.number["function"]())), "(S \u222a N) \u222a -> N").to.be["true"];
      expect(T.string.union(T.number).union(T.number["function"]()).toString()).to.equal("(-> Number|Number|String)");
      expect(T.stringOrNumber.union(T.stringOrNumber["function"]()).equals(T.string.union(T.number).union(T.number.union(T.string)["function"]())), "(S \u222a N) \u222a -> (S \u222a N)").to.be["true"];
      expect(T.stringOrNumber.union(T.stringOrNumber["function"]()).toString()).to.equal("(-> (Number|String)|Number|String)");
      expect(T.stringOrNumber.union(T.boolean.complement()).equals(T.boolean.complement()), "(S \u222a N) \u222a !B").to.be["true"];
      expect(T.stringOrNumber.union(T.number.complement())).to.equal(T.any, "(S \u222a N) \u222a !N");
      expect(T.stringOrNumber.union(T.string.complement())).to.equal(T.any, "(S \u222a N) \u222a !S");
      expect(T.stringOrNumber.union(T.stringOrNumber.complement())).to.equal(T.any, "(S \u222a N) \u222a !(S \u222a N)");
      expect(T.stringOrNumber.union(T.object).equals(T.object.union(T.number).union(T.string)), "(S \u222a N) \u222a {}").to.be["true"];
      expect(T.stringOrNumber.union(T.object).toString()).to.equal("({}|Number|String)");
      expect(T.stringOrNumber.union(T.makeObject({ x: T.stringOrNumber })).toString()).to.equal("({x: (Number|String)}|Number|String)");
      return expect(T.stringOrNumber.union(T.generic("Thing", T.stringOrNumber)).toString()).to.equal("(Thing<(Number|String)>|Number|String)");
    });
    it("Union of complement", function () {
      var notNumber;
      notNumber = T.number.complement();
      expect(notNumber.union(T.number)).to.equal(T.any, "!N \u222a N");
      expect(notNumber.union(T.string)).to.equal(notNumber, "!N \u222a S");
      expect(notNumber.union(T.stringOrNumber)).to.equal(T.any, "!N \u222a (S \u222a N)");
      expect(notNumber.union(T.boolean.union(T.string))).to.equal(notNumber, "!N \u222a (S|B)");
      expect(notNumber.union(T.any)).to.equal(T.any, "!N \u222a *");
      expect(notNumber.union(T.none)).to.equal(notNumber, "!N \u222a 0");
      expect(notNumber.union(T.array)).to.equal(notNumber, "!N \u222a [*]");
      expect(notNumber.union(T.number.array())).to.equal(notNumber, "!N \u222a [N]");
      expect(notNumber.union(notNumber.array())).to.equal(notNumber, "!N \u222a [!N]");
      expect(notNumber.union(T.number.array().complement())).to.equal(T.any, "!N \u222a ![N]");
      expect(notNumber.union(T["function"])).to.equal(notNumber, "!N \u222a -> *");
      expect(notNumber.union(T.number["function"]())).to.equal(notNumber, "!N \u222a -> N");
      expect(notNumber.union(notNumber["function"]())).to.equal(notNumber, "!N \u222a -> !N");
      expect(notNumber.union(T.number["function"]().complement())).to.equal(T.any, "!N \u222a !(-> N)");
      expect(notNumber.union(T.number.complement()).equals(notNumber), "!N \u222a !N").to.be["true"];
      expect(notNumber.union(T.string.complement())).to.equal(T.any, "!N \u222a !S");
      expect(notNumber.union(T.object)).to.equal(notNumber, "!N \u222a {}");
      return expect(notNumber.union(T.generic("Thing", T.number))).to.equal(notNumber, "!N \u222a X<N>");
    });
    it("Union of none", function () {
      var myGeneric, myObject, notNumber;
      expect(T.none.union(T.number)).to.equal(T.number, "0 \u222a N");
      expect(T.none.union(T.stringOrNumber)).to.equal(T.stringOrNumber, "0 \u222a (S \u222a N)");
      expect(T.none.union(T.any)).to.equal(T.any, "0 \u222a *");
      expect(T.none.union(T.none)).to.equal(T.none, "0 \u222a 0");
      expect(T.none.union(T.array)).to.equal(T.array, "0 \u222a [*]");
      expect(T.none.union(T.number.array())).to.equal(T.number.array(), "0 \u222a [N]");
      expect(T.none.union(T["function"])).to.equal(T["function"], "0 \u222a -> *");
      expect(T.none.union(T.number["function"]())).to.equal(T.number["function"](), "0 \u222a -> N");
      notNumber = T.number.complement();
      expect(T.none.union(notNumber)).to.equal(notNumber, "0 \u222a !N");
      expect(T.none.union(T.object)).to.equal(T.object, "0 \u222a {}");
      myObject = T.makeObject({ x: T.number });
      expect(T.none.union(myObject)).to.equal(myObject, "0 \u222a {x:N}");
      myGeneric = T.generic("Thing", T.number);
      return expect(T.none.union(myGeneric)).to.equal(myGeneric, "0 \u222a X<N>");
    });
    it("Union of any", function () {
      expect(T.any.union(T.number)).to.equal(T.any, "* \u222a N");
      expect(T.any.union(T.stringOrNumber)).to.equal(T.any, "* \u222a (S \u222a N)");
      expect(T.any.union(T.any)).to.equal(T.any, "* \u222a *");
      expect(T.any.union(T.none)).to.equal(T.any, "* \u222a 0");
      expect(T.any.union(T.array)).to.equal(T.any, "* \u222a [*]");
      expect(T.any.union(T.number.array())).to.equal(T.any, "* \u222a [N]");
      expect(T.any.union(T["function"])).to.equal(T.any, "* \u222a -> *");
      expect(T.any.union(T.number["function"]())).to.equal(T.any, "* \u222a -> N");
      expect(T.any.union(T.number.complement())).to.equal(T.any, "* \u222a !N");
      expect(T.any.union(T.object)).to.equal(T.any, "* \u222a {}");
      expect(T.any.union(T.makeObject({ x: T.number }))).to.equal(T.any, "* \u222a {}");
      return expect(T.any.union(T.generic("Thing", T.number))).to.equal(T.any, "* \u222a X<N>");
    });
    it("Union of specialized array", function () {
      var notNumber;
      expect(T.number.array().union(T.number).toString()).to.equal("([Number]|Number)", "[N] \u222a N");
      expect(T.number.array().union(T.string).toString()).to.equal("([Number]|String)", "[N] \u222a S");
      expect(T.number.array().union(T.stringOrNumber).toString()).to.equal("([Number]|Number|String)", "[N] \u222a (S \u222a N)");
      expect(T.number.array().union(T.number["function"]()).toString()).to.equal("([Number]|-> Number)", "[N] \u222a -> N");
      expect(T.number.array().union(T.any)).to.equal(T.any, "[N] \u222a *");
      expect(T.number.array().union(T.none)).to.equal(T.number.array(), "[N] \u222a 0");
      expect(T.number.array().union(T.array)).to.equal(T.array, "[N] \u222a [*]");
      expect(T.number.array().union(T.number.array())).to.equal(T.number.array(), "[N] \u222a [N]");
      expect(T.number.array().union(T.string.array()).toString()).to.equal("([Number]|[String])", "[N] \u222a [S]");
      notNumber = T.number.complement();
      expect(T.number.array().union(notNumber)).to.equal(notNumber, "[N] \u222a !N");
      expect(T.number.array().union(T.number.array().complement())).to.equal(T.any, "[N] \u222a ![N]");
      expect(T.number.array().union(T.object).toString()).to.equal("([Number]|{})", "[N] \u222a {}");
      expect(T.number.array().union(T.makeObject({ x: T.number })).toString()).to.equal("([Number]|{x: Number})", "[N] \u222a {x:N}");
      return expect(T.number.array().union(T.generic("Thing", T.number)).toString()).to.equal("([Number]|Thing<Number>)", "[N] \u222a X<N>");
    });
    it("Union of array", function () {
      var notNumber;
      expect(T.array.union(T.number).toString()).to.equal("([]|Number)", "[*] \u222a N");
      expect(T.array.union(T.string).toString()).to.equal("([]|String)", "[*] \u222a S");
      expect(T.array.union(T.stringOrNumber).toString()).to.equal("([]|Number|String)", "[*] \u222a (S \u222a N)");
      expect(T.array.union(T["function"]).toString()).to.equal("([]|->)", "[*] \u222a -> *");
      expect(T.array.union(T.any)).to.equal(T.any, "[*] \u222a *");
      expect(T.array.union(T.none)).to.equal(T.array, "[*] \u222a 0");
      expect(T.array.union(T.array)).to.equal(T.array, "[*] \u222a [*]");
      expect(T.array.union(T.number.array())).to.equal(T.array, "[*] \u222a [N]");
      notNumber = T.number.complement();
      expect(T.array.union(notNumber)).to.equal(notNumber, "[*] \u222a !N");
      expect(T.array.union(T.array.complement())).to.equal(T.any, "[*] \u222a ![*]");
      expect(T.array.union(T.object).toString()).to.equal("([]|{})", "[*] \u222a {}");
      expect(T.array.union(T.makeObject({ x: T.number })).toString()).to.equal("([]|{x: Number})", "[*] \u222a {x:*}");
      return expect(T.array.union(T.generic("Thing", T.number)).toString()).to.equal("([]|Thing<Number>)", "[*] \u222a X<N>");
    });
    it("Union of specialized function", function () {
      var notNumber;
      expect(T.number["function"]().union(T.number).toString()).to.equal("(-> Number|Number)", "-> N \u222a N");
      expect(T.number["function"]().union(T.string).toString()).to.equal("(-> Number|String)", "-> N \u222a S");
      expect(T.number["function"]().union(T.stringOrNumber).toString()).to.equal("(-> Number|Number|String)", "-> N \u222a (S \u222a N)");
      expect(T.number["function"]().union(T.number.array()).toString()).to.equal("([Number]|-> Number)", "-> N \u222a [N]");
      expect(T.number["function"]().union(T.any)).to.equal(T.any, "-> N \u222a *");
      expect(T.number["function"]().union(T.none)).to.equal(T.number["function"](), "-> N \u222a 0");
      expect(T.number["function"]().union(T["function"])).to.equal(T["function"], "-> N \u222a -> *");
      expect(T.number["function"]().union(T.number["function"]())).to.equal(T.number["function"](), "-> N \u222a -> N");
      expect(T.number["function"]().union(T.string["function"]()).toString()).to.equal("(-> Number|-> String)", "-> N \u222a -> S");
      notNumber = T.number.complement();
      expect(T.number["function"]().union(notNumber)).to.equal(notNumber, "-> N \u222a !N");
      expect(T.number["function"]().union(T.number["function"]().complement())).to.equal(T.any, "-> N \u222a !(-> N)");
      expect(T.number["function"]().union(T.object).toString()).to.equal("(-> Number|{})", "-> N \u222a {}");
      expect(T.number["function"]().union(T.makeObject({ x: T.number })).toString()).to.equal("(-> Number|{x: Number})", "-> N \u222a {x:N}");
      return expect(T.number["function"]().union(T.generic("Thing", T.number)).toString()).to.equal("(-> Number|Thing<Number>)", "-> N \u222a X<N>");
    });
    it("Union of function", function () {
      var notNumber;
      expect(T["function"].union(T.number).toString()).to.equal("(->|Number)", "-> * \u222a N");
      expect(T["function"].union(T.string).toString()).to.equal("(->|String)", "-> * \u222a S");
      expect(T["function"].union(T.stringOrNumber).toString()).to.equal("(->|Number|String)", "-> * \u222a (S \u222a N)");
      expect(T["function"].union(T.array).toString()).to.equal("([]|->)", "-> * \u222a [*]");
      expect(T["function"].union(T.any)).to.equal(T.any, "-> * \u222a *");
      expect(T["function"].union(T.none)).to.equal(T["function"], "-> * \u222a 0");
      expect(T["function"].union(T["function"])).to.equal(T["function"], "-> * \u222a -> *");
      expect(T["function"].union(T.number["function"]())).to.equal(T["function"], "-> * \u222a -> N");
      notNumber = T.number.complement();
      expect(T["function"].union(notNumber)).to.equal(notNumber, "-> * \u222a !N");
      expect(T["function"].union(T["function"].complement())).to.equal(T.any, "-> * \u222a !(-> *)");
      expect(T["function"].union(T.object).toString()).to.equal("(->|{})", "-> * \u222a {}");
      expect(T["function"].union(T.makeObject({ x: T.number })).toString()).to.equal("(->|{x: Number})", "-> * \u222a {x:N}");
      return expect(T["function"].union(T.generic("Thing", T.number)).toString()).to.equal("(->|Thing<Number>)", "-> * \u222a X<N>");
    });
    it("Union of specialized object", function () {
      var myObject, notNumber;
      myObject = T.makeObject({ x: T.number });
      expect(myObject.union(T.number).toString()).to.equal("({x: Number}|Number)", "{x:N} \u222a N");
      expect(myObject.union(T.string).toString()).to.equal("({x: Number}|String)", "{x:N} \u222a S");
      expect(myObject.union(T.stringOrNumber).toString()).to.equal("({x: Number}|Number|String)", "{x:N} \u222a (S \u222a N)");
      expect(myObject.union(T.number.array()).toString()).to.equal("([Number]|{x: Number})", "{x:N} \u222a [N]");
      expect(myObject.union(T.number["function"]()).toString()).to.equal("(-> Number|{x: Number})", "{x:N} \u222a -> N");
      expect(myObject.union(T.any)).to.equal(T.any, "{x:N} \u222a *");
      expect(myObject.union(T.none)).to.equal(myObject, "{x:N} \u222a 0");
      notNumber = T.number.complement();
      expect(myObject.union(notNumber)).to.equal(notNumber, "{x:N} \u222a !N");
      expect(myObject.union(myObject.complement())).to.equal(T.any, "{x:N} \u222a !{x:N}");
      expect(myObject.union(T.object)).to.equal(T.object, "{x:N} \u222a {}");
      expect(myObject.union(T.makeObject({ x: T.number }))).to.equal(myObject, "{x:N} \u222a {x:N}");
      expect(myObject.union(T.makeObject({ x: T.string })).toString()).to.equal("({x: Number}|{x: String})", "{x:N} \u222a {x:S}");
      expect(myObject.union(T.makeObject({ x: T.number, y: T.string }))).to.equal(myObject, "{x:N} \u222a {x:N, y:S}");
      expect(T.makeObject({ x: T.number, y: T.string }).union(myObject)).to.equal(myObject, "{x:N, y:S} \u222a {x:N}");
      expect(myObject.union(T.makeObject({ x: T.string })).union(T.object)).to.equal(T.object, "{x:N} \u222a {x:S} \u222a {}");
      expect(T.makeObject({ x: T.number, y: T.string }).union(T.makeObject({ x: T.number, z: T.boolean })).union(myObject)).to.equal(myObject, "{x:N, x:S} \u222a {x:N, z:B} \u222a {x:N}");
      return expect(myObject.union(T.generic("Thing", T.number)).toString()).to.equal("(Thing<Number>|{x: Number})", "{x:N} \u222a X<N>");
    });
    it("Union of object", function () {
      var notNumber;
      expect(T.object.union(T.number).toString()).to.equal("({}|Number)", "{} \u222a N");
      expect(T.object.union(T.string).toString()).to.equal("({}|String)", "{} \u222a S");
      expect(T.object.union(T.stringOrNumber).toString()).to.equal("({}|Number|String)", "{} \u222a (S \u222a N)");
      expect(T.object.union(T.array).toString()).to.equal("([]|{})", "{} \u222a [*]");
      expect(T.object.union(T["function"]).toString()).to.equal("(->|{})", "{} \u222a ->");
      expect(T.object.union(T.any)).to.equal(T.any, "{} \u222a *");
      expect(T.object.union(T.none)).to.equal(T.object, "{} \u222a 0");
      notNumber = T.number.complement();
      expect(T.object.union(notNumber)).to.equal(notNumber, "{} \u222a !N");
      expect(T.object.union(T.object.complement())).to.equal(T.any, "{} \u222a !{}");
      expect(T.object.union(T.object)).to.equal(T.object, "{} \u222a {}");
      expect(T.object.union(T.makeObject({ x: T.number }))).to.equal(T.object, "{} \u222a {x:N}");
      return expect(T.object.union(T.generic("Thing", T.number)).toString()).to.equal("(Thing<Number>|{})", "{} \u222a X<N>");
    });
    it("Union of generic", function () {
      var myGeneric, notNumber;
      myGeneric = T.generic("Thing", T.number);
      expect(myGeneric.union(T.number).toString()).to.equal("(Thing<Number>|Number)", "X<N> \u222a N");
      expect(myGeneric.union(T.string).toString()).to.equal("(Thing<Number>|String)", "X<N> \u222a S");
      expect(myGeneric.union(T.stringOrNumber).toString()).to.equal("(Thing<Number>|Number|String)", "X<N> \u222a (S \u222a N)");
      expect(myGeneric.union(T.number.array()).toString()).to.equal("([Number]|Thing<Number>)", "X<N> \u222a [N]");
      expect(myGeneric.union(T.number["function"]()).toString()).to.equal("(-> Number|Thing<Number>)", "X<N> \u222a -> N");
      expect(myGeneric.union(T.any)).to.equal(T.any, "X<N> \u222a *");
      expect(myGeneric.union(T.none)).to.equal(myGeneric, "X<N> \u222a 0");
      notNumber = T.number.complement();
      expect(myGeneric.union(notNumber)).to.equal(notNumber, "X<N> \u222a !N");
      expect(myGeneric.union(myGeneric.complement())).to.equal(T.any, "X<N> \u222a !X<N>");
      expect(myGeneric.union(T.object).toString()).to.equal("(Thing<Number>|{})", "X<N> \u222a {}");
      expect(myGeneric.union(T.makeObject({ x: T.number })).toString()).to.equal("(Thing<Number>|{x: Number})", "X<N> \u222a {x:N}");
      expect(myGeneric.union(T.generic("Other", T.number)).toString()).to.equal("(Other<Number>|Thing<Number>)", "X<N> \u222a Y<N>");
      expect(myGeneric.union(T.generic("Thing", T.number)).toString()).to.equal("(Thing<Number>|Thing<Number>)", "X<N> \u222a Z<N>");
      expect(myGeneric.union(T.generic(myGeneric.base, T.number))).to.equal(myGeneric, "X<N> \u222a X<N>");
      return expect(myGeneric.union(T.generic(myGeneric.base, T.string)).toString()).to.equal("(Thing<Number>|Thing<String>)", "X<N> \u222a X<S>");
    });
    it("Intersection of simple", function () {
      expect(T.number.intersect(T.number)).to.equal(T.number, "N \u2229 N");
      expect(T.number.intersect(T.string)).to.equal(T.none, "N \u2229 S");
      expect(T.number.intersect(T.stringOrNumber)).to.equal(T.number, "N \u2229 (S \u222a N)");
      expect(T.number.intersect(T.string.complement())).to.equal(T.number, "N \u2229 !S");
      expect(T.number.intersect(T.number.complement())).to.equal(T.none, "N \u2229 !N");
      expect(T.number.intersect(T.any)).to.equal(T.number, "N \u2229 *");
      expect(T.number.intersect(T.none)).to.equal(T.none, "N \u2229 0");
      expect(T.number.intersect(T.number.array())).to.equal(T.none, "N \u2229 [N]");
      expect(T.number.intersect(T.number["function"]())).to.equal(T.none, "N \u2229 -> N");
      expect(T.number.intersect(T.object)).to.equal(T.none, "N \u2229 {}");
      expect(T.number.intersect(T.makeObject({ x: T.number }))).to.equal(T.none, "N \u2229 {x:N}");
      return expect(T.number.intersect(T.generic("Thing", T.number))).to.equal(T.none, "N \u2229 X<N>");
    });
    it("Intersection of union", function () {
      expect(T.stringOrNumber.intersect(T.number)).to.equal(T.number, "(S \u222a N) \u2229 N");
      expect(T.stringOrNumber.intersect(T.stringOrNumber)).to.equal(T.stringOrNumber, "(S \u222a N) \u2229 (S \u222a N)");
      expect(T.stringOrNumber.intersect(T.number.union(T.boolean))).to.equal(T.number, "(S \u222a N) \u2229 (N|B)");
      expect(T.stringOrNumber.intersect(T.boolean.union(T.stringOrNumber))).to.equal(T.stringOrNumber, "(S \u222a N) \u2229 (S|N|B)");
      expect(T.stringOrNumber.intersect(T.any)).to.equal(T.stringOrNumber, "(S \u222a N) \u2229 *");
      expect(T.stringOrNumber.intersect(T.none)).to.equal(T.none, "(S \u222a N) \u2229 0");
      expect(T.stringOrNumber.intersect(T.number.array())).to.equal(T.none, "(S \u222a N) \u2229 [N]");
      expect(T.stringOrNumber.intersect(T.stringOrNumber.array())).to.equal(T.none, "(S \u222a N) \u2229 [(S \u222a N)]");
      expect(T.stringOrNumber.intersect(T.number["function"]())).to.equal(T.none, "(S \u222a N) \u2229 -> N");
      expect(T.stringOrNumber.intersect(T.stringOrNumber["function"]())).to.equal(T.none, "(S \u222a N) \u2229 -> (S \u222a N)");
      expect(T.stringOrNumber.intersect(T.boolean.complement())).to.equal(T.stringOrNumber, "(S \u222a N) \u2229 !B");
      expect(T.stringOrNumber.intersect(T.number.complement())).to.equal(T.string, "(S \u222a N) \u2229 !N");
      expect(T.stringOrNumber.intersect(T.string.complement())).to.equal(T.number, "(S \u222a N) \u2229 !S");
      expect(T.stringOrNumber.intersect(T.stringOrNumber.complement())).to.equal(T.none, "(S \u222a N) \u2229 !(S \u222a N)");
      expect(T.stringOrNumber.intersect(T.object)).to.equal(T.none, "(S \u222a N) \u2229 {}");
      expect(T.stringOrNumber.intersect(T.makeObject({ x: T.stringOrNumber }))).to.equal(T.none, "(S \u222a N) \u2229 {x:(S \u222a N)}");
      return expect(T.stringOrNumber.intersect(T.generic("Thing", T.number))).to.equal(T.none, "(S \u222a N) \u2229 X<N>");
    });
    it("Intersection of complement", function () {
      var booleanOrString, myGeneric, myObject, notNumber;
      notNumber = T.number.complement();
      expect(notNumber.intersect(T.number)).to.equal(T.none, "!N \u2229 N");
      expect(notNumber.intersect(T.string)).to.equal(T.string, "!N \u2229 S");
      expect(notNumber.intersect(T.stringOrNumber)).to.equal(T.string, "!N \u2229 (S \u222a N)");
      booleanOrString = T.boolean.union(T.string);
      expect(notNumber.intersect(booleanOrString)).to.equal(booleanOrString, "!N \u2229 (S|B)");
      expect(notNumber.intersect(T.any)).to.equal(notNumber, "!N \u2229 *");
      expect(notNumber.intersect(T.none)).to.equal(T.none, "!N \u2229 0");
      expect(notNumber.intersect(T.array)).to.equal(T.array, "!N \u2229 [*]");
      expect(notNumber.intersect(T.number.array())).to.equal(T.number.array(), "!N \u2229 [N]");
      expect(notNumber.intersect(notNumber.array()).equals(notNumber.array()), "!N \u2229 [!N]").to.be["true"];
      expect(notNumber.intersect(T.number.array().complement()).equals(T.number.union(T.number.array()).complement()), "!N \u2229 ![N]").to.be["true"];
      expect(notNumber.intersect(T["function"])).to.equal(T["function"], "!N \u2229 -> *");
      expect(notNumber.intersect(T.number["function"]())).to.equal(T.number["function"](), "!N \u2229 -> N");
      expect(notNumber.intersect(notNumber["function"]()).equals(notNumber["function"]()), "!N \u2229 -> !N").to.be["true"];
      expect(notNumber.intersect(T.number["function"]().complement()).equals(T.number.union(T.number["function"]()).complement()), "!N \u2229 !(-> N)").to.be["true"];
      expect(notNumber.intersect(T.number.complement()).equals(notNumber), "!N \u2229 !N").to.be["true"];
      expect(notNumber.intersect(T.string.complement()).equals(T.stringOrNumber.complement()), "!N \u2229 !S").to.be["true"];
      expect(notNumber.intersect(T.object)).to.equal(T.object, "!N \u2229 {}");
      myObject = T.makeObject({ x: notNumber });
      expect(notNumber.intersect(myObject)).to.equal(myObject, "!N \u2229 {x:!N}");
      myGeneric = T.generic("Thing", notNumber);
      return expect(notNumber.intersect(myGeneric)).to.equal(myGeneric, "!N \u2229 X<!N>");
    });
    it("Intersection of none", function () {
      expect(T.none.intersect(T.number)).to.equal(T.none, "0 \u2229 N");
      expect(T.none.intersect(T.stringOrNumber)).to.equal(T.none, "0 \u2229 (S \u222a N)");
      expect(T.none.intersect(T.any)).to.equal(T.none, "0 \u2229 *");
      expect(T.none.intersect(T.none)).to.equal(T.none, "0 \u2229 0");
      expect(T.none.intersect(T.array)).to.equal(T.none, "0 \u2229 [*]");
      expect(T.none.intersect(T.number.array())).to.equal(T.none, "0 \u2229 [N]");
      expect(T.none.intersect(T["function"])).to.equal(T.none, "0 \u2229 -> *");
      expect(T.none.intersect(T["function"].array())).to.equal(T.none, "0 \u2229 -> N");
      expect(T.none.intersect(T.number.complement())).to.equal(T.none, "0 \u2229 !N");
      expect(T.none.intersect(T.object)).to.equal(T.none, "0 \u2229 {}");
      expect(T.none.intersect(T.makeObject({ x: T.number }))).to.equal(T.none, "0 \u2229 {x:N}");
      return expect(T.none.intersect(T.generic("Thing", T.number))).to.equal(T.none, "0 \u2229 X<N>");
    });
    it("Intersection of any", function () {
      var myGeneric, myObject, notNumber;
      expect(T.any.intersect(T.number)).to.equal(T.number, "* \u2229 N");
      expect(T.any.intersect(T.stringOrNumber)).to.equal(T.stringOrNumber, "* \u2229 (S \u222a N)");
      expect(T.any.intersect(T.any)).to.equal(T.any, "* \u2229 *");
      expect(T.any.intersect(T.none)).to.equal(T.none, "* \u2229 0");
      expect(T.any.intersect(T.array)).to.equal(T.array, "* \u2229 [*]");
      expect(T.any.intersect(T.number.array())).to.equal(T.number.array(), "* \u2229 [N]");
      expect(T.any.intersect(T["function"])).to.equal(T["function"], "* \u2229 -> *");
      expect(T.any.intersect(T.number["function"]())).to.equal(T.number["function"](), "* \u2229 -> N");
      notNumber = T.number.complement();
      expect(T.any.intersect(notNumber)).to.equal(notNumber, "* \u2229 !N");
      expect(T.any.intersect(T.object)).to.equal(T.object, "* \u2229 {}");
      myObject = T.makeObject({ x: T.number });
      expect(T.any.intersect(myObject)).to.equal(myObject, "* \u2229 {x:N}");
      myGeneric = T.generic("Thing", T.number);
      return expect(T.any.intersect(myGeneric)).to.equal(myGeneric, "* \u2229 X<N>");
    });
    it("Intersection of specialized array", function () {
      expect(T.number.array().intersect(T.number)).to.equal(T.none, "[N] \u2229 N");
      expect(T.number.array().intersect(T.string)).to.equal(T.none, "[N] \u2229 S");
      expect(T.number.array().intersect(T.stringOrNumber)).to.equal(T.none, "[N] \u2229 (S \u222a N)");
      expect(T.number.array().intersect(T.any)).to.equal(T.number.array(), "[N] \u2229 *");
      expect(T.number.array().intersect(T.none)).to.equal(T.none, "[N] \u2229 0");
      expect(T.number.array().intersect(T.array)).to.equal(T.number.array(), "[N] \u2229 [*]");
      expect(T.number.array().intersect(T.number.array())).to.equal(T.number.array(), "[N] \u2229 [N]");
      expect(T.number.array().intersect(T.string.array())).to.equal(T.none.array(), "[N] \u2229 [S]");
      expect(T.number.array().intersect(T.number.complement())).to.equal(T.number.array(), "[N] \u2229 !N");
      expect(T.number.array().intersect(T.number.array().complement())).to.equal(T.none, "[N] \u2229 ![N]");
      expect(T.number.array().intersect(T["function"])).to.equal(T.none, "[N] \u2229 -> *");
      expect(T.number.array().intersect(T.number["function"]())).to.equal(T.none, "[N] \u2229 -> N");
      expect(T.number.array().intersect(T.object)).to.equal(T.none, "[N] \u2229 {}");
      expect(T.number.array().intersect(T.makeObject({ x: T.number }))).to.equal(T.none, "[N] \u2229 {x:N}");
      return expect(T.number.array().intersect(T.generic("Thing", T.number))).to.equal(T.none, "[N] \u2229 X<N>");
    });
    it("Intersection of array", function () {
      expect(T.array.intersect(T.number)).to.equal(T.none, "[*] \u2229 N");
      expect(T.array.intersect(T.string)).to.equal(T.none, "[*] \u2229 S");
      expect(T.array.intersect(T.stringOrNumber)).to.equal(T.none, "[*] \u2229 (S \u222a N)");
      expect(T.array.intersect(T.any)).to.equal(T.array, "[*] \u2229 *");
      expect(T.array.intersect(T.none)).to.equal(T.none, "[*] \u2229 0");
      expect(T.array.intersect(T.array)).to.equal(T.array, "[*] \u2229 [*]");
      expect(T.array.intersect(T.number.array())).to.equal(T.number.array(), "[*] \u2229 [N]");
      expect(T.array.intersect(T.number.complement())).to.equal(T.array, "[*] \u2229 !N");
      expect(T.array.intersect(T.array.complement())).to.equal(T.none, "[*] \u2229 ![*]");
      expect(T.array.intersect(T["function"])).to.equal(T.none, "[*] \u2229 -> *");
      expect(T.array.intersect(T.number["function"]())).to.equal(T.none, "[*] \u2229 -> N");
      expect(T.array.intersect(T.object)).to.equal(T.none, "[*] \u2229 {}");
      expect(T.array.intersect(T.makeObject({ x: T.number }))).to.equal(T.none, "[*] \u2229 {x:N}");
      return expect(T.array.intersect(T.generic("Thing", T.any))).to.equal(T.none, "[*] \u2229 X<*>");
    });
    it("Intersection of specialized function", function () {
      expect(T.number["function"]().intersect(T.number)).to.equal(T.none, "-> N \u2229 N");
      expect(T.number["function"]().intersect(T.string)).to.equal(T.none, "-> N \u2229 S");
      expect(T.number["function"]().intersect(T.stringOrNumber)).to.equal(T.none, "-> N \u2229 (S \u222a N)");
      expect(T.number["function"]().intersect(T.any)).to.equal(T.number["function"](), "-> N \u2229 *");
      expect(T.number["function"]().intersect(T.none)).to.equal(T.none, "-> N \u2229 0");
      expect(T.number["function"]().intersect(T["function"])).to.equal(T.number["function"](), "-> N \u2229 -> *");
      expect(T.number["function"]().intersect(T.number["function"]())).to.equal(T.number["function"](), "-> N \u2229 -> N");
      expect(T.number["function"]().intersect(T.string["function"]())).to.equal(T.none["function"](), "-> N \u2229 -> S");
      expect(T.number["function"]().intersect(T.number.complement())).to.equal(T.number["function"](), "-> N \u2229 !N");
      expect(T.number["function"]().intersect(T.number["function"]().complement())).to.equal(T.none, "-> N \u2229 !(-> N)");
      expect(T.number["function"]().intersect(T.array)).to.equal(T.none, "-> N \u2229 [*]");
      expect(T.number["function"]().intersect(T.number.array())).to.equal(T.none, "-> N \u2229 [N]");
      expect(T.number["function"]().intersect(T.object)).to.equal(T.none, "-> N \u2229 {}");
      expect(T.number["function"]().intersect(T.makeObject({ x: T.number }))).to.equal(T.none, "-> N \u2229 {x:N}");
      return expect(T.number["function"]().intersect(T.generic("Thing", T.number))).to.equal(T.none, "-> N \u2229 X<N>");
    });
    it("Intersection of function", function () {
      expect(T["function"].intersect(T.number)).to.equal(T.none, "-> * \u2229 N");
      expect(T["function"].intersect(T.string)).to.equal(T.none, "-> * \u2229 S");
      expect(T["function"].intersect(T.stringOrNumber)).to.equal(T.none, "-> * \u2229 (S \u222a N)");
      expect(T["function"].intersect(T.any)).to.equal(T["function"], "-> * \u2229 *");
      expect(T["function"].intersect(T.none)).to.equal(T.none, "-> * \u2229 0");
      expect(T["function"].intersect(T["function"])).to.equal(T["function"], "-> * \u2229 -> *");
      expect(T["function"].intersect(T.number["function"]())).to.equal(T.number["function"](), "-> * \u2229 -> N");
      expect(T["function"].intersect(T.number.complement())).to.equal(T["function"], "-> * \u2229 !N");
      expect(T["function"].intersect(T["function"].complement())).to.equal(T.none, "-> * \u2229 !(-> *)");
      expect(T["function"].intersect(T.array)).to.equal(T.none, "-> * \u2229 [*]");
      expect(T["function"].intersect(T.number.array())).to.equal(T.none, "-> * \u2229 [N]");
      expect(T["function"].intersect(T.object)).to.equal(T.none, "-> * \u2229 {}");
      expect(T["function"].intersect(T.makeObject({ x: T.number }))).to.equal(T.none, "-> * \u2229 {x:N}");
      return expect(T["function"].intersect(T.generic("Thing", T.number))).to.equal(T.none, "-> * \u2229 X<N>");
    });
    it("Intersection of specialized object", function () {
      var badObject, myObject, otherObject;
      myObject = T.makeObject({ x: T.number });
      expect(myObject.intersect(T.number)).to.equal(T.none, "{x:N} \u2229 N");
      expect(myObject.intersect(T.string)).to.equal(T.none, "{x:N} \u2229 S");
      expect(myObject.intersect(T.stringOrNumber)).to.equal(T.none, "{x:N} \u2229 (S \u222a N)");
      expect(myObject.intersect(T.any)).to.equal(myObject, "{x:N} \u2229 *");
      expect(myObject.intersect(T.none)).to.equal(T.none, "{x:N} \u2229 0");
      expect(myObject.intersect(T["function"])).to.equal(T.none, "{x:N} \u2229 -> *");
      expect(myObject.intersect(T.number["function"]())).to.equal(T.none, "{x:N} \u2229 -> N");
      expect(myObject.intersect(T.number.complement())).to.equal(myObject, "{x:N} \u2229 !N");
      expect(myObject.intersect(myObject.complement())).to.equal(T.none, "{x:N} \u2229 !{x:N}");
      expect(myObject.intersect(T.array)).to.equal(T.none, "{x:N} \u2229 [*]");
      expect(myObject.intersect(T.number.array())).to.equal(T.none, "{x:N} \u2229 [N]");
      expect(myObject.intersect(T.object)).to.equal(myObject, "{x:N} \u2229 {}");
      expect(myObject.intersect(T.makeObject({ x: T.number }))).to.equal(myObject, "{x:N} \u2229 {x:N}");
      otherObject = T.makeObject({ x: T.number, y: T.string });
      expect(myObject.intersect(otherObject)).to.equal(otherObject, "{x:N} \u2229 {x:N, y:S}");
      badObject = T.makeObject({ x: T.string });
      expect(myObject.intersect(badObject).equals(T.makeObject({ x: T.none })), "{x:N} \u2229 {x:S}").to.be["true"];
      return expect(myObject.intersect(T.generic("Thing", T.number))).to.equal(T.none, "{x:N} \u2229 X<N>");
    });
    it("Intersection of object", function () {
      var myObject;
      expect(T.object.intersect(T.number)).to.equal(T.none, "{} \u2229 N");
      expect(T.object.intersect(T.string)).to.equal(T.none, "{} \u2229 S");
      expect(T.object.intersect(T.stringOrNumber)).to.equal(T.none, "{} \u2229 (S \u222a N)");
      expect(T.object.intersect(T.any)).to.equal(T.object, "{} \u2229 *");
      expect(T.object.intersect(T.none)).to.equal(T.none, "{} \u2229 0");
      expect(T.object.intersect(T["function"])).to.equal(T.none, "{} \u2229 -> *");
      expect(T.object.intersect(T.number["function"]())).to.equal(T.none, "{} \u2229 -> N");
      expect(T.object.intersect(T.number.complement())).to.equal(T.object, "{} \u2229 !N");
      expect(T.object.intersect(T.object.complement())).to.equal(T.none, "{} \u2229 !{}");
      expect(T.object.intersect(T.array)).to.equal(T.none, "{} \u2229 [*]");
      expect(T.object.intersect(T.number.array())).to.equal(T.none, "{} \u2229 [N]");
      expect(T.object.intersect(T.object)).to.equal(T.object, "{} \u2229 {}");
      myObject = T.makeObject({ x: T.number });
      expect(T.object.intersect(myObject)).to.equal(myObject, "{} \u2229 {x:N}");
      return expect(T.object.intersect(T.generic("Thing", T.number))).to.equal(T.none, "{} \u2229 X<N>");
    });
    it("Intersection of generic", function () {
      var myGeneric;
      myGeneric = T.generic("Thing", T.number);
      expect(myGeneric.intersect(T.number)).to.equal(T.none, "X<N> \u2229 N");
      expect(myGeneric.intersect(T.string)).to.equal(T.none, "X<N> \u2229 S");
      expect(myGeneric.intersect(T.stringOrNumber)).to.equal(T.none, "X<N> \u2229 (S \u222a N)");
      expect(myGeneric.intersect(T.any)).to.equal(myGeneric, "X<N> \u2229 *");
      expect(myGeneric.intersect(T.none)).to.equal(T.none, "X<N> \u2229 0");
      expect(myGeneric.intersect(T["function"])).to.equal(T.none, "X<N> \u2229 -> *");
      expect(myGeneric.intersect(T.number["function"]())).to.equal(T.none, "X<N> \u2229 -> N");
      expect(myGeneric.intersect(T.number.complement())).to.equal(myGeneric, "X<N> \u2229 !N");
      expect(myGeneric.intersect(myGeneric.complement())).to.equal(T.none, "X<N> \u2229 !X<N>");
      expect(myGeneric.intersect(T.array)).to.equal(T.none, "X<N> \u2229 [*]");
      expect(myGeneric.intersect(T.number.array())).to.equal(T.none, "X<N> \u2229 [N]");
      expect(myGeneric.intersect(T.object)).to.equal(T.none, "X<N> \u2229 {}");
      expect(myGeneric.intersect(T.makeObject({ x: T.number }))).to.equal(T.none, "X<N> \u2229 {x:N}");
      expect(myGeneric.intersect(T.generic(myGeneric.base, T.stringOrNumber))).to.equal(myGeneric, "X<N> \u2229 X<(S \u222a N)>");
      expect(T.generic(myGeneric.base, T.stringOrNumber).intersect(myGeneric)).to.equal(myGeneric, "X<(S \u222a N)> \u2229 X<N>");
      expect(
        myGeneric.intersect(T.generic(myGeneric.base, T.string)).equals(T.generic(myGeneric.base, T.none)),
        "X<N> \u2229 X<S>"
      ).to.be["true"];
      expect(myGeneric.intersect(T.generic("Other", T.number))).to.equal(T.none, "X<N> \u2229 Y<N>");
      return expect(myGeneric.intersect(T.generic("Thing", T.number))).to.equal(T.none, "X<N> \u2229 Z<N>");
    });
    it("Arrays", function () {
      expect(T.array.toString()).to.equal("[]");
      expect(T.boolean.array().toString()).to.equal("[Boolean]");
      expect(T.string.array().toString()).to.equal("[String]");
      expect(T.string.array().array().toString()).to.equal("[[String]]");
      expect(T.boolean.array().equals(T.boolean.array())).to.be["true"];
      expect(T.string.array().equals(T.string.array())).to.be["true"];
      expect(T.boolean.array().equals(T.string.array())).to.be["false"];
      expect(T.array.overlaps(T.boolean.array())).to.be["true"];
      expect(T.boolean.array().overlaps(T.array)).to.be["true"];
      expect(T.boolean.array().isSubsetOf(T.array)).to.be["true"];
      expect(T.array.isSubsetOf(T.boolean.array())).to.be["false"];
      expect(T.boolean.array().union(T.array)).to.equal(T.array);
      return expect(T.array.equals(T.any.array())).to.be["true"];
    });
    it("Functions", function () {
      expect(T["function"].toString()).to.equal("->");
      expect(T.boolean["function"]().toString()).to.equal("-> Boolean");
      expect(T.string["function"]().toString()).to.equal("-> String");
      expect(T.string["function"]()["function"]().toString()).to.equal("-> -> String");
      expect(T.string.array()["function"]().toString()).to.equal("-> [String]");
      expect(T.string["function"]().array().toString()).to.equal("[-> String]");
      expect(T.boolean["function"]().equals(T.boolean["function"]())).to.be["true"];
      expect(T.string["function"]().equals(T.string["function"]())).to.be["true"];
      expect(T.boolean["function"]().equals(T.string["function"]())).to.be["false"];
      expect(T["function"].overlaps(T.boolean["function"]())).to.be["true"];
      expect(T.boolean["function"]().overlaps(T["function"])).to.be["true"];
      expect(T.boolean["function"]().isSubsetOf(T["function"])).to.be["true"];
      expect(T["function"].isSubsetOf(T.boolean["function"]())).to.be["false"];
      expect(T.boolean["function"]().union(T["function"])).to.equal(T["function"]);
      return expect(T["function"].equals(T.any["function"]())).to.be["true"];
    });
    it("Objects", function () {
      expect(T.object.toString()).to.equal("{}");
      expect(T.makeObject({ x: T.any })).to.equal(T.object);
      expect(T.makeObject({ x: T.number }).toString()).to.equal("{x: Number}");
      expect(T.makeObject({ x: T.number, y: T.string }).toString()).to.equal("{x: Number, y: String}");
      expect(T.makeObject({ y: T.string, x: T.number }).toString()).to.equal("{x: Number, y: String}");
      expect(T.makeObject({ x: T.number, y: T.string }).equals(T.makeObject({ y: T.string, x: T.number }))).to.be["true"];
      expect(T.makeObject({ x: T.number }).isSubsetOf(T.object)).to.be["true"];
      expect(T.object.isSubsetOf(T.makeObject({ x: T.number }))).to.be["false"];
      expect(T.makeObject({ x: T.number }).isSubsetOf(T.makeObject({ x: T.number }))).to.be["true"];
      expect(T.makeObject({ x: T.number }).isSubsetOf(T.makeObject({ x: T.string }))).to.be["false"];
      expect(T.makeObject({ x: T.number }).isSubsetOf(T.makeObject({ x: T.stringOrNumber }))).to.be["true"];
      expect(T.makeObject({ x: T.number }).intersect(T.makeObject({ y: T.string })).equals(T.makeObject({ x: T.number, y: T.string }))).to.be["true"];
      expect(T.object.value("x")).to.equal(T.any);
      expect(T.makeObject({ x: T.number }).value("x")).to.equal(T.number);
      expect(T.makeObject({ x: T.number }).value("y")).to.equal(T.any);
      expect(T.makeObject({ x: T.number }).value("w")).to.equal(T.any);
      expect(T.makeObject({ x: T.number, y: T.string }).value("x")).to.equal(T.number);
      expect(T.makeObject({ x: T.number, y: T.string }).value("y")).to.equal(T.string);
      expect(T.makeObject({ x: T.number, y: T.string }).value("z")).to.equal(T.any);
      return expect(T.makeObject({ x: T.number, y: T.string }).value("w")).to.equal(T.any);
    });
    it("Making types", function () {
      var alpha, bravo;
      alpha = T.make("Alpha");
      bravo = T.make("Bravo");
      expect(alpha.toString()).to.equal("Alpha");
      expect(bravo.toString()).to.equal("Bravo");
      expect(alpha.union(bravo).toString()).to.equal("(Alpha|Bravo)");
      expect(bravo.union(alpha).toString()).to.equal("(Alpha|Bravo)");
      expect(alpha.union(bravo).equals(bravo.union(alpha))).to.be["true"];
      expect(alpha.array().toString()).to.equal("[Alpha]");
      expect(bravo.array().toString()).to.equal("[Bravo]");
      expect(alpha["function"]().toString()).to.equal("-> Alpha");
      expect(bravo["function"]().toString()).to.equal("-> Bravo");
      expect(alpha.union(bravo).array().toString()).to.equal("[(Alpha|Bravo)]");
      expect(alpha.union(bravo)["function"]().toString()).to.equal("-> (Alpha|Bravo)");
      expect(alpha.union(bravo).array().equals(bravo.union(alpha).array())).to.be["true"];
      expect(alpha.array().union(bravo.array()).toString()).to.equal("([Alpha]|[Bravo])");
      expect(alpha["function"]().union(bravo["function"]()).toString()).to.equal("(-> Alpha|-> Bravo)");
      expect(alpha.array().union(bravo.array()).equals(bravo.array().union(alpha.array()))).to.be["true"];
      expect(alpha["function"]().union(bravo["function"]()).equals(bravo["function"]().union(alpha["function"]()))).to.be["true"];
      expect(alpha.union(bravo).array().equals(alpha.array().union(bravo.array()))).to.be["false"];
      expect(alpha.union(bravo)["function"]().equals(alpha["function"]().union(bravo["function"]()))).to.be["false"];
      expect(T.makeObject({ x: alpha }).toString()).to.equal("{x: Alpha}");
      expect(T.makeObject({ x: alpha }).equals(T.makeObject({ x: alpha }))).to.be["true"];
      expect(T.make("Alpha").equals(alpha)).to.be["false"];
      return expect(T.make("Alpha").compare(alpha)).to.not.equal(0);
    });
    it("Serialization", function () {
      function handle(x) {
        return T.fromJSON(JSON.parse(JSON.stringify(x)));
      }
      expect(handle(T["undefined"])).to.equal(T["undefined"]);
      expect(handle(T["null"])).to.equal(T["null"]);
      expect(handle(T.string)).to.equal(T.string);
      expect(handle(T.number)).to.equal(T.number);
      expect(handle(T.boolean)).to.equal(T.boolean);
      expect(handle(T["function"])).to.equal(T["function"]);
      expect(handle(T.object)).to.equal(T.object);
      expect(handle(T.array)).to.equal(T.array);
      expect(handle(T.args)).to.equal(T.args);
      expect(handle(T.any)).to.equal(T.any);
      expect(handle(T.none)).to.equal(T.none);
      expect(handle(T.regexp)).to.equal(T.regexp);
      expect(T.stringOrNumber.equals(handle(T.stringOrNumber))).to.be["true"];
      expect(handle(T.number.array())).to.equal(T.number.array());
      expect(handle(T.number["function"]())).to.equal(T.number["function"]());
      expect(T.stringOrNumber.complement().equals(handle(T.stringOrNumber.complement()))).to.be["true"];
      expect(T.number.complement().equals(handle(T.number.complement()))).to.be["true"];
      expect(T.makeObject({ x: T.number }).equals(handle(T.makeObject({ x: T.number })))).to.be["true"];
      return expect(T.generic(T.string, T.number).equals(handle(T.generic(T.string, T.number)))).to.be["true"];
    });
    return it("Return type", function () {
      expect(T.none.returnType()).to.equal(T.none);
      expect(T.any.returnType()).to.equal(T.any);
      expect(T.string.returnType()).to.equal(T.none);
      expect(T.array.returnType()).to.equal(T.none);
      expect(T.string.array().returnType()).to.equal(T.none);
      expect(T["function"].returnType()).to.equal(T.any);
      expect(T.string["function"]().returnType()).to.equal(T.string);
      expect(T.string["function"]().union(T.number).returnType()).to.equal(T.string);
      expect(T.string["function"]().union(T.number["function"]()).returnType().equals(T.string.union(T.number))).to.be["true"];
      expect(T.stringOrNumber["function"]().returnType()).to.equal(T.stringOrNumber);
      expect(T.string.returnType().complement()).to.equal(T.any);
      expect(T.stringOrNumber.returnType().complement()).to.equal(T.any);
      expect(T.makeObject({ x: T.number }).returnType()).to.equal(T.none);
      return expect(T.generic(T.string, T.number).returnType()).to.equal(T.none);
    });
  });
}.call(this));
