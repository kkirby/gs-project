macro $ViewDelegate
	syntax '(',viewController as Identifier,',',logicController as Identifier,superclass as (',',this as Identifier)?,')',body as Body
		superclass ?= @ident \ViewDelegate
		AST
			class! extends $superclass
				def viewController = $viewController
				def logicController = $logicController