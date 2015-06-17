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
	
	def getDirectoryRecursive(mutable path,options)**
		if typeof path == \string; path := path.split r'[\\/]'g
		if path[0] == ''; path.shift()
		for reduce dir in path, current = @
			yield current.getDirectory dir, options
	
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