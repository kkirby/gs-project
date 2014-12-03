class!
	def _entry = null
	dyn getIsFile() -> @_entry.isFile
	dyn getIsDirectory() -> @_entry.isDirectory
	dyn getName() -> @_entry.name
	dyn getFullPath() -> @_entry.fullPath
	dyn getNativeURL() -> @_entry.nativeURL
	def filesystem = null
	@Factory := null
	
	def constructor(@filesystem,@_entry) ->
	
	def getMetadata()
		new Promise #(resolve,reject)@ -> @_entry.getMetadata resolve, reject
	
	def moveTo(parent,newName)
		new Promise #(resolve,reject)@
			@_entry.moveTo(
				parent._entry ? parent
				newName
				#(result) -> resolve Entry.Factory.get(result)
				reject
			)
	
	def copyTo(parent,newName)
		new Promise #(resolve,reject)@
			@_entry.copyTo(
				parent._entry ? parent
				newName
				#(result) -> resolve Entry.Factory.get(result)
				reject
			)
	
	def toInternalURL() -> @_entry.toInternalURL()
	
	def toURL() -> @_entry.toURL()
	
	def remove()
		new Promise #(resolve,reject)@
			@_entry.remove(
				#(deleted)
					if deleted; Entry.Factory.remove @_entry
					resolve deleted
				rejected
			)
	
	def getParent()
		new Promise #(resolve,reject)@
			@_entry.getParent(
				#(entry) -> resolve Entry.Factory.get(entry)
				reject
			)