class!
	def AddBasicArc(canvas)
		canvas.customAttributes.arc := #(cX, cY, inValue, total, R)
			let value = (inValue min total) max 0
            let alpha = (360 / total) * value
			let a = (90 - alpha) * (Math.PI / 180)
			let x = cX + R * Math.cos(a)
			let y = cY - R * Math.sin(a)
            let path =
				if total == value
                    [["M", cX, cY - R], ["A", R, R, 0, 1, 1, cX - 0.1, cY - R]]
                else
                    [["M", cX, cY - R], ["A", R, R, 0, toggle(alpha > 180,1,0), 1, x, y]]
			{path}
	
	def AddInverseArc(canvas)
		canvas.customAttributes.arc := #(cX, cY, inValue, total, R)
			let value = (inValue min total) max 0
            let alpha = (360 / total) * value
			let a = (90 - alpha) * (Math.PI / 180)
			let x = cY + R * Math.cos(a)
			let y = cX - R * Math.sin(a)
            let path = [["M", cX, cY - R], ["A", R, R, 1, toggle(alpha > 180,0,1), 0, x + toggle(value == 0,0.1,0), y]]
            {path}
	
	def CreateGraph(node,colorA,colorB)
		canvas.circle 18, 18, 15
			..attr \stroke, colorA
			..attr 'stroke-width', 4
		let progressPath = canvas.path()
			..attr \fill, ''
			..attr 'stroke-width', 4
			..attr \stroke, colorB
			..attr \arc, [18, 18, 30, 100, 15]
		#(percent,time,easing)
			progressPath.animate(
				{
					arc: [18, 18, percent, 100, 15]
				},
				time,
				easing
			)