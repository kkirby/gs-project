import sys.Component

class! extends Component
	
	let Tnfs = {
		0x00: 'Empty'
		0x01: 'Well Known'
		0x02: 'Mime Media'
		0x03: 'Absolute URI'
		0x04: 'External'
		0x05: 'Unknown'
		0x06: 'Unchanged'
		0x07: 'Reserved'
	}
	
	let BytesToString(_bytes = [])
		for reduce _byte in _bytes, str = ''
			str & String.fromCharCode _byte
	
	def idStr = null
	def tnfStr = null
	def typeStr = null
	def data = null
	
	dyn def attr: id = null
		let afterSet(id) -> @idStr := BytesToString id
			
	dyn def attr: tnf = null
		let afterSet(tnf) -> @tnfStr := Tnfs[tnf]
	
	dyn def attr: type = null
		let afterSet(type) -> @typeStr := BytestoString type
	
	def data = null
	
	def initialize(config = {})
		@id ?=in config
		@tnf ?=in config
		@type ?=in config
		if config.payload?
			@data := if @typeStr == \T
				let length = config.payload.shift()
				BytesToString config.payload[length + 1 to -1]
			else
				BytesToString config.payload
