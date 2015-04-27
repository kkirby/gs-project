import sys.lib.Long

class!
	@TagToNumber := #(mutable tag)
		while not (tag.length %% 4); tag.unshift 0
		let length as Number = tag.length
		let numbers = for index as Number in length to 1 by -4
			for reduce byte as Number in tag[index - 4 to index - 1] by -1, previousByte = 0
				(previousByte bitlshift 8) bitor (byte + 256) % 256
			('0000000000'&previousByte biturshift 0).slice -10
		numbers.join ''
	
	@TagToUnsignedInt := #(bytes,little = false)
		let _255 = Long(255)
		let _256 = Long(256)
		let result = Long(0)
		let factor = Long(1)
		for byte in bytes by toggle(little,-1,1)
			result.add(Long(byte).and(_255).multiply(factor))
			factor.multiply(_256)
		result.toString 10
	
	@TagToHexString := #(bytes,trim = false)
		let mutable str = (for mutable byte in bytes
			if byte < 0; byte += 256
			('0' & byte.toString(16)).slice(-2)).join ''
		if trim; str := str.replace(r'^0+','')
		str