import { LintResult } from '../../types.js';

export function noEmptyQuotesCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    const equalIndex = lineContent.indexOf('=');
    if (equalIndex === -1) return;

    const rawKey = lineContent.slice(0, equalIndex).trim();
    const rawValue = lineContent.slice(equalIndex + 1).trim();

    // Remove inline comment if any
    const value = rawValue.split('#')[0].trim();

    const isDoubleEmpty = value === '""';
    const isSingleEmpty = value === "''";

    if (isDoubleEmpty || isSingleEmpty) {
        return {
            line: lineNumber,
            issue: `Empty quoted string in "${rawKey}" is discouraged — use unquoted empty value instead`,
            content: lineContent,
            severity: 'warning',
        };
    }

    return;
}
