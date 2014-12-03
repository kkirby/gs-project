import sys.file.Factory
import sys.file.FS

class!
	
	@ResolveLocalFileSystemURL := #(url) -> FS.ResolveLocalFileSystemURL url
	@RequestFileSystem := #(type,size) -> FS.RequestFileSystem type, size