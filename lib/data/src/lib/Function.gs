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

Function.prototype.deferLatest := #(waitTime)
	let mutable timeout = null
	let oldFunc = @
	let mutable args = null
	#!
		args := arguments
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

Function.prototype.decontext := #()
	let oldFunc = @
	# -> setTimeout (# -> oldFunc.apply(@,arguments)), 0

Function.prototype.worker := #()
	let oldFunc = @
	let oldFuncStr = oldFunc.toString()
	let workerBody = """
		onmessage = function(event){
			try {
				postMessage([null,($(oldFuncStr)).apply(null,event.data)])
			}
			catch(e){
				postMessage([String(e),null])
			}
			self.close();
		}
		"""
	let blob = new Blob(
		[workerBody]
		type: 'text/javascript'
	)
	#()
		let args = Array.prototype.slice.apply arguments
		new Promise #(resolve,reject)
			let worker = new Worker(URL.createObjectURL(blob))
			worker.onmessage := #(e)
				if e.data[0] == null; resolve e.data[1]
				else; reject e.data[0]
			worker.postMessage(args)

Function
				