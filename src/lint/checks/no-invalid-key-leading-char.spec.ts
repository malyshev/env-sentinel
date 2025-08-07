import { LintResult } from '../../types.js';
import { noInvalidKeyLeadingCharCheck } from './no-invalid-key-leading-char.check.js';

describe('noInvalidLeadingCharCheck', () => {
    it('should ignore empty lines', () => {
        expect(noInvalidKeyLeadingCharCheck(1, '')).toBeUndefined();
    });

    it('should ignore lines valid variable starting with a whitespace', () => {
        expect(noInvalidKeyLeadingCharCheck(1, ' FOO=bar')).toBeUndefined();
    });

    it('should ignore comment lines', () => {
        expect(noInvalidKeyLeadingCharCheck(2, '# This is a comment')).toBeUndefined();
    });

    it('should ignore valid variable starting with a letter', () => {
        expect(noInvalidKeyLeadingCharCheck(3, 'FOO=value')).toBeUndefined();
    });

    it('should ignore valid variable starting with an underscore', () => {
        expect(noInvalidKeyLeadingCharCheck(4, '_FOO=value')).toBeUndefined();
    });

    it('should return error for variable starting with a number', () => {
        const result = noInvalidKeyLeadingCharCheck(5, '1FOO=value') as LintResult;
        expect(result).toEqual({
            line: 5,
            issue: 'Variable name starts with invalid character: "1" in "1FOO"',
            content: '1FOO=value',
            severity: 'error',
        });
    });

    it('should return error for variable starting with a symbol', () => {
        const result = noInvalidKeyLeadingCharCheck(6, '$FOO=value') as LintResult;
        expect(result).toEqual({
            line: 6,
            issue: 'Variable name starts with invalid character: "$" in "$FOO"',
            content: '$FOO=value',
            severity: 'error',
        });
    });

    it('should handle keys with quotes', () => {
        const result = noInvalidKeyLeadingCharCheck(7, '"1FOO"=value') as LintResult;
        expect(result).toEqual({
            line: 7,
            issue: 'Variable name starts with invalid character: "1" in "1FOO"',
            content: '"1FOO"=value',
            severity: 'error',
        });
    });

    it('should ignore quoted valid keys', () => {
        expect(noInvalidKeyLeadingCharCheck(8, "'_FOO'=value")).toBeUndefined();
    });

    it('should ignore leading/trailing spaces and still validate correctly', () => {
        const result = noInvalidKeyLeadingCharCheck(9, '   9FOO = value   ') as LintResult;
        expect(result).toEqual({
            line: 9,
            issue: 'Variable name starts with invalid character: "9" in "9FOO"',
            content: '   9FOO = value   ',
            severity: 'error',
        });
    });
});
