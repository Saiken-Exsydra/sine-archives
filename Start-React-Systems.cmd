@echo off
setlocal
cd /d "%~dp0"
if exist node_modules\.bin\vite.cmd goto serve
call npm.cmd ci
if errorlevel 1 goto failed
:serve
call npm.cmd run dev -- --open "/#/systems"
if not errorlevel 1 exit /b 0
:failed
pause
exit /b 1
