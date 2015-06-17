import .Entry

class! extends Entry
	
	def createReader() -> @_entry.createReader()

	def getDirectory(path,options) -> new Promise #(resolve,reject)@
		@_entry.getDirectory(
			path
			options
			#(entry)@ -> resolve @_factory.get(entry)
			reject
		)
	
	
	def removeRecursively() ->new Promise #(resolve,reject)@
		@_entry.removeRecursively(
			#(deleted)@
				if deleted?; @_factory.remove @_entry
				resolve deleted
			reject	
		)
	
	def getFile(path,options) -> new Promise #(resolve,reject)@
		@_entry.getFile(
			path
			options
			#(entry)@ -> resolve @_factory.get(entry)
			reject
		)