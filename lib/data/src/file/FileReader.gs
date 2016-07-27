class!
	def _entry = null
	def _target = null
	def constructor(@_entry)
		@_target := new GLOBAL.FileReader()
		@_onResult := new Promise #(resolve,reject)@
			@_target.onloadend := #@
				if @error?; reject @error
				else; resolve @result
	dyn bind onabort -> @_target.onabort
	dyn bind onerror -> @_target.onerror
	dyn bind onload -> @_target.onload
	dyn bind onloadend -> @_target.onloadend
	dyn bind onloadstart -> @_target.onloadstart
	dyn bind onprogress -> @_target.onprogress
	dyn getReadyState() -> @_target.readyState
	dyn getResult() -> @_target.result
	dyn getError() -> @_target.error
	
	def readAsArrayBuffer()
		@_target.readAsArrayBuffer @_entry
		@_onResult
	
	def readAsBinaryString()
		@_target.readAsBinaryString @_entry
		@_onResult
		
	def readAsDataURL()
		@_target.readAsDataURL @_entry
		@_onResult
		
	def readAsText()
		@_target.readAsText @_entry
		@_onResult