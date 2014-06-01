import .AStateMachine

class! extends AStateMachine
	def stateMachines = null
	def getStateMachines() -> []
	
	def initialize(config)
		callSuper initialize
		@loadStateMachines(config)
	
	def loadStateMachines(config)
		@stateMachines := {}
		let stateMachines = @getStateMachines()
		let props = (view: @view) <<< config
		if is-array! stateMachine
			for stateMachine in stateMachines
				@stateMachines[stateMachine.displayName] := stateMachine props
		else
			for key, stateMachine of stateMachines
				@stateMachines[key] := stateMachine props
	
	def handle(action,...data)
		callSuper handle
		for name, stateMachine of @stateMachines; stateMachine.handle action, ...data
	
	def saveState()
		let savedState = {
			stateMachines: {}
		}
		for stateMachineName, stateMachine of @stateMachines
			savedState.stateMachines[stateMachineName] := stateMachine.saveState()
		savedState
	
	def restoreState(savedState)
		for stateMachineName, stateMachineState of savedState.stateMachines
			@stateMachines[stateMachineName].restoreState stateMachineState
		