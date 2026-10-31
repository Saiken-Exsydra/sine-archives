import { execFile } from "node:child_process";
import { dirname, resolve } from "node:path";
import type { ChildProcess } from "node:child_process";

/** Release only the processes/pipes belonging to an already-exited browser. */
export function ownWindowsWebKitExit(browserProcess: ChildProcess, executable: string, started: Date) {
  const browserPid = browserProcess.pid;
  if (!browserPid) throw new Error("WebKit browser process has no PID");
  const runtimeDirectory = dirname(resolve(executable)).replaceAll("'", "''");

  return new Promise<Error | undefined>((resolve) => {
    browserProcess.once("exit", (code, signal) => {
      const exited = new Date().toISOString();
      // Network children can retain inherited pipe handles after Playwright.exe
      // exits. Node's 'close' event (which Playwright awaits) then never fires.
      // Match parent PID, creation time, executable directory and exact names;
      // never terminate another browser or a child of a still-running browser.
      const script = `
$ErrorActionPreference = 'Stop'
$minimumCreation = [DateTime]::Parse('${started.toISOString()}')
$maximumCreation = [DateTime]::Parse('${exited}')
$orphans = @(Get-CimInstance Win32_Process | Where-Object {
  $_.ParentProcessId -eq ${browserPid} -and
  $_.Name -in @('WebKitNetworkProcess.exe', 'WebKitGPUProcess.exe', 'WebKitWebProcess.exe') -and
  $_.CreationDate -ge $minimumCreation -and
  $_.CreationDate -le $maximumCreation -and
  [IO.Path]::GetDirectoryName($_.ExecutablePath) -eq '${runtimeDirectory}'
})
foreach ($orphan in $orphans) {
  $liveProcess = Get-Process -Id $orphan.ProcessId -ErrorAction SilentlyContinue
  if ($liveProcess -and [Math]::Abs(($liveProcess.StartTime - $orphan.CreationDate).TotalMilliseconds) -lt 1) {
    try { $liveProcess.Kill(); $liveProcess.WaitForExit(5000) | Out-Null }
    catch { if (-not $liveProcess.HasExited) { throw } }
    if (-not $liveProcess.HasExited) { throw "WebKit child did not exit: $($orphan.ProcessId)" }
  }
}
`;
      execFile("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script], {
        windowsHide: true,
        timeout: 10_000,
      }, (error, _stdout, stderr) => {
        // The application process has exited; no protocol traffic remains.
        // Destroy our own pipe endpoints so Node can finish child cleanup.
        for (const pipe of browserProcess.stdio) {
          if (pipe && "destroy" in pipe && typeof pipe.destroy === "function") pipe.destroy();
        }
        if (error) resolve(new Error(`WebKit child cleanup failed: ${stderr || error.message}`));
        else if (code !== 0 || signal) resolve(new Error(`WebKit exited unexpectedly: code=${code}, signal=${signal}`));
        else resolve(undefined);
      });
    });
  });
}
