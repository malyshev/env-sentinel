import { LintResult } from '../../types.js';

export function noCommaSeparatedValueInScalarCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    const equalIndex = lineContent.indexOf('=');
    if (equalIndex === -1) return;

    const rawKey = lineContent.slice(0, equalIndex).trim();
    const rawValue = lineContent.slice(equalIndex + 1).trim();

    // Strip inline comment before checking quotes or commas
    const value = rawValue.split('#')[0].trim();

    // Skip quoted values (after comment is removed)
    const isQuoted = (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"));
    if (isQuoted) return;

    // Warn if comma exists in unquoted value
    if (value.includes(',')) {
        return {
            line: lineNumber,
            issue: `Unquoted comma-separated value in "${rawKey}"`,
            content: lineContent,
            severity: 'warning',
        };
    }

    return;
}
