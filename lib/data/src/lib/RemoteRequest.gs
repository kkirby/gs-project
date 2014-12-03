import sys.Component
import .#.Browser
import .#.NodeJs

let root = Browser ? NodeJs
class! extends root
	def call(method,uri,headers = {},mutable userData = null)
		new Promise #(resolve,reject)@
			_(@):on readyStateChange()@
				if @readyStateCode == 4
					let statusCode = int!@statusCode
					if statusCode >= 200 and statusCode < 300
						resolve @responseText
					else
						reject @statusText
			@open method, uri
			if typeof! userData == \Object
				if headers not ownskey 'Content-Type'
					headers['Content-Type'] := 'application/json'
				userData := JSON.stringify userData
			for key, value of headers; @setRequestHeader key, value
			@send(
				if userData?; userData
			)
			