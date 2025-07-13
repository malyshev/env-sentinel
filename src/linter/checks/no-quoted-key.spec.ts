import type { LintResult } from '../../types.js';
import { noQuotedKeyCheck } from './no-quoted-key.check.js';

describe('noQuotedKeyCheck', () => {
    it('should allow unquoted keys', () => {
        expect(noQuotedKeyCheck(1, 'KEY=value')).toBeUndefined();
        expect(noQuotedKeyCheck(2, 'MY_TOKEN=abc123')).toBeUndefined();
    });

    it('should catch keys fully wrapped in double quotes', () => {
        const result = noQuotedKeyCheck(3, '"KEY"=value') as LintResult;
        expect(result).toEqual({
            line: 3,
            issue: 'Quoted keys are not allowed: "KEY"',
            content: '"KEY"=value',
            severity: 'error',
        });
    });

    it('should catch keys fully wrapped in single quotes', () => {
        const result = noQuotedKeyCheck(4, "'KEY'=value") as LintResult;
        expect(result).toEqual({
            line: 4,
            issue: "Quoted keys are not allowed: 'KEY'",
            content: "'KEY'=value",
            severity: 'error',
        });
    });

    it('should catch keys with mismatched quotes (leading only)', () => {
        const result1 = noQuotedKeyCheck(5, '"KEY=value') as LintResult;
        expect(result1.issue).toMatch(/Quoted keys are not allowed/);

        const result2 = noQuotedKeyCheck(6, "'KEY=value") as LintResult;
        expect(result2.issue).toMatch(/Quoted keys are not allowed/);
    });

    it('should catch keys with mismatched quotes (trailing only)', () => {
        const result1 = noQuotedKeyCheck(7, 'KEY"=value') as LintResult;
        expect(result1.issue).toMatch(/Quoted keys are not allowed/);

        const result2 = noQuotedKeyCheck(8, "KEY'=value") as LintResult;
        expect(result2.issue).toMatch(/Quoted keys are not allowed/);
    });

    it('should skip lines without equal sign', () => {
        expect(noQuotedKeyCheck(9, 'JUST_TEXT')).toBeUndefined();
        expect(noQuotedKeyCheck(10, '')).toBeUndefined();
    });

    it('should handle leading/trailing spaces', () => {
        const result = noQuotedKeyCheck(11, '   "TOKEN" = abc') as LintResult;
        expect(result).toEqual({
            line: 11,
            issue: 'Quoted keys are not allowed: "TOKEN"',
            content: '   "TOKEN" = abc',
            severity: 'error',
        });
    });
});
