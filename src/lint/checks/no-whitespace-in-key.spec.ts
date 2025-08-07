import { noWhitespaceInKeyCheck } from './no-whitespace-in-key.check.js';

describe('noWhitespaceInKeyCheck', () => {
    it('should return undefined for valid key without internal whitespace', () => {
        expect(noWhitespaceInKeyCheck(1, 'FOO=bar')).toBeUndefined();
        expect(noWhitespaceInKeyCheck(2, 'FOO_BAR=value')).toBeUndefined();
        expect(noWhitespaceInKeyCheck(3, '"FOO_BAR"=baz')).toBeUndefined();
        expect(noWhitespaceInKeyCheck(4, "'FOO_BAR'=baz")).toBeUndefined();
    });

    it('should return undefined for comments and empty lines', () => {
        expect(noWhitespaceInKeyCheck(5, '')).toBeUndefined();
        expect(noWhitespaceInKeyCheck(6, '   ')).toBeUndefined();
        expect(noWhitespaceInKeyCheck(7, '# just a comment')).toBeUndefined();
    });

    it('should return an error for key with space inside', () => {
        const result = noWhitespaceInKeyCheck(10, 'FOO BAR=value');
        expect(result).toEqual({
            line: 10,
            issue: 'Variable name contains internal whitespace in "FOO BAR"',
            content: 'FOO BAR=value',
            severity: 'error',
        });
    });

    it('should return an error for quoted key with internal tab', () => {
        const result = noWhitespaceInKeyCheck(11, "'FOO\tBAR'=val");
        expect(result).toEqual({
            line: 11,
            issue: 'Variable name contains internal whitespace in "FOO\tBAR"',
            content: "'FOO\tBAR'=val",
            severity: 'error',
        });
    });

    it('should return an error for key with multiple spaces inside', () => {
        const result = noWhitespaceInKeyCheck(12, 'FOO   BAR=value');
        expect(result).toEqual({
            line: 12,
            issue: 'Variable name contains internal whitespace in "FOO   BAR"',
            content: 'FOO   BAR=value',
            severity: 'error',
        });
    });

    it('should return undefined for key with leading space only', () => {
        expect(noWhitespaceInKeyCheck(13, '   FOO=value')).toBeUndefined();
    });

    it('should return undefined for lines without "="', () => {
        expect(noWhitespaceInKeyCheck(14, 'FOOBAR')).toBeUndefined();
    });

    it('should return undefined for empty key', () => {
        expect(noWhitespaceInKeyCheck(15, '=value')).toBeUndefined();
        expect(noWhitespaceInKeyCheck(16, '   =value')).toBeUndefined();
    });
});
