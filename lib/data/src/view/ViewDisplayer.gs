import sys.Component
import sys.lib.Animation
import js sys.create

class! extends Component
	
	def slide(viewA,viewB)
		let targetA = {
			x: 0
		}
		let targetB = {
			x: 100
		}
		let timeline = new createjs.Timeline(
			* createjs.Tween.get(targetA)
				.to({x:-50},500,createjs.Ease.sineInOut)
				.call # -> viewA.hide()
			* createjs.Tween.get(targetB)
				.call # -> viewB.show viewA.node.parentNode
				.to({x:0},500,createjs.Ease.sineInOut)
		)
		createjs.Ticker.timingMode := createjs.Ticker.RAF
		createjs.Ticker.addEventListener(
			\tick
			#
				viewA.node
					..style[Vendor(\transform)] := 'translateX(' & targetA.x & '%)'
					..style.zIndex := 1
				viewB.node
					..style[Vendor(\transform)] := 'translateX(' & targetB.x & '%)'
					..style.zIndex := 2
		)
	
	def slidex(viewA,viewB,config = {})
		let orig = #
			if viewA.node.parentNode?
				start: # -> viewB.show viewA.node.parentNode
				end: # -> viewA.hide()
				func: #(e)
					let percent = e.percent
					viewA.node
						..style[Vendor(\transform)] := 'translateX(' & -1 * percent * 50 & '%)'
						..style.zIndex := 1
					viewB.node
						..style[Vendor(\transform)] := 'translateX(' & 100 - percent * 100 & '%)'
						..style.zIndex := 2
						..style[Vendor(\boxShadow)] := ((-8 * percent) max -4) & 'px 0px 5px 0px rgba(0,0,0,' & (1.5 * percent) min 0.75 & ')'
			else if viewB.node.parentNode?
				start: # -> viewA.show viewB.node.parentNode
				end: # -> viewB.hide()
				func: #(e)
					let percent = e.percent
					viewA.node
						..style[Vendor(\transform)] := 'translateX(' & -50 + percent * 50 & '%)'
						..style.zIndex := 1
					viewB.node
						..style[Vendor(\transform)] := 'translateX(' & 100 * percent & '%)'
						..style.zIndex := 2
						..style[Vendor(\boxShadow)] := ((-8 + 8 * percent) max -4) & 'px 0px 5px 0px rgba(0,0,0,' & (1.5 - 1.5 * percent) min 0.75 & ')'
		let ticker = orig.memoize()
		Animation.Animate({
			time: 500
			easing: \easeInOut
			func: #(e) -> ticker().func(e)
			start: #() -> ticker().start()
			end: #() -> ticker().end()
			name: \slide
		})