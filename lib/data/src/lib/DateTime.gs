import js sys.moment

class!
	@CurrentTime := # -> moment.utc().format('YYYY-MM-DDTHH:mm:ss.SSSSZ')
	@Parse := #(str) -> moment.utc(str,'YYYY-MM-DDTHH:mm:ss.SSSSZ').local()