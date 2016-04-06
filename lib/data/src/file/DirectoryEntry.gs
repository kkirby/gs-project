import .Entry

let checkExistance(entry,name,getter)**
	try
		yield entry[getter](name,{-create,+exclusive})
	catch e
		if e.name in [\NotFoundError,\TypeMismatchError]
			false
		else
			throw e

class! extends Entry
	
	def createReader() -> @_entry.createReader()
		
	def exists(mutable path)**
		if typeof path == \string; path := path.split r'[/]'g
		if path[0] == ''; path.shift()
		let pathItem = path.shift()
		let mutable entry = yield checkExistance @, pathItem, \getDirectory
		if entry != false and path.length > 0
			yield entry.exists path
		else if entry == false and path.length == 0
			entry := yield checkExistance @, pathItem, \getFile
		entry
	
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