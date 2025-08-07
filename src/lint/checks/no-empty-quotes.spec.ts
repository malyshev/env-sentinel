import type { LintResult } from '../../types.js';
import { noEmptyQuotesCheck } from './no-empty-quotes.check.js';

describe('noEmptyQuotesCheck', () => {
    it('should allow unquoted empty values', () => {
        expect(noEmptyQuotesCheck(1, 'PLACEHOLDER_OK=')).toBeUndefined();
        expect(noEmptyQuotesCheck(2, 'EMPTY=   ')).toBeUndefined();
    });

    it('should warn on empty double-quoted value', () => {
        const result = noEmptyQuotesCheck(3, 'PLACEHOLDER_BAD_1=""') as LintResult;
        expect(result).toEqual({
            line: 3,
            issue: 'Empty quoted string in "PLACEHOLDER_BAD_1" is discouraged — use unquoted empty value instead',
            content: 'PLACEHOLDER_BAD_1=""',
            severity: 'warning',
        });
    });

    it('should warn on empty single-quoted value', () => {
        const result = noEmptyQuotesCheck(4, "PLACEHOLDER_BAD_2=''") as LintResult;
        expect(result).toEqual({
            line: 4,
            issue: 'Empty quoted string in "PLACEHOLDER_BAD_2" is discouraged — use unquoted empty value instead',
            content: "PLACEHOLDER_BAD_2=''",
            severity: 'warning',
        });
    });

    it('should allow quoted non-empty values', () => {
        expect(noEmptyQuotesCheck(5, 'MESSAGE="hello"')).toBeUndefined();
        expect(noEmptyQuotesCheck(6, "MESSAGE='hi'")).toBeUndefined();
        expect(noEmptyQuotesCheck(7, 'MESSAGE=" "')).toBeUndefined(); // whitespace is not empty
    });

    it('should skip lines without equal sign', () => {
        expect(noEmptyQuotesCheck(8, 'NOT_A_VAR')).toBeUndefined();
    });

    it('should handle inline comments correctly', () => {
        const result = noEmptyQuotesCheck(9, 'EMPTY_QUOTES="" # comment') as LintResult;
        expect(result).toEqual({
            line: 9,
            issue: 'Empty quoted string in "EMPTY_QUOTES" is discouraged — use unquoted empty value instead',
            content: 'EMPTY_QUOTES="" # comment',
            severity: 'warning',
        });
    });
});
