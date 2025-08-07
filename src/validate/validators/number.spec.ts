import { numberValidator } from './number.validator.js';

describe('numberValidator', () => {
    it('should return true for valid integers', () => {
        expect(numberValidator('PORT', '3000')).toBe(true);
    });

    it('should return true for valid decimals', () => {
        expect(numberValidator('THRESHOLD', '0.75')).toBe(true);
    });

    it('should return error message for invalid numbers', () => {
        expect(numberValidator('PORT', 'abc')).toBe('Invalid number for PORT');
    });

    it('should return error message for empty strings', () => {
        expect(numberValidator('PORT', '')).toBe('Invalid number for PORT');
    });

    it('should return true for negative numbers', () => {
        expect(numberValidator('DEPTH', '-5')).toBe(true);
    });

    it('should return true for scientific notation', () => {
        expect(numberValidator('EXP', '1e5')).toBe(true);
    });

    it('should return error message for whitespace-only strings', () => {
        expect(numberValidator('PORT', '   ')).toBe('Invalid number for PORT');
    });
});
