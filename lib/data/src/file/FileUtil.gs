import .Factory
import .FS
class!
	@ResolveLocalFileSystemURL :=  #(url) -> FS.ResolveLocalFileSystemURL url, Factory
	@RequestFileSystem := #(type,size) -> FS.RequestFileSystem type, size, Factory
	@FacadeData := #(data) -> Factory.get data