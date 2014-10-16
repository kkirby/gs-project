import sys.Component
import .Payload
import sys.lib.Long

class! extends Component
	def id = null
	def type = null
	def payloads = null
	
	def initialize(config)
		@id ?=in config
		@type ?=in config
		@payloads := 
			if config.ndefMessage?
				for element in config.ndefMessage
					Payload element
			else; []
	
	def getIdAsNumber()
		let length as Number = @id.length
		unless length %% 4
			throw 'The tag id must be a byte array of 4 byte parts.'
		let numbers = for index as Number in length to 1 by -4
			for reduce _byte as Number in @id[index - 4 to index - 1] by -1, previousByte = 0
				(previousByte bitlshift 8) bitor (_byte + 256) % 256
			('0000000000'&previousByte biturshift 0).slice -10
		numbers.join ''
	
	def getIdAsUnsignedInt()
		let _255 = Long(255)
		let _256 = Long(256)
		let result = Long(0)
		let factor = Long(1)
		for _byte in @id
			result.add(Long(_byte).and(_255).multiply(factor))
			factor.multiply(_256)
		result.toString 10