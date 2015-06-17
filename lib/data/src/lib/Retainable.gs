class!
	def _retainCount = 0
	
	def retain()
		@_retainCount += 1
		if @_retainCount == 1; @alloc()
	
	def release()
		@_retainCount -= 1
		if @_retainCount == 0; @dealloc()
	
	@extend := #(parent)
		let obj = @prototype
		parent.prototype
			..retain := obj.retain
			..release := obj.release
			.._retainCount := obj._retainCount