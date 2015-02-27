import sys.stateMachine.#
import sys.lib.RemoteRequest
import .#Model

class! extends StateMachine
	def timeout = jsTime(1_min)
	def initialize(@config = {})
		superArg()
		@model := ApiQueueSyncModel()
		$(@config.queueProvider):on! mutated()@**
			@model.queueItemCount := yield @config.queueProvider.count()
	
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
				let table = @config.queueProvider
				let apiUrl = yield @config.urlProvider.get()
				for record in yield table.allRecords()
					let {method,uri,data} = record
					let response = JSON.parse yield RemoteRequest().call(method, apiUrl & '/' & uri, {}, data)
					yield table.delete record
			catch e; @emitEvent \failed, e
			else; @emitEvent \success
			finally; @transition \idle