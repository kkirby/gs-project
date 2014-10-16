import sys.Component

class! extends Component
	def needsPreload = false
	def localStorage = null
	dyn def data = null
		let afterSet()
			@emitEvent \dataUpdated
	
	def fetch() -> throw 'Fetch unimplemented.'
	
	def initialize()
		superArg()
		@restoreFromLocal()
		if @data == null and @needsPreload
			
	
	def restoreFromLocal()
		let name = @localStorage
		die unless name?
		let localData = localStorage.getItem name
		die unless localData?
		
		let [err,data] =
			try
				[null,JSON.parse localData]
			catch e
				[e]
		die if err?
		@data := data
	
	def updateData()
		async err, data <- @fetch()