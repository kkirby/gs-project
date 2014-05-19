macro helper fsm_init = #(config)
	let init = config.initialize ? # ->
	config.substates := {}
	config.delegateFsms ?= []
	config['*'] ?= # -> true
	config.initialize := #
		if @delegateFsms instanceof Array
			for value, key in @delegateFsms
				@delegateFsms[key] := new value({parent: @})
		for key, mutable state of @states
			if typeof state == \function
				let fsmInstance = new state()
				fsmInstance.enter ?= #
					if @view
						App.show @view
					@transition @enterState, ...arguments
				fsmInstance.exit ?= #
					if @view
						App.hide @view
					@transition \__void, ...arguments
				unless fsmInstance.states?.__void
					fsmInstance.states.__void := {}
				@states[key] := {
					substate: fsmInstance
					_onEnter: #
						@substate := fsmInstance
						fsmInstance.enter ...arguments
					_onExit: #
						@substate := null
						fsmInstance.exit ...arguments
					'*': #
						fsmInstance.handle ...arguments
				}
			else
				if state._initialize?
					state._initialize.apply @, arguments
				if state.substate
					let instance = new state.substate()
					state.substate := instance
					let _enter = state._onEnter ? # ->
					let _exit = state._onExit ? # ->
					state._onEnter := #
						@substate := instance
						_enter.apply @, arguments
					state._onExit := #
						@substate := null
						_exit.apply @, arguments
					state['*'] := #
						if _wc.apply @, arguments
							@substate.handle ...arguments
			let _state = @states[key]
			let _wc = _state['*'] ? # ->
			_state['*'] := #
				for delegate in @delegateFsms
					delegate.handle ...arguments
				@['*'].apply @, arguments
				_wc.apply @, arguments
		init.apply this, arguments

macro fsm
	syntax code as Body
		let scope = code.scope
		let name = @tmp \FsmConfig
		code := code.walkWithThis #(node)@
			if node.isCall and node.func.isIdent and node.func.name == \state
				let _stateName = node.args[0].name
				let _stateIdent = node.args[0]
				ASTE $name.states[$_stateName] := $_stateIdent
			else if node.isIdent and node.name == \this and node.scope == scope
				name
		AST
			do
				let $name = {states:{}}
				$code
				fsm_init($name)
				lib.Machina $name
	
	syntax 'state', view as ('view',':',this as Expression)?, code as Body
		let name = @tmp \FsmConfig
		let parseHelpers = #(node)@ -> node.walkWithThis #(node)@
			if node.isCall and node.func.name? and node.func.name.substr(0,1) == '$'
				let args = @internalCall \array, for arg in node.args
					parseHelpers arg
				let _name = @ident node.func.name
				ASTE $_name.apply(this,$args)
		let init = []
		init.push AST let $name = {}
		init.push @macroExpandAll(code).walkWithThis #(node)@
			if node.isCall and node.func.name == \custom
				let _handler = node.args[1]
				let _handlerFn = node.args[2]
				AST $name[$_handler] := $_handlerFn
			else if node.isIdent and node.name == \this and node.scope.parent and not node.scope.parent.parent
				name
		init.push AST lib.Machina.State($view,$name)
		let mutable _body = AST $init
		_body := parseHelpers @macroExpandAll _body
		AST
			do
				$_body