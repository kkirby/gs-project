let CPromise(func)
	let promise = new Promise(func)
	promise <<< CPromise.prototype
	promise.then(
		# -> promise._status := \fulfilled
		# -> promise._status := \rejected
	)
	promise
	
CPromise.Defer := #(timeout,value,shouldReject)
	new Promise #(fulfill,reject)
		setTimeout(
			#
				if shouldReject; reject value
				else; fulfill value
			timeout
		)

CPromise.prototype := {
	_status: null
	isFulfilled: # -> @_status == \fulfulled
	isRejected: # -> @_status == \rejected
	isPending: # -> @_status == null
	isDone: # -> not @isPending()
	rejectAfter: #(timeout,value)
		Promise.race(
			* @
			* CPromise.Defer timeout, value, true
		)
}

CPromise