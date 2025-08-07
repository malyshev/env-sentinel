import { LintResult } from '../../types.js';

export function noSpaceBeforeEqualCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    const equalIndex = lineContent.indexOf('=');
    if (equalIndex <= 0) return;

    const beforeEqual = lineContent.slice(0, equalIndex);
    if (/\s$/.test(beforeEqual)) {
        return {
            line: lineNumber,
            issue: 'Unexpected space(s) before `=`',
            content: lineContent,
            severity: 'warning',
        };
    }

    return;
}
