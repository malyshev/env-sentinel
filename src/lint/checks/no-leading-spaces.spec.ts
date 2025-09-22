import type { LintResult } from '../../types.js';
import { noLeadingSpacesCheck } from './no-leading-spaces.check.js';

describe('noLeadingSpacesCheck', () => {
    it('returns undefined for lines with no leading space in variable name', () => {
        const result = noLeadingSpacesCheck(1, 'VAR=value');
        expect(result).toBeUndefined();
    });

    it('returns warning for variable names with leading spaces', () => {
        const result = noLeadingSpacesCheck(2, ' VAR=value');
        const expected: LintResult = {
            line: 2,
            issue: 'Variable name has leading spaces: " VAR"',
            content: ' VAR=value',
            severity: 'error',
        };
        expect(result).toEqual(expected);
    });

    it('returns undefined for comment lines', () => {
        const result = noLeadingSpacesCheck(3, '# This is a comment');
        expect(result).toBeUndefined();
    });

    it('returns undefined for empty lines', () => {
        const result = noLeadingSpacesCheck(4, '   ');
        expect(result).toBeUndefined();
    });

    it('handles multiple leading spaces', () => {
        const result = noLeadingSpacesCheck(5, '    VAR=value');
        const expected: LintResult = {
            line: 5,
            issue: 'Variable name has leading spaces: "    VAR"',
            content: '    VAR=value',
            severity: 'error',
        };
        expect(result).toEqual(expected);
    });
});
