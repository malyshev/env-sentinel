import { LintResult } from '../../types.js';

export function noLowercaseInKeyCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    const equalIndex = lineContent.indexOf('=');
    if (equalIndex === -1) return;

    const rawKey = lineContent.slice(0, equalIndex).trim();
    const unquotedKey = rawKey.replace(/^['"]|['"]$/g, '');

    if (unquotedKey === '') {
        return;
    }

    const keyBody = unquotedKey.slice(1);

    if (/[a-z]/.test(keyBody)) {
        return {
            line: lineNumber,
            issue: `Variable name contains lowercase letter(s) in "${unquotedKey}"`,
            content: lineContent,
            severity: 'error',
        };
    }

    return;
}
