import type { LintResult } from '../../types.js';
import { noLowercaseInKeyCheck } from './no-lowercase-in-key.check.js';

describe('noLowercaseInKeyCheck', () => {
    it('should allow keys with only uppercase letters and numbers', () => {
        expect(noLowercaseInKeyCheck(1, 'KEY=value')).toBeUndefined();
        expect(noLowercaseInKeyCheck(2, 'TOKEN123=abc')).toBeUndefined();
        expect(noLowercaseInKeyCheck(3, 'A_B_C=xyz')).toBeUndefined();
    });

    it('should report error if key contains lowercase letters (not first char)', () => {
        const result = noLowercaseInKeyCheck(4, 'KKey=value') as LintResult;
        expect(result).toEqual({
            line: 4,
            issue: 'Variable name contains lowercase letter(s) in "KKey"',
            content: 'KKey=value',
            severity: 'error',
        });
    });

    it('should allow first lowercase letter if check only applies to body', () => {
        expect(noLowercaseInKeyCheck(5, 'kEY=value')).toBeUndefined();
    });

    it('should detect lowercase in body even if key is quoted', () => {
        const result = noLowercaseInKeyCheck(6, '"SeCrEt_KEY"=value') as LintResult;
        expect(result).toEqual({
            line: 6,
            issue: 'Variable name contains lowercase letter(s) in "SeCrEt_KEY"',
            content: '"SeCrEt_KEY"=value',
            severity: 'error',
        });
    });

    it('should skip lines without equal sign', () => {
        expect(noLowercaseInKeyCheck(7, 'INVALID_LINE')).toBeUndefined();
    });

    it('should ignore completely empty keys', () => {
        expect(noLowercaseInKeyCheck(8, '=value')).toBeUndefined();
    });

    it('should trim the key before checking', () => {
        const result = noLowercaseInKeyCheck(9, '  MYkey = value') as LintResult;
        expect(result).toEqual({
            line: 9,
            issue: 'Variable name contains lowercase letter(s) in "MYkey"',
            content: '  MYkey = value',
            severity: 'error',
        });
    });

    it('should handle mismatched quotes gracefully', () => {
        const result = noLowercaseInKeyCheck(10, '"KEYtest=val') as LintResult;
        expect(result.issue).toMatch(/lowercase/);
    });
});
