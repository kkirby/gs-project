import sys.Component

class! extends Component
	
	def isValueValid(value)
		if typeof! value == 'Object'
			for every key, subValue of value; @isValueValid subValue
		else
			not not (if value instanceof Array
				value.length
			else
				value)
	
	def compareValues(valueA,valueB)
		if typeof! valueA == \Object
			if typeof! valueB != \Object; return false
			for every key of value; @compareValues valueA[key], valueB[key]
		else
			if valueA instanceof Array
				if valueB not instanceof Array or valueA.length != valueB.length; return false
				for every itemA in valueA
					for some itemB in valueB; @compareValues itemA, itemB
			else
				valueA == valueB