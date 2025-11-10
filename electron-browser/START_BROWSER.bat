@echo off
echo ==========================================
echo   The Turkish Chromium Browser
echo ==========================================
echo.

if not exist "node_modules" (
    echo Installing dependencies...
    call yarn install
    echo.
)

echo Starting The Turkish Chromium...
echo.
echo Press Ctrl+C to stop the browser
echo.

call yarn start
