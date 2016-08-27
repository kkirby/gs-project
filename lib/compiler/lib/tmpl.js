var tmpl = require("blueimp-tmpl");
tmpl.regexp = /([\s'\\])(?!(?:[^<]|<(?!%))*%>)|(?:<%(=|#)([\s\S]+?)%>)|(<%)|(%>)/g;

var helperScope = [];

global.TMPL_HELPER_SCOPE = helperScope;

module.exports = function(content,data,helpers){
	helpers = helpers || {};
	var helpersString = Object.getOwnPropertyNames(helpers).reduce(function(previous,current){
		return previous + ',' + current + '=' + 'function(){ return global.TMPL_HELPER_SCOPE[TMPL_HELPER_SCOPE.length - 1][\'' + current + '\'].apply(this,arguments); }';
	},'');
	helperScope.push(helpers);
	var oldHelpers = tmpl.helper;
	tmpl.helper += helpersString;
	var result = tmpl(
		content,
		data
	);
	tmpl.helper = oldHelpers;
	helperScope.pop();
	return result;
}