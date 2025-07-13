import { LintResult } from '../../types.js';

export function noInvalidKeyDelimiterCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    const equalIndex = lineContent.indexOf('=');

    if (equalIndex === -1) {
        return;
    }

    const key = lineContent.slice(0, equalIndex).trim();

    // Skip check if key is empty (handled elsewhere)
    if (!key) {
        return;
    }

    // Remove surrounding single or double quotes from the key (if any)
    // Match all characters that are not:
    // - Unicode letters (\p{L})
    // - Unicode numbers (\p{N})
    // - Underscores (_)
    // - Whitespace (which is ignored here, handled in a different check)
    const invalidDelimiters = [
        ...key
            // Remove quotes around the key; they're part of formatting, not the key itself
            .replace(/^['"]|['"]$/g, '')
            // Skip the first character; we're checking the leading character of the key, not treating it as a delimiter
            .slice(1)
            .matchAll(/[^\p{L}\p{N}_\s]/gu),
    ].map((match) => match[0]);

    if (invalidDelimiters.length === 0) {
        return;
    }

    const delimiterList = invalidDelimiters.map((d) => `"${d}"`).join(', ');

    return {
        line: lineNumber,
        issue: `Variable name contains invalid delimiter: ${delimiterList}`,
        content: lineContent,
        severity: 'error',
    };
}
