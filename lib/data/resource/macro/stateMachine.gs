macro ConcurrentStateNestingPush(data)
	GLOBAL._ConcurrentStateNesting or= []
	if data.args[0].value == null and GLOBAL._ConcurrentStateNesting.length > 0 and GLOBAL._ConcurrentStateNesting[* - 1][0] != null
		GLOBAL._ConcurrentStateNesting[* - 1][1] := data.args[1].value
	else
		GLOBAL._ConcurrentStateNesting.push [data.args[0].value,data.args[1].value]
	wait jsTime(2_s)
		GLOBAL._ConcurrentStateNesting := []
	ASTE null

macro ConcurrentStateNestingPop()
	GLOBAL._ConcurrentStateNesting or= []
	GLOBAL._ConcurrentStateNesting.pop()
	ASTE null

macro ConcurrentStateNestingGet()
	let nest = GLOBAL._ConcurrentStateNesting
	let keys = []
	let args = for item in nest
		let key = item[0]&item[1]
		if key in keys
			continue
		keys.push key
		__call(
			null,
			__symbol(null, "internal", "array"),
			__value(null,item[0]),
			__value(null,item[1])
		)
	__call(
		null,
		__symbol(null, "internal", "array"),
		...args
	)

macro ConcurrentStateNestingGetHandler(handler)
	let nest = GLOBAL._ConcurrentStateNesting
	let keys = []
	let args = for item in nest
		let key = item[0]&'_'&item[1]
		if key in keys
			continue
		keys.push key
	let res = 'state_'&keys.join('_')&'_'&handler.value
	ASTE $res

macro _defState
	syntax concurrentProcess, body as Body
		if body?
			body := body.walkWithThis #(node)@ 
				if node.scope == body.scope and node.isMacroAccess and node.data.macroName == \def
					let _name = node.data.macroData.key.value
					let name = ASTE ConcurrentStateNestingGetHandler($_name)
					let func = node.data.macroData.func ? node.data.macroData.value
					AST
						@prototype[$name] := $func
						@prototype[$name].states := ConcurrentStateNestingGet()
						@prototype[$name].action := $_name
		body

macro defState
	syntax states as ObjectLiteral, body as Body
		let currentState = []
		let pushes = []
		let pops = []
		if states?
			for state in states.args[1 to (* - 1)] 
				do key = state.args[0].value, value = state.args[1]
					if value.isCall
						for _value in value.args
							let __value = _value.name ? _value.value
							pushes.push ASTE ConcurrentStateNestingPush([$key,$__value])
					else
						let _value = value.name ? value.value
						pushes.push ASTE ConcurrentStateNestingPush([$key,$_value])
					pops.push ASTE ConcurrentStateNestingPop()
		AST
			$pushes
			_defState concurrentProcess
				$body
			$pops

	syntax 'for', subState as Identifier, body as Body
		subState := subState.name
		return body.walkWithThis #(node)@
			if node.scope == body.scope and node.isMacroAccess and node.data.macroName == \defState and node.data.macroData.name? and node.data.macroData.body?
				let _name = node.data.macroData.name
				let _body = node.data.macroData.body
				let res = AST
					defState {a:b}
						$_body
				res.data.macroData.states.args[1].args[0] := ASTE $subState
				res.data.macroData.states.args[1].args[1] := ASTE $_name
				return res

	syntax name as Identifier, body as Body
		body.walkWithThis #(node)@ 
			if node.scope == body.scope and node.isMacroAccess and node.data.macroName == \def
				let tmp = @tmp()
				let name2 = "state_$(name.name)_$(node.data.macroData.key.value)"
				let func = node.data.macroData.func ? node.data.macroData.value
				AST
					@prototype[$name2] := $func