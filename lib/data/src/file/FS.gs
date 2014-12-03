import .DirectoryEntry

class!
	def _fs = null
	dyn getName() -> @_fs.name
	def root = null
	@Factory := null
	
	def constructor(@_fs)
		@root := FS.Factory.get(@_fs.root,@)
	
	@ResolveLocalFileSystemURL := #(url)
		let resolveLocalFileSystemURL = GLOBAL.resolveLocalFileSystemURL ? GLOBAL.webkitResolveLocalFileSystemURL
		new Promise #(resolve,reject)
			resolveLocalFileSystemURL(
				url
				#(entry) -> resolve FS.Factory.get(entry)
				reject
			)
	
	@RequestFileSystem := #(type,size)
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
					#(fs) -> resolve FS.Factory.get(fs)
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
				