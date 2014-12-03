class!
	@Factory := null
	def _directoryReader = null
	dyn getLocalURL() -> @_directoryReader.localURL
	dyn getHasReadEntries() -> @_directoryReader.hasReadEntries
	
	def constructor(@_directoryReader) ->
	
	def readEntries()
		new Promise #(resolve,reject)@
			@_directoryReader.readEntries(
				#(entries)
					return for entry in entries; DirectoryReader.Factory.get entry
				reject
			)
			