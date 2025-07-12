import { LintResult } from '../../types.js';

export function noDuplicateReferenceCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    const equalIndex = lineContent.indexOf('=');
    if (equalIndex === -1) return;

    const rawKey = lineContent.slice(0, equalIndex).trim();
    let rawValue = lineContent.slice(equalIndex + 1).trim();

    // skip quoted values
    const isQuoted =
        (rawValue.startsWith('"') && rawValue.endsWith('"')) || (rawValue.startsWith("'") && rawValue.endsWith("'"));
    if (isQuoted) return;

    // strip inline comment
    rawValue = rawValue.split('#')[0].trim();

    // match all ${...} occurrences
    const referenceRegex = /\$\{([A-Z0-9_]+)\}/g;
    const found = new Map<string, number>();

    let match;
    while ((match = referenceRegex.exec(rawValue)) !== null) {
        const varName = match[1];
        const count = found.get(varName) ?? 0;
        found.set(varName, count + 1);
    }

    for (const [ref, count] of found.entries()) {
        if (count > 1) {
            return {
                line: lineNumber,
                issue: `Duplicate reference "\${${ref}}" found ${count} times in "${rawKey}"`,
                content: lineContent,
                severity: 'notice',
            };
        }
    }

    return;
}
