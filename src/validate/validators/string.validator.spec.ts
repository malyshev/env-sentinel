import { stringValidator } from './string.validator.js';

describe('stringValidator', () => {
    it('should always return true for any string value', () => {
        expect(stringValidator()).toBe(true);
        expect(stringValidator()).toBe(true);
        expect(stringValidator()).toBe(true);
        expect(stringValidator()).toBe(true);
        expect(stringValidator()).toBe(true);
    });

    it('should return true for empty string', () => {
        expect(stringValidator()).toBe(true);
    });

    it('should return true for numeric strings', () => {
        expect(stringValidator()).toBe(true);
        expect(stringValidator()).toBe(true);
    });

    it('should return true for boolean strings', () => {
        expect(stringValidator()).toBe(true);
        expect(stringValidator()).toBe(true);
    });

    it('should return true for complex strings', () => {
        expect(stringValidator()).toBe(true);
        expect(stringValidator()).toBe(true);
        expect(stringValidator()).toBe(true);
    });
});
