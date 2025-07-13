import { LintResult } from '../../types.js';

export function noUnquotedMultilineValueCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    const equalIndex = lineContent.indexOf('=');
    if (equalIndex === -1) return;

    const rawKey = lineContent.slice(0, equalIndex).trim();
    const value = lineContent.slice(equalIndex + 1).trim();

    const looksMultiline = value.includes('\\n') || value.includes('\\r');

    const isQuoted = (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"));

    if (looksMultiline && !isQuoted) {
        return {
            line: lineNumber,
            issue: `Unquoted multiline-looking value in "${rawKey}"`,
            content: lineContent,
            severity: 'warning',
        };
    }

    return;
}
