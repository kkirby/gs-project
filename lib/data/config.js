var sprintf = require('sprintf').sprintf;
module.exports = {
	alias: {
		root: __dirname
	}/*,
	dir: {
		image: {
			path: 'resource.img',
			extension: 'png'
		}
	}*/,
	html: sprintf('file://%s/resource/html/index.html',__dirname),
	main: 'main'
};