import .DirectoryEntry

class!
	def _fs = null
	dyn getName() -> @_fs.name
	def root = null
	def _factory = null
	
	def constructor(@_fs,@_factory)
		@root := @_factory.get(@_fs.root,@)
	
	@ResolveLocalFileSystemURL := #(url,factory)
		let resolveLocalFileSystemURL = GLOBAL.resolveLocalFileSystemURL ? GLOBAL.webkitResolveLocalFileSystemURL
		new Promise #(resolve,reject)
			resolveLocalFileSystemURL(
				url
				#(entry) -> resolve factory.get(entry)
				reject
			)
	
	@RequestFileSystem := #(type,size,factory)
		let requestFileSystem = GLOBAL.requestFileSystem ? GLOBAL.webkitRequestFileSystem
		let requestQuota = #(type,size,succ,err)
			if type == 1 and navigator.webkitPersistentStorage?
				navigator.webkitPersistentStorage.requestQuota(size,succ,err)
			else if type == 0 and navigator.webkitTemporaryStorage
				navigator.webkitTemporaryStorage.requestQuota(size,succ,err)
			else if webkitStorageInfo?.requestQuota?
				webkitStorageInfo.requestQuota(type,size,succ,err)
	
		new Promise #(resolve,reject)
			let request = #(grantedBytes)
				requestFileSystem(
					type
					grantedBytes ? size
					#(fs) -> resolve factory.get(fs)
					reject
				)
			if cordova?; request()
			else
				requestQuota(
					type
					size
					request
					reject
				)
				