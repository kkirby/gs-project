import js sys.raphael
import sys.stateMachine.#

class! extends StateMachine
	
	def getStates()
		* \idle
		* \ticking
	
	def initialState = \idle
	def currentStateName = \idle
	
	def frameListeners = null
	
	def framer = if GLOBAL.requestAnimationFrame?
		GLOBAL@.requestAnimationFrame
	else
		#(func) -> setTimeout func, 1000 / 60
	
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
		listener.end?()
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
			@framer #@ -> @handle \tick
		
		def tick()
			let tickTime = new Date().getTime()
			for frameListener in @frameListeners.concat([])
				if frameListener.startTime <= tickTime
					if frameListener.data.state == \stopped; continue
					if frameListener.data.state == \idle; frameListener.start?()
					let timeDelta = tickTime - frameListener.startTime
					let percent = timeDelta / frameListener.duration min 1
					let easingPercent = toggle(percent == 1,percent,frameListener.easing(percent))
					frameListener.data
						..timeDelta := timeDelta
						..percent := easingPercent
						..timePercent := percent
						..state := \running
					frameListener.func frameListener.data
					if percent == 1
						@removeFrameListener frameListener
			@handle \requestTick

	def _processArguments(args)
		let result = {
			easing: \linear
			delay: 0
			time: null
			func: null
			start: null
			end: null
			name: null
		}
		if args.length == 1 and typeof args[0] == \object
			result <<< args[0]
		else
			for arg in args
				let type = typeof arg
				if type == \function
					if result.func == null
						result.func := arg
					else if result.start == null
						result.start := arg
					else if result.end == null
						result.end := arg
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
			options.start
			options.end
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
	
	def AnimateValues(start,end,...args)
		die if start <~=> end
		let options = @_processArguments args
			..data := value: null
		let distances = {}
		for key, value of start
			distances[key] := end[key] - value
		let oldFunc = options.func
		options.func := #(data)
			data.value := {}
			for key, value of start
				data.value[key] := Math.round((value + distances[key] * data.percent) * 1000) / 1000
			oldFunc data
		@Animate options
class!()