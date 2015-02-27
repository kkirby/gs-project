# Usage Examples

```js
gorilla: {
  compile: {
    files: {
      'path/to/result.js': 'path/to/source.gs', // 1:1 compile
      'path/to/another.js': ['path/to/sources/*.gs', 'path/to/more/*.gs'] // compile into single file
    }
  },

  compileBare: {
    options: {
      bare: true
    },
    files: {
      'path/to/result.js': 'path/to/source.gs', // 1:1 compile
      'path/to/another.js': ['path/to/sources/*.gs', 'path/to/more/*.gs'] // compile into single file
    }
  },
  
  compileWithMaps: {
    options: {
      sourceMap: true,
      sourceRoot: "path/to" // defaults to ""
    },
    files: {
      'path/to/result.js': 'path/to/source.gs', // 1:1 compile
      'path/to/another.js': ['path/to/sources/*.gs', 'path/to/more/*.gs'] // compile into single file
    }
  },

  glob_to_multiple: {
    expand: true,
    flatten: true,
    cwd: 'path/to',
    src: ['*.gs'],
    dest: 'path/to/dest/',
    ext: '.js'
  }
}
```

For more examples on how to use the `expand` API to manipulate the default dynamic path construction in the `glob_to_multiple` examples, see "Building the files object dynamically" in the grunt wiki entry [Configuring Tasks](http://gruntjs.com/configuring-tasks).
