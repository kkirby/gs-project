# grunt-gorilla

> Compile GorillaScript files to JavaScript.



## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-gorilla --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-gorilla');
```

*This plugin was designed to work with Grunt 0.4.x. If you're still using grunt v0.3.x it's strongly recommended that [you upgrade](http://gruntjs.com/upgrading-from-0.3-to-0.4).*


## Gorilla task
_Run this task with the `grunt gorilla` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### linefeed
Type: `String`
Default: on Windows, `"\r\n"`, otherwise `"\n"`

Compilation will use this to join lines.

#### bare
Type: `boolean`

Compile the JavaScript without the top-level function safety wrapper.

#### sourceMap
Type: `boolean`
Default: `false`

Compile JavaScript and create a .map file linking it to the GorillaScript source.

#### sourceRoot
Type: `string`
Default: `""`

Specify the `sourceRoot` property in the created .map file.

#### encoding
Type: `string`
Default: `grunt.file.defaultEncoding`, which is `"utf8"` unless overridden.

The encoding of the resultant .js files. Not recommended to change.

#### overwrite
Type: `boolean`
Default: `false`

Compile and overwrite .js files even if they don't appear to be out-of-date.

#### coverage
Type: `boolean`
Default: `false`

Instruments output .js files with `_$jscoverage` support.

### Usage Examples

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


## Release History

 * 2013-05-29   v0.1.5   Add the "coverage" option
 * 2013-05-27   v0.1.4   Bugfix with the needs-compiling check
 * 2013-05-27   v0.1.3   Add more logging, and a nice display in verbose mode. Only compile files if the mtime of the .gs is more than that of its .js Add the "overwrite" option, to override the "only-compile-when" check.
 * 2013-05-26   v0.1.2   Add the "encoding" option, defaulting to `grunt.file.default-encoding`
 * 2013-05-26   v0.1.1   Task is now run asynchronously
 * 2013-05-26   v0.1.0   Initial release

---

Task submitted by [Cameron Kenneth Knight](http://github.com/ckknight)

*This file was generated on Wed May 29 2013 23:52:26.*
