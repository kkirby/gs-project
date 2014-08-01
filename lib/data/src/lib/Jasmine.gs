import js sys.jasmine.jasmine
import js sys.jasmine.console
import js sys.jasmine.boot
import macro sys.macros
import macro sys.jasmine

class!
	@Execute := #(done = # ->, showColors = true)
		let env = jasmine.getEnv()
		let consoleReporter = new jasmine.ConsoleReporter({
			print: require('util').print
			onComplete: done
			showColors: showColors
			timer: new jasmine.Timer()
	    })
		env.addReporter(consoleReporter)
		env.execute()