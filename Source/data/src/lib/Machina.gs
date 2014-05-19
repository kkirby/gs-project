import js sys.underscore
import js sys.machina
import macro sys.fsm

let Machina = #(config)
	machina.Fsm.extend config
	
Machina.State := #(page,config = {})
		let oldOnEnter = config._onEnter
		let oldOnExit = config._onExit
		config._onEnter := #
			if page?
				App.show page
			if oldOnEnter?
				oldOnEnter.apply this, arguments
		config._onExit := #
			if page?
				App.hide page
			if oldOnExit
				oldOnExit.apply this, arguments
		config	

Machina