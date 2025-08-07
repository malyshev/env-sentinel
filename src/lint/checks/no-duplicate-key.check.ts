import { LintResult } from '../../types.js';

const seenKeys = new Map<string, number>();

export function noDuplicateKeyCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    const equalIndex = lineContent.indexOf('=');
    if (equalIndex === -1) {
        return;
    }

    const key = lineContent.slice(0, equalIndex).trim();

    if (seenKeys.has(key)) {
        return {
            line: lineNumber,
            issue: `Duplicate variable name "${key}" (already defined on line ${seenKeys.get(key)})`,
            content: lineContent,
            severity: 'error',
        };
    }

    seenKeys.set(key, lineNumber);
    return;
}

export function __resetSeenKeysForTests() {
    seenKeys.clear();
}
