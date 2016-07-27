let CustomError(target)
	if typeof Object.setPrototypeOf == \function
		Object.setPrototypeOf target.prototype, Error.prototype
	else
		target.prototype := Object.create Error.prototype
	class E extends target
		def constructor(message,...args)
			super message, ...args
		
			Object.defineProperty @, \name, {
				-enumerable
				-writable
				value: target.prototype.constructor.name
			}
		
			Object.defineProperty @, \message, {
				-enumerable
				+writable
				value: message
			}
		
			if Error.hasOwnProperty \captureStackTrace
				Error.captureStackTrace @, @constructor
			else
				Object.defineProperty @, \stack, {
					-enumerable
					-writable
					value: (new Error(message)).stack
				}
	E