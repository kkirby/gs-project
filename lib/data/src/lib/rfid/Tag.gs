import sys.Component
import .Payload
import .Decoder

class! extends Component
	def id = null
	def type = null
	def payloads = null
	
	def initialize(config)
		@id ?=in config
		@type ?=in config
		@payloads := config.ndefMessage?.map(Payload) ? []
	
	def getIdAsNumber(padToTen = true,fourByteBigEndian = false) -> Decoder.TagToNumber @id, padToTen, fourByteBigEndian
	def getIdAsUnsignedInt(little) -> Decoder.TagToUnsignedInt @id, little
	def getIdAsHexString(trim) -> Decoder.TagToHexString @id, trim