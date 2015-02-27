import .$DataProvider

class! extends ApiDataProvider
	def data = null
	def name = null
	
	def initialize(@name)
		superArg()
		@data := []
		@restoreFromLocal()
		_(@):on mutated @@.saveToLocal
	
	
	def addRecord(record)
		@data.push record
		@emitEvent \mutated
	
	def count()** -> @data.length
	def allRecords()** -> @data.concat []
	def delete(record)**
		@data arrayRemoveItem record
		@emitEvent \mutated
	
	def restoreFromLocal()
		try
			@data := JSON.parse(localStorage.getItem(@name)) ? []
		catch e; console.log e
	
	def saveToLocal()
		localStorage.setItem @name, JSON.stringify(@data)
	