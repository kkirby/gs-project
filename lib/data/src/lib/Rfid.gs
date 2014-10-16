import sys.Component
import .#.Tag

class! extends Component
	def initialize()
		$(document):on deviceready()@
			async err <- asyncWrap nfc.addTagDiscoveredListener @@.tagScanned
			throw? err
		GLOBAL.Rfid := @
	
	def mock(inputId)
		let id = [inputId,null,null,null,null,null,null,null]
		for index in 0 til id.length
			let mutable val = id[index] ? 0
			for i in 0 til index
				val := (id[i] bitlshift (index * i)) + (val bitlshift (index * val))
			id[index] := val
			for i in index to 0 by -1
				id[i] := (id[i] bitlshift (index * i)) + (val bitlshift (index * val))
		for index in 0 til id.length
			id[index] := ||id[index] % 255
		@tagScanned {
			tag: {
				id,
				type: \ndef
			}
		}
	
	def tagScanned(e)!
		@emitEvent \tag, Tag(e.tag)

class!()