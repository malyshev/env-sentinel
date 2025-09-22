import { LintResult } from '../../types.js';
import { isEmptyOrCommentLine } from '../utils.js';

export function noLeadingSpacesCheck(lineNumber: number, lineContent: string): LintResult | undefined {
    if (isEmptyOrCommentLine(lineContent)) {
        return;
    }

    const [rawKey] = lineContent.split('=');

    // Check for leading spaces before the key
    if (rawKey.length > 0 && rawKey !== rawKey.trimStart()) {
        return {
            line: lineNumber,
            issue: `Variable name has leading spaces: "${rawKey}"`,
            content: lineContent,
            severity: 'error',
        };
    }
    return;
}
