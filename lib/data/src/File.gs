import sys.file.Factory
import sys.file.FS

class!
	
	@ResolveLocalFileSystemURL := #(url) -> FS.ResolveLocalFileSystemURL url, Factory
	@RequestFileSystem := #(type,size) -> FS.RequestFileSystem type, size, Factory