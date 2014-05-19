import .Uuid

class!
	@Events := {
		\intentStart,
		\intentEnd,
		\intentClick
	}
	
	/*do
		$(document):on(\touchstart) #(e) ->
		$(document):on(\touchend) #(e) ->*/
		
	@IsElementInBounds := #(element,bounds)
		let rect = element.getClientRects()[0]
		let extra = parseInt(element.dataset.touchArea,10)
		rect.top -= extra
		rect.right += extra
		rect.bottom += extra
		rect.left -= extra
		return bounds.y between [rect.top,rect.bottom] and bounds.x between [rect.left,rect.right]
	
	@GetBoundsFromEvent := #(event)
		let mutable area = event
		if event.changedTouches?
			area := event.changedTouches[0]
		return {
			y: area.pageY,
			x: area.pageX
		}
	let isTouchSupported = not not ((GLOBAL haskey \ontouchstart) or (GLOBAL.DocumentTouch and document instanceof GLOBAL.DocumentTouch))
	@BindToElement := #(userOptions)
		let options = {
			down: #->
			up: #->
			click: #->
			selector: '*'
			element: null
			disableMove: false
			exactSelection: false
		} <<< userOptions
		
		unless options.selector == '*' or options.exactSelection
			options.selector := options.selector&', '&options.selector&' *'
		
		let mutable isActive = false
		let mutable didStart = false
		let uuid = Uuid.Fast()
		
		let shouldDisableMove = if typeof options.disableMove == \boolean
			# -> options.disableMove
		else if typeof options.disableMove == \string
			#(moveEventObject) -> $(moveEventObject.target):eIs options.disableMove
			
		
		// Proxy event binds
		
		// Down
		$(options.element):on @Events.intentStart: (e)
			if e.detail?.uuid == uuid
				isActive := true
				options.down.apply(@,[e.detail.event])
		// Up
		$(options.element):on @Events.intentEnd: (e)
			if e.detail?.uuid == uuid
				isActive := false
				options.up.apply(@,[e.detail.event])
		// Click
		$(options.element):on @Events.intentClick: (e)
			if e.detail?.uuid == uuid
				options.click.apply(@,[e.detail.event])
		
		// Real event binds
		if isTouchSupported
			// Down
			$(options.element):on touchstart(startEventObject)!
				unless startEventObject.target.matchesSelector(options.selector) then return true
				didStart := true
				startEventObject.stopPropagation()
				$(@):trigger(
					IntentClick.Events.intentStart,
					{
						event: startEventObject
						uuid
					}
				)
			// Move
			$(options.element):on touchmove(moveEventObject)!
				if didStart
					moveEventObject.preventDefault()
					let inArea = IntentClick.IsElementInBounds(
						moveEventObject.target,
						IntentClick.GetBoundsFromEvent(moveEventObject)
					)
					let eventDetail = {
						event: moveEventObject
						uuid
					}
					if shouldDisableMove(moveEventObject)
						$(@):trigger(
							IntentClick.Events.intentEnd,
							eventDetail
						)
					else
						if not isActive and inArea
							$(@):trigger(
								IntentClick.Events.intentStart,
								eventDetail
							)
						else if isActive and not inArea
							$(@):trigger(
								IntentClick.Events.intentEnd,
								eventDetail
							)
			// Up
			$(options.element):on touchend(endEventObject)! 
				didStart := false
				if isActive
					endEventObject.stopPropagation()
					$(@):trigger(
						IntentClick.Events.intentEnd,
						{
							event: endEventObject
							uuid
						}
					)
					$(@):trigger(
						IntentClick.Events.intentClick,
						{
							event: endEventObject
							uuid
						}
					)
		else
			$(options.element):on mousedown(startEventObject)!
				unless startEventObject.target.matchesSelector(options.selector) then return true
				$(@):trigger(
					IntentClick.Events.intentStart,
					{
						event: startEventObject
						uuid
					}
				)
			$(options.element):on mouseup(stopEventObject)!
				unless stopEventObject.target.matchesSelector(options.selector) then return true
				$(@):trigger(
					IntentClick.Events.intentEnd,
					{
						event: stopEventObject
						uuid
					}
				)
			$(options.element):on click(clickEventObject)!
				unless clickEventObject.target.matchesSelector(options.selector) then return true
				let eventDetail = {
					event: clickEventObject
					uuid
				}
				$(@):trigger(
					IntentClick.Events.intentClick,
					eventDetail
				)
				$(@):trigger(
					IntentClick.Events.intentEnd,
					eventDetail
				)