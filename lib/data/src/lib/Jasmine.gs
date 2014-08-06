import js sys.jasmine.jasmine
import js sys.jasmine.console
import js sys.jasmine.boot
import macro sys.macros
import macro sys.jasmine

class!
	@Execute := #(onComplete = # ->, showColors = true, verbose = false, sentences = false)
		let env = jasmine.getEnv()
		let consoleReporter = new jasmine.ConsoleReporter({
			print: require('util').print
			timer: new jasmine.Timer()
			onComplete
			showColors
			verbose
			sentences
	    })
		env.addReporter(consoleReporter)
		env.execute()