import .Entry

class! extends Entry
	
	def createWriter()
		new Promise #(resolve,reject)@
			@_entry.createWriter(
				#(writer)@ -> resolve @_factory.get(writer)
				reject
			)
	
	def createReader() -> throw 'FileEntry.createReader is unimplemented.'