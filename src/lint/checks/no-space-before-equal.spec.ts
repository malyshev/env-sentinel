import type { LintResult } from '../../types.js';
import { noSpaceBeforeEqualCheck } from './no-space-before-equal.check.js';

describe('noSpaceBeforeEqualCheck', () => {
    it('should return a warning when there is a space before =', () => {
        const result = noSpaceBeforeEqualCheck(1, 'KEY =value');
        expect(result).toEqual<LintResult>({
            line: 1,
            issue: 'Unexpected space(s) before `=`',
            content: 'KEY =value',
            severity: 'warning',
        });
    });

    it('should return a warning when there are multiple spaces before =', () => {
        const result = noSpaceBeforeEqualCheck(2, 'KEY    =value');
        expect(result).toEqual<LintResult>({
            line: 2,
            issue: 'Unexpected space(s) before `=`',
            content: 'KEY    =value',
            severity: 'warning',
        });
    });

    it('should not return anything when = is at position 0 (invalid)', () => {
        const result = noSpaceBeforeEqualCheck(3, '=VALUE');
        expect(result).toBeUndefined();
    });

    it('should not return anything when there is no space before =', () => {
        const result = noSpaceBeforeEqualCheck(4, 'KEY=value');
        expect(result).toBeUndefined();
    });

    it('should not return anything if = is missing', () => {
        const result = noSpaceBeforeEqualCheck(5, 'KEYVALUE');
        expect(result).toBeUndefined();
    });
});
