import type { LintResult } from '../../types.js';
import { noSpaceAfterEqualCheck } from './no-space-after-equal.check.js';

describe('noSpaceAfterEqualCheck', () => {
    it('should return a warning when there is a space after =', () => {
        const result = noSpaceAfterEqualCheck(1, 'KEY= value');
        expect(result).toEqual<LintResult>({
            line: 1,
            issue: 'Unexpected space(s) after `=`',
            content: 'KEY= value',
            severity: 'warning',
        });
    });

    it('should return a warning when there are multiple spaces after =', () => {
        const result = noSpaceAfterEqualCheck(2, 'KEY=   value');
        expect(result).toEqual<LintResult>({
            line: 2,
            issue: 'Unexpected space(s) after `=`',
            content: 'KEY=   value',
            severity: 'warning',
        });
    });

    it('should return a warning for tab after =', () => {
        const result = noSpaceAfterEqualCheck(3, 'KEY=\tvalue');
        expect(result).toEqual<LintResult>({
            line: 3,
            issue: 'Unexpected space(s) after `=`',
            content: 'KEY=\tvalue',
            severity: 'warning',
        });
    });

    it('should not return anything when there is no space after =', () => {
        const result = noSpaceAfterEqualCheck(4, 'KEY=value');
        expect(result).toBeUndefined();
    });

    it('should not return anything when = is the last character', () => {
        const result = noSpaceAfterEqualCheck(5, 'KEY=');
        expect(result).toBeUndefined();
    });

    it('should not return anything if = is missing', () => {
        const result = noSpaceAfterEqualCheck(6, 'KEYVALUE');
        expect(result).toBeUndefined();
    });

    it('should not return anything when after = is a comment', () => {
        const result = noSpaceAfterEqualCheck(7, 'KEY=   #comment');
        expect(result).toBeUndefined();
    });
});
