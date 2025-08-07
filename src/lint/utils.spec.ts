import { isEmptyOrCommentLine, parseDisabledRules } from './utils.js';

describe('isEmptyOrCommentLine', () => {
    it('should return true for empty string', () => {
        expect(isEmptyOrCommentLine('')).toBe(true);
    });

    it('should return true for string with only spaces', () => {
        expect(isEmptyOrCommentLine('   ')).toBe(true);
    });

    it('should return true for full-line comment with #', () => {
        expect(isEmptyOrCommentLine('# this is a comment')).toBe(true);
    });

    it('should return true for comment with leading whitespace', () => {
        expect(isEmptyOrCommentLine('   # another comment')).toBe(true);
    });

    it('should return false for a normal key=value line', () => {
        expect(isEmptyOrCommentLine('KEY=value')).toBe(false);
    });

    it('should return false for a malformed assignment', () => {
        expect(isEmptyOrCommentLine('NOTACOMMENT')).toBe(false);
    });

    it('should return false for inline comment after a key', () => {
        expect(isEmptyOrCommentLine('KEY=value # comment')).toBe(false);
    });
});

describe('parseDisabledRules', () => {
    it('should detect single rule on one line', () => {
        const lines = ['# es-disable: no-empty-value', 'KEY=123'];
        const result = parseDisabledRules(lines);
        expect(result.get(2)).toEqual(new Set(['no-empty-value']));
    });

    it('should support multiple rules on one line', () => {
        const lines = ['# es-disable: no-empty-value, no-leading-spaces', ' KEY=123'];
        const result = parseDisabledRules(lines);
        expect(result.get(2)).toEqual(new Set(['no-empty-value', 'no-leading-spaces']));
    });

    it('should trim whitespace and ignore empty rule names', () => {
        const lines = ['# es-disable:  no-empty-value ,  ,  no-quoted-key  ', 'KEY=123'];
        const result = parseDisabledRules(lines);
        expect(result.get(2)).toEqual(new Set(['no-empty-value', 'no-quoted-key']));
    });

    it('should ignore unrelated comments', () => {
        const lines = ['# this is a normal comment', 'KEY=123'];
        const result = parseDisabledRules(lines);
        expect(result.size).toBe(0);
    });

    it('should not include inline-style disable comments (by design)', () => {
        const lines = ['KEY=123', '# es-disable: no-empty-value'];
        const result = parseDisabledRules(lines);
        expect(result.size).toBe(0); // rule applies to line 3, which doesn't exist
    });

    it('should accumulate multiple disables for the same line', () => {
        const lines = ['# es-disable: no-empty-value', '# es-disable: no-lowercase', 'key=value'];
        const result = parseDisabledRules(lines);
        expect(result.get(3)).toEqual(new Set(['no-empty-value', 'no-lowercase']));
    });
});
