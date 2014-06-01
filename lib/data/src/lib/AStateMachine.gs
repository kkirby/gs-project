import sys.lib.Component

class! extends Component
	def view = null
	dyn getNode() -> @view.node
	
	def initialize(config = {})
		callSuper initialize
		@view ?=in config
		@view and= @readyState.waitFor if typeof @view == 'function' then @view() else @view
		if @view and not @node.classList.contains \StateMachineScope
			$(@node):addClass \StateMachineScope
			@node.stateMachine := @
		@setup ...arguments
	
	def setup() ->

	def proxyViewEvent(selector,eventName,handler = eventName)
		let _handler = toggle(
			typeof handler == \function,
			handler,
			#(e)@ -> @handle handler, e
		)
		$(@node):on($eventName):(e)
			if selector?
				$(e.target):is selector
					_handler e
			else
				_handler e
				
	def handle(action,...data)
		if @[action]?
			@[action] ...data
	
	def saveState() ->
	def restoreState() ->