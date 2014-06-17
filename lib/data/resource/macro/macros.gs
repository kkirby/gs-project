Element.prototype.matches or= Element.prototype.matchesSelector or Element.prototype.mozMatchesSelector or Element.prototype.webkitMatchesSelector or Element.prototype.msMatchesSelector

//macro operator binary ownskey with precedence: 6, maximum: 1, invertible: true, type: \boolean, label: \ownership
//  AST
//  	($left).hasOwnProperty($right)

macro $$_bootstrap()
	GLOBAL.$$_getType := #(input)
		let mutable type = null
		if input.isIdent
			let vars = input.scope.top().children[0].variables[input.name]
			type := if vars?
				// Not sure if this was a bug or a feature ... :(
				//if typeof type == \function
				//	vars.type().toString()
				//else
				vars.type.toString()
			else
				\any
		else
			type := if input.nodeType == \macroAccess
				input.nodeType
			else
				input.type().toString()
		type.toLowerCase()

	GLOBAL.$$_reduce := #(args, isMultiple = false)
		let macroData = args[0].macroData
		let [__wrap,__const,__value,__symbol,__call,__macro] = args[1 to 6]
		let data = macroData.selector
		let _getContextQuery(context,multiple)
			if context?
				let type = $$_getType context
				if type == \string
					if context.value? and context.value == \body
						__call(
							null,
							__symbol(null,\internal,\access),
							__symbol(null,\ident,\document),
							__value(null,\body)
						)
					else
						__call(
							null,
							__call(
								null,
								__symbol(null,\internal,\access),
								__symbol(null,\ident,\document),
								if multiple then __value(null,\querySelectorAll) else __value(null,\querySelector)
							),
							__wrap(context)
						)
				else
					__wrap(context)
			else
				__symbol(null,\ident,\document)
		
		if data.length == 1
			_getContextQuery data[0], isMultiple
		else
			__call(
				null,
				__call(
					null,
					__symbol(null,\internal,\access),
					_getContextQuery(data[1]),
					if isMultiple then __value(null,\querySelectorAll) else __value(null,\querySelector)
				),
				__wrap(data[0])
			)
	ASTE null

$$_bootstrap()

macro ucfirst(str)
	@maybe-cache str, #(setStr, str)
		ASTE $setStr.substr(0,1).toUpperCase()&$str.substr(1)

GLOBAL.Vendor := do
	let mutable cachedPrefix = null
	let getPrefix = #
		unless cachedPrefix
			let dummyStyle = document.createElement(\div).style
			let vendors = {
				'': 'transform'
				'webkit': 'webkitTransform'
				'ms': 'msTransform'
				'o': 'oTransform'
				'Moz': 'MozTransform'
			}
			cachedPrefix := for first prefix, style of vendors
				if dummyStyle haskey style; prefix
		cachedPrefix
	#(name)
		let vendorPrefix = getPrefix()
		if not not vendorPrefix
			if name.indexOf(\animation) == 0 and vendorPrefix == \Moz
				return name.toLowerCase()
			return vendorPrefix & ucfirst(name)
		else
			return name

macro $
	// basic
	syntax selector as InvocationArguments
		$$_reduce arguments

	// Basic Array
	syntax selector as InvocationArguments,'[',']'
		$$_reduce arguments, true
			
	syntax selector as InvocationArguments,'[',']',':','each','as',name as Identifier,body as (Body|Expression)
		let query = $$_reduce arguments, true
		let tmp = @tmp()
		let assignment = AST let $tmp = $query
		AST
			$assignment
			for $name in $tmp
				$body

	/*syntax selector as InvocationArguments,':','on',args as InvocationArguments,body as (Body|Expression)
		let element = $$_reduce arguments
		let events = if args[0].args? then args[0].args else [args[0]]
		if args.length == 2
			let insideBody = []
			let selector = args[1]
			for event in events
				let useCapture = if event.value in [\focus,\blur]
					ASTE true
				else
					ASTE false
				insideBody.push AST
					$element.addEventListener(
						$event,
						onEvent,
						$useCapture
					)
			AST
				do callback = $body
					let onEvent = #(e)
						if e.target.webkitMatchesSelector($selector)
							callback.apply(this,arguments)
					$insideBody
					onEvent
		else
			let insideBody = []
			for event in events
				insideBody.push AST
					$element.addEventListener($event,callback)
			AST
				do callback = $body
					$insideBody
					callback*/

	syntax selector as InvocationArguments,':','on',runNow as '!'?,event as (Identifier|Expression),spacer as (':')?,func as (FunctionDeclaration|Expression)
		let element = $$_reduce arguments
		@maybe-cache func, #(setFunc, func)
			if event.isIdent
				if event.name.substr(0,1) == '$'
					event.name := event.name.substr(1)
				else
					event := event.name
			if event == 'afterAnimate'
				event := ASTE Vendor(\animationEnd)
			else if event == 'afterTransit'
				event := ASTE Vendor(\transitionEnd)
			let useCapture = event in [\focus,\blur]
			let first = if useCapture
				ASTE $element.addEventListener $event, $setFunc, true
			else
				ASTE $element.addEventListener $event, $setFunc
			let second = if runNow?; ASTE $func()
			else; ASTE null
			AST
				$first
				$second
	
	syntax selector as InvocationArguments,':','is',isSelector as InvocationArguments,body as Body
		let newElm = $$_reduce arguments
		let newSelector = isSelector[0]
		AST
			if $newElm.matches($newSelector)
				$body
				
	syntax selector as InvocationArguments,':','eIs',isSelector as InvocationArguments
		let newElm = $$_reduce arguments
		let newSelector = isSelector[0]
		AST $newElm.matches($newSelector)
				
	syntax selector as InvocationArguments,':','toggle',args as InvocationArguments
		let newElm = $$_reduce arguments
		let modifier = if args.length == 1 then args[0]
		if modifier?
			AST
				if $modifier
					$newElm.style.display := ''
				else
					$newElm.style.display := \none
		else
			AST
				if $newElm.style.display == \none
					$newElm.style.display := ''
				else
					$newElm.style.display := \none
	
	syntax selector as InvocationArguments,':','one',event as Identifier,func as (FunctionDeclaration | Expression)
		let userCallback = @tmp \userCallback, true
		let callback = @tmp \callback, true
		let elm = @tmp \elm, true
		let element = $$_reduce arguments
		event := event.name
		let mutable vendorify = false
		if event == 'afterAnimate'
			event := ASTE Vendor(\animationEnd)
		else if event == 'afterTransit'
			event := ASTE Vendor(\transitionEnd)
		AST
			let $elm = $element
			let $userCallback = $func
			let $callback = #
				$elm.removeEventListener $event, $callback
				$userCallback.apply this, arguments
			$elm.addEventListener $event, $callback
	
	syntax selector as InvocationArguments,':','closest',matchSelector as InvocationArguments
		let newElm = $$_reduce arguments
		let newSelector = matchSelector[0]
		let tmpElm = @tmp \elm
		AST
			let mutable $tmpElm = $newElm
			until $tmpElm.matches($newSelector)
				$tmpElm := $tmpElm.parentNode
			$tmpElm
	
	syntax selector as InvocationArguments,':','trigger',event as InvocationArguments
		let htmlEvent = @tmp \htmlEvent
		let newElm = $$_reduce arguments
		let eventName = event[0]
		let data = event[1]
		AST
			let $htmlEvent = document.createEvent(\CustomEvent)
			$htmlEvent.initCustomEvent($eventName,true,true,$data)
			$newElm.dispatchEvent($htmlEvent)
	
	syntax selector as InvocationArguments,':','hasClass',className as InvocationArguments
		let newElm = $$_reduce arguments
		let newClassName = className[0]
		AST
			$newElm.classList.contains($newClassName)
	
	syntax selector as InvocationArguments,':','removeClass',className as InvocationArguments
		let newElm = $$_reduce arguments
		let newClassName = className[0]
		AST
			$newElm.classList.remove($newClassName)
			
	syntax selector as InvocationArguments,':','addClass',className as InvocationArguments
		let newElm = $$_reduce arguments
		let newClassName = className[0]
		AST
			$newElm.classList.add($newClassName)
			
	syntax selector as InvocationArguments,':','toggleClass',args as InvocationArguments
		let newElm = $$_reduce arguments
		let className = args[0]
		let modifier = if args.length == 2 then args[1] else null
		if modifier == null
			AST
				$newElm.classList.toggle($className)
		else
			AST
				if $modifier
					$newElm.classList.add($className)
				else
					$newElm.classList.remove($className)
		
	syntax selector as InvocationArguments,':','append',element as Expression
		let elm = $$_reduce arguments
		AST ($($elm)).appendChild $element
		
	syntax selector as InvocationArguments,':','appendTo',element as Expression
		let elm = $$_reduce arguments
		AST ($element).appendChild $elm
		
	syntax selector as InvocationArguments,':','remove',element as Expression
		let elm = $$_reduce arguments
		AST ($($elm)).removeChild $element
	
	syntax selector as InvocationArguments,':','remove','(',')'
		let elm = $$_reduce arguments
		let tmp = @tmp()
		AST
			let $tmp = $($elm)
			if $tmp?.parentNode?
				$tmp.parentNode.removeChild $tmp
			$tmp
	
	syntax selector as InvocationArguments,':','css',properties as InvocationArguments
		let elm = $$_reduce arguments
		let styles = {}
		if properties.length == 1
			if properties[0].isCall and properties[0].func.isObject
				for arg in properties[0].args[1 to -1]
					styles[arg.args[0].value] := arg.args[1]
			else
				let key = properties[0]
				return AST
					($elm).style[$key]
		else if properties.length == 2
			styles[properties[0].value] := properties[1]
		let astNodes = for key, value of styles
			ASTE ($elm).style[$key] := $value
		AST
			$astNodes

	syntax selector as InvocationArguments,':','show','(',')'
		let elm = $$_reduce arguments
		AST
			($elm).style.display := ''

	syntax selector as InvocationArguments,':','hide','(',')'
		let elm = $$_reduce arguments
		AST
			($elm).style.display := 'none'
	
	syntax selector as InvocationArguments,':','text',text as Expression
		let elm = $$_reduce arguments
		AST
			($elm).innerText := $text
	
	syntax selector as InvocationArguments,':','html',html as Expression
		let elm = $$_reduce arguments
		AST
			($elm).innerHTML := $html

	syntax body as Body
		AST
			document.addEventListener(
				'DOMContentLoaded',
				#@
					$body
			)

macro ajax
	syntax params as (head as (type as (this as ('error'|'text'|'response'),':')?, param as Parameter), tail as (',', type as (this as ('error'|'text'|'response'),':')?, param as Parameter)*)?, '<-', method as (\post | \get | \POST | \GET)?, url,data as (',','data',':',this as Expression)?,headers as (',','headers',':',this as Expression)?,body as DedentedBody?
		method ?= \get
		method := method.toUpperCase()
		params := if params? then [params.head].concat params.tail else []
		let callbackParams = for param in params; param.param
		let callbackArgs = [\error,\response,\text][0 to params.length - 1].map @@.ident
		for param, index in params
			if param.type?
				while callbackArgs.length - 1 < index; callbackArgs.push AST null
				callbackArgs[index] := @ident param.type
		let callbackArgsAst = @internalCall \array, ...callbackArgs
		let vRequest = @tmp \request, true
		let vCallback = @tmp \callback, true
		let vHeaders = @tmp \headers
		let func = if body? then @func(callbackParams, @internalCall(\autoReturn, body), true) else AST # ->
		let _headers = {}
		if headers?
			for header, key in headers.args
				if key > 0
					_headers[header.args[0].value] := header.args[1].value
		if data? and data.type().inspect().indexOf(\Object) != -1
			data := ASTE JSON.stringify $data
			unless _headers['Content-Type']?
		    	_headers['Content-Type'] := 'application/json'
		let __headers = []
		for key, header of _headers
			__headers.push ASTE $vRequest.setRequestHeader $key, $header
		AST
			let $vRequest = new XMLHttpRequest()
			let $vCallback = once! (mutate-function! $func)
			$vRequest.onreadystatechange := #@
				if $vRequest.readyState == 4
						let error = if $vRequest.status != 200; "HTTP Request failed, got an HTTP status of $($vRequest.status)"
						let response = $vRequest
						let text = response.responseText
						$vCallback.apply @, $callbackArgsAst
			$vRequest.open $method, $url, true
			$__headers
			$vRequest.send $data

macro does
	syntax theClasses as InvocationArguments, body as DedentedBody
		let ret = []
		for theClass in theClasses
			ret.push AST
				lib.Component.Extend(
					$theClass,
					this
				)
		AST
			$body
			$ret

macro operator binary between with precedence: 2
	let minVal = right.args[0]
	let maxVal = right.args[1]
	ASTE $left >= $minVal and $left < $maxVal

macro operator binary outsideof with precedence: 2
	let minVal = right.args[0]
	let maxVal = right.args[1]
	ASTE $left < $minVal or $left > $maxVal

macro operator assign set=
	let mutable leftAssign = []
	let mutable method = null
	if left.args?
		leftAssign := left.args[0 to -2].map #(item)
			ASTE $item
		method := left.args[*-1].value
	else
		method := $left.value
	method := 'set'&method.substr(0,1).toUpperCase()&method.substr(1)
	ASTE $leftAssign[$method]($right)

macro dyn
	syntax name as Identifier, func as FunctionDeclaration
		name := name.name
		let type = name.substr(0,3)
		name := name.substr(3)
		name := name.substr(0,1).toLowerCase()&name.substr(1)
		if type == \get
			ASTE Object.defineProperty @prototype, $name, {get: $func}
		else if type == \set
			ASTE Object.defineProperty @prototype, $name, $func, {set: $func}
	
	syntax 'bind',name as Identifier,'->',bindTo as Expression
		name := name.name
		AST
			Object.defineProperty @prototype, $name, {
				get: # -> $bindTo
				set: #(value) -> ($bindTo) := value
			}
	
	syntax 'input','bind',':',inputName as Identifier,attrName as ('to',this as Identifier)?,type as ('as',this as Identifier)?
		attrName or= inputName
		type or= @ident \text
		inputName := inputName.name
		attrName := attrName.name
		type := type.name
		////////////
		// Getter
		// - Text
		let getter = if type == 'text'
			AST
				let node = $('input[name="'&$inputName&'"]',@node)
				node?.value
		// - Select
		else if type == 'select'
			AST
				let node = $('select[name="'&$inputName&'"]',@node)
				node?.value
		// - Checkbox
		else if type == 'checkbox'
			AST
				not not ($('input[name="'&$inputName&'"]:checked',@node))
		// - MultiCheckbox
		else if type == 'multiCheckbox'
			AST
				let nodes = $('input[name="'&$inputName&'"]:checked',@node)[]
				for node in nodes; node.value
		// - Radio
		else if type == 'radio'
			AST
				let node = $('input[name="'&$inputName&'"]:checked',@node)
				node?.value
		////////////
		// Setter
		// - Text
		let setter = if type == 'text'
			AST
				let node = $('input[name="'&$inputName&'"]',@node)
				if node?; node.value := value
		// - Select
		else if type == 'select'
			AST
				let nodes = $('select[name="'&$inputName&'"] option',@node)[]
				unless nodes? then return
				let mutable alreadySet = false
				for node in nodes
					node.selected := false
					if node.value == value and not alreadySet
						node.selected := true
						alreadySet := true
		// - Checkbox
		else if type == 'checkbox'
			AST
				let node = $('input[name="'&$inputName&'"]',@node)
				if node?; node.checked := not not value
		// - MultiCheckbox
		else if type == 'multiCheckbox'
			AST
				for node in ($('input[name="'&$inputName&'"]',@node)[])
					node.checked := node.value in value
		// - Radio
		else if type == 'radio'
			AST
				for node in ($('input[name="'&$inputName&'"]',@node)[])
					node.checked := node.value == value
		////////////
		// OnChange
		// - Text
		let onchange = if type == 'text'
			AST
				$('input[name="'&$inputName&'"]',@node):on keyup(e)@
					let eventInfo = {
						attribute: $inputName
						value: e.target.value
					}
					@emitEvent 'attributeChange', eventInfo
					@emitEvent 'attributeChange.'&$inputName, eventInfo
		// - Select
		else if type == 'select'
			AST
				$('select[name="'&$inputName&'"]',@node):on change(e)@
					let eventInfo = {
						attribute: $inputName
						value: e.target.value
					}
					@emitEvent 'attributeChange', eventInfo
					@emitEvent 'attributeChange.'&$inputName, eventInfo
		// - Checkbox
		else if type == 'checkbox'
			AST
				$('input[name="'&$inputName&'"]',@node):on change(e)@
					let eventInfo = {
						attribute: $inputName
						value: e.target.checked
					}
					@emitEvent 'attributeChange', eventInfo
					@emitEvent 'attributeChange.'&$inputName, eventInfo
		// - MultiCheckbox
		else if type == 'multiCheckbox'
			AST
				for input in ($('input[name="'&$inputName&'"]',@node)[])
					$(input):on change(e)@
						let eventInfo = {
							attribute: $inputName
							value: for selectedInput in ($('input[name="'&$inputName&'"]:checked',@node)); selectedInput.value
						}
						@emitEvent 'attributeChange', eventInfo
						@emitEvent 'attributeChange.'&$inputName, eventInfo
		// - Radio
		else if type == 'radio'
			AST
				for input in ($('input[name="'&$inputName&'"]',@node)[])
					$(input):on change(e)@
						let eventInfo = {
							attribute: $inputName
							value: $getter
						}
						@emitEvent 'attributeChange', eventInfo
						@emitEvent 'attributeChange.'&$inputName, eventInfo
						
		let tmp = @tmp \oldSetup, true
		AST
			let $tmp = @prototype._bindingSetup
			@prototype._bindingSetup := #
				let ret = $tmp.apply @, ...arguments
				$onchange
				ret
			Object.defineProperty @prototype, $attrName, {
				get: # -> $getter
				set: #(value) -> $setter
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
				

macro modelAttrs(value)
	let defs = []
	let setups = []
	for mutable propertyDefinition in value.args
		let mutable isArray = false
		let mutable isComputed = null
		if propertyDefinition.args?
			if propertyDefinition.args.length == 1
				isArray := true
				propertyDefinition := propertyDefinition.args[0]
			else if propertyDefinition.args.length == 2
				isComputed := propertyDefinition.args[1].args[1]
				propertyDefinition := @ident propertyDefinition.args[1].args[0].value
		let propertyName = propertyDefinition.name
		let hiddenPropertyName = '_'&propertyName
		let isProtected = propertyName.substr(0,1) == '_'
		let plainPropertyName = propertyName.substr(
			if isProtected then 1 else 0
		)
		let createSubPropertyName = #(subPropertyName)
			let resultPropertyName = [subPropertyName]
			if isProtected
				resultPropertyName.unshift \_
			resultPropertyName.push ucfirst plainPropertyName
			resultPropertyName.join('')
		let peekPropertyName = createSubPropertyName \peek
		let rawPropertyName = createSubPropertyName \raw
		defs.push AST
			@.prototype[$hiddenPropertyName] := null
			Object.defineProperty @prototype, $propertyName, {
				set: #(value)!
					@[$hiddenPropertyName](value)
					@emitEvent \attributeChanged, $propertyName,
				get: # @[$hiddenPropertyName]()
			}
			Object.defineProperty @prototype, $peekPropertyName, {
				get: # @[$hiddenPropertyName].peek()
			}
			Object.defineProperty @prototype, $rawPropertyName, {
				get: # @[$hiddenPropertyName]
			}
		if isComputed?
			setups.push ASTE @[$hiddenPropertyName] := ko.computed
				read: $isComputed.bind(@)
				write: $isComputed.bind(@)
		else if isArray
			setups.push ASTE @[$hiddenPropertyName] := ko.observableArray()
		else
			setups.push ASTE @[$hiddenPropertyName] := ko.observable()
	AST
		$defs
		@.prototype._setupModel := #!
			$setups

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

macro operator binary cTo
	let leftUnitSrc = this
		.parser
		.source
		.split("\n")[this.line(left) - 1]
		.substr(this.column(left) - 1)
		.substr(String(left.value).length+1,3)
	let unitMatcher = r"(hr|hou|min|ms|s)"
	let leftUnitMatches = leftUnitSrc.match unitMatcher
	let rightUnitMatches = right.name.match unitMatcher
	unless leftUnitMatches
		@error "A valid unit was not found in $(leftUnitSrc).", left
    unless rightUnitMatches
		@error "A valid unit was not found in $(right.name).", right
	let leftUnit = leftUnitMatches[0]
	let rightUnit = rightUnitMatches[0]
	let time = if leftUnit == \s
		left.value * 1000
	else if leftUnit == \ms
		left.value
	else if leftUnit == \min
		left.value * 60000
	else if leftUnit == \hr or leftUnit == \hou
		left.value * 3600000
	
	if rightUnit == \ms
		ASTE $time
	else if rightUnit == \s
		ASTE $time / 1000
	else if rightUnit == \min
		ASTE $time / 60000
	else if rightUnit == \hr or rightUnit == \hou
		ASTE $time / 3600000
		
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
	syntax cond as (type as (\if|\unless|'?'), test as Logic)?, body as (Body | (subtype as ('then' | ';')?,stmt as Statement) | (subtype as ('->' | '<-'),stmt as Expression))?
		if cond?
			let mutable test = cond.test
			let type = cond.type
			let condBody = if body?
				if body.subtype?
					if body.subtype in ['->','<-']
						let oldTest = test
						test := ASTE ($test)?
						let mutable stmt = body.stmt
						stmt := @macro-expand-1 stmt
						if stmt.isInternalCall(\contextCall,\new) or stmt.isNormalCall()
							if body.subtype == '<-'
								@call stmt.func, [oldTest, ...stmt.args]
							else
								@call stmt.func, [...stmt.args, oldTest]
						else if stmt.isIdent
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
					return null
			else if type == \unless
				AST unless $test
					$condBody
					return null
		else
			if body.subtype? and body.subtype in ['->','<-']
				@error 'Cannot use '&body.subtype&' with non-conditional die.', body.subtype
			let stmt = if body?
				if body.stmt
					body.stmt
				else
					body
			else
				ASTE null
			AST
				$stmt
				return null
	
macro operator binary ?^
	AST
		if ($left)?
			$right $left
			return null
			
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

macro operator binary restrictTo
	let minNumber = right.args[0]
	let maxNumber = right.args[1]
	ASTE (($left min $maxNumber) max $minNumber)
	
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
					
macro operator unary ||, abs
	ASTE Math.abs $node
	
macro operator unary sqrt
	ASTE Math.sqrt $node
	
macro operator unary square
	ASTE Math.pow $node, 2
	
macro operator unary cos
	ASTE Math.cos $node

macro operator unary sin
	ASTE Math.sin $node

macro operator unary asNumber
	ASTE parseInt($node,10)

macro lengthOf(str)
	if str.isValue
		let len = str.value.length
		ASTE $len
	else
		ASTE $str.length

macro operator binary arrayFill
    let values = []
    for i in 0 til right.value
    	values.push left
    @internalCall \array, values
	
macro randomNum(maxNum,places,roundToNearest)
	places or= ASTE 0
    roundToNearest or= ASTE 1
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
	syntax extendTo as (meh as ('extends' | '<-' | '<<' | '<->' | '->'),ident as Identifier)?, body as Body?
		let result = this.ident this.getConstValue(\__CLASS__)
		let _class = if extendTo?
			extendTo := extendTo.ident
			AST
				class $result extends $extendTo
					$body
    	else
    		AST
    			class $result
    				$body
		let res = @macroExpandAll(_class).args[0].args[1].args[1].func.args[1].args[0]
		res.args.pop()
		AST
			$res
			$result

	syntax args as InvocationArguments
		let result = this.ident this.getConstValue(\__CLASS__)
		@call result, args

macro isEmpty(input)
	ASTE not $input? or $input == ''

macro operator binary =?
	AST
		if $right?; $left := $right

macro operator binary ?=in
	let name = if left.args?
		left.args[*-1].value
	else; null
	AST
		if $right[$name]?; $left := $right[$name]

macro operator binary ?=in!
	let name = if left.args?
		left.args[*-1].value
	else; null
	let configName = ucfirst(name)
	AST
		if $right ownskey $configName; $left := $right[$configName]

macro operator unary str!
	AST
		String($node)
		
macro operator unary num!
	AST
		parseInt($node,10)

macro toggle(cond,a,b)
	AST
		if $cond
			$a
		else
			$b

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
							let __value = _value.name
							pushes.push ASTE ConcurrentStateNestingPush([$key,$__value])
					else
						let _value = value.name
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

macro operator assign <difference>
	let tmp = @tmp()
	AST
		for filter $tmp in $left
			$tmp not in $right

macro operator assign <bind>,<bindattr>
	let mutable leftName = null
	let mutable leftObj = null
	left.walk #(item)
		if item.isCall and leftObj == null
			leftObj := item
		else if item.isValue
			leftName := item
	if leftObj == null and left.isCall
		leftObj := left.args[0]
	let mutable rightName = null
	let mutable rightObj = null
	right.walk #(item)
		if item.isCall and rightObj == null
			rightObj := item
		else if item.isValue
			rightName := item
	if rightObj == null and right.isCall
		rightObj := right.args[0]
	let leftEventName = 'attributeChange.'&leftName.value
	let rightEventName = 'attributeChange.'&rightName.value
	let locked = @tmp \locked, true
	let leftFunc = @tmp \leftFunc, true
	let rightFunc = @tmp \rightFunc, true
	let binder = @tmp \binder, true
	let addListener =
		if op == '<bindattr>' and leftObj?
			let event = 'attributeChange.'&leftObj.args[1].value
			AST
				let $binder = #(e)@
					if e?.data?.oldValue?
						e.data.oldValue.removeEventListener $leftEventName, $leftFunc
					$leftObj.addEventListener $leftEventName, $leftFunc
					$leftFunc()
				$binder()
				@addEventListener $event, $binder
		else
			AST
				$leftObj.addEventListener $leftEventName, $leftFunc
				$leftFunc()
	
	AST
		let mutable $locked = false
		let $leftFunc = #()@
			if $locked; return
			$locked := true
			$right := $left
			$locked := false
		let $rightFunc = #()@
			if $locked; return
			$locked := true
			$left := $right
			$locked := false
		$addListener
		$rightObj.addEventListener $rightEventName, $rightFunc
		#
			$leftObj.removeEventListener $leftEventName, $leftFunc
			$rightObj.removeEventListener $rightEventName, $rightFunc

macro operator assign mapownsor=
	left := @macro-expand-1 left
	unless left.is-internal-call \access
		@error "Can only use mapownsor= on an access", left
	let [parent, child] = left.args
	@maybe-cache parent, #(set-parent, parent)
		@maybe-cache child, #(set-child, child)
			@maybe-cache right, #(set-right, right)
				AST
					if $set-parent.has($set-child)
						$parent.get($child)
					else
						$parent.set($child,$set-right)
						$right

macro operator binary arrayRemoveItem
	let index = @tmp \index
	AST
		let $index = $left.indexOf $right
		if $index != -1
			$left.splice $index, 1

macro makeSingleton()
	let instance = @tmp \instance, true
	AST
		let mutable $instance = null
		@get := # -> $instance or= new @

//macro operator binary inall, inAll, in=	