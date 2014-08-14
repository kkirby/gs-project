import sys.stateMachine.#

macro $ViewDelegate
	syntax '(',viewController as Identifier,',',logicController as Identifier,superclass as (',',this as Identifier)?,')',body as Body
		superclass ?= @ident \ViewDelegate
		AST
			class! extends $superclass
				def viewController = $viewController
				def logicController = $logicController

class! extends StateMachine
	def viewController = null
	def logicController = null
	
	def constructor(config = {})
		@logicController := @logicController config.logicController
		@viewController := @viewController config.viewController
	