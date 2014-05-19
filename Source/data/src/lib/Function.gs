Function.prototype.wrap := #(newFunc)
	let oldFunc = @
	#
		newFunc.apply @, [oldFunc,...arguments]

Function.prototype.before := #(newFunc)
	let oldFunc = @
	#
		newFunc.apply @, arguments
		oldFunc.apply @, arguments

Function.prototype.after := #(newFunc)
	let oldFunc = @
	#
		let ret = oldFunc.apply @, arguments
		newFunc.apply @, [ret,...arguments]

Function.prototype.defer := #(waitTime)
	let mutable timeout = null
	let oldFunc = @
	#!
		let args = arguments
		if timeout; clearTimeout timeout
		timeout := wait waitTime
			oldFunc.apply @, args

Function.prototype.throttle := #(waitTime)
	let mutable timeout = null
	let mutable result = null
	let oldFunc = @
	#
		unless timeout?
			timeout := wait waitTime
				timeout := result := null
			result := oldFunc.apply @, arguments
		else
			result

Function
				