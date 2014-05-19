class!
	
	let shorten(data)
		let mutable dataStr = str!data
		if dataStr.length > 15
			dataStr := dataStr.substr(0,5)&' ... '&dataStr.slice(-5)
		dataStr
	
	@DecodeResponse := #(data)
		if data.indexOf('{') == -1 then throw ('Invalid response '&shorten(data))
		try
			let json = JSON.parse data
			if typeof json != \object then throw ('Decoded response is invalid: '&shorten(data))
			JSON.parse data
		catch eErr
			throw ('Unable to decode response ('&shorten(data)&') got error: '&str!eErr)

	@HandleInline := #(error,response,successKey = null,errorKey = null,dataKey = null)
		let mutable _err = null;
		let mutable _result = null
		let callback = #(err,result)
			_err := err
			_result := result
		@Handle error, response, callback, successKey, errorKey, dataKey
		throw? _err
		_result

	@Handle := #(error,response,callback,successKey = null,errorKey = null,dataKey = null)
		die if error -> callback
		let data = try
			@DecodeResponse response.responseText
		catch decodeErr
			die callback decodeErr
		if null not in [successKey,errorKey]
			if data[successKey] == true
				callback null, if dataKey
					data[dataKey]
				else
					data
			else
				callback data[errorKey]
		else
			callback null, if dataKey
				data[dataKey]
			else
				data