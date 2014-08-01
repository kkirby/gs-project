import .Component
import macro sys.webMacros

class! extends Component
	def node = null
	def _node = null
	def childViews = null
	def _isShowing = false
	
	def initialize()
		super.initialize()
		@node := @_node.cloneNode true
		@childViews := []
		@setup ...arguments
	
	dyn getIsVisible() -> @_isShowing
	
	def onVisible(callback)
		if @_isShowing
			callback()
		else
			$(@):one afterShow callback
	
	def addChildViews(childViews,selector)!
		@childViews := @childViews.concat childViews
		let node = if selector?
			$(selector,@node)
		else
			@node
		for view in childViews
			if @_isShowing
				view.beforeShow()
			$(node):append view.node
			if @_isShowing
				view.afterShow()
	
	def addChildView(childView,selector)!
		@addChildViews [childView], selector
	
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
		@emitEvent \afterShow
		@_isShowing := true
		for view in @childViews; view.afterShow()
	
	def beforeHide()
		@emitEvent \beforeHide
		for view in @childViews; view.beforeHide()
	
	def afterHide()
		@emitEvent \afterHide
		for view in @childViews; view.afterHide()
		@_isShowing := false
	
	def show(where)
		@beforeShow()
		(where ? document.body).appendChild @node
		@afterShow()
	
	def hide()
		@beforeHide()
		@node.parentNode?.removeChild @node
		@afterHide()