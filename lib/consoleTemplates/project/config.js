var mPath = require('path');
module.exports = {
	alias: {
		base: __dirname,
		root: __dirname,
	},
	dir: {
		html: {
			path: ['src','resource.html'],
			extension: 'html'
		},
		css: {
			path: ['src','resource.css'],
			extension: 'scss'
		}
	},
	html: 'file://'+mPath.join(__dirname,'resource','html','index.html'),
	main: 'main.Main',
	saveRawGs: true,
	saveRawScss: true,
	output: 'file://'+mPath.join(__dirname,'..','buildStage'),
	applicationName: '',
};