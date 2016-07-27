import sys.Component
import .#.Browser
import .#.NodeJs
import .CustomError

let root = Browser ? NodeJs
class! extends root
	@Error := CustomError class RemoteRequestError
		def statusCode = 0
		def statusText = null
		def constructor(@statusCode,@statusText,@response)
			if @statusCode == 0
				@statusText := 'No internet connection, or the server isn\'t responding.'
			@statusText or= 'Unknown Error'
			super @statusText & ' (' & @statusCode & ')'
			
	def call(method,uri,headers = {},mutable userData = null,@responseType = null)
		new Promise #(resolve,reject)@
			_(@):on readyStateChange()@
				if @readyStateCode == 4
					let statusCode = int!@statusCode
					if statusCode >= 200 and statusCode < 300
						resolve @response ? @responseText
					else
						reject RemoteRequest.Error(@statusCode,(if @statusText?.length > 0 then @statusText else null),@response ? @responseText)
			@open method, uri
			if typeof! userData == \Object
				if headers not ownskey 'Content-Type'
					headers['Content-Type'] := 'application/json'
				userData := JSON.stringify userData
			for key, value of headers; @setRequestHeader key, value
			@send(
				if userData?; userData
			)