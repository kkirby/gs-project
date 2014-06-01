import sys.lib.Component

class! extends Component
	def currentAction = null
	def currentActionData = null
	def stateMachine = null
		
	dyn getView() -> @stateMachine.view
	dyn getNode() -> @stateMachine.node	
	
	def initialize(@stateMachine)
		callSuper initialize
		if @view?; @readyState.waitFor @view
		@setup()
	
	def setup() ->
	def enter() ->
	def exit() ->
	def catchAll() ->
	
	def handle(action,...data) -> @stateMachine.handle action, ...data
	def transition(state,...data) -> @stateMachine.transition state, ...data

	def proxyViewEvent() -> @stateMachine.proxyViewEvent ...arguments
	
	def deferUntilTransition() -> @stateMachine.deferUntilTransition ...arguments

	def _handle(action,...data)
		let setCurrentAction = not @currentAction?
		if setCurrentAction
			@currentAction := action
			@currentActionData := data
		let ret = if @[action]?
			@[action] ...data 
		else
			@catchAll ...data 
		if setCurrentAction
			@currentAction := null
			@currentActionData := null
		ret
	
	def saveState() -> {}
	def restoreState() ->