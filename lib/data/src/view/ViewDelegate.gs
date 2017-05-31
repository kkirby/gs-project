import sys.stateMachine.#

class! extends StateMachine
	def viewController = null
	def logicController = null
	
	def constructor(config = {})
		@logicController := @logicController config.logicController
		@viewController := @viewController config.viewController
	