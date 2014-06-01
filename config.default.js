var mPath = require('path');

module.exports = {
	alias: {
		sys: mPath.normalize(mPath.join(__dirname,'lib','data'))
	},
	dir: {
		src: {
			path: 'src',
			extension: 'gs'
		},
		js: {
			path: 'resource.js',
			extension: 'js'
		},
		css: {
			path: 'resource.css',
			extension: 'scss'
		},
		macro: {
			path: 'resource.macro',
			extension: 'gs'
		},
		html: {
			path: 'resource.html',
			extension: 'html'
		},
		image: {
			path: 'resource.img',
			extension: 'png'
		},
		raw: {
			path: 'resource.raw'
		}
	},
	output: 'root.build',
	main: 'Main',
	applicationName: 'My Application',
	html: '<!DOCTYPE html><html><head><title/></head><body></body></html>'
};