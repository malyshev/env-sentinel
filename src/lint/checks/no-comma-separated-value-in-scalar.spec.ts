import type { LintResult } from '../../types.js';
import { noCommaSeparatedValueInScalarCheck } from './no-comma-separated-value-in-scalar.check.js';

describe('noCommaSeparatedValueInScalarCheck', () => {
    it('should allow quoted comma-separated values', () => {
        expect(noCommaSeparatedValueInScalarCheck(1, 'CSV_OK="a,b,c"')).toBeUndefined();
        expect(noCommaSeparatedValueInScalarCheck(2, "CSV_OK='x,y,z'")).toBeUndefined();
    });

    it('should warn on unquoted comma-separated values', () => {
        const result1 = noCommaSeparatedValueInScalarCheck(3, 'CSV_BAD_1=a,b,c') as LintResult;
        expect(result1).toEqual({
            line: 3,
            issue: 'Unquoted comma-separated value in "CSV_BAD_1"',
            content: 'CSV_BAD_1=a,b,c',
            severity: 'warning',
        });

        const result2 = noCommaSeparatedValueInScalarCheck(4, 'CSV_BAD_2=server1,server2') as LintResult;
        expect(result2).toEqual({
            line: 4,
            issue: 'Unquoted comma-separated value in "CSV_BAD_2"',
            content: 'CSV_BAD_2=server1,server2',
            severity: 'warning',
        });
    });

    it('should strip comments before checking for commas and quotes', () => {
        expect(noCommaSeparatedValueInScalarCheck(5, 'CSV_OK="a,b,c" # with comment')).toBeUndefined();

        const result = noCommaSeparatedValueInScalarCheck(6, 'CSV_BAD=a,b # comment') as LintResult;
        expect(result).toEqual({
            line: 6,
            issue: 'Unquoted comma-separated value in "CSV_BAD"',
            content: 'CSV_BAD=a,b # comment',
            severity: 'warning',
        });
    });

    it('should ignore values without commas', () => {
        expect(noCommaSeparatedValueInScalarCheck(7, 'NAME=alpha')).toBeUndefined();
        expect(noCommaSeparatedValueInScalarCheck(8, 'LIST=abc def')).toBeUndefined();
    });

    it('should skip lines without equal sign', () => {
        expect(noCommaSeparatedValueInScalarCheck(9, 'NOT_A_VAR')).toBeUndefined();
    });
});
