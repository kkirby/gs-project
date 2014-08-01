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
	syntax description as Expression, body as Body
		let func = ASTE #! -> $body
		__call(
			null,
			__symbol(null,\ident,\it),
			__wrap(description),
			__wrap(func)
		)

macro beforeEach
	syntax body as Body
		let func = ASTE #! -> $body
		__call(
			null,
			__symbol(null,\ident,\beforeEach),
			__wrap(func)
		)

macro afterEach
	syntax body as Body
		let func = ASTE #! -> $body
		__call(
			null,
			__symbol(null,\ident,\afterEach),
			__wrap(func)
		)