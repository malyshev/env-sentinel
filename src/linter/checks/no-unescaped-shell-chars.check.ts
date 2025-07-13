import { LintResult } from '../../types.js';

// List of shell metacharacters for unquoted/unescaped detection
const SHELL_SPECIAL_CHARS = ['$', '`', '!', '*', ';', '|', '&', '>', '<', '?', '(', ')', '{', '}', '[', ']', '='];

export function noUnescapedShellCharsCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    // Only process lines with KEY=VALUE
    const equalIndex = lineContent.indexOf('=');
    if (equalIndex === -1) return;

    const rawKey = lineContent.slice(0, equalIndex).trim();
    let value = lineContent.slice(equalIndex + 1);

    // Remove inline comment from unquoted value (strip at first unescaped #)
    let cleanValue = '';
    let inEscape = false;
    for (let i = 0; i < value.length; i++) {
        if (inEscape) {
            cleanValue += value[i];
            inEscape = false;
            continue;
        }
        if (value[i] === '\\') {
            inEscape = true;
            cleanValue += value[i];
            continue;
        }
        if (value[i] === '#') {
            break;
        }
        cleanValue += value[i];
    }
    value = cleanValue.trim();

    // Correctly identify fully-quoted values: allow blank after value!
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        return; // fully quoted, skip checks!
    }

    // Skip multiline-looking values (handled by another check)
    if (value.includes('\\n') || value.includes('\\r')) {
        return;
    }

    // Remove ENV-style substitutions (${...}) to avoid false positives in escape checks
    const valueWithoutEnvSubs = value.replace(/\$\{[^}]+}/g, (match) => {
        // Preserve escape context before ${...} for proper backslash counting below,
        // by replacing with an equivalent-length safe filler:
        return ' '.repeat(match.length);
    });

    // Detect unescaped shell special characters in the value (outside ENV substitutions)
    for (let i = 0; i < valueWithoutEnvSubs.length; i++) {
        const ch = valueWithoutEnvSubs[i];
        if (SHELL_SPECIAL_CHARS.includes(ch)) {
            // count preceding backslashes to see if escaped
            let escapeCount = 0;
            let j = i - 1;
            while (j >= 0 && valueWithoutEnvSubs[j] === '\\') {
                escapeCount++;
                j--;
            }
            if (escapeCount % 2 === 0) {
                // even number of '\' → not escaped!
                return {
                    line: lineNumber,
                    issue: `Unescaped shell special character '${ch}' in value of "${rawKey}"`,
                    content: lineContent,
                    severity: 'error',
                };
            }
        }
    }

    return;
}
