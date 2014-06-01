import macro sys.macros
import .ReadyState

class!
	def eventListeners = null
	def readyState = null
	def _bubbleEventsTo = null
	def constructor()
		@eventListeners := {}
		@_bubbleEventsTo := []
		@readyState := ReadyState()
		@readyState.whenReady #@ @emitEvent \ready
		@initialize ...arguments
		@readyState.ready()
	
	def bubbleEventsTo(component)
		@_bubbleEventsTo.push component
	
	def unBubbleEventsTo(component)
		@_bubbleEventsTo arrayRemoveItem component
	
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
		for eventBubbleTo in @_bubbleEventsTo
			if eventBubbleTo.emitEventData?
				eventBubbleTo.emitEventData eventData
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
	
	@MethodInfo := #(mutable method)
		let mutable type = \normal
		if method.indexOf(\before) == 0
			method := method.substr(6)
			type := \before
		else if method.indexOf(\after) == 0
			method := method.substr(5)
			type := \after
		
		{
			name: method.substr(0,1).toLowerCase()&method.substr(1),
			type
		}
		
	let ExtendHelper = #(extendFrom,extendTo)
		for key, value of extendFrom
			if typeof value == 'function'
				let methodInfo = Component.MethodInfo(key)
				if methodInfo.type == \before
					if extendTo[methodInfo.name]?
						let old = extendTo[methodInfo.name]
						extendTo[methodInfo.name] := #
							value.apply(this,arguments)
							old.apply(this,arguments)
					else
						extendTo[methodInfo.name] := value
				else if methodInfo.type == \after
					if extendTo[methodInfo.name]?
						let old = extendTo[methodInfo.name]
						extendTo[methodInfo.name] := #
							let ret = old.apply(this,arguments)
							value.apply(this,arguments)
							ret
					else
						extendTo[methodInfo.name] := value
				else
					extendTo[key] := value
			else
				extendTo[key] := value
	
	@Extend := #(extendFrom,extendTo)
		ExtendHelper(extendFrom.prototype,extendTo.prototype)
		ExtendHelper(extendFrom,extendTo)
	
	@GetEventMethodName := #(mutable event)
		event := event.replace r"\.(\w)"g, #(a,b) -> b.toUpperCase()
		'on'&event.substr(0,1).toUpperCase()&event.substr(1)