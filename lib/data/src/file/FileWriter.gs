import sys.Component
import sys.lib.Function

class! extends Component
	def _fileWriter = null
		
	dyn getFileName() -> @_fileWriter.fileName
	dyn getLength() -> @_fileWriter.length
	dyn getPosition() -> @_fileWriter.position
	dyn getReadyState() -> @_fileWriter.readyState
	dyn getResult() -> @_fileWriter.result
	dyn getError() -> @_fileWriter.error
	
	@INIT := 0
	@WRITING := 1
	@DONE := 2
		
	def constructor(@_fileWriter)
		@eventListeners := {}
		@_fileWriter.onwritestart := #(evt)@ -> @emitEvent \writeStart, evt
		@_fileWriter.onprogress := #(evt)@ -> @emitEvent \progress, evt
		@_fileWriter.onwrite := #(evt)@ -> @emitEvent \write, evt
		@_fileWriter.onwriteend := #(evt)@ -> @emitEvent \writeEnd, evt
		@_fileWriter.onabort := #(evt)@ -> @emitEvent \abort, evt
		@_fileWriter.onerror := #(evt)@ -> @emitEvent \error, evt
	
	def write(data)
		new Promise #(resolve,reject)@
			let removeEventListeners()@
				@removeEventListener resolve
				@removeEventListener reject
			@addEventListener(
				\writeEnd
				resolve.before removeEventListeners
				resolve
			)
			@addEventListener(
				\error
				reject.before removeEventListeners
				reject
			)
			@_fileWriter.write data
	
	def seek(offset) -> @_fileWriter.seek offset
	def truncate(size) -> @_fileWriter.truncate size