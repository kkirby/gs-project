Element.prototype.matches or= Element.prototype.matchesSelector or Element.prototype.mozMatchesSelector or Element.prototype.webkitMatchesSelector or Element.prototype.msMatchesSelector

$$_bootstrap()

GLOBAL.VendorPrefix := do
	let prefixes = 
		* \webkit
		* \Moz
		* \o
		* \ms
	
	let elm = document.createElement \div
	let style = elm.style
	
	#(prop)
		let ucProp = prop.charAt(0).toUpperCase()&prop.slice(1)
		let propPrefixes = prefixes.join(ucProp&' ').split(' ')
		let props = [prop,ucProp].concat propPrefixes
		for first prop in props
			if style haskey prop; prop

GLOBAL.Vendor := do
	#(mutable name)
		if name in [\animationEnd,\transitionEnd]
			name := name.slice 0, -3
			let vendorPrefix = VendorPrefix(name)
			if vendorPrefix == name
				vendorPrefix.toLowerCase() & \end
			else
				vendorPrefix & \End
		else
			VendorPrefix(name) ? name