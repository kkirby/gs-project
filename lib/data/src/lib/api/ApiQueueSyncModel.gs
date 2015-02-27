import sys.Component

class! extends Component
	dyn def attr: queueItemCount = 0
	
	dyn getAttributeNames()
		* \queueItemCount
	
	dyn getAttributes()
		{@queueItemCount}
	
	dyn getAttributeLabels()
		queueItemCount: \Items