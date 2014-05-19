class!
	let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
	@Fast := #
		let uuid = new Array(36);
		let mutable random = 0
		for i in 0 to 35
			uuid[i] :=
				if i == 8 or i == 13 or i == 18 or i == 23
					'-'
				else if i == 14
					'4'
				else
					if random <= 0x02
						random := 0x2000000 + (Math.random()*0x1000000) bitor 0
					let r = random bitand 0xf
					random := random bitrshift 4
					chars[if i == 19 then (r bitand 0x3) bitor 0x8 else r]
		uuid.join ''