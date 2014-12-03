let Marquee = do
	
	let marqueeMessageNode = $('<div class="HeadlineMessage"></div>'):createDom()
	let marqueeMessageContainerNode = $('<div class="HeadlineWrapper"></div>'):createDom()
	let marqueeMessageScrollerNode = $('<div class="HeadlineWrappers"></div>'):createDom()
	let marqueeNode = $('<div class="Headline"></div>'):createDom()
	
	class MarqueeMessageContainer
		def node = null
		
		dyn getWidth()
			@node.getBoundingClientRect().width
		
		def constructor(node)
			@node := node ? marqueeMessageContainerNode.cloneNode true
		
		def addMessage(text)
			let messageNode = marqueeMessageNode.cloneNode(true)
			messageNode.innerHTML := text
			@node.appendChild messageNode
		
		def clone()
			MarqueeMessageContainer(@node.cloneNode true)
		
	class MarqueeMessageScroller
		def node = null
		def containers = null
		def marquee = null
		
		dyn getWidth()
			@node.getBoundingClientRect().width
		
		dyn def x = 0
			let set(x)
				if @containers.length == 2 and x > @containers[0].width
					let container = @containers.shift()
					let resX = x - container.width
					@node.removeChild container.node
					resX
				else
					x
			
			let afterSet(x)
				if @containers.length == 1 and x >= @width - @marquee.width
					let container = @containers[0].clone()
					@node.appendChild container.node
					@containers.push container
				@node.style.webkitTransform := 'translateX('&(-1 * @x)&'px)'
		
		def constructor(@marquee)
			@node := marqueeMessageScrollerNode.cloneNode true
			let firstContainer = MarqueeMessageContainer()
			@node.appendChild firstContainer.node
			@containers := [firstContainer]
		
		dyn getCurrentContainer() -> @containers[* - 1]
	
	class Marquee
		def scrollRate = 200
		def node = null
		def scroller = null
		def lastUpdateTime = null
		
		dyn getWidth()
			@node.getBoundingClientRect().width
		
		def constructor()
			@scroller := MarqueeMessageScroller(@)
			@node := marqueeNode.cloneNode true
			@node.appendChild @scroller.node
			GLOBAL.marquee := @
		
		def update()
			let lastUpdateTime = @lastUpdateTime ? new Date().getTime()
			let newTime = @lastUpdateTime := new Date().getTime()
			let rate = Math.round(((newTime - lastUpdateTime) / 1000) * @scrollRate)
			if @scroller.width > @width
				@scroller.x += rate
			requestAnimationFrame @@.update
	
	return Marquee

return Marquee
				