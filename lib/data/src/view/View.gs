import sys.Component

class! extends Component
	def node = null
	def childViews = null
	def _isShowing = false
	
	def initialize()
		superArg()
		@node := @node.cloneNode true
		@childViews := []
		@setup ...arguments
	
	dyn getIsVisible() -> @_isShowing
	
	def onVisible(callback)
		if @_isShowing; callback()
		else; _(@):one afterShow callback
	
	def addChildViews(childViews,selector)!
		@childViews := @childViews.concat childViews
		let node =
			if selector?
				if typeof selector == \string; $(selector,@node)
				else; selector
			else
				@node
		for view in childViews
			if @_isShowing; view.beforeShow()
			$(node):append view.node
			if @_isShowing; view.afterShow()
	
	def addChildView(childView,selector)!
		@addChildViews [childView], selector
	
	def removeChildViews(childViews)
		for childView in childViews; @removeChildView childView
	
	def removeChildView(childView)
		@childViews arrayRemoveItem childView
		childView.hide()
	
	def _bindingSetup() ->
	def setup()
		@_bindingSetup()
		
	def beforeShow()
		@emitEvent \beforeShow
		for view in @childViews; view.beforeShow()
	
	def afterShow()
		@_isShowing := true
		@emitEvent \afterShow
		for view in @childViews; view.afterShow()
	
	def beforeHide()
		@emitEvent \beforeHide
		for view in @childViews; view.beforeHide()
	
	def afterHide()
		@_isShowing := false
		@emitEvent \afterHide
		for view in @childViews; view.afterHide()
	
	def show(where)
		@beforeShow()
		(where ? document.body).appendChild @node
		@afterShow()
	
	def hide()
		@beforeHide()
		$(@node):remove()
		@afterHide()
	
	def showAnimate()
		$(@node):css \display, \block
		$(@node):one afterAnimate()@
			$(@node):removeClass \ShowAnimate
		$(@node):addClass \ShowAnimate
	
	def hideAnimate(remove = false)
		$(@node):one afterAnimate()@
			$(@node):removeClass \HideAnimate
			if remove; @hide()
			else; $(@node):css \display, \none
		$(@node):addClass \HideAnimate
			