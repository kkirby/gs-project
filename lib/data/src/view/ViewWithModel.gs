import .View

class! extends View
	dyn def attr: model
		let beforeSet()
			if @model?; @removeModelEventListeners()
		let afterSet()
			if @model?; @addModelEventListeners()
	
	def _modelEventListener = null
	def _modelAttributes = null
	def _modelAttributeNodes = null
	
	def getModelAttributes() -> []
	
	def setup()
		callSuper setup
		@_modelEventListener := #(e)@ -> @_onModelAttributeChange e.data.attribute, e.data.value
		@_modelAttributes := @getModelAttributes()
		@_modelAttributeNodes := @_getModelAttributeNodes()

	def _getModelAttributeNodes()
		let nodes = {}
		for attribute in @_modelAttributes
			nodes[attribute] := $("*[data-model-attribute=\"$(attribute)\"]",@node)[]
		nodes
	
	def addModelEventListeners()
		for attribute in @_modelAttributes
			@model.addEventListener 'attributeChange.'&attribute, @_modelEventListener
			@_onModelAttributeChange attribute, @model[attribute]
	
	def removeModelEventListeners()
		for attribute in @_modelAttributes
			@model.removeEventListener 'attributeChange.'&attribute, @_modelEventListener
	
	def formatModelAttribute(attribute,value) -> value
	
	def _onModelAttributeChange(attribute,mutable value)
		let nodes = @_modelAttributeNodes[attribute]
		for node in nodes
			die unless node?
			if node.dataset.showIf?
				$(node):toggle @formatModelAttribute(attribute,value)?
			else if node.dataset.cssClassIf? and node.dataset.cssClassIf != ''
				$(node):toggleClass node.dataset.cssClassIf, @formatModelAttribute attribute, value
			else
				$(node):html @formatModelAttribute attribute, value
		
		