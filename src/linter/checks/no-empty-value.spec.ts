import { noEmptyValueCheck } from './no-empty-value.check.js';

describe('noEmptyValueCheck', () => {
    it('should return undefined for valid key-value pair', () => {
        expect(noEmptyValueCheck(1, 'FOO=bar')).toBeUndefined();
        expect(noEmptyValueCheck(2, 'KEY="value"')).toBeUndefined();
    });

    it('should warn on empty value', () => {
        const result = noEmptyValueCheck(3, 'EMPTY=');
        expect(result).toEqual({
            line: 3,
            issue: 'Variable "EMPTY" has an empty value',
            content: 'EMPTY=',
            severity: 'warning',
        });
    });

    it('should warn on value with only whitespace', () => {
        const result = noEmptyValueCheck(4, 'FOO=    ');
        expect(result).toEqual({
            line: 4,
            issue: 'Variable "FOO" has an empty value',
            content: 'FOO=    ',
            severity: 'warning',
        });
    });

    it('should warn on value that is a comment', () => {
        const result = noEmptyValueCheck(5, 'FOO= # some comment');
        expect(result).toEqual({
            line: 5,
            issue: 'Variable "FOO" has an empty value',
            content: 'FOO= # some comment',
            severity: 'warning',
        });
    });

    it('should return undefined for empty string value', () => {
        expect(noEmptyValueCheck(6, 'FOO=""')).toBeUndefined();
    });

    it('should ignore comment lines and empty lines', () => {
        expect(noEmptyValueCheck(7, '# comment')).toBeUndefined();
        expect(noEmptyValueCheck(8, '     ')).toBeUndefined();
    });

    it('should return undefined for lines without equal sign', () => {
        expect(noEmptyValueCheck(9, 'INVALID_LINE')).toBeUndefined();
    });
});
