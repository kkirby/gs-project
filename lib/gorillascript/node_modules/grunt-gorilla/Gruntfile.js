/*
 * grunt-gorilla
 * https://github.com/ckknight/grunt-gorilla
 *
 * Copyright (c) 2013 Cameron Kenneth Knight
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    gorilla: {
      task: {
        files: {
          'tasks/gorilla.js': ['tasks/gorilla.gs']
        }
      },
      compileDefault: {
        files: {
          'tmp/default/hello.js': ['test/fixtures/hello.gs'],
          'tmp/default/loop.js': ['test/fixtures/loop.gs'],
          'tmp/default/joined.js': ['test/fixtures/hello.gs', 'test/fixtures/loop.gs']
        }
      },
      compileBare: {
        options: {
          bare: true
        },
        files: {
          'tmp/bare/hello.js': ['test/fixtures/hello.gs'],
          'tmp/bare/loop.js': ['test/fixtures/loop.gs'],
          'tmp/bare/joined.js': ['test/fixtures/hello.gs', 'test/fixtures/loop.gs']
        }
      },
      compileCoverage: {
        options: {
          coverage: true
        },
        files: {
          'tmp/coverage/hello.js': ['test/fixtures/hello.gs'],
          'tmp/coverage/loop.js': ['test/fixtures/loop.gs'],
          'tmp/coverage/joined.js': ['test/fixtures/hello.gs', 'test/fixtures/loop.gs']
        }
      },
      compileMaps: {
        options: {
          sourceMap: true
        },
        files: {
          'tmp/maps/hello.js': ['test/fixtures/hello.gs'],
          'tmp/maps/loop.js': ['test/fixtures/loop.gs'],
          'tmp/maps/joined.js': ['test/fixtures/hello.gs', 'test/fixtures/loop.gs']
        }
      },
      compileEachMap: {
        options: {
          sourceMap: true
        },
        files: [{
          expand: true,
          cwd: 'test/fixtures/',
          src: ['hello.gs', 'loop.gs'],
          dest: 'tmp/eachMap/',
          ext: '.js'
        }]
      },
      compileBareMaps: {
        options: {
          sourceMap: true,
          bare: true
        },
        files: {
          'tmp/maps/helloBare.js': ['test/fixtures/hello.gs'],
          'tmp/maps/loopBare.js': ['test/fixtures/loop.gs'],
          'tmp/maps/joinedBare.js': ['test/fixtures/hello.gs', 'test/fixtures/loop.gs']
        }
      },
      compileCoverageMaps: {
        options: {
          sourceMap: true,
          coverage: true
        },
        files: {
          'tmp/coverageMaps/hello.js': ['test/fixtures/hello.gs'],
          'tmp/coverageMaps/loop.js': ['test/fixtures/loop.gs'],
          'tmp/coverageMaps/joined.js': ['test/fixtures/hello.gs', 'test/fixtures/loop.gs']
        }
      },
      encoding: {
        options: {
          encoding: "utf16le"
        },
        files: {
          'tmp/encoding/helloUTF16.js': ['test/fixtures/hello.gs']
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-internal');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'gorilla', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['test', 'build-contrib']);

};
