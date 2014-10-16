import .StateMachineConcurrent
import macro sys.webMacros

// This class is kept for legacy purposes.

class! extends StateMachineConcurrent
	def view = null
	dyn getNode() -> @view.node
	
	def initialize(config = {})
		superArg()
		@view ?=in config
		@view and= @readyState.waitFor if typeof @view == 'function' then @view() else @view
		if @view and not @node.classList.contains \StateMachineScope
			@node.classList.add \StateMachineScope
			@node.stateMachine := @
		@setup ...arguments
	
	def setup() ->

	def proxyViewEvent(selector,eventName,handler = eventName)
		let _handler = toggle(
			typeof handler == \function,
			handler,
			#(e)@ -> @handle handler, e
		)
		_(@node):on($eventName):(e)
			if selector?
				if e.target.matches selector
					_handler e
			else
				_handler e

