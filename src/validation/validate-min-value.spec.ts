import { validateMinValue } from './validate-min-value.js';

describe('validateMinValue', () => {
    it('validates number values correctly', () => {
        expect(validateMinValue('PORT', '3000', ['1000'])).toBe(true);
        expect(validateMinValue('PORT', '500', ['1000'])).toBe('PORT must be >= 1000');
    });

    it('returns error for invalid min argument', () => {
        expect(validateMinValue('PORT', '3000', ['abc'])).toBe('Invalid min argument for PORT');
    });

    it('validates string length if value is not a number', () => {
        expect(validateMinValue('NAME', 'admin', ['3'])).toBe(true);
        expect(validateMinValue('NAME', 'ab', ['3'])).toBe('NAME must be at least 3 characters long');
    });

    it('handles empty strings as strings', () => {
        expect(validateMinValue('NAME', '', ['1'])).toBe('NAME must be at least 1 characters long');
    });
});
