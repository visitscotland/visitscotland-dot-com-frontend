import { stripVTControlCharacters } from 'node:util';

// Scope sandbox proxy settings to Yarn child processes; never change repository config.
export function yarnEnvironment(environment = process.env) {
    const env = {
        ...environment,
    };
    const http = env.HTTP_PROXY || env.http_proxy;
    const https = env.HTTPS_PROXY || env.https_proxy || http;
    if (!env.YARN_HTTP_PROXY && http) env.YARN_HTTP_PROXY = http;
    if (!env.YARN_HTTPS_PROXY && https) env.YARN_HTTPS_PROXY = https;
    return env;
}

export function installDiagnostic(log, errorCode) {
    // Node prints a whole bundled source line before a stack trace. Keep the first
    // useful error, not the final 4 KB of that bundle and its secondary crash.
    const lines = stripVTControlCharacters(log).split(/\r?\n/)
        .filter((line) => line.length < 800 && line.trim());
    const errors = lines.filter((line) => /YN\d{4}:.*(?:Error|failed)|\bError\b|ERR_|ECONN|ENOTFOUND|ETIMEDOUT|certificate|YN00(?:35|41|82)/i.test(line));
    const diagnostic = (errors.length ? errors : lines.slice(-12)).slice(0, 12).join('\n')
        .replace(/(https?:\/\/)[^\s/@][^\s/:@]*:[^\s/@]+@/g, '$1[redacted]@').slice(0, 3000);
    const failureClass = errorCode === 'ETIMEDOUT' ? 'timeout'
        : /ERR_SOCKET|ECONN|ENOTFOUND|ETIMEDOUT|EAI_AGAIN|certificate|TLS|socket closed/i.test(diagnostic) ? 'network'
            : 'dependency';
    return {
        diagnostic,
        failureClass,
    };
}

export function remediationStatus(result, changed) {
    if (!result) return changed.length ? 'missing' : 'not-attempted';
    if (result.passed) return 'succeeded';
    return changed.length && result.rolledBack ? 'partial' : 'failed';
}

export const completedRemediation = (status) => ['not-attempted', 'succeeded', 'partial'].includes(status);
