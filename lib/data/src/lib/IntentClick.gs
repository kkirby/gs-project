import .Uuid
import macro sys.webMacros

class!
	@Events := {
		\intentStart,
		\intentEnd,
		\intentClick
	}
	
	let nonTouchEvents = 
		if PointerEvent?
			{down: \pointerdown
			move: \pointermove
			up: \pointerup}
		else
			{down: \mousedown
			move: \mousemove
			up: \mouseup}
	
	@DefaultInit := #(down,up,click)
		IntentClick.BindToElement {
			selector: '.Clickable'
			down: #(e)
				$(e.target):addClass \Down
				down?(e)
			up: #(e)
				$(e.target):removeClass \Down
				up?(e)
			click: #(e)@
				click?(e)
				unless isEmpty(e.target.dataset.event)
					$(e.target):trigger(e.target.dataset.event,e)
			element: $('body')
			disableMove: '.DisableMove *'
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
				unless startEventObject.target.matches(options.selector) then return true
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
					if shouldDisableMove(moveEventObject) and not inArea
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
			let mutable targetElement = null
			
			$(options.element):on(nonTouchEvents.down):(startEventObject)!
				unless startEventObject.target.matches(options.selector) then return true
				targetElement := startEventObject.target
				didStart := true
				$(targetElement):trigger(
					IntentClick.Events.intentStart,
					{
						event: startEventObject
						uuid
					}
				)
				
			$(options.element):on(nonTouchEvents.move):(moveEventObject)!
				if didStart
					moveEventObject.preventDefault()
					moveEventObject.customTarget := targetElement
					let inArea = IntentClick.IsElementInBounds(
						targetElement,
						IntentClick.GetBoundsFromEvent(moveEventObject)
					)
					let eventDetail = {
						event: moveEventObject
						uuid
					}
					if shouldDisableMove(moveEventObject) and not inArea
						$(targetElement):trigger(
							IntentClick.Events.intentEnd,
							eventDetail
						)
					else
						if not isActive and inArea
							$(targetElement):trigger(
								IntentClick.Events.intentStart,
								eventDetail
							)
						else if isActive and not inArea
							$(targetElement):trigger(
								IntentClick.Events.intentEnd,
								eventDetail
							)
			
			$(options.element):on(nonTouchEvents.up):(stopEventObject)!
				unless stopEventObject.target.matches(options.selector) then return true
				unless didStart and isActive then return true
				stopEventObject.customTarget := targetElement
				didStart := false
				$(targetElement):trigger(
					IntentClick.Events.intentEnd,
					{
						event: stopEventObject
						uuid
					}
				)
				$(targetElement):trigger(
					IntentClick.Events.intentClick,
					{
						event: stopEventObject
						uuid
					}
				)
			
			/*$(options.element):on click(clickEventObject)!
				unless clickEventObject.target.matches(options.selector) or isActive then return true
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
				)*/