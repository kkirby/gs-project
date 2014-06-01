import sys.lib.Long

class!
	@TagToNumber := #(mutable tag)
		let length as Number = tag.length
		unless length %% 4
			throw 'The tag id must be a byte array of 4 byte parts.'
		let numbers = for index as Number in length to 1 by -4
			for reduce byte as Number in tag[index - 4 to index - 1] by -1, previousByte = 0
				(previousByte bitlshift 8) bitor (byte + 256) % 256
			('0000000000'&previousByte biturshift 0).slice -10
		numbers.join ''
	
	@TagToUnsignedInteger := #(bytes)
		let _255 = Long(255)
		let _256 = Long(256)
		let result = Long(0)
		let factor = Long(1)
		for byte in bytes
			result.add(Long(byte).and(_255).multiply(factor))
			factor.multiply(_256)
		result.toString 10