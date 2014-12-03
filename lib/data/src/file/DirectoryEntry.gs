import .Entry

class! extends Entry
	@Factory := null
	
	def createReader() -> @_entry.createReader()

	def getDirectory(path,options)
		new Promise #(resolve,reject)@
			@_entry.getDirectory(
				path
				options
				#(entry) -> resolve DirectoryEntry.Factory.get(entry)
				reject
			)
	
	def removeRecursively()
		new Promise #(resolve,reject)@
			@_entry.removeRecursively(
				#(deleted)
					if deleted?; DirectoryEntry.Factory.remove @_entry
					resolve deleted
				reject	
			)
	
	def getFile(path,options)
		new Promise #(resolve,reject)@
			@_entry.getFile(
				path
				options
				#(entry) -> resolve DirectoryEntry.Factory.get(entry)
				reject
			)