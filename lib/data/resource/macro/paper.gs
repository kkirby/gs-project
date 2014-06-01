macro operator binary pAdd
	AST
		$left.add $right
		
macro operator binary pSub
	AST
		$left.subtract $right

macro operator binary pDiv
	AST
		$left.divide $right

macro operator binary pMul
	AST
		$left.multiply $right
		
macro operator binary pMod
	AST
		$left.modulo $right