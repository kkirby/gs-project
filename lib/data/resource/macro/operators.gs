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

macro operator binary ?^
	AST
		if ($left)?
			$right $left
			return null

macro operator binary restrictTo
	let minNumber = right.args[0]
	let maxNumber = right.args[1]
	ASTE (($left min $maxNumber) max $minNumber)

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

macro operator binary arrayFill
    let values = []
    for i in 0 til right.value
    	values.push left
    @internalCall \array, values

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

macro operator binary <<<?
	@maybe-cache right, #(setRight, right)
		AST
			if typeof $setRight == \object
				$left <<< $right
			$right

macro helper __compare = #(a,b)
	let [aType,bType] = [typeof a,typeof b]
	if aType != bType; return false
	if a instanceof Array
		f b not instanceof Array or a.length != b.length; return false
		return for every aValue, aKey in a
			__compare b[aKey], aValue
	else if aType == \object
		let [aTypeName,bTypeName] = [typeof! a,typeof! b]
		if aTypeName != bTypeName; return false
		if aTypeName == \Object
			return for every aKey, aValue of a
				__compare b[aKey], aValue
		else if typeof a.compare == \function
			return a.compare b
	a == b
			

macro operator binary <~=>
	AST
		__compare $left, $right

macro operator binary arrayRemoveItem
	let index = @tmp \index
	AST
		let $index = $left.indexOf $right
		if $index != -1
			$left.splice $index, 1