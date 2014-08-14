import sys.stateMachine.#

macro $ViewController
	syntax '(',view as Identifier,superclass as (',',this as Identifier)?,')',body as Body?
		superclass ?= @ident \ViewController
		AST
			class! extends ViewController
				def view = $view
				$body

class! extends StateMachine
	def view = null
	
	def initialize()
		superArg()
		@view := @view()
		