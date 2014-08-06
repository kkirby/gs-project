import sys.lib.Component

die if typeof module?.exports == \object

class! extends Component
	def request = null
	def contentLength = null
	
	dyn getResponseText() -> @request.responseText
	dyn getStatusCode() -> @request.status
	dyn getResponseHeaders() -> @request.getAllResponseHeaders()
	dyn getReadyStateCode() -> @request.readyState
	
	def setRequestHeader(key,value) -> @request?.setRequestHeader(key,value)
	
	def open(method,uri)
		@request := new GLOBAL.XMLHttpRequest()
			..addEventListener \readystatechange, #()@ -> @emitEvent \readyStateChange
			..addEventListener \progress, #(e)@
				if e.lengthComputable; @contentLength := e.total
				@emitEvent \progress, {
					e.lengthComputable, e.total, e.loaded
				}
			..open method, uri
		@emitEvent \readyStateChange
	
	def send(data)
		@request.send data ? ''
		
		