import { LintResult } from '../../types';
import { noMissingKeyCheck } from './no-missing-key.check.js';

describe('noMissingKeyCheck', () => {
    it('should report an error if key is missing', () => {
        const result = noMissingKeyCheck(3, ' =VALUE');
        const expected: LintResult = {
            line: 3,
            issue: 'Missing variable name before "=" sign',
            content: ' =VALUE',
            severity: 'error',
        };
        expect(result).toEqual(expected);
    });

    it('should not report an error if key is present', () => {
        const result = noMissingKeyCheck(5, 'VALID_KEY=value');
        expect(result).toBeUndefined();
    });

    it('should not report an error if there is no equal sign', () => {
        const result = noMissingKeyCheck(6, 'NO_EQUALS_SIGN');
        expect(result).toBeUndefined();
    });

    it('should trim whitespace and still detect missing key', () => {
        const result = noMissingKeyCheck(7, '     = something');
        const expected: LintResult = {
            line: 7,
            issue: 'Missing variable name before "=" sign',
            content: '     = something',
            severity: 'error',
        };
        expect(result).toEqual(expected);
    });
});
