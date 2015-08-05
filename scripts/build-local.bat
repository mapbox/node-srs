@ECHO OFF
SETLOCAL
SET EL=0

ECHO ~~~~~~~~~~~~~~~~~~~~~~~~~~~~ %~f0 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

SET PATH=C:\Python27;%PATH%

SET APPVEYOR_REPO_COMMIT_MESSAGE=test local

SET TOOLSET_ARGS=

SETLOCAL EnableDelayedExpansion
FOR %%T in (12 14) DO (
	SET msvs_toolset=%%T
	ECHO msvs_toolset^: !msvs_toolset!
	IF "!msvs_toolset!"=="14" SET TOOLSET_ARGS=--dist-url=https://s3.amazonaws.com/mapbox/node-cpp11 --toolset=v140 && ECHO !TOOLSET_ARGS!
	FOR %%N IN (0.10.40 0.12.7) DO (
		SET nodejs_version=%%N
		ECHO nodejs_version^: !nodejs_version!
		FOR %%P in (x64 x86) DO (
			IF EXIST lib\binding ECHO deleting lib/binding && RD /Q /S lib\binding
			IF !ERRORLEVEL! NEQ 0 GOTO ERROR
			IF EXIST node_modules ECHO deleting node_modules && RD /Q /S node_modules
			IF !ERRORLEVEL! NEQ 0 GOTO ERROR
			SET platform=%%P
			ECHO build node^: !nodejs_version! platform^: !platform!
			CALL scripts\build-appveyor.bat
			ECHO ERRORLEVEL node^: !nodejs_version! platform^: !platform! !ERRORLEVEL!
			IF !ERRORLEVEL! NEQ 0 GOTO ERROR
		)
	)
)
ENDLOCAL



GOTO DONE

:ERROR
ECHO ~~~~~~~~~~~~~~~~~~~~~~ ERROR %~f0 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
ECHO ERRORLEVEL^: %ERRORLEVEL%
SET EL=%ERRORLEVEL%

:DONE
ECHO ~~~~~~~~~~~~~~~~~~~~~~ DONE %~f0 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

EXIT /b %EL%
