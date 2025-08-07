import { LintResult } from '../../types.js';

export function noMissingKeyCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    const equalIndex = lineContent.indexOf('=');

    // If there's no equal sign, skip (might be caught by another check)
    if (equalIndex === -1) {
        return;
    }

    const key = lineContent.slice(0, equalIndex).trim();

    // If key is missing
    if (key === '') {
        return {
            line: lineNumber,
            issue: 'Missing variable name before "=" sign',
            content: lineContent,
            severity: 'error',
        };
    }
    return;
}
