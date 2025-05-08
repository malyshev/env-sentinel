import { inferType } from './infer-type.js';

describe('inferType', () => {
    it('should return "boolean" for boolean strings', () => {
        expect(inferType('true')).toBe('boolean');
        expect(inferType('false')).toBe('boolean');
        expect(inferType('TRUE')).toBe('boolean');
        expect(inferType('False')).toBe('boolean');
    });

    it('should return "number" for numeric strings', () => {
        expect(inferType('123')).toBe('number');
        expect(inferType('-456')).toBe('number');
        expect(inferType('3.14')).toBe('number');
        expect(inferType('-0.99')).toBe('number');
    });

    it('should return "" for non-boolean, non-numeric strings', () => {
        expect(inferType('hello')).toBe('');
        expect(inferType('123abc')).toBe('');
        expect(inferType('trueish')).toBe('');
        expect(inferType('')).toBe('');
    });
});
