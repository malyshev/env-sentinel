import { validateMaxValue } from './validate-max-value.js';

describe('validateMaxValue', () => {
    it('passes when numeric value is less than max', () => {
        expect(validateMaxValue('PORT', '3000', ['5000'])).toBe(true);
    });

    it('passes when numeric value is equal to max', () => {
        expect(validateMaxValue('PORT', '5000', ['5000'])).toBe(true);
    });

    it('fails when numeric value is greater than max', () => {
        expect(validateMaxValue('PORT', '6000', ['5000'])).toBe('PORT must be <= 5000');
    });

    it('passes when string length is within max', () => {
        expect(validateMaxValue('NAME', 'abc', ['5'])).toBe(true);
    });

    it('fails when string length exceeds max', () => {
        expect(validateMaxValue('NAME', 'abcdef', ['5'])).toBe('NAME must be at most 5 characters long');
    });

    it('fails when max argument is invalid', () => {
        expect(validateMaxValue('PORT', '3000', ['not-a-number'])).toBe('Invalid max argument for PORT');
    });

    it('passes when string is empty and max allows it', () => {
        expect(validateMaxValue('NAME', '', ['0'])).toBe(true);
    });

    it('fails when string is empty and max is negative', () => {
        expect(validateMaxValue('NAME', '', ['-1'])).toBe('NAME must be at most -1 characters long');
    });
});
