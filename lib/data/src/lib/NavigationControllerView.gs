import .View
import html sys.navigationController as ViewNode
import css sys.navigationController
import js sys.iscroll

class! extends View
	def _node = ViewNode
	def iScroll = null
	
	def setup()
		@iScroll := new IScroll $('.NavigationControllerContent',@node), {
			snap: true
			snapThreshold: 1
			bounce: false
			momentum: false
			scrollX: true
			scrollY: false
		}
		@iScroll.disable()
	
	def afterShow()
		callSuper afterShow
		@iScroll.refresh()