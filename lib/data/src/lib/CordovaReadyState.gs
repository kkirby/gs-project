import sys.ReadyState

class! extends ReadyState
	def constructor()
		superArg()
		if cordova?
			@wait()
			document.addEventListener \deviceready, #()@ -> @ready()
		@ready()

class!()