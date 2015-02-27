macro get_const(type)
	let name = type.name.toLowerCase().replace r'_'g, ''
	if name == \builddate
		let currentTime = new Date().getTime();
		AST
			new Date($currentTime)

macro def
	syntax key as ObjectKey, func as FunctionDeclaration
		let mutable argsVar = null
		func := func.walkWithThis #(node)@
			if node.isNormalCall() and node.func.name == \superArg
				argsVar ?= @tmp \args, true
				ASTE(node) super[$key](...$argsVar)
		if argsVar?
			let oldData = func.data.node.args[1]
			let newData = AST
				let $argsVar as [] = arguments
				$oldData
			func.data.node.args[1] := newData
		@internal-call \custom,
			@const \def
			key
			func

macro yield-cb
	syntax pos as ('(',this as Expression,')')?,call as Expression
		if pos?.name; pos := pos.name
		call := @macroExpandAll call
		let args = [...call.args]
		let successCb = ASTE #(result) -> callback(null,result)
		let errorCb = ASTE #(err) -> callback(err)
		if pos == \start; args.splice(0,0,successCb,errorCb)
		else if not pos? or pos == \end; args.splice(args.length,0,successCb,errorCb)
		else if pos == \custom
			for arg, index in args
				if arg.name == \success; args[index] := successCb
				if arg.name == \error; args[index] := errorCb
		call := @call call.func, args
		ASTE yield to-promise! (#(callback)@ -> $call)()

macro ucfirst(str)
	@maybe-cache str, #(setStr, str)
		ASTE $setStr.substr(0,1).toUpperCase()&$str.substr(1)

/**
 TODO:
	On the resulting object container for the handlers,
	do compile-time object mapping. So instead of
		prototype.abc.d = function()
	do
		prototype.abc = {d: function()}
	If using custom get/set functions, don't make a __attribute property.
	Allow for let set = someHandler
**/
macro dyn
	syntax name as Identifier, func as FunctionDeclaration
		name := name.name
		let type = name.substr(0,3)
		name := name.substr(3)
		let transformMethod = 
			if type in [\get,\set]; 'toLowerCase'
			else if type in [\Get,\Set]; 'toUpperCase'
		name := name.substr(0,1)[transformMethod]()&name.substr(1)
		if type in [\get,\Get]
			ASTE Object.defineProperty @prototype, $name, {get: $func}
		else if type in [\set,\Set]
			ASTE Object.defineProperty @prototype, $name, $func, {set: $func}
	
	syntax 'bind',name as Identifier,'->',bindTo as Expression
		name := name.name
		AST
			Object.defineProperty @prototype, $name, {
				get: # -> $bindTo
				set: #(value) -> ($bindTo) := value
			}
	
	syntax 'def',isModel as 'attr'?,colon as ':'?,dynName as Identifier,initialValue as ('=',this as Expression)?,dynBody as Body?
		unless dynBody
			dynBody := ASTE null
		isModel := isModel == 'attr'
		dynName := dynName.name
		let helpers =
			func:
				beforeGet: null
				get: null
				afterGet: null
				beforeSet: null
				set: null
				afterSet: null
			value:
				initial: initialValue
		if dynBody.args?
			dynBody := dynBody.args
		else
			dynBody := [dynBody]
		for node in dynBody
			if node.nodeType == \macroAccess  
				let {macroData,macroName} = node.data
				if macroName == \let
					let {type,name,value} =
						if macroData.func?
							{
								type: \func
								name: macroData.ident.name
								value: macroData.func
							}
						else if macroData.declarable?
							{
								type: \value
								name: @macroExpandAll(macroData.declarable).ident.name
								value: macroData.value
							}
					if helpers[type] ownskey name
						helpers[type][name] := value
		let codeSegments = []
		let valueName = '__'&dynName
		let mutable tmp = null
		let noop = {
				func: ASTE null
				inline: ASTE null
		}
		// Getter
		tmp := helpers.func.beforeGet
		let {func:beforeGetFunc,inline:beforeGetInline} = 
			if tmp?
				{
					func: AST @prototype[$valueName].beforeGet := $tmp
					inline: AST @[$valueName].beforeGet.call(this,value)
				}
			else
				noop
		tmp := helpers.func.get
		let {func:getFunc,inline:getInline} = 
			if tmp?
				{
					func: AST(helpers.func) @prototype[$valueName].get := $tmp
					inline: AST value := @[$valueName].get.call(this,value)
				}
			else
				noop
		tmp := helpers.func.afterGet
		let {func:afterGetFunc,inline:afterGetInline} = 
			if tmp?
				{
					func: AST @prototype[$valueName].afterGet := $tmp
					inline: AST @[$valueName].afterGet.call(this,value)
				}
			else
				noop
		// Setter
		tmp := helpers.func.beforeSet
		let {func:beforeSetFunc,inline:beforeSetInline} = 
			if tmp?
				{
					func: AST @prototype[$valueName].beforeSet := $tmp
					inline: AST @[$valueName].beforeSet.call(this,newValue,oldValue)
				}
			else
				noop
		tmp := helpers.func.set
		let {func:setFunc,inline:setInline} = 
			if tmp?
				{
					func: AST @prototype[$valueName].set := $tmp
					inline: AST newValue := @[$valueName].set.call(this,newValue,oldValue)
				}
			else
				noop
		tmp := helpers.func.afterSet
		let {func:afterSetFunc,inline:afterSetInline} = 
			if tmp?
				{
					func: AST @prototype[$valueName].afterSet := $tmp
					inline: AST @[$valueName].afterSet.call(this,newValue,oldValue)
				}
			else
				noop
		// Initial Value
		let setInitialValueName = '__'&dynName&'DidSetInitialValue'
		tmp := helpers.value.initial
		let _valueName = '_'&valueName
		let {func:setInitialValueFunc,inline:setInitialValueInline} =
			if tmp?
				{
					func: AST @prototype[$setInitialValueName] := false
					inline: AST
						unless @[$setInitialValueName]
							@[$_valueName] := $tmp
							@[$setInitialValueName] := true
				}
			else
				noop
		let afterSetInlineModel = if isModel
			let eventName = 'attributeChange'
			let eventName2 = eventName&'.'&dynName
			let e = @tmp \e
			AST
				let $e = {attribute:$dynName,value:newValue,oldValue:oldValue}
				@emitEvent $eventName, $e
				@emitEvent $eventName2, $e
		else
			ASTE null
		let setterDidSetInitialInline = if helpers.value.initial?
			ASTE @[$setInitialValueName] := true
		else
			ASTE null
		AST
			@prototype[$_valueName] := null
			@prototype[$valueName] := {}
			$beforeGetFunc
			$getFunc
			$afterGetFunc
			$beforeSetFunc
			$setFunc
			$afterSetFunc
			$setInitialValueFunc
			Object.defineProperty @prototype, $dynName, {
				get: #
					$setInitialValueInline
					let mutable value = @[$_valueName]
					$beforeGetInline
					$getInline
					$afterGetInline
					value
				set: #(value)!
					let mutable newValue = value
					let oldValue = @[$_valueName]
					if oldValue == newValue then return
					$beforeSetInline
					$setInline
					@[$_valueName] := newValue
					$setterDidSetInitialInline
					$afterSetInline
					$afterSetInlineModel
			}

macro wait
	syntax time as Expression,'->',body as Expression
		AST
			setTimeout($body,$time)

	syntax time as Expression, body as Body
		let func = @tmp \func
		AST
			let $func = #@
				$body
			setTimeout($func,$time)

macro sleep
	syntax time as InvocationArguments, body as DedentedBody
		time := time[0]
		ASTE setTimeout (#@ -> $body), $time
			
macro interval
	syntax runNow as (this as '!')?,time as Expression, body as Body
		let func = ASTE #@ -> $body
		@maybe-cache func, #(setFunc,func)
			runNow := if runNow?
				ASTE $func()
			else
				ASTE null
			let tmp = @tmp()
			AST
				let $tmp = setInterval $setFunc, $time
				$runNow
				$tmp

	syntax time as Expression, body as Body,'\n','while', untilBody as Body
		AST
			do
				let mutable intervalVar = null
				let untilFunc = #@
					$untilBody
				let intervalFunc = #@
					if untilFunc()
						$body
					else
						clearInterval intervalVar
				intervalVar := setInterval intervalFunc, $time
		
macro asyncWrap
	syntax call as Expression
		let success = AST #
			callback.apply(this,[null,...arguments])
		let error = AST #(err)
			if err?
				callback.apply(this,arguments)
			else
				callback.apply(this,['Failed.'])
		let inner = @call call.func, [
			...call.args,
			ASTE(success) once! (mutate-function! $success),
			ASTE(error) once! (mutate-function! $error)
		]
		
		let outer = ASTE #(callback)@
			$inner
		
		AST
			$outer()

	syntax 'custom', call as Expression
		let mutable success = AST #
			callback.apply(this,[null,...arguments])
		let mutable error = AST #(err)
			if err?
				callback.apply(this,arguments)
			else
				callback.apply(this,['Failed.'])
		success := ASTE(success) once! (mutate-function! $success)
		error := ASTE(error) once! (mutate-function! $error)
		let outer = ASTE #(callback)@
			let success = $success
			let error = $error
			$call
		
		AST
			$outer()
		
macro jsTime(left)
	let leftUnitSrc = this
		.parser
		.source
		.split("\n")[this.line(left) - 1]
		.substr(this.column(left) - 1)
		.substr(String(left.value).length+1,2)
	let unitMatcher = r"(hr|ho|mi|ms|s)"
	let leftUnitMatches = leftUnitSrc.match unitMatcher
	unless leftUnitMatches
		@error "A valid unit was not found in $(leftUnitSrc).", left
	let leftUnit = leftUnitMatches[0]
	let time = if leftUnit == \s
		left.value * 1000
	else if leftUnit == \ms
		left.value
	else if leftUnit == \mi
		left.value * 60000
	else if leftUnit == \hr or leftUnit == \ho
		left.value * 3600000
	ASTE $time

macro die
	syntax cond as (type as (\if|\unless|'?'), test as Logic)?, body as (Body | (subtype as ('then' | ';')?,stmt as Statement) | (subtype as ('->' | '<-'),stmt as Expression))?, retVal as (',',this as Expression)?
		retVal ?= __const("null")
		if cond?
			let mutable test = cond.test
			let type = cond.type
			let condBody = if body?
				if body.subtype?
					if body.subtype in ['->','<-']
						let oldTest = test
						// TODO: Cache value of $test so that the result doesn't evaluate it twice!
						test := ASTE ($test)?
						let mutable stmt = body.stmt
						stmt := @macro-expand-1 stmt
						if stmt.isInternalCall(\contextCall,\new) or stmt.isNormalCall()
							if body.subtype == '<-'
								@call stmt.func, [oldTest, ...stmt.args]
							else
								@call stmt.func, [...stmt.args, oldTest]
						else if stmt.isIdent or (stmt.isCall and not stmt.isNormalCall())
							ASTE $stmt $oldTest
						else
							@error 'Invalid symbol used with '&body.subtype, stmt
					else
						body.stmt
				else
					body
			else
				ASTE null
			if type in [\if,'?']
				AST if $test
					$condBody
					return $retVal
			else if type == \unless
				AST unless $test
					$condBody
					return $retVal
		else
			if body? and body.subtype? and body.subtype in ['->','<-']
				@error 'Cannot use '&body.subtype&' with non-conditional die.', body.subtype
			let stmt = if body?
				if body.stmt
					body.stmt
				else
					body
			else
				ASTE $retVal
			AST
				$stmt
				return $retVal

	syntax 'with', withExp as Expression,',', cond as (type as (\if|\unless|'?'), test as Logic)?
		if cond?
			let _macro = ASTE die if a, b
			_macro.data.macroData.cond.type := cond.type
			_macro.data.macroData.cond.test := cond.test
			_macro.data.macroData.retVal := withExp
			_macro
		else
			let _macro = ASTE die ,b
			_macro.data.macroData.retVal := withExp

macro compose
	syntax 'if',test as Logic, '->', stmt as Expression
		@maybeCache test, #(setTest,test)
			stmt := @macro-expand-1 stmt
			AST
				if $setTest?; $stmt $test
			
macro ConstStr
	syntax inputNodes as InvocationArguments
		let resolveValue(node)@
			if node.nodeType == \value
				node.value
			else if node.nodeType == \macroAccess
				resolveValue @macroExpandAll inputNode
			else
				@error 'Invalid node type', node
		__value(
			null,
			(for inputNode in inputNodes; resolveValue inputNode).join ''
		)
	
macro fnDefer
	syntax '(',time as Expression,')', body as FunctionDeclaration
		AST
			do
				let mutable timeout = null
				let mutable args = null
				let mutable scope = null
				let funcA = $body
				let funcB = #
					timeout := null
					funcA.apply scope, args
				#!
					die if timeout
					args := arguments
					scope := this
					timeout := setTimeout funcB, $time

macro lengthOf(str)
	if str.isValue
		let len = str.value.length
		ASTE $len
	else
		ASTE $str.length
	
macro randomNum(maxNum,places,roundToNearest)
	places or= ASTE 0
    roundToNearest or= ASTE 1
	if places.value == 0
		AST
			Math.round(Math.random() * $maxNum)
	else
		places.value := 1 * (10 ^ places.value)
	    let b = ASTE $maxNum * $places
		AST
			(Math.round((Math.random() * $b) / $roundToNearest) * $roundToNearest) / $places
/**
 TODO: Implement ..		
macro random!
	syntax maxNum as ('max',':',this as Expression)?, minNum
*/

macro round!(num,places)
	places or= ASTE 0
	places.value := 1 * (10 ^ places.value)
	if places.value == 1
		ASTE Math.round($num)
	else
		ASTE Math.round($num * $places) / $places

macro angleToRad(angle)
	AST
		$angle * (Math.PI / 180)
		
macro multiline!
	syntax op as Logic, b as Body
		let mutable vals = null
		if b.func.inspect() == 'Symbol.block'
			vals := b.args[0].args[0]
			for line, ind in b.args
				if ind
					vals := @call op, vals, line.args[0]
		else
			vals := b.args[0]
		vals

macro callSuper
	syntax name as Identifier
		name := name.name
		ASTE super[$name] ...arguments

macro do
  syntax locals as (ident as Identifier, "=", value, rest as (",", ident as Identifier, "=", value)*)?, body as (Body | (";", this as Statement))
    if locals
      let params = []
      let values = []
      let all-locals = [{locals.ident, locals.value}].concat(locals.rest)
      let f(i)@
        if i < all-locals.length
          if all-locals[i].ident
            params.push @internal-call \param,
              all-locals[i].ident
              @noop()
              @const false
              @const false
              @noop()
            values.push all-locals[i].value
          f i + 1
      f 0
      @call(
        @func(params, @internal-call(\auto-return, @macroExpandAll(body)), true)
        values)
    else
      ASTE (#@ -> $body)()

macro class!
	syntax generic as ("<", head as Identifier, tail as (",", this as Identifier)*, ">")?, extendTo as ("extends", this)?, body as Body?
		let result = this.ident this.getConstValue(\__CLASS__)
		let _class = if extendTo?
			AST
				class $result extends $extendTo
					$body
    	else
    		AST
    			class $result
    				$body
		if generic?; _class.data.macroData.generic := generic
		if generic? or extendTo?.isCall
			_class
		else
			let res = @macroExpandAll(_class).args[0].args[1].args[1].func.args[1].args[0]
			res.args.pop()
			AST
				$res
				$result

	syntax args as InvocationArguments
		if args.length == 1 and args[0].name == \self
			@ident @getConstValue(\__CLASS__)
		else
			let result = this.ident this.getConstValue(\__CLASS__)
			@call result, args

macro isEmpty(input)
	ASTE not $input? or $input == ''

macro toggle(cond,a,b)
	AST
		if $cond
			$a
		else
			$b

macro _
	syntax selector as InvocationArguments,':','on',runNow as '!'?,event as (Identifier|Expression),spacer as (':')?,func as (FunctionDeclaration|Expression)
		let element = selector[0]
		@maybe-cache func, #(setFunc, func)
			if event.isIdent
				if event.name.substr(0,1) == '$'
					event.name := event.name.substr(1)
				else
					event := event.name
			let first = ASTE $element.addEventListener $event, $setFunc
			let second = if runNow?; ASTE $func()
			else; ASTE null
			AST
				$first
				$second
	
	syntax selector as InvocationArguments,':','one',event as Identifier,func as (FunctionDeclaration | Expression)
		let userCallback = @tmp \userCallback, true
		let callback = @tmp \callback, true
		let elm = @tmp \elm, true
		let element = selector[0]
		event := event.name
		AST
			let $elm = $element
			let $userCallback = $func
			let $callback = #
				$elm.removeEventListener $event, $callback
				$userCallback.apply this, arguments
			$elm.addEventListener $event, $callback
	
	syntax selector as InvocationArguments,':','onOneOf',body as Body
		let element = selector[0]
		let removerVar = @tmp \removeEvents, true
		let listenersVar = @tmp \listeners, true
		let adders = []
		let removers = []
		let listeners = for arg in body.args[1 to -1]
			let [name,listener] = arg.args
			adders.push AST
				context.addEventListener $name, $listenersVar[$name].actualListener
			removers.push AST
				context.removeEventListener $name, $listenersVar[$name].actualListener
			AST
				* $name
				* {
					listener: $listener
					actualListener: #(...args)
						$removerVar()
						$listenersVar[$name].listener(...args)
				}
		let listenersObj = __call(
			null
			__symbol(null,\internal,\object)
			__symbol(null,\internal,\nothing)
			...listeners
		)
		AST
			do context = $element
				let $listenersVar = $listenersObj
				let $removerVar = #! -> $removers
				$adders
				{
					remove: $removerVar
				}

macro bindTogether
	syntax 'left',':',left as Expression,',','right',':',right as Expression,body as Body
		unless body
			body := ASTE null
		if body.args?
			body := body.args
		else
			body := [body]
		let helpers = {
			left: null
			right: null
		}
		for node in body
			if node.nodeType == \macroAccess  
				let {macroData,macroName} = node.data
				if macroName == \let
					let name = macroData.ident.name
					let value = macroData.func
					if helpers ownskey name
						helpers[name] := value
		let tmp = ASTE $left <bind> $right
		tmp.data.leftHandler := helpers.left
		tmp.data.rightHandler := helpers.right
		tmp

macro let
	syntax ?!'as', type as Type, ident as Identifier, init as InvocationArguments?
		if init?
			let initFunc =
				if type.scope.has type
					__call(
						null,
						type,
						...init
					)
				else if type.name in [\Number,\String]
					ASTE $init[0]
				else
					__call(
						null,
						__symbol(null,\internal,\new)
						type,
						...init
					)
			ASTE let $ident as $type = $initFunc
		else
			ASTE let mutable $ident as $type = null

macro helper _ellipsis = #(text,length as Number,append = '...')
	if text.length > length
		text.substr(0,length - append.length) & append
	else; text

macro ellipsis(text,length,append)
	append ?= ASTE null
	AST
		_ellipsis($text,$length,$append)

/**
 * Usage:
 *	extract(
 *		{
 *			firstName: 'Kyle'
 *		},
 *		[\firstName]
 *	)
 *	This is essentially the same thing as a <<< b execept
 *	you get to pick and choose the keys you want. Plus
 *	it's more efficent.
*/
macro extract(obj,keys)
	keys := for key in keys.args; key.value
	let storage = @tmp \obj
	let keyAsts = for key in keys
		__call(
			null,
			__symbol(null,\internal,\array),
			__value(null,key),
			ASTE $storage[$key]
		)
	let newObj = __call(
		null,
		__symbol(null,\internal,\object),
		__symbol(null,\internal,\nothing),
		...keyAsts
	)
	AST
		let $storage = $obj
		$newObj
//macro operator binary inall, inAll, in=	