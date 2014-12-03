import sys.stateMachine.#

macro $ViewController
	syntax '(',view as Identifier,superclass as (',',this as Identifier)?,')',body as Body?
		superclass ?= AST null
		AST
			class! extends ViewController<$superclass>
				def view = $view
				$body

class! <ParentClass> extends (ParentClass ? StateMachine)
	def view = null
	
	def initialize()
		superArg()
		@view := @view()
		