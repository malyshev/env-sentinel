import type { LintResult } from '../../types.js';
import { noInvalidKeyCharactersCheck } from './no-invalid-key-characters.check.js';

describe('noInvalidCharactersCheck', () => {
    it('should return undefined for valid ASCII variable names', () => {
        expect(noInvalidKeyCharactersCheck(1, 'VALID_KEY=some_value')).toBeUndefined();
        expect(noInvalidKeyCharactersCheck(2, '"QUOTED_KEY"=123')).toBeUndefined();
        expect(noInvalidKeyCharactersCheck(3, 'KEY_WITH_SPECIALS-%.=value')).toBeUndefined();
    });

    it('should return undefined if there is no equal sign', () => {
        expect(noInvalidKeyCharactersCheck(4, 'NO_EQUALS_SIGN')).toBeUndefined();
    });

    it('should return undefined if the key is empty after trimming', () => {
        expect(noInvalidKeyCharactersCheck(5, '   =value')).toBeUndefined();
    });

    it('should ignore the first character of the key', () => {
        // Leading invalid char should be ignored (handled by other rule)
        expect(noInvalidKeyCharactersCheck(6, 'ЛINVALID=value')).toBeUndefined();
    });

    it('should return error if key contains invalid (non-ASCII) characters', () => {
        const result = noInvalidKeyCharactersCheck(7, 'AБВ=value') as LintResult;

        expect(result).toEqual({
            line: 7,
            issue: 'Variable name contains invalid character(s): "Б", "В"',
            content: 'AБВ=value',
            severity: 'error',
        });
    });

    it('should handle duplicate invalid characters gracefully', () => {
        const result = noInvalidKeyCharactersCheck(8, 'X漢漢X=value') as LintResult;

        expect(result).toEqual({
            line: 8,
            issue: 'Variable name contains invalid character(s): "漢"',
            content: 'X漢漢X=value',
            severity: 'error',
        });
    });

    it('should report invisible control characters', () => {
        const result = noInvalidKeyCharactersCheck(9, 'OK\u0007BAD=value') as LintResult;

        expect(result).toEqual({
            line: 9,
            issue: 'Variable name contains invalid character(s): "\u0007"',
            content: 'OK\u0007BAD=value',
            severity: 'error',
        });
    });
});
