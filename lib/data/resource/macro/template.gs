macro TemplateNodeDisposedEvent()
	AST
		let evt = document.createEvent \CustomEvent
		evt.initCustomEvent \TemplateNodeDisposed, false, true
		evt

GLOBAL.TemplateNodeDisposedEvent := TemplateNodeDisposedEvent()
// BASENODE

macro TemplateSet(key,value)
	GLOBAL.__Template.set key, value
	
macro TemplateGet(key)
	GLOBAL.__Template.get key
	
macro TemplateNest()
	GLOBAL.__Template.nest()
	ASTE null

macro TemplateUnnest()
	GLOBAL.__Template.unnest()
	ASTE null
	
macro TemplateStarted()
	GLOBAL.__Template.templateStarted()
	ASTE null
	
macro TemplateEnded()
	GLOBAL.__Template.templateEnded()
	ASTE null

macro TemplateStart
	syntax node as Expression, code as Body
		unless GLOBAL.__Template?
			class __Template
				def count = 0
				def stack = null
				def current = null
				def constructor(@current = {},@stack = [@current]) ->
		
				def get(key) -> @current[key]
				def set(key,value) -> @current[key] := value
	
				def nest()
					let newItem = Object.create @current
					newItem.$parent := @current
					@current := newItem
					@stack.push @current
	
				def unnest()
					@stack.pop()
					@current := @stack[*-1]
				
				def templateStarted()
					@count := @count + 1
				
				def templateEnded()
					@count := @count - 1
					if @count == 0
						GLOBAL.__Template := null

			GLOBAL.__Template := __Template()
		let data = @tmp \data, true
		let ret = AST
			$node.parentNode.removeChild $node
			#($data)!
				TemplateStarted()
				let TemplateNode = $node.cloneNode true
				TemplateSet \baseNode, TemplateNode
				TemplateSet \data, $data
				$code
				TemplateEnded()
				TemplateNode.DestoryTemplate := #
					TemplateNode.dispatchEvent TemplateNodeDisposedEvent()
					TemplateNode.parentNode.removeChild TemplateNode
				return TemplateNode
		return ret


macro TemplateBindToData
	syntax data as Expression,',',args as InvocationArguments
		let args2 = @internal-call \array, args
		AST
			$data.addEventListener ...$args2
		
macro TemplateUnBindToData
	syntax data as Expression,',',args as InvocationArguments
		let args2 = @internal-call \array, args
		AST
			$data.removeEventListener ...$args2
// templates have enabled/disabled states, don't mutate in disabled.
// component events can be muted temporaraly
// 
macro TemplateForeach
	syntax data as Expression,'as',_baseNode as Expression,iterate as Body
		let itemAdded = @tmp \itemAdded, true
		let itemRemoved = @tmp \itemRemoved, true
		let node = @tmp \node, true
		let index = @tmp \index, true
		let item = @tmp \item, true
		let itemNode = @tmp \itemNode, true
		let nodeRemoved = @tmp \nodeRemoved, true
		let baseNode = @tmp \baseNode, true
		AST
			let $baseNode = $_baseNode
			let $itemNode = $baseNode.firstElementChild
			$baseNode.removeChild $itemNode
			let $itemAdded = #($index,$item)!
				let $node = $itemNode.cloneNode true
				if $index == $baseNode.children.length
					$baseNode.appendChild $node
				else
					$baseNode.insertBefore $node, $baseNode.children[index-1]
				TemplateNest()
				TemplateSet \index, $index
				TemplateSet \data, $item
				TemplateSet \baseNode, $node
				$iterate
				TemplateUnnest()
			let $itemRemoved = #(item,index)!
				let node = $baseNode.children[index]
				node.dispatchEvent TemplateNodeDisposedEvent()
				$baseNode.removeChild $baseNode.children[index]
			TemplateBindToData $data, \itemAdded, $itemAdded
			TemplateBindToData $data, \itemRemoved, $itemRemoved
			let $nodeRemoved = #!
				console.log \nodeRemoved
				TemplateUnBindToData $data, \itemAdded, $itemAdded
				TemplateUnBindToData $data, \itemRemoved, $itemRemoved
				$baseNode.removeEventListener \TemplateNodeDisposed, $nodeRemoved
				for child in $baseNode.children
					child.dispatchEvent TemplateNodeDisposedEvent()
			(TemplateGet \baseNode).addEventListener \TemplateNodeDisposed, $nodeRemoved, false
			for item, index in $data.items
				$itemAdded index, item

macro TemplateOnDataChange
	syntax node as Expression,',',data as Expression,',',attribute as Expression,code as Body
		let attributeChanged = @tmp \attributeChanged, true
		let _node = @tmp \node, true
		let nodeDisposed = @tmp \nodeDisposed, true
		AST
			let $_node = $node
			let $attributeChanged = #(item,attribute,value)!
				TemplateNest()
				TemplateSet \node, $_node
				TemplateSet \item, item
				TemplateSet \attribute, attribute
				TemplateSet \value, value
				$code
				TemplateUnnest()
			TemplateBindToData $data, \attributeChanged, $attribute, $attributeChanged
			let $nodeDisposed = #!
				console.log \nodeRemoved
				TemplateUnBindToData $data, \attributeChanged, $attribute, $attributeChanged
				(TemplateGet \baseNode).removeEventListener \TemplateNodeDisposed, $nodeDisposed
			(TemplateGet \baseNode).addEventListener \TemplateNodeDisposed, $nodeDisposed, false
			$attributeChanged $data, $attribute, $data[$attribute]
			
macro TemplateInTemplate(_node,data,template)
	let node = @tmp \node, true
	let baseNode = @tmp \baseNode, true
	let nodeRemoved = @tmp \nodeRemoved, true
	AST
		let $baseNode = TemplateGet \baseNode
		let $node = $_node
		$node.parentNode.replaceChild $template($data), $node
		let $nodeRemoved = #!
			console.log \nodeRemoved
			$baseNode.removeEventListener \TemplateNodeDisposed, $nodeRemoved
			$node.dispatchEvent TemplateNodeDisposedEvent()
		$baseNode.addEventListener \TemplateNodeDisposed, $nodeRemoved, false
		

macro TemplateText(node,data,attribute)
	let value = @tmp \value
	AST
		TemplateOnDataChange $node, $data, $attribute
			((TemplateGet \node).innerText) := TemplateGet \value

macro TemplateShowIf(node,data,attribute)
	AST
		TemplateOnDataChange $node, $data, $attribute
			((TemplateGet \node).style.display) := if TemplateGet(\value) then \block else \none
