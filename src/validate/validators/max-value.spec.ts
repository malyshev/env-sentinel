import { maxValueValidator } from './max-value.validator.js';

describe('maxValueValidator', () => {
    it('should return true for valid number within range', () => {
        expect(maxValueValidator('PORT', '3000', ['5000'])).toBe(true);
    });

    it('should return true for number equal to max', () => {
        expect(maxValueValidator('PORT', '5000', ['5000'])).toBe(true);
    });

    it('should return error message for number exceeding max', () => {
        expect(maxValueValidator('PORT', '6000', ['5000'])).toBe('PORT must be <= 5000');
    });

    it('should return error message for invalid max argument', () => {
        expect(maxValueValidator('PORT', '3000', ['not-a-number'])).toBe('Invalid max argument for PORT');
    });

    it('should validate string length for non-numeric values', () => {
        expect(maxValueValidator('PORT', 'abc', ['2'])).toBe('PORT must be at most 2 characters long');
    });
});
