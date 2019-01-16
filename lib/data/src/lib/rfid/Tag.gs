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
	
	def getIdAsNumber(padToTen = true,fourByteBigEndian = false,leftTrim = false) -> Decoder.TagToNumber @id, padToTen, fourByteBigEndian, leftTrim
	def getIdAsUnsignedInt(little,castToUnsignedChar = false) -> Decoder.TagToUnsignedInt @id, little, castToUnsignedChar
	def getIdAsHexString(trim) -> Decoder.TagToHexString @id, trim