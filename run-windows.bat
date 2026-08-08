@echo off
rem THEY WERE HERE — local launcher for Windows.
rem Double-click to host the Field Kit on your PC (no internet, no GitHub).
cd /d "%~dp0"
set PORT=8247

where py >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:%PORT%"
  echo.
  echo   PINEBROOK FIELD KIT — http://localhost:%PORT%
  echo   Keep this window open while you play. Close it to stop.
  echo.
  py -3 -m http.server %PORT%
  goto :eof
)

where python >nul 2>nul
if %errorlevel%==0 (
  start "" "http://localhost:%PORT%"
  echo.
  echo   PINEBROOK FIELD KIT — http://localhost:%PORT%
  echo   Keep this window open while you play. Close it to stop.
  echo.
  python -m http.server %PORT%
  goto :eof
)

echo No Python found — opening the app straight from the files instead.
echo (Everything works this way too; only the "Install app" button needs a local server.)
start "" "%~dp0index.html"
pause
