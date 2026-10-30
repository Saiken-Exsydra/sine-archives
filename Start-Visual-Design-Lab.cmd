@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 goto missing_node
if not exist "node_modules\astro\package.json" goto missing_deps
node -e "const s=require('node:net').createServer();s.once('error',()=>process.exit(1));s.listen(4321,'127.0.0.1',()=>s.close());"
if errorlevel 1 goto port_in_use
echo Open http://127.0.0.1:4321/_lab/visual-design/
call npm run dev -- --host 127.0.0.1 --port 4321
exit /b %errorlevel%
:missing_node
echo Node.js is missing. Install Node.js 22 LTS, then reopen this launcher.
exit /b 1
:missing_deps
echo Dependencies are missing. Run Setup-Visual-Design-Lab.cmd first.
exit /b 1
:port_in_use
echo Port 4321 is already in use. Stop the existing server before launching another.
echo If this is the lab server, open http://127.0.0.1:4321/_lab/visual-design/
exit /b 1
