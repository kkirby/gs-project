import .InlineStateMachine
import .#View as View

class! extends InlineStateMachine
	def view = View
	
	def controllerList = null
	def headerNode = null
	def contentNode = null
	def contentInnerNode = null
	def titleNode = null
	def backButtonNode = null
	def presenterNode = null
	def presenterCount = 0
	
	def setup(config = {})
		@headerNode := $('.NavigationControllerHeader',@node)
		@titleNode := $('.NavigationControllerHeaderTitle',@node)
		@contentNode := $('.NavigationControllerContent',@node)
		@contentInnerNode := $('.NavigationControllerContentInner',@node)
		@backButtonNode := $('.NavigationControllerHeaderBackButton',@node)
		@presenterNode := $('.NavigationControllerPresenter',@node)
		@presenterNode.parentNode.removeChild @presenterNode
		@controllerList := []
		$(@node):on render(e)@ -> @render e.detail
		$(@node):on present(e)@ -> @presentController e.detail
		$(@node):on dismiss(e)@ -> @dismissController e.detail
		$(@node):on goBack()@ -> @goBack()
		if config.defaultController?
			@render config.defaultController
		if config.className?
			$(@node):addClass config.className
		$(window):on resize @@.updateWidth
		$(@view):on afterShow()@ -> @updateWidth()
	
	def catchAll(handler,...data)
		if @controllerList.length > 0
			@controllerList[* - 1].handle handler, ...data
	
	def render(controller)
		die if @presenterCount > 0
		@controllerList.push controller
		@updateWidth()
		@view.addChildView controller.view, '.NavigationControllerContentInner'
		@updateTitle()
		@updateBackButton()
		if @controllerList.length > 1
			@view.iScroll.next(450)
	
	def blurAllInputs()
		let node = @controllerList[* - 1].view.node
		for input in $('input',node)[]
			input.blur()
			
	def presentController(controller)
		@blurAllInputs()
		@presenterCount += 1
		let presenter = @presenterNode.cloneNode true
		presenter.style.display := \none
		@controllerList.push controller
		$(@node):append presenter
		wait 1
			presenter.style.display := \block
			controller.view.show presenter
	
	def dismissController(controller)
		let position = @controllerList.indexOf controller
		die unless position != -1
		@blurAllInputs()
		@presenterCount -= 1
		@controllerList.splice position, 1
		let presenter = controller.node.parentNode
		$(presenter):addClass \Dismiss
		let eventName = Vendor \animationEnd
		let event = #(e)@
			die unless e.animationName == \hideNavigationPresenter
			presenter.removeEventListener eventName, event
			controller.view.hide()
			@node.removeChild presenter
		presenter.addEventListener eventName, event, false
		
	
	def updateBackButton()
		$(@node):toggleClass \EnableBackButton, @controllerList.length > 1
		if @controllerList.length > 1
			$(@backButtonNode):text @controllerList[* - 2].view.node.dataset.navigationTitle
	
	def updateAux()
		let controller = @controllerList[* - 1]
		$('.AuxRight',@headerNode):remove()
		if controller.auxRight?
			$(@headerNode):append controller.auxRight
	
	def updateTitle()
		$(@titleNode):text @controllerList[* - 1].view.node.dataset.navigationTitle
		@updateAux()
	
	def updateWidth()
		let contentWidth = @contentNode.clientWidth
		let resultWidth = contentWidth * @controllerList.length
		$(@contentInnerNode):css \width, resultWidth&'px'
		for controller in @controllerList
			$(controller.node):css \width, contentWidth&'px'
		@view.iScroll
			..wrapperWidth := contentWidth
			..scrollerWidth	:= resultWidth
			..maxScrollX := @view.iScroll.wrapperWidth - @view.iScroll.scrollerWidth
			..hasHorizontalScroll := true
			..wrapperOffset := @view.iScroll.wrapper.getClientRects()[0]
			.._execEvent \refresh
	
	def goBack()
		@blurAllInputs()
		let controller = @controllerList.pop()
		$(@view.iScroll):one scrollEnd()@
			controller.view.hide()
			@updateWidth()
		@updateTitle()
		@updateBackButton()
		@view.iScroll.prev(450)