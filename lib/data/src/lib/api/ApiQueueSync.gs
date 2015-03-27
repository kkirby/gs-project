import sys.stateMachine.#
import sys.lib.RemoteRequest
import .#Model

// TODO: Update to keep an internal counter of how many times a queue item is tried, and after x amount of tries, forget about it and push it into some sort of failed queue.
class! extends StateMachine
	def acceptableFailStatusCodes = null
	def queueProvider = null
	def urlProvider = null
	def timeout = jsTime(1_min)
	
	def initialize(config = {})
		superArg()
		@model := ApiQueueSyncModel()
		@queueProvider := config.queueProvider
		@urlProvider := config.urlProvider
		@timeout ?=in config
		@acceptableFailStatusCodes := config.acceptableFailStatusCodes ? []
		$(@queueProvider):on! mutated()@**
			@model.queueItemCount := yield @queueProvider.count()
	
	def getStates() -> [\idle,\syncing]
	
	def initialState = \idle
	
	def sync()
		new Promise #(fulfill,reject)@
			if @currentStateName == \idle
				_(@):onOneOf
					success: # -> fulfill()
					failed: #(e) -> reject(e.data)
				@transition \syncing
			else; reject()
	
	defState idle
		def enter()
			setTimeout(
				#@ -> @sync().then(
					# ->
					# ->
				)
				@timeout
			)
	
	defState syncing
		def enter()**
			try
				let table = @queueProvider
				let apiUrl = yield @urlProvider.get()
				for record in yield table.allRecords()
					let {method,uri,data} = record
					try
						let response = JSON.parse yield RemoteRequest().call(method, apiUrl & uri, {}, data)
					catch e
						unless e.statusCode in @acceptableFailStatusCodes; throw e
					yield table.delete record
			catch e; @emitEvent \failed, e
			else; @emitEvent \success
			finally; @transition \idle