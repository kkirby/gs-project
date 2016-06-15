import sys.Component
import macro sys.webMacros

class! extends Component
	def baseUrlFunc = null
	def initialize(@baseUrlFunc) -> superArg()
	def get() -> @baseUrlFunc()
	
	def nest(method)
		let obj = Object.create @
		let self = @
		obj.get := #()**
			(await self.get()) & '/' & method
		obj