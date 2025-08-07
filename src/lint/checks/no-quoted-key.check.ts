import { LintResult } from '../../types.js';

export function noQuotedKeyCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    const equalIndex = lineContent.indexOf('=');
    if (equalIndex === -1) return;

    const rawKey = lineContent.slice(0, equalIndex).trim();

    // Detect if key starts and ends with quote (including mismatched)
    const startsWithQuote = rawKey.startsWith('"') || rawKey.startsWith("'");
    const endsWithQuote = rawKey.endsWith('"') || rawKey.endsWith("'");

    if (startsWithQuote || endsWithQuote) {
        return {
            line: lineNumber,
            issue: `Quoted keys are not allowed: ${rawKey}`,
            content: lineContent,
            severity: 'error',
        };
    }

    return;
}
