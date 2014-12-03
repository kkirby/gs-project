import css sys.lib
import macro sys.operators
import macro sys.macros
import .ReadyState

class!
	def eventListeners = null
	def readyState = null
	
	def constructor()
		superArg()
		@eventListeners := {}
		@readyState := ReadyState()
			..whenReady #@ @emitEvent \ready
		@initialize ...arguments
		@readyState.ready()
	
	def onReady() ->
	
	def initialize() ->
	
	/**
	 * Component Methods
	 */
	def emitEventData(eventData)
		if @eventListeners ownskey eventData.event
			for eventListener from @eventListeners[eventData.event].values()
				eventListener eventData
		let methodName = Component.GetEventMethodName eventData.event
		if @[methodName]?; @[methodName] eventData.data
		not eventData.defaultPrevented
	
	def emitEvent(name,data)
		@emitEventData {
			event: name
			context: @
			data: data
			defaultPrevented: false
			preventDefault: # -> @defaultPrevented := true
		}
	
	def addEventListener(name,listener,key)
		(@eventListeners[name] ownsor= %{}).set key ? listener, listener
	
	def removeEventListener(name,key)
		if @eventListeners ownskey name; @eventListeners[name].delete key
	
	@GetEventMethodName := #(mutable event)
		event := event.replace r"\.(\w)"g, #(a,b) -> b.toUpperCase()
		'on'&event.substr(0,1).toUpperCase()&event.substr(1)