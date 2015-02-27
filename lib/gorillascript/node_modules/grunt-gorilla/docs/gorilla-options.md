# Options

## linefeed
Type: `String`
Default: on Windows, `"\r\n"`, otherwise `"\n"`

Compilation will use this to join lines.

## bare
Type: `boolean`

Compile the JavaScript without the top-level function safety wrapper.

## sourceMap
Type: `boolean`
Default: `false`

Compile JavaScript and create a .map file linking it to the GorillaScript source.

## sourceRoot
Type: `string`
Default: `""`

Specify the `sourceRoot` property in the created .map file.

## encoding
Type: `string`
Default: `grunt.file.defaultEncoding`, which is `"utf8"` unless overridden.

The encoding of the resultant .js files. Not recommended to change.

## overwrite
Type: `boolean`
Default: `false`

Compile and overwrite .js files even if they don't appear to be out-of-date.

## coverage
Type: `boolean`
Default: `false`

Instruments output .js files with `_$jscoverage` support.
