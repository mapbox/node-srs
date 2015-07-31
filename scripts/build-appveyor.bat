@ECHO OFF
SETLOCAL
SET EL=0

ECHO ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ %~f0 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

SET PATH=%CD%;%PATH%
SET msvs_version=2013
IF "%msvs_toolset"=="14" SET msvs_version=2015

ECHO APPVEYOR^: %APPVEYOR%
ECHO nodejs_version^: %nodejs_version%
ECHO platform^: %platform%
ECHO msvs_toolset^: %msvs_toolset%
ECHO msvs_version^: %msvs_version%
ECHO TOOLSET_ARGS^: %TOOLSET_ARGS%


ECHO activating VS command prompt
IF /I "%platform%"=="x64" ECHO x64 && CALL "C:\Program Files (x86)\Microsoft Visual Studio %msvs_toolset%.0\VC\vcvarsall.bat" amd64
IF /I "%platform%"=="x86" ECHO x86 && CALL "C:\Program Files (x86)\Microsoft Visual Studio %msvs_toolset%.0\VC\vcvarsall.bat" x86
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

ECHO using compiler^: && cl
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

ECHO using MSBuild^: && msbuild /version && ECHO.
IF %ERRORLEVEL% NEQ 0 GOTO ERROR


ECHO downloading/installing node
IF /I "%APPVEYOR%"=="True" IF /I "%msvs_toolset%"=="12" powershell Install-Product node $env:nodejs_version $env:Platform
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

IF /I "%msvs_toolset%"=="12" GOTO NODE_INSTALLED

SET ARCHPATH=
IF "%platform%"=="x64" (SET ARCHPATH=x64/)
SET NODE_URL=https://mapbox.s3.amazonaws.com/node-cpp11/v%nodejs_version%/%ARCHPATH%node.exe
ECHO downloading node^: %NODE_URL%
powershell Invoke-WebRequest "${env:NODE_URL}" -OutFile node.exe
IF %ERRORLEVEL% NEQ 0 GOTO ERROR


:NODE_INSTALLED

ECHO available node.exe^:
where node
ECHO available npm^:
where npm

ECHO node^: && node -v
node -e "console.log(process.argv,process.execPath)"
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

CALL npm install -g node-gyp
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

CALL npm install --build-from-source --msvs_version=%msvs_version% %TOOLSET_ARGS% --loglevel=http
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

FOR /F "tokens=*" %%i in ('CALL node_modules\.bin\node-pre-gyp reveal module --silent') DO SET MODULE=%%i
IF %ERRORLEVEL% NEQ 0 GOTO ERROR
FOR /F "tokens=*" %%i in ('node -e "console.log(process.execPath)"') DO SET NODE_EXE=%%i
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

dumpbin /DEPENDENTS "%NODE_EXE%"
IF %ERRORLEVEL% NEQ 0 GOTO ERROR
dumpbin /DEPENDENTS "%MODULE%"
IF %ERRORLEVEL% NEQ 0 GOTO ERROR

ECHO calling npm test
CALL npm test

GOTO DONE


  - node-pre-gyp package %TOOLSET_ARGS%
  # make commit message env var shorter
  - SET CM=%APPVEYOR_REPO_COMMIT_MESSAGE%
  - if not "%CM%" == "%CM:[publish binary]=%" node-pre-gyp --msvs_version=2015 unpublish publish %TOOLSET_ARGS%




:ERROR
ECHO ~~~~~~~~~~~~~~~~~~~~~~ ERROR %~f0 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
ECHO ERRORLEVEL^: %ERRORLEVEL%
SET EL=%ERRORLEVEL%

:DONE
ECHO ~~~~~~~~~~~~~~~~~~~~~~ DONE %~f0 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

EXIT /b %EL%
