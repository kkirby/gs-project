var grunt = require('grunt');
var fs = require('fs');

function fixNewlines(text) {
  if (process.platform === 'win32') {
    text = text.replace(/\r\n/g, '\n');
  }
  return text;
}

function readFile(file, options) {
  'use strict';

  var contents = grunt.file.read(file, options);

  return fixNewlines(contents);
}

function assertFileEquality(test, pathToActual, pathToExpected, message) {
    var actual = readFile(pathToActual);
    var expected = readFile(pathToExpected);
    test.equal(expected, actual, message);
}

exports.gorilla = {
  compileBare: function(test) {
    'use strict';

    test.expect(3);

    assertFileEquality(test,
      'tmp/bare/hello.js',
      'test/expected/bare/hello.js',
      'Should compile GorillaScript to unwrapped JavaSscript');

    assertFileEquality(test,
      'tmp/bare/loop.js',
      'test/expected/bare/loop.js',
      'Should compile GorillaScript to unwrapped JavaSscript');

    assertFileEquality(test,
      'tmp/bare/joined.js',
      'test/expected/bare/joined.js',
      'Should compile GorillaScript files without wrappers and concatenate them into a single JavaScript file');

    test.done();
  },
  compileDefault: function(test) {
    'use strict';

    test.expect(3);

    assertFileEquality(test,
      'tmp/default/hello.js',
      'test/expected/default/hello.js',
      'Should compile GorillaScript to JavaScript');

    assertFileEquality(test,
      'tmp/default/loop.js',
      'test/expected/default/loop.js',
      'Should compile GorillaScript to wrapped JavaScript');

    assertFileEquality(test,
      'tmp/default/joined.js',
      'test/expected/default/joined.js',
      'Should compile GorillaScript files with wrappers and concatenate them into a single JavaScript file');

    test.done();
  },
  compileCoverage: function(test) {
    'use strict';

    test.expect(3);

    assertFileEquality(test,
      'tmp/coverage/hello.js',
      'test/expected/coverage/hello.js',
      'Should compile GorillaScript to JavaScript with _$jscoverage support');

    assertFileEquality(test,
      'tmp/coverage/loop.js',
      'test/expected/coverage/loop.js',
      'Should compile GorillaScript to wrapped JavaScript with _$jscoverage support');

    assertFileEquality(test,
      'tmp/coverage/joined.js',
      'test/expected/coverage/joined.js',
      'Should compile GorillaScript files with wrappers and concatenate them into a single JavaScript file with _$jscoverage support');

    test.done();
  },
  compileMaps: function(test) {
    'use strict';

    test.expect(12);

    assertFileEquality(test,
      'tmp/maps/hello.js',
      'test/expected/maps/hello.js',
      'Compilation of single file with source maps should generate JavaScript');

    assertFileEquality(test,
      'tmp/maps/hello.js.map',
      'test/expected/maps/hello.js.map',
      'Compilation of single file with source maps should generate map');

    assertFileEquality(test,
      'tmp/maps/helloBare.js',
      'test/expected/maps/helloBare.js',
      'Bare compilation of single file with source maps should generate JavaScript');

    assertFileEquality(test,
      'tmp/maps/helloBare.js.map',
      'test/expected/maps/helloBare.js.map',
      'Bare compilation of single file with source maps should generate map');

    assertFileEquality(test,
      'tmp/maps/joined.js',
      'test/expected/maps/joined.js',
      'Compilation of multiple files with source maps should generate JavaScript');

    assertFileEquality(test,
      'tmp/maps/joined.js.map',
      'test/expected/maps/joined.js.map',
      'Compilation of multiple files with source maps should generate map');

    assertFileEquality(test,
      'tmp/maps/joinedBare.js',
      'test/expected/maps/joinedBare.js',
      'Bare compilation of multiple files with source maps should generate JavaScript');

    assertFileEquality(test,
      'tmp/maps/joinedBare.js.map',
      'test/expected/maps/joinedBare.js.map',
      'Bare compilation of multiple files with source maps should generate map');

    assertFileEquality(test,
      'tmp/maps/loop.js',
      'test/expected/maps/loop.js',
      'Compilation of single file with source maps should generate JavaScript');

    assertFileEquality(test,
      'tmp/maps/loop.js.map',
      'test/expected/maps/loop.js.map',
      'Compilation of single file with source maps should generate map');

    assertFileEquality(test,
      'tmp/maps/loopBare.js',
      'test/expected/maps/loopBare.js',
      'Bare compilation of single file with source maps should generate JavaScript');

    assertFileEquality(test,
      'tmp/maps/loopBare.js.map',
      'test/expected/maps/loopBare.js.map',
      'Bare compilation of single file with source maps should generate map');

    test.done();
  },
  compileCoverageMaps: function(test) {
    'use strict';

    test.expect(6);

    assertFileEquality(test,
      'tmp/coverageMaps/hello.js',
      'test/expected/coverageMaps/hello.js',
      'Compilation of single file with source maps should generate JavaScript with _$jscoverage support');

    assertFileEquality(test,
      'tmp/coverageMaps/hello.js.map',
      'test/expected/coverageMaps/hello.js.map',
      'Compilation of single file with source maps should generate map');

    assertFileEquality(test,
      'tmp/coverageMaps/joined.js',
      'test/expected/coverageMaps/joined.js',
      'Compilation of multiple files with source maps should generate JavaScript with _$jscoverage support');

    assertFileEquality(test,
      'tmp/coverageMaps/joined.js.map',
      'test/expected/coverageMaps/joined.js.map',
      'Compilation of multiple files with source maps should generate map');

    assertFileEquality(test,
      'tmp/coverageMaps/loop.js',
      'test/expected/coverageMaps/loop.js',
      'Compilation of single file with source maps should generate JavaScript with _$jscoverage support');

    assertFileEquality(test,
      'tmp/coverageMaps/loop.js.map',
      'test/expected/coverageMaps/loop.js.map',
      'Compilation of single file with source maps should generate map');

    test.done();
  },
  compileEachMap: function(test) {
    'use strict';

    test.expect(4);

    assertFileEquality(test,
      'tmp/eachMap/hello.js',
      'test/expected/eachMap/hello.js',
      'Separate compilation of GorillaScript files with source maps should generate JavaScript');

    assertFileEquality(test,
      'tmp/eachMap/hello.js.map',
      'test/expected/eachMap/hello.js.map',
      'Separate compilation of GorillaScript files with source maps should generate map');

    assertFileEquality(test,
      'tmp/eachMap/loop.js',
      'test/expected/eachMap/loop.js',
      'Separate compilation of GorillaScript files with source maps should generate JavaScript');

    assertFileEquality(test,
      'tmp/eachMap/loop.js.map',
      'test/expected/eachMap/loop.js.map',
      'Separate compilation of GorillaScript files with source maps should generate map');

    test.done();
  },
  encoding: function(test) {
    'use strict';
    
    test.expect(1);
    
    var actual = fixNewlines(fs.readFileSync('tmp/encoding/helloUTF16.js', 'utf16le'));
    var expected = readFile('test/expected/default/hello.js');
    test.equal(expected, actual, "GorillaScript can compile with encoding UTF-16-le");
    
    test.done();
  }
};
