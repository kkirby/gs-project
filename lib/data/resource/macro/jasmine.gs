macro describe
	syntax description as Expression, body as Body
		let func = ASTE #! -> $body
		__call(
			null,
			__symbol(null,\ident,\describe),
			__wrap(description),
			__wrap(func)
		)

macro it
	syntax cb as ('(',this as Identifier,')')?, description as Expression, body as Body
		let func = if cb?
			ASTE #($cb)! -> $body
		else
			ASTE #! -> $body
		__call(
			null,
			__symbol(null,\ident,\it),
			__wrap(description),
			__wrap(func)
		)
		
macro xit
	syntax cb as ('(',this as Identifier,')')?, description as Expression, body as Body
		let func = if cb?
			ASTE #($cb)! -> $body
		else
			ASTE #! -> $body
		__call(
			null,
			__symbol(null,\ident,\xit),
			__wrap(description),
			__wrap(func)
		)

macro beforeEach
	syntax cb as ('(',this as Identifier,')')?, body as Body
		let func = if cb?
			ASTE #($cb)! -> $body
		else
			ASTE #! -> $body
		__call(
			null,
			__symbol(null,\ident,\beforeEach),
			__wrap(func)
		)

macro afterEach
	syntax cb as ('(',this as Identifier,')')?, body as Body
		let func = if cb?
			ASTE #($cb)! -> $body
		else
			ASTE #! -> $body
		__call(
			null,
			__symbol(null,\ident,\afterEach),
			__wrap(func)
		)