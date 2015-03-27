let CPromise(func)
	let promise = new Promise(func)
	promise <<< CPromise.prototype
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
	rejectAfter: #(timeout,value)
		Promise.race(
			* @
			* CPromise.Defer timeout, value, true
		)
}

CPromise