macro $View
	syntax '(',node as Expression,superclass as (',',this as Identifier)?,')',body as Body?
		superclass ?= @ident \View
		AST
			class! extends $superclass
				def node = $node
				$body