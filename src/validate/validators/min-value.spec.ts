import { minValueValidator } from './min-value.validator.js';

describe('minValueValidator', () => {
    it('should return true for valid number within range', () => {
        expect(minValueValidator('PORT', '3000', ['1000'])).toBe(true);
    });

    it('should return error message for number below min', () => {
        expect(minValueValidator('PORT', '500', ['1000'])).toBe('PORT must be >= 1000');
    });

    it('should return error message for invalid min argument', () => {
        expect(minValueValidator('PORT', '3000', ['abc'])).toBe('Invalid min argument for PORT');
    });

    it('should return error message for invalid number value', () => {
        expect(minValueValidator('PORT', 'abc', ['1000'])).toBe('Invalid number for PORT');
    });
});
