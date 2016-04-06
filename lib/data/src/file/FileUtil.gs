import .Factory
import .FS
class!
	@ResolveLocalFileSystemURL :=  #(url) -> FS.ResolveLocalFileSystemURL url, Factory
	@RequestFileSystem := #(type,size) -> FS.RequestFileSystem type, size, Factory
	@FacadeData := #(data) -> Factory.get data
	@DIR := 0
	@FILE := 1
	@GetItem := #(path,size = 1024 * 1024 * 5,type = @FILE,options = {+create,-exclusive})**
		let fs = yield @RequestFileSystem(1,size)
		let pathSegments = path.replace(r'^file://','').split '/'
		let basename = pathSegments.pop()
		let dir = yield fs.root.getDirectoryRecursive pathSegments.join('/'), options
		let entry = if type == @DIR
			yield dir.getDirectory basename, options
		else
			yield dir.getFile basename, options
		entry
	@Exists := #(path)**
		let fs = yield @RequestFileSystem(1,1024 * 1024 * 5)
		let pathSegments = path.replace(r'^file://','').split '/'
		let basename = pathSegments.pop()
		let dir = yield fs.root.getDirectoryRecursive pathSegments.join('/')
		yield dir.exists basename