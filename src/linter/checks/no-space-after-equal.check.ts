import { LintResult } from '../../types.js';

export function noSpaceAfterEqualCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    const equalIndex = lineContent.indexOf('=');
    if (equalIndex === -1 || equalIndex === lineContent.length - 1) return;

    const afterEqual = lineContent.slice(equalIndex + 1);

    // Skip check if an empty value has a comment
    if (afterEqual.trim().startsWith('#')) {
        return;
    }

    if (/^\s/.test(afterEqual)) {
        return {
            line: lineNumber,
            issue: 'Unexpected space(s) after `=`',
            content: lineContent,
            severity: 'warning',
        };
    }

    return;
}
