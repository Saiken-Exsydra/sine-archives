@echo off
setlocal
cd /d "%~dp0"
node -e "const [a,b]=process.versions.node.split('.').map(Number);if(a<18||(a===18&&b<19)){console.error('Impeccable needs Node 18.19 or newer; use Node 22 LTS.');process.exit(1)}"
if errorlevel 1 exit /b 1
if exist "node_modules\astro\package.json" goto install_skill
call npm ci
if errorlevel 1 exit /b 1
:install_skill
call npx --yes impeccable@4.8.0 install --providers=codex --scope=project --yes
if errorlevel 1 exit /b 1
call .agents\skills\impeccable\scripts\impeccable.cmd hooks on
if errorlevel 1 exit /b 1
call .agents\skills\impeccable\scripts\impeccable.cmd doctor --json
if errorlevel 1 exit /b 1
echo Review and trust PostToolUse and Stop in Codex Settings - Hooks, or /hooks in the CLI.
echo Start the website with Start-Visual-Design-Lab.cmd.
