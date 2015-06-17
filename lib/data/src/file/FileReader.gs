class!
	def _entry = null
	def _target = null
	def constructor(@_target)
		@_target := new FileReader()
		@_onResult := new Promise #(resolve,reject)@
			$(@):on loadend()@
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
	
	def readAsArrayBuffer() -> @_target.readAsArrayBuffer @_entry
	def readAsBinaryString() -> @_target.readAsBinaryString @_entry
	def readAsDataURL() -> @_target.readAsDataURL @_entry
	def readAsText() -> @_target.readAsText @_entry