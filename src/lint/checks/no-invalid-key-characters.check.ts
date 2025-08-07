import { LintResult } from '../../types.js';

export function noInvalidKeyCharactersCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    const equalIndex = lineContent.indexOf('=');
    if (equalIndex === -1) {
        return;
    }

    const rawKey = lineContent.slice(0, equalIndex).trim();
    const unquotedKey = rawKey.replace(/^['"]|['"]$/g, '');

    if (unquotedKey === '') {
        return;
    }

    const keyBody = unquotedKey.slice(1);
    if (keyBody === '') {
        return;
    }

    // Allow printable ASCII only (0x20–0x7E), exclude control and non-ASCII
    const invalidChars = [...keyBody].filter((char) => !/^[\x20-\x7E]$/.test(char));

    const uniqueInvalid = [...new Set(invalidChars)];

    if (uniqueInvalid.length === 0) return;

    const listed = uniqueInvalid.map((c) => `"${c}"`).join(', ');

    return {
        line: lineNumber,
        issue: `Variable name contains invalid character(s): ${listed}`,
        content: lineContent,
        severity: 'error',
    };
}
