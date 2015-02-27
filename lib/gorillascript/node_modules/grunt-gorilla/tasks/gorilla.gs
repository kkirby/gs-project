/*!
 * grunt-gorilla
 * https://github.com/ckknight/grunt-gorilla
 *
 * Copyright (c) 2013 Cameron Kenneth Knight
 * Licensed under the MIT license.
 */

require! path
require! fs

module.exports := #(grunt)
  grunt.register-multi-task "gorilla", "Compile GorillaScript files into JavaScript.", #!
    let options = @options {
      -bare
      source-map: null
      grunt.util.linefeed
      encoding: grunt.file.default-encoding
      -verbose
      -overwrite
      -coverage
    }
    
    grunt.verbose.writeflags options, "Options"

    let verbose = grunt.option('verbose') or options.verbose
    
    let done = @async()
    let promise = promise!
      yield require('gorillascript').init()
      let max-name-length = calculate-max-name-length @files
      let start-time = Date.now()
      if verbose
        grunt.log.write grunt.util.repeat max-name-length, " "
        grunt.log.writeln "     parse     macro     reduce    translate compile |   total"
      let progress-totals = {}
      let mutable num-compiled = 0
      for file in @files
        let valid-files = remove-invalid-files file
        unless has-expected-extensions valid-files
          continue
        if valid-files.length == 0
          continue
        
        if options.overwrite or yield needs-compiling valid-files, file.dest
          num-compiled += 1
          let progress-counts = yield compile valid-files, options, file.dest, max-name-length, verbose
          if verbose
            for k, v of progress-counts
              progress-totals[k] ?= 0
              progress-totals[k] += v
        else
          if verbose
            grunt.log.writeln "$(valid-files.join ', '): Skipping"
          else
            grunt.log.writeln "Skipping $(valid-files.join ', ')"
      if verbose and num-compiled > 1
        grunt.log.write grunt.util.repeat max-name-length + 53, "-"
        grunt.log.writeln "+----------"
        grunt.log.write grunt.util.repeat max-name-length + 2, " "
        for name in [\parse, \macro-expand, \reduce, \translate, \compile]
          grunt.log.write " "
          grunt.log.write pad-left 9, "$((progress-totals[name] / 1000_ms).to-fixed(3)) s"
        grunt.log.write " | "
        grunt.log.writeln pad-left 9, "$(((Date.now() - start-time) / 1000_ms).to-fixed(3)) s"
    promise.then(
      #-> done()
      #(e)
        grunt.log.error "Got an unexpected exception: $(String(e?.stack or e))"
        done(false))
  
  let needs-compiling = promise! #(inputs, output)*
    let input-stats-p = for input in inputs; to-promise! fs.stat input
    let output-stat-p = to-promise! fs.stat output
    let gorilla-mtime-p = require('gorillascript').get-mtime()
    let output-stat = try
      yield output-stat-p
    catch
      return true
    if (yield gorilla-mtime-p).get-time() > (yield output-stat-p).mtime.get-time()
      return true
    for input-stat-p in input-stats-p
      if (yield input-stat-p).mtime.get-time() > (yield output-stat-p).mtime.get-time()
        return true
    false
  
  let calculate-max-name-length(fileses)
    let mutable max-name-length = 0
    for files in fileses
      for file in files.src
        max-name-length max= file.length
    max-name-length
  
  let remove-invalid-files(files)
    for filter filepath in files.src
      unless grunt.file.exists filepath
        grunt.log.warn "Source file '$filepath' not found."
        false
      else
        true
  
  let pad-right(desired-length as Number, mutable text as String)
    if text.length < desired-length
      text & grunt.util.repeat(desired-length - text.length, " ")
    else
      text
  
  let pad-left(desired-length as Number, text as String)
    if text.length < desired-length
      grunt.util.repeat(desired-length - text.length, " ") & text
    else
      text
  
  let compile = promise! #(files, options, dest, max-name-length, verbose)*
    let dest-dir = path.dirname dest
    let compile-options = {
      input: files
      output: dest
      options.encoding
      options.linefeed
      options.bare
      options.coverage
      source-map: if options.source-map
        {
          file: path.join dest-dir, "$(path.basename dest, path.extname dest).js.map"
          source-root: options.source-root or ""
        }
      else
        null
    }
    let gorilla = require('gorillascript')
    yield gorilla.init()
    let start-time = Date.now()
    let progress-counts = {}
    if not verbose
      grunt.log.write "Compiling $(files.join ', ') ..."
    else
      if files.length > 1
        grunt.log.write files.join ", "
        grunt.log.writeln ": "
        grunt.log.write grunt.util.repeat max-name-length + 2, " "
      else
        grunt.log.write pad-right max-name-length + 1, files[0] & ":"
        grunt.log.write " "
      compile-options.progress := #(name, time)
        grunt.log.write " "
        grunt.log.write pad-left 9, (time / 1000_ms).to-fixed(3) & " s"
        progress-counts[name] := time
    try
      yield gorilla.compile-file compile-options
    catch e
      grunt.log.writeln()
      if not e? or not e.line? or not e.column?
        grunt.log.error "Got an unexpected exception from the gorillascript compiler. The original exception was: $(String(e?.stack or e))"
      else
        grunt.log.error e
      grunt.fail.warn "GorillaScript failed to compile."
    if not verbose
      let num-spaces = max-name-length - files.join(', ').length min 60
      if num-spaces > 0
        grunt.log.write grunt.util.repeat num-spaces, " "
      grunt.log.write " "
    else
      grunt.log.write " | "
    grunt.log.writeln pad-left 9, "$(((Date.now() - start-time) / 1000_ms).to-fixed(3)) s"
    progress-counts
  
  let has-expected-extensions(files)
    let bad-extensions = []
    for file in files
      let ext = path.extname file
      if ext != ".gs" and ext not in bad-extensions
        bad-extensions.push ext
    
    if bad-extensions.length
      grunt.fail.warn "Expected to only work with .gs files (found $(extensions.join ', '))."
      false
    else
      true
