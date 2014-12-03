import .Entry

class! extends Entry
	@Factory := null
	
	def createWriter()
		new Promise #(resolve,reject)@
			@_entry.createWriter(
				#(writer) -> resolve FileEntry.Factory.get(writer)
				reject
			)
	
	def createReader() -> throw 'FileEntry.createReader is unimplemented.'