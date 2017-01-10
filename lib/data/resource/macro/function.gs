macro func!
	syntax 'defer', '(', time as Expression, ')', func as Expression
		 ASTE ($func).defer($time)