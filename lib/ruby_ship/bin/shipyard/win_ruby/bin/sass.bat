@ECHO OFF
IF NOT "%~f0" == "~f0" GOTO :WinNT
@"ruby.exe" "C:/Users/kkirby/HubbleMobile/node_modules/grunt-gsScriptProject/node_modules/GsScriptProject/lib/ruby_ship/bin/shipyard/win_ruby/bin/sass" %1 %2 %3 %4 %5 %6 %7 %8 %9
GOTO :EOF
:WinNT
@"ruby.exe" "%~dpn0" %*
