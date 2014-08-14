import sys.Component

class! extends Component
	def currentState = null
	def states = null
	def stateHandlers = null
	def currentAction = null
	def currentActionData = null
	
	def initialize(config)
		callSuper initialize
		@states := @getStates()
		@stateHandlers := []
		@currentState := {}
		for key, item ofall @
			if typeof item != \function or key.substr(0,6) != 'state_' or not item.states?
				continue
			@stateHandlers.push item
		_(@):one ready()@
			for key, item of @getInitialStates()
				@transition key, item
	
	def getHandlersForState(allStates,action)
		return for filter handler in @stateHandlers
			handler.action == action and for every state in handler.states
				let [name,subState] = state
				allStates[name]? and allStates[name] == subState
	
	def transition(state,subState,...data)
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
					newEnterHandler.apply @, data
			@emitEvent \transition
	
	def deferUntilTransition(state,subState)
		die unless @currentAction?
		let action = @currentAction
		let actionData = @currentActionData
		let event = #@
			die unless @currentState ownskey state or @currentState[state] != subState
			@removeEventListener \transition, event
			@handle action, ...actionData
		@addEventListener \transition, event
	
	def handle(action,...data)
		let handlers = @getHandlersForState @currentState, action
		let setAction = @currentAction == null
		if setAction
			@currentAction := action
			@currentActionData := data
		@[action]? ...data
		for handler in handlers; handler.apply @, data
		if setAction
			@currentAction := @currentActionData := null
	
	def hasHandler(action) -> @getHandlersForState(@currentState,action).length > 0
	
	def getStates() -> {}
	def getInitialStates() -> {}
	
	def isInState(state,subState) -> @currentState[state] == subState
		
	def saveState()
		currentState: @currentState
	
	def restoreState(savedState)
		if savedState.currentState?
			for k, v of savedState.currentState
				@transition k, v