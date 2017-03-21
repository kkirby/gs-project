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
	
	// TODO: Implement
	//syntax selector as InvocationArguments,':','onAnyFirst',runNow as '!'?,event as (Identifier|Expression),spacer as (':')?,func as (FunctionDeclaration|Expression)
		
	
	syntax selector as InvocationArguments,':','on',runNow as '!'?,event as (Identifier|Expression),spacer as (':')?,func as (FunctionDeclaration|Expression)
		let element = $$_reduce arguments
		@maybe-cache func, #(setFunc, func)
			if event.isIdent
				if event.name.substr(0,1) == '$'
					event.name := event.name.substr(1)
				else
					event := event.name
			if event in ['afterAnimate','animationEnd']
				event := ASTE Vendor(\animationEnd)
			else if event in ['afterTransit','transitionEnd']
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
	
	syntax selector as InvocationArguments,':','onOneOf',body as Body
		let element = $$_reduce arguments
		let elementVar = @tmp \element, true
		let removerVar = @tmp \removeEvents, true
		let listenersVar = @tmp \listeners, true
		let adders = []
		let removers = []
		let listeners = for arg in body.args[1 to -1]
			let [name,listener] = arg.args
			adders.push AST
				$elementVar.addEventListener $name, $listenersVar[$name].actualListener
			removers.push AST
				$elementVar.removeEventListener $name, $listenersVar[$name].actualListener
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
			do
				let $elementVar = $element
				let $listenersVar = $listenersObj
				let $removerVar = do
					let mutable called = false
					#!
						if called == false
							called := true
							$removers
				$adders
				{
					remove: $removerVar
				}
	
	syntax selector as InvocationArguments,':','watch','(',other as Expression,')',event as (Identifier|Expression),func as (FunctionDeclaration|Expression)
		let funcVar = @tmp \func, true
		let nestedSelector = other.value
		AST
			let $funcVar = $func
			$($selector):on $event(e)
				if e.target.matches $nestedSelector
					$funcVar ...arguments
	
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
	
	syntax selector as InvocationArguments,':','one',event as (Identifier|Expression),spacer as (':')?,func as (FunctionDeclaration|Expression)
		let userCallback = @tmp \userCallback, true
		let callback = @tmp \callback, true
		let elm = @tmp \elm, true
		let element = $$_reduce arguments
		if event.isIdent
			if event.name.substr(0,1) == '$'
				event.name := event.name.substr(1)
			else
				event := event.name
		let mutable vendorify = false
		if event in ['afterAnimate','animationEnd']
			event := ASTE Vendor(\animationEnd)
		else if event in ['afterTransit','transitionEnd']
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
	
	syntax selector as InvocationArguments,':','prepend',element as Expression
		let elm = $$_reduce arguments
		let elm2 = AST ($($elm))
		@maybeCache elm2, #(setElm,elm)
			AST ($setElm).insertBefore $element, $elm.children[0]
	
	syntax selector as InvocationArguments,':','firstChild',args as InvocationArguments
		let elm = $$_reduce arguments
		AST
			($($elm)).children[0]
	
	syntax selector as InvocationArguments,':','lastChild',args as InvocationArguments
		let elm = $$_reduce arguments
		let elm2 = ASTE ($($elm))
		@maybeCache elm2, #(setElm,elm)
			AST
				($setElm).children[$elm.children.length - 1]
	
	syntax selector as InvocationArguments,':','appendAll',elements as Expression
		let elm = $$_reduce arguments
		let tmp = @tmp()
		AST
			let $temp = $elm
			for elm in $elements; $temp.appendChild elm
		
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
	
	syntax args as InvocationArguments,':','createDom','(',')'
		let html = args[0]
		if html.nodeType != \value
			@error('Value was not passed to createDom.',html)
		let context = @
		let htmlparser = rootRequire('htmlparser2')
		let scope = []
		scope.get := #() -> scope[scope.length - 1]
		let mutable rootElm = null
		let output = []
		let parser = new htmlparser.Parser(
			{
				onopentag: #(name,attributes)
					let nodeVar = context.tmp()
					output.push ASTE let $nodeVar = document.createElement $name
					for key, value of attributes
						output.push ASTE $nodeVar.setAttribute $key, $value
					if rootElm == null; rootElm := nodeVar
					else
						let parentScope = scope.get()
						output.push ASTE $parentScope.appendChild $nodeVar
					scope.push nodeVar
				ontext: #(text)
					let parentScope = scope.get()
					output.push ASTE $parentScope.appendChild(document.createTextNode($text))
				onclosetag: #(name)
					scope.pop()
			},
			{
				+decodeEntities
			}
		)
		parser.write(html.value)
		parser.end()
		output.push rootElm
		ASTE $output

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
		if data? and data.type().inspect().toLowerCase().indexOf(\object) != -1
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
					let error = if $vRequest.status != 200; "HTTP Request failed, got an HTTP status of $($vRequest.statusText)"
					let response = $vRequest
					let text = response.responseText
					$vCallback.apply @, $callbackArgsAst
			$vRequest.open $method, $url, true
			$__headers
			$vRequest.send $data

macro dynInput
	syntax 'bind',':',inputName as (Identifier|Expression),comma as ','?,attrName as ('to',this as Identifier)?,type as ('as',this as Identifier)?
		type or= @ident \text
		unless comma?
			attrName or= inputName
			inputName := inputName.name
		attrName := attrName.name
		type := type.name
		////////////
		// Getter
		// - Text
		let getter = if type in ['text','textarea']
			let sel =
				if type == \text; \input
				else if type == \textarea; \textarea
			AST
				let node = $($sel & '[name="'&$inputName&'"]',@node)
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
				return for node in nodes; node.value
		// - Radio
		else if type == 'radio'
			AST
				let node = $('input[name="'&$inputName&'"]:checked',@node)
				node?.value
		////////////
		// Setter
		// - Text
		let setter = if type in ['text','textarea']
			let sel =
				if type == \text; \input
				else if type == \textarea; \textarea
			AST
				let node = $($sel & '[name="'&$inputName&'"]',@node)
				if node? and value?; node.value := value
		// - Select
		else if type == 'select'
			AST
				let node = $('select[name="'&$inputName&'"]',@node)
				if node?; node.value := value
		// - Checkbox
		else if type == 'checkbox'
			AST
				let node = $('input[name="'&$inputName&'"]',@node)
				if node?; node.checked := not not value
		// - MultiCheckbox
		else if type == 'multiCheckbox'
			AST
				for node in ($('input[name="'&$inputName&'"]',@node)[])
					node.checked :=
						if value?
							node.value in value
						else; false
		// - Radio
		else if type == 'radio'
			AST
				for node in ($('input[name="'&$inputName&'"]',@node)[])
					node.checked := node.value == value
		////////////
		// OnChange
		// - Text
		let onchange = if type in ['text','textarea']
			let sel =
				if type == \text; \input
				else if type == \textarea; \textarea
			AST
				do
					let mutable issued = false
					let reset()
						if issued == false
							issued := true
							setTimeout(
								# -> issued := false
								0
							)
							true
						else; false
					let node = $($sel & '[name="'&$inputName&'"]',@node)
					let onchange(e)@
						if not reset(); return
						let eventInfo = {
							attribute: $attrName
							value: node.value
						}
						@emitEvent 'attributeChange', eventInfo
						@emitEvent 'attributeChange.'&$attrName, eventInfo
					$(node):on keyup onchange
					$(node):on input onchange
						
		// - Select
		else if type == 'select'
			AST
				$('select[name="'&$inputName&'"]',@node):on change(e)@
					let eventInfo = {
						attribute: $attrName
						value: e.target.value
					}
					@emitEvent 'attributeChange', eventInfo
					@emitEvent 'attributeChange.'&$attrName, eventInfo
		// - Checkbox
		else if type == 'checkbox'
			AST
				$('input[name="'&$inputName&'"]',@node):on change(e)@
					let eventInfo = {
						attribute: $attrName
						value: e.target.checked
					}
					@emitEvent 'attributeChange', eventInfo
					@emitEvent 'attributeChange.'&$attrName, eventInfo
		// - MultiCheckbox
		else if type == 'multiCheckbox'
			AST
				$(@node):on change(e)@
					$(e.target):is 'input[name="'&$inputName&'"]'
						let eventInfo = {
							attribute: $attrName
							value: for selectedInput in ($('input[name="'&$inputName&'"]:checked',@node)[]); selectedInput.value
						}
						@emitEvent 'attributeChange', eventInfo
						@emitEvent 'attributeChange.'&$attrName, eventInfo
		// - Radio
		else if type == 'radio'
			AST
				$(@node):on change(e)@
					$(e.target):is 'input[name="'&$inputName&'"]'
						let eventInfo = {
							attribute: $attrName
							value: $getter
						}
						@emitEvent 'attributeChange', eventInfo
						@emitEvent 'attributeChange.'&$attrName, eventInfo
						
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

macro loadImage!(img,cb)
	let imgVar = @tmp \img
	AST
		let $imgVar = document.createElement(\img)
		$imgVar.onload := # -> cb()
		$imgVar.onerror := # -> cb 'Unable to load image "'&$img&'"'
		$imgVar.src := $img
