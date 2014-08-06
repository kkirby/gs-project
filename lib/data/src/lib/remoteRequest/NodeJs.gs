import sys.lib.Component

die if typeof module?.exports != \object

let [http,url] = [require(\http),require(\url)]

class! extends Component
	def request = null
	def responseText = null
	def statusCode = null
	def responseHeaders = null
	def contentLength = null
	def readyStateCode = 0
	
	def setRequestHeader(key,value) -> @request?.setHeader(key,value)
	
	def open(method,uri)
		let {hostname,pathname,protocol,query} = url.parse(uri)
		@request := http.request(
			{
				method,
				hostname,
				host: hostname
				path: toggle(query?,pathname&'?'&query,pathname)
				port: toggle(protocol == 'https:',443,80)
				agent: false
			}
		)
			..on \response, #(response)@
				@statusCode := response.statusCode
				@responseHeaders := response.headers
				@contentLength := for first key, value of @responseHeaders
					if key.toLowerCase() == 'content-length'; parseInt value, 10
				@readyStateCode := 2
				@emitEvent \readyStateChange
				response
					..on \end, #()@
						@readyStateCode := 4
						@emitEvent \readyStateChange
					..on \data, #(chunk)@
						@responseText ?= ''
						@responseText &= chunk.toString()
						@readyStateCode := 3
						@emitEvent \readyStateChange
						@emitEvent \progress, {
							lengthComputable: @contentLength?
							total: @contentLength
							loaded: @responseText.length
						}
		@readyStateCode := 1
		@emitEvent \readyStateChange
	
	def send(data)
		if data?; @setRequestHeader 'Content-Length', data.length
		@request.end data ? '', \utf8
		
		