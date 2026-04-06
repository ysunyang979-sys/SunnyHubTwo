@echo off
setlocal enabledelayedexpansion

:: 1. Sync data.json
echo --- Step 1: Update Index ---
node scripts/build-list.js
git add data.json
git commit -m "update index"
git push origin main

:: 2. Upload manga folders one by one
echo --- Step 2: Upload Folders ---
for /f "delims=" %%d in ('dir /b /ad "manga"') do (
    echo.
    echo Processing folder: %%d
    git add "manga/%%d"
    git commit -m "auto add %%d"
    git push origin main
)

echo --- All Done ---
pause