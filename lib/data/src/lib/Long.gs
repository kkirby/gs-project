import js sys.goog.math.Long

class!
	def _internal = null
	
	def constructor(input)
		if typeof input == \number
			@_internal := goog.math.Long.fromNumber(input)
		else
			@_internal := input
	
	@FromNumber := #(value)
		class!(goog.math.Long.fromNumber(value))
	
	@FromInt := #(value)
		class!(goog.math.Long.fromInt(value))
	
	@FromString := #(str,opt_radix)
		class!(goog.math.Long.fromString(str,opt_radix))
	
	def add(other)
		@_internal := @_internal.add other._internal
		@
	
	def and(other)
		@_internal := @_internal.and other._internal
		@
	
	def compare(other)
		@_internal.compare other
	
	def div(other)
		@_internal := @_internal.div other._internal
		@
	
	def equals(other)
		@_internal.equals other._internal
	
	def getHighBits()
		@_internal.getHighBits()

	def getLowBits()
		@_internal.getLowBits()
	
	def getLowBitsUnsigned()
		@_internal.getLowBitsUnsigned()
	
	def getNumBitsAbs()
		@_internal.getNumBitsAbs()
	
	def greaterThan(other)
		@_internal.greaterThan other._internal
	
	def greaterThanOrEqual(other)
		@_internal.greaterThanOrEqual other._internal
	
	def isNegative()
		@_internal.isNegative()
	
	def isOdd()
		@_internal.isOdd()
	
	def isZero()
		@_internal.isZero()
	
	def lessThan(other)
		@_internal.lessThan other._internal
		@
	
	def lessThanOrEqual(other)
		@_internal.lessThanOrEqual other._internal
	
	def modulo(other)
		@_internal := @_internal.modulo other._internal
		@
	
	def multiply(other)
		@_internal := @_internal.multiply other._internal
		@
	
	def negate()
		@_internal := @_internal.negate()
		@
	
	def not()
		@_internal := @_internal.not()
		@
	
	def notEqual(other)
		@_internal.notEqual other._internal
	
	def or(other)
		@_internal := @_internal.or other._internal
		@
	
	def shiftLeft(numBits)
		@_internal := @_internal.shiftLeft numBits
		@
	
	def shiftRight(numBits)
		@_internal := @_internal.shiftRight numbits
		@
	
	def shiftRightUnsigned(numBits)
		@_internal := @_internal.shiftRightUnsigned numBits
		@
	
	def subtract(other)
		@_internal := @_internal.subtract other._internal
		@
	
	def toInt()
		@_internal.toInt()
	
	def toNumber()
		@_internal.toNumber()
	
	def toString(opt_radix)
		@_internal.toString opt_radix
	
	def xor(other)
		@_internal := @_internal.xor other._internal
		@
		
		