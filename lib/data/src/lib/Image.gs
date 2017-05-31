import js sys.jpegEncoder
import js sys.canvasToBlob

let Bitwise = {
	IsBitInValue: #(bit,value) -> (value bitand bit) != 0
}

let Compare = {
	EqualTo: 1
	GreaterThan: 2
	LessThan: 4
	CondAnd: 8
	CondOr: 16
	FormatArguments: #(args)
		if args.length == 2
			args.push this.EqualTo
		args[1] := this.FormatOperator args[1]
		args
	FormatOperator: #(mutable operator)
		unless Bitwise.IsBitInValue(
			@EqualTo bitor @GreaterThan bitor @LessThan
			operator
		); operator := operator bitor @EqualTo
		unless Bitwise.IsBitInValue(
			@CondOr bitor @CondAnd
			operator
		); operator := operator bitor @CondAnd
		operator
	CompareValues: #(...args)
		let [a,operator,b] = @FormatArguments args
		let equalTo = Bitwise.IsBitInValue(@EqualTo,operator)
		if Bitwise.IsBitInValue @GreaterThan, operator
			if equalTo then $a >= $b else $a > $b
		else if Bitwise.IsBitInValue @LessThan, operator
			if equalTo then a <= b else $a < $b
		else if equalTo; a == b
	CompareValuesIf: #(...args)
		let conditional = args.shift()
		@FormatArguments args
		let result = @CompareValues(...args)
		if Bitwise.IsBitInValue(@CondOr,args[1])
			conditional or result
		else if Bitwise.IsBitInValue(@CondAnd,args[1])
			conditional and result
}

class Rect
	def x = 0
	def y = 0
	def width = 0
	def height = 0
	
	def constructor(@x = 0,@y = 0,@width = 0,@height = 0) ->
	
	@X := 1
	@Y := 2
	@Width := 4
	@Height := 8
	
	def compareTo(rect,parameters = Rect.X bitor Rect.Y bitor Rect.Width bitor Rect.Height,operator = Compare.EqualTo)
		let mutable result = true
		if Bitwise.IsBitInValue Rect.X, parameters
			result := Compare.CompareValuesIf result, @x, operator bitxor Compare.CondOr, rect.x
		if Bitwise.IsBitInValue Rect.Y, parameters
			result := Compare.CompareValuesIf result, @y, operator, rect.y
		if Bitwise.IsBitInValue Rect.Width, parameters
			result := Compare.CompareValuesIf result, @width, operator, rect.width
		if Bitwise.IsBitInValue Rect.Height, parameters
			result := Compare.CompareValuesIf result, @height, operator, rect.height
		result
	
	dyn getAspectRatio() -> @width / @height
	
	@CENTER := 1
	@NO_ENLARGE := 2
	@FILL := 4
	def fitInsideOf(rect,flags = 0)
		let ratio = @aspectRatio
		let mutable x = @x
		let mutable y = @y
		let mutable width = null
		let mutable height = null
		if Bitwise.IsBitInValue Rect.NO_ENLARGE, flags
			if rect.width >= @width and rect.height >= @height
				width := @width
				height := @height
		if width == null and height == null
			if Bitwise.IsBitInValue Rect.FILL, flags
				width := rect.width
				height := width / ratio
				if height < rect.height
					height := rect.height
					width := height * ratio
			else
				width := rect.width
				height := width / ratio
				if height > rect.height
					height := rect.height
					width := height * ratio
		if Bitwise.IsBitInValue Rect.CENTER, flags
			if height > rect.height
				y := (rect.height - height) / 2
			if width > rect.width
				x := (rect.width - width) / 2
		Rect x, y, width, height

class CopyData
	def image = null
	def rect = null
	
	def constructor(@image,@rect) ->


class Image
	def canvas = null
	def context = null
	
	def constructor(@canvas)
		@context := @canvas.getContext '2d'
	
	@CreateNew := #(width,height)
		let canvas = document.createElement \canvas
		canvas
			..width := width
			..height := height
		Image(canvas)
		
	@CreateFromUrl := #(src)
		let img = document.createElement \img
		img.src := src
		@CreateFromImage img
	
	@CreateFromImage := #(image)
		let createImage()@
			let res = @CreateNew image.width, image.height
			res.context.drawImage image, 0, 0, image.width, image.height
			res
		
		new Promise #(fulfill,reject)
			if image.width > 0; fulfill createImage()
			else
				image.onload := # -> fulfill createImage()
				image.onerror := reject
	
	def copy(sourceRect = @rect)
		CopyData @, sourceRect
	
	def paste(copyData,destRect = @rect)
		let source = copyData.image
		let sourceRect = copyData.rect
		@context.drawImage(
			source.context.canvas
			sourceRect.x, sourceRect.y
			sourceRect.width, sourceRect.height
			destRect.x, destRect.y
			destRect.width, destRect.height
		)
		@
	
	def crop(sourceRect) -> Image.CreateNew(sourceRect.width,sourceRect.height).paste(@copy(sourceRect))
	
	def resize(destRect) -> Image.CreateNew(destRect.width,destRect.height).paste(@copy())
	
	def duplicate() -> Image.CreateNew(@width,@height).paste(@copy())
	
	def renderJpegAsync(quality = 90,raw = false) -> JPEGEncoder @getData(), quality, raw
	
	def renderJpeg(quality = 90,raw = false)
		new Promise #(fulfill,reject)@
			if raw
				@canvas.toBlob(
					fulfill
					'image/jpeg'
					quality
				)
			else
				fulfill @canvas.toDataURL 'image/jpeg', quality
		
		
		
	def getData(rect = @rect) -> @context.getImageData rect.x, rect.y, rect.width, rect.height
	def putData(data,rect = @rect) -> @context.putImageData data, rect.x, rect.y
	
	dyn getWidth() -> @canvas.width
	dyn getHeight() -> @canvas.height
	dyn getRect() -> Rect 0, 0, @width, @height
	
	def fitTo(rect)
		let result = Image.CreateNew(rect.width,rect.height)
		let destRect = @rect.fitInsideOf(result.rect,Rect.FILL)
		result.paste(
			@resize(destRect).crop(result.rect.fitInsideOf(destRect,Rect.CENTER)).copy()
		)

Image <<< {
	CopyData
	Rect
	Compare
	Bitwise
}