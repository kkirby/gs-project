import js sys.raphael
import sys.stateMachine.#

class! extends StateMachine
	
	def getStates()
		* \idle
		* \ticking
	
	def initialState = \idle
	
	def frameListeners = null
	
	def initialize()
		superArg()
		@frameListeners := []
	
	def addFrameListener(listener)
		/**
		 * We don't need to call listenersUpdated if we're stopping
		 * an animation because stopping calls listenersUpdated
		 */
		let previousAnimation = if listener.name?; @GetAnimationByName listener.name
		@frameListeners.push listener
		if previousAnimation?; previousAnimation.data.stop()
		else; @handle \listenersUpdated
	
	def removeFrameListener(listener)
		@frameListeners arrayRemoveItem listener
		listener.data.state := \stopped
		@handle \listenersUpdated
	
	def GetAnimationByName(name)
		return for first frameListener in @frameListeners
			if frameListener.name == name; frameListener
	
	defState idle
		def listenersUpdated()
			if @frameListeners.length > 0; @transition \ticking
	
	defState ticking
		def enter() -> @handle \requestTick
		
		def listenersUpdated()
			if @frameListeners.length == 0; @transition \idle
		
		def requestTick()
			requestAnimationFrame #@ -> @handle \tick
		
		def tick()
			let tickTime = new Date().getTime()
			for frameListener in @frameListeners.concat([])
				if frameListener.startTime <= tickTime
					if frameListener.data.state == \stopped; continue
					let timeDelta = tickTime - frameListener.startTime
					let percent = timeDelta / frameListener.duration min 1
					let easingPercent = toggle(percent == 1,percent,frameListener.easing(percent))
					frameListener.data
						..timeDelta := timeDelta
						..percent := easingPercent
						..timePercent := percent
						..state := \running
					frameListener.func frameListener.data
					if percent == 1; @removeFrameListener frameListener
			@handle \requestTick

	def _processArguments(args)
		if args.length == 1 and typeof args[0] == \object
			args[0]
		else
			let result = {
				easing: \linear
				delay: 0
				time: null
				func: null
				name: null
			}
			for arg in args
				let type = typeof arg
				if type == \function
					if result.func == null
						result.func := arg
					else
						result.easing := arg
				else if type == \number
					if result.time == null
						result.time := arg
					else
						result.delay := arg
				else if type == \string
					if Raphael.easing_formulas ownskey arg
						result.easing := arg
					else
						result.name := arg
				else if type == \object
					result <<< arg
			result

	def Animate(...args)
		let options = @_processArguments args
		let frameListener = {
			easing: toggle(typeof options.easing == \string,Raphael.easing_formulas[options.easing],options.easing)
			options.func
			startTime: new Date().getTime() + options.delay
			duration: options.time
			name: options.name
			data: {
				percent: null
				timePercent: null
				state: \idle
				timeDelta: null
				stop: #()@
					die if frameListener.data.state == \stopped
					@removeFrameListener frameListener
			} <<< options.data
		}
		@addFrameListener frameListener
		frameListener.data
	
	def AnimateValue(start,end,...args)
		die if start == end
		let options = @_processArguments args
			..data := value: null
		let distance = end - start
		let oldFunc = options.func
		options.func := #(data)
			data.value := Math.round((start + distance * data.percent) * 1000) / 1000
			oldFunc data
		@Animate options
class!()