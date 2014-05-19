class InlineConcurrentStateMachine
	def currentState = null
	def initialState = null
	def states = null
	def stateHandlers = null
	def currentAction = null
	def currentActionData = null
	
	def constructor()
		@states := @getStates()
		@stateHandlers := []
		@currentState := {}
		for key, item ofall @
			if typeof item != \function or key.substr(0,6) != 'state_' or not item.states?
				continue
			@stateHandlers.push item
	
	def getHandlersForState(allStates,action)
		return for filter handler in @stateHandlers
			handler.action == action and for every state in handler.states
				let [name,subState] = state
				allStates[name]? and allStates[name] == subState
	
	def transition(state,subState)
		if @states[state]? and subState in @states[state]
			let currentState = {} <<< @currentState
			let oldExitHandlers = @getHandlersForState currentState, \exit
			let oldEnterHandlers = @getHandlersForState currentState, \enter
			currentState[state] := subState
			let newExitHandlers = @getHandlersForState currentState, \exit
			let newEnterHandlers = @getHandlersForState currentState, \enter
			for oldExitHandler in oldExitHandlers
				if oldExitHandler not in newExitHandlers
					oldExitHandler.apply @
			@currentState[state] := subState
			for newEnterHandler in newEnterHandlers
				if newEnterHandler not in oldEnterHandlers
					newEnterHandler.apply @
	
	def handle(action,...data)
		let handlers = for filter handler in @stateHandlers
			for every state in handler.states
				let [name,subState] = state
				@currentState[name]? and @currentState[name] == subState
		for handler in handlers; handler.apply @, data
	
	def getStates() -> {}