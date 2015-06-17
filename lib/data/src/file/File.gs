import .FileReader

class!
	def _entry = null
	dyn getLastModified() -> @_entry.lastModified
	dyn getLastModifiedDate() -> @_entry.lastModifiedDate
	dyn getName() -> @_entry.name
	dyn getSize() -> @_entry.size
	dyn getType() -> @_entry.type
	
	def constructor(@_entry) ->
	
	def slice() -> @_entry.slice ...arguments
	
	def createReader() -> FileReader @_entry