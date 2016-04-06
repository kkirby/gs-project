class!

	@Basename := #(input) -> input.substr(input.lastIndexOf('/') + 1)

	@Filename := #(mutable input)
		input := input.substr(input.lastIndexOf('/') + 1)
		input.substr(0,input.lastIndexOf('.'))
	
	@Extension := #(input)
		let base = @Basename(input)
		base.substr(base.lastIndexOf('.') + 1)