import sys.Component

die if typeof module?.exports == \object
// TODO: Implement abort to emit an event and tell the caller of failure.
class! extends Component
	def request = null
	def contentLength = null
	def responseType = null
	
	dyn getResponseText() -> @request.responseText
	dyn getResponse() -> @request.response
	dyn getStatusCode() -> @request.status
	dyn getStatusText() -> @request.statusText
	dyn getResponseHeaders() -> @request.getAllResponseHeaders()
	dyn getReadyStateCode() -> @request.readyState
	
	def setRequestHeader(key,value) -> @request?.setRequestHeader(key,value)
	
	def open(method,uri)
		@request := new GLOBAL.XMLHttpRequest()
		@request
			..addEventListener \readystatechange, #()@ -> @emitEvent \readyStateChange
			..addEventListener \progress, #(e)@
				if e.lengthComputable; @contentLength := e.total
				@emitEvent \progress, {
					e.lengthComputable, e.total, e.loaded
				}
			..open method, uri
		@emitEvent \readyStateChange
	
	def send(data)
		if @responseType?
			@request.responseType := @responseType
		@request.send data ? ''
	
	def abort() -> @request.abort()
		