import { LintResult } from '../../types.js';
import { isEmptyOrCommentLine } from '../utils.js';

export function noInvalidKeyLeadingCharCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    if (isEmptyOrCommentLine(lineContent)) {
        return;
    }

    const [rawKey] = lineContent.split('=');

    const trimmedKey = rawKey.trim().replace(/^['"]|['"]$/g, '');

    if (trimmedKey === '') {
        return;
    }

    const firstChar = trimmedKey.charAt(0);

    if (!/[A-Za-z_]/.test(firstChar)) {
        return {
            line: lineNumber,
            issue: `Variable name starts with invalid character: "${firstChar}" in "${trimmedKey}"`,
            content: lineContent,
            severity: 'error',
        };
    }

    return;
}
