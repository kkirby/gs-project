var wrench = require('wrench');
var path = require('path');
var src = path.join(__dirname,'..','lib','consoleTemplates','project');
var dest = process.cwd();
wrench.copyDirSyncRecursive(src,dest);
