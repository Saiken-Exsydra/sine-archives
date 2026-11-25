@echo off
setlocal
cd /d "%~dp0"
if exist node_modules\.bin\vite.cmd if exist node_modules\motion\package.json goto serve
call npm.cmd ci
if errorlevel 1 goto failed
:serve
call npm.cmd run dev -- --open "/#/"
if not errorlevel 1 exit /b 0
:failed
pause
exit /b 1
