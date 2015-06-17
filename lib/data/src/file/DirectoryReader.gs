class!
	def _directoryReader = null
	dyn getLocalURL() -> @_directoryReader.localURL
	dyn getHasReadEntries() -> @_directoryReader.hasReadEntries
	def _factory = null
	
	def constructor(@_directoryReader,@_factory) ->
	
	def readEntries()
		new Promise #(resolve,reject)@
			@_directoryReader.readEntries(
				#(entries)
					return for entry in entries; @_factory.get entry
				reject
			)
			