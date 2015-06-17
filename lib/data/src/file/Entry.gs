class!
	def _entry = null
	dyn getIsFile() -> @_entry.isFile
	dyn getIsDirectory() -> @_entry.isDirectory
	dyn getName() -> @_entry.name
	dyn getFullPath() -> @_entry.fullPath
	dyn getNativeURL() -> @_entry.nativeURL
	def filesystem = null
	def _factory = null
	
	def constructor(@filesystem,@_entry,@_factory) ->
	
	def getMetadata()
		new Promise #(resolve,reject)@ -> @_entry.getMetadata resolve, reject
	
	def moveTo(parent,newName)
		new Promise #(resolve,reject)@
			@_entry.moveTo(
				parent._entry ? parent
				newName
				#(result) -> resolve @_factory.get(result)
				reject
			)
	
	def copyTo(parent,newName)
		new Promise #(resolve,reject)@
			@_entry.copyTo(
				parent._entry ? parent
				newName
				#(result) -> resolve @_factory.get(result)
				reject
			)
	
	def toInternalURL() -> @_entry.toInternalURL?() ? @fullPath
	
	def toURL() -> @_entry.toURL?() ? @fullPath
	
	def remove()
		new Promise #(resolve,reject)@
			@_entry.remove(
				#(deleted)@
					if deleted; @_factory.remove @_entry
					resolve deleted
				reject
			)
	
	def getParent()
		new Promise #(resolve,reject)@
			@_entry.getParent(
				#(entry) -> resolve @_factory.get(entry)
				reject
			)