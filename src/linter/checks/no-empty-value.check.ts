import { LintResult } from '../../types.js';

export function noEmptyValueCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    const equalIndex = lineContent.indexOf('=');
    if (equalIndex === -1) {
        return;
    }

    const key = lineContent.slice(0, equalIndex).trim();
    const value = lineContent.slice(equalIndex + 1);

    const trimmedValue = value.trim();

    // Warn only if value is truly empty (not quoted empty string)
    if (trimmedValue === '' || trimmedValue.startsWith('#')) {
        return {
            line: lineNumber,
            issue: `Variable "${key}" has an empty value`,
            content: lineContent,
            severity: 'warning',
        };
    }

    return;
}
