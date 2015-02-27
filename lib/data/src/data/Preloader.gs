import js sys.font

class!
	def typesMap = {
		image:
			* \png
			* \jpeg
			* \jpeg
			* \gif
		video:
			* '3g2'
			* '3gp'
			* \avi
			* \m4v
			* \mov
			* \mp4
			* \mpg
			* \rm
			* \wmv
		audio:
			* \aif
			* \m4a
			* \mid
			* \midi
			* \mp3
			* \mpa
			* \wav
			* \wma
		font:
			* \otf
			* \ttf
	}
	
	def constructor()
		let typesByExtension = {}
		for type, extensions of @typesMap
			for extension in extensions
				typesByExtension[extension] := type
		@typesByExtension := typesByExtension
	
	def PreloadLocalAssets(progress,cb)
		@Preload GsLoadableFiles, progress, cb
	
	def Preload(files,progress = # ->,cb = # ->)
		let mutable loaded = 0
		progress files.length
		asyncfor(10) err <- next, file in files
			async err <- @preloadFile file
			unless err?; loaded += 1
			progress files.length, loaded
			next err
		cb err
			
	def getFileExtension(file) -> file.substr file.lastIndexOf('.') + 1
	
	def getFileType(file) -> @typesByExtension[@getFileExtension(file)]
	
	def preloadFile(file,cb)
		let type = @getFileType file
		if type == \image; @loadImage file, cb
		else if type == \video; @loadVideo file, cb
		else if type == \audio; @loadAudio file, cb
		else if type == \font; @loadFont file, cb
		else; cb()
	
	def loadImage(img,cb)
		(if Image? then new Image() else document.createElement \img)
			..onload := # -> cb()
			..onerror := # -> cb 'Unable to load image "'&img&'"'
			..src := img
	
	def loadVideo(video,cb)
		let xhr = new XMLHttpRequest()
			..open \GET, video, true
			..responseType := \arraybuffer
			..onload := #(evt)
				if xhr.response; cb()
				else; cb 'Unable to load video "'&video&'"'
			..onerror := #(ect)
				cb 'Unable to load video "'&video&'"'
			..send(null)
		
	def loadAudio(audio,cb)
		let xhr = new XMLHttpRequest()
			..open \GET, audio, true
			..responseType := \arraybuffer
			..onload := #(evt)
				if xhr.response; cb()
				else; cb 'Unable to load audio "'&audio&'"'
			..onerror := #(ect)
				cb 'Unable to load audio "'&audio&'"'
			..send(null)
	
	def loadFont(font,cb)
		die if font.indexOf(\glyphicons) > -1 then cb()
		new Font()
			..onload := # -> cb()
			..onerror := # -> cb 'Unable to load font "'&font&'"'
			..src := font

class!()