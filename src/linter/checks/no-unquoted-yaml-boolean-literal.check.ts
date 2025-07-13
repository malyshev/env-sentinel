import { LintResult } from '../../types.js';

const YAML_BOOLEAN_LITERALS = new Set(['true', 'false', 'yes', 'no', 'on', 'off']);

export function noUnquotedYAMLBooleanLiteralCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    const equalIndex = lineContent.indexOf('=');
    if (equalIndex === -1) return;

    const rawKey = lineContent.slice(0, equalIndex).trim();
    const rawValue = lineContent.slice(equalIndex + 1).trim();

    // skip if value is fully quoted
    const isQuoted =
        (rawValue.startsWith('"') && rawValue.endsWith('"')) || (rawValue.startsWith("'") && rawValue.endsWith("'"));
    if (isQuoted) return;

    // remove inline comment
    const value = rawValue.split('#')[0].trim().toLowerCase();

    if (YAML_BOOLEAN_LITERALS.has(value)) {
        return {
            line: lineNumber,
            issue: `Unquoted YAML-style boolean literal "${value}" in "${rawKey}" may cause unexpected coercion`,
            content: lineContent,
            severity: 'warning',
        };
    }

    return;
}
