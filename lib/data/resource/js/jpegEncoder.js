JPEGEncoder = (function(){
	__import(js,sys.HardWorker);
	
	var JpegEncoderWorker = HardWorker.Extend(
		__import(raw,sys.jpegEncoderWorker.js),
		'encode'
	);
	
	return function(data,quality,raw){
		return new JpegEncoderWorker().encode(data,quality,raw);
	};
})();