import .Entry

class! extends Entry
	
	def createWriter()
		new Promise #(resolve,reject)@
			@_entry.createWriter(
				#(writer)@ -> resolve @_factory.get(writer)
				reject
			)
	
	def resolve()
		new Promise #(resolve,reject)@
			@_entry.file(
				#(file)@ -> resolve @_factory.get(file)
				reject
			)
	
	def createReader()**
		yield (yield @resolve()).createReader()
		
		
			