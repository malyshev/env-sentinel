import { LintResult } from '../../types.js';

const unsafeEnvKeys = new Set([
    // Language/runtime manipulation
    'NODE_OPTIONS',
    'LD_PRELOAD',
    'PYTHONPATH',
    'GEM_HOME',
    'GEM_PATH',

    // System-reserved
    'PATH',
    'HOME',
    'SHELL',
    'TERM',
    'LANG',
    'TMPDIR',
    'PWD',
    'OLDPWD',
    'USER',
    'LOGNAME',
    'DISPLAY',
    'XAUTHORITY',

    // CI/CD
    'CI',
    'GITHUB_ACTIONS',
    'TRAVIS',
    'CIRCLECI',
    'APPVEYOR',
    'GITLAB_CI',
    'BUILD_ID',
    'RUNNER_NAME',
    'CI_COMMIT_SHA',

    // Unsafe in prod
    'DEBUG',
    'VERBOSE',
    'TEST',
]);

export function noUnsafeKeyCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    const equalIndex = lineContent.indexOf('=');
    if (equalIndex === -1) return;

    const rawKey = lineContent.slice(0, equalIndex).trim();
    const unquotedKey = rawKey.replace(/^['"]|['"]$/g, '');

    if (unquotedKey === '') return;

    const upperKey = unquotedKey.toUpperCase();

    if (unsafeEnvKeys.has(upperKey)) {
        return {
            line: lineNumber,
            issue: `Variable "${unquotedKey}" is discouraged due to potential security or system conflicts`,
            content: lineContent,
            severity: 'error',
        };
    }

    return;
}
