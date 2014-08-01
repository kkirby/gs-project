import .AStateMachine

class! extends AStateMachine
	def currentStateName = null
	def initialState = null
	def states = null
	def currentAction = null
	def currentActionData = null
	
	def initialize()
		callSuper initialize
		@states := @getStates()
		$(@):one ready()@
			if @initialState and not @currentStateName?
				@transition @initialState
	
	def getStates() -> []
	
	def handle(action,...data)
		callSuper handle
		unless @currentStateName?
			if typeof @catchAll == \function; @catchAll action, ...data
			return
		// This may need to be optimized, eg, no for loop.
		let handlerName = for first handlerName in [action,\catchAll]
			let _handlerName = "state_$(@currentStateName)_$(handlerName)"
			if typeof @[_handlerName] == 'function'; _handlerName
		die unless handlerName?
		let setCurrentAction = not @currentAction?
		if setCurrentAction
			@currentAction := action
			@currentActionData := data
		@[handlerName](...data)
		if setCurrentAction
			@currentAction := @currentActionData := null
				
	def transition(stateName,...data)
		die if stateName == @currentStateName
		die unless stateName in @states
			throw 'Invalid state name '&stateName
		if @currentStateName?; @handle \exit, ...data
		@currentStateName := stateName
		@handle \enter, ...data
		@emitEvent \transition
	
	def deferUntilTransition(state)
		die unless @currentStateName? and @currentAction?
		let action = @currentAction
		let actionData = @currentActionData
		let event = #@
			die if state? and state != @currentStateName
			@removeEventListener \transition, event
			@handle action, ...actionData
		@addEventListener \transition, event
	
	def saveState()
		{@currentStateName}
	
	def restoreState(savedState)
		if savedState.currentStateName?
			@transition savedState.currentStateName