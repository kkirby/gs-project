var jpegEncoderPath = __import(raw,sys.jpegEncoder.js);
var hardWorkerPath = __import(raw,sys.HardWorker.js);
importScripts(jpegEncoderPath,hardWorkerPath);

(function(){
	var worker = new HardWorker({
		encode: function(data,quality,raw){
			var res = JPEGEncoder(data,quality,raw);
			setTimeout(function(){
				close();
			},100);
			return res;
		}
	});
})();