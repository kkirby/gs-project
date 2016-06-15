import .Factory
import .FS
class!
	@ResolveLocalFileSystemURL :=  #(url) -> FS.ResolveLocalFileSystemURL url, Factory
	@RequestFileSystem := #(type,size) -> FS.RequestFileSystem type, size, Factory
	@FacadeData := #(data) -> Factory.get data
	@DIR := 0
	@FILE := 1
	@GetItem := #(path,size = 1024 * 1024 * 5,type = @FILE,options = {+create,-exclusive})**
		let fs = await @RequestFileSystem(1,size)
		let pathSegments = path.replace(r'^file://','').split '/'
		let basename = pathSegments.pop()
		let dir = await fs.root.getDirectoryRecursive pathSegments.join('/'), options
		let entry = if type == @DIR
			await dir.getDirectory basename, options
		else
			await dir.getFile basename, options
		entry
	@Exists := #(path)**
		let fs = await @RequestFileSystem(1,1024 * 1024 * 5)
		let pathSegments = path.replace(r'^file://','').split '/'
		let basename = pathSegments.pop()
		let dir = await fs.root.getDirectoryRecursive pathSegments.join('/')
		await dir.exists basename