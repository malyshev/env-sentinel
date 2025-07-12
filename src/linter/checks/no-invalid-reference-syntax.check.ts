import type { LintResult } from '../../types.js';

const VALID_NAME_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

export function noInvalidReferenceSyntaxCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    // regex: match $VAR or ${VAR}, but skip \$, $$, and more than two $
    // - match non-escaped, single $
    // - not immediately followed by another $
    const regex = /(?<!\\)(\$\{([^}]*)}|\$(?!\$)[a-zA-Z_][a-zA-Z0-9_]*\b)/g;

    let match: RegExpExecArray | null;
    while ((match = regex.exec(lineContent)) !== null) {
        const [fullMatch, , inner] = match;

        // Case: ${} — empty variable name
        if (fullMatch.startsWith('${') && (inner === undefined || inner === '')) {
            return {
                line: lineNumber,
                content: lineContent,
                severity: 'error',
                issue: 'Empty variable reference `${}` is invalid',
            };
        }

        // Extract variable name (before any parameter expansion syntax)
        const content = fullMatch.startsWith('${') ? inner : fullMatch.slice(1);
        const varName = content.split(/[:=?#%]/)[0];

        if (!varName) continue;

        // Case: starts with digit
        if (/^\d/.test(varName)) {
            return {
                line: lineNumber,
                content: lineContent,
                severity: 'error',
                issue: `Invalid variable name: must not start with a digit → "${varName}"`,
            };
        }

        // Case: contains invalid characters
        if (!VALID_NAME_REGEX.test(varName)) {
            return {
                line: lineNumber,
                content: lineContent,
                severity: 'error',
                issue: `Invalid character in variable name: "${varName}"`,
            };
        }
    }

    return undefined;
}
