import { LintResult } from '../../types.js';

export function noWhitespaceInKeyCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    const equalIndex = lineContent.indexOf('=');
    if (equalIndex === -1) {
        return;
    }

    const rawKey = lineContent.slice(0, equalIndex).trim();

    // Remove surrounding quotes (if any)
    const unquotedKey = rawKey.replace(/^['"]|['"]$/g, '');

    if (unquotedKey === '') {
        return;
    }

    // Slice off first char (leading char already validated elsewhere)
    const keyBody = unquotedKey.slice(1);

    // Check for any remaining whitespace in the key body
    if (/\s/.test(keyBody)) {
        return {
            line: lineNumber,
            issue: `Variable name contains internal whitespace in "${unquotedKey}"`,
            content: lineContent,
            severity: 'error',
        };
    }

    return;
}
