import .AStateMachine

class! extends AStateMachine
	def currentState = null
	def currentStateName = null
	def states = null
	def initialState = null
	
	def initialize()
		callSuper initialize
		@loadStates()
		$(@):one ready()@
			if @initialState and not @currentState?
				@transition @initialState
	
	def getStates() -> []
	
	def loadStates()
		let states = {}
		let _states = @getStates()
		if is-array! _states
			for state in _states; states[state.displayName] := @readyState.waitFor state(@)
		else if is-object! _states
			for name, state of _states; states[name] := @readyState.waitFor state(@)
		@states := states
	
	def handle(action,...data)
		callSuper handle
		if @currentState?; @currentState._handle action, ...data
	
	def transition(state,...data)
		let stateName = if typeof state == 'function' and state.displayName? then state.displayName else state
		die if stateName == @currentStateName
		die unless @states[stateName]?
			throw 'Invalid state name '&stateName	
		if @currentState?; @currentState.exit()
		@currentState := @states[stateName]
		@currentStateName := stateName
		@currentState.enter(...data)
		@emitEvent \transition
	
	def deferUntilTransition(state)
		die unless @currentState? and @currentState.currentAction?
		let action = @currentState.currentAction
		let actionData = @currentState.currentActionData
		let event = #@
			die if state? and state != @currentStateName
			@removeEventListener \transition, event
			@handle action, ...actionData
		@addEventListener \transition, event
	
	def saveState()
		let savedState = {
			states: {}
		}
		savedState.currentStateName := @currentStateName
		for stateName, state of @states
			savedState.states[stateName] := @states[stateName].saveState()
		savedState
	
	def restoreState(savedState)
		if savedState.currentStateName?
			@transition savedState.currentStateName
		for stateName, state of savedState.states
			@states[stateName].restoreState state