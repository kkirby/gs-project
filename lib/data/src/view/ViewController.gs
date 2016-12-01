import sys.stateMachine.#

class! <ParentClass> extends (ParentClass ? StateMachine)
	def view = null
	
	def initialize()
		superArg()
		@view := @view()
		