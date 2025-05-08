import { validateNumber } from './validate-number';

describe('validateNumber', () => {
    it('returns true for valid integers', () => {
        expect(validateNumber('PORT', '3000')).toBe(true);
    });

    it('returns true for valid floats', () => {
        expect(validateNumber('THRESHOLD', '0.75')).toBe(true);
    });

    it('returns error for non-numeric strings', () => {
        expect(validateNumber('PORT', 'abc')).toBe('Invalid number for PORT');
    });

    it('returns error for empty string', () => {
        expect(validateNumber('PORT', '')).toBe('Invalid number for PORT');
    });

    it('returns true for negative numbers', () => {
        expect(validateNumber('DEPTH', '-5')).toBe(true);
    });

    it('returns true for scientific notation', () => {
        expect(validateNumber('EXP', '1e5')).toBe(true);
    });

    it('returns error for whitespace string', () => {
        expect(validateNumber('PORT', '   ')).toBe('Invalid number for PORT');
    });
});
