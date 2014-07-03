class!
	def _readyState = 1
	def waiters = null
	dyn getIsReady() -> @_readyState == 0 
	
	def constructor()
		@waiters := []
	
	def wait(waitFor)
		@_readyState += 1
		if waitFor?
			let readyState = if waitFor instanceof ReadyState; waitFor
			else if waitFor.readyState instanceof ReadyState; waitFor.readyState
			readyState.whenReady #@! @ready()
		waitFor
	
	def waitFor(waitFor) -> @wait waitFor

	def ready()!
		if (@_readyState -= 1) == 0
			for waiter in @waiters; waiter()
			@waiters := []
	
	def whenReady(cb)
		if @_readyState == 0; cb()
		else; @waiters.push cb
	