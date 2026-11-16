import { execFile } from 'node:child_process';

// Stop only the process tree created by this runner, including Yarn/Nuxt and
// Playwright's server children. No shell interpolation or process-name killing.
export function terminateTree(child) {
    if (!child?.pid || child.exitCode !== null) {
        return;
    }

    if (process.platform === 'win32') {
        execFile('taskkill', ['/PID', String(child.pid), '/T', '/F'], {
            windowsHide: true,
        }, () => {});
    } else {
        try {
            process.kill(-child.pid, 'SIGKILL');
        } catch (error) {
            if (error.code !== 'ESRCH') {
                throw error;
            }
        }
    }
}
