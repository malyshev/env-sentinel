import { secureValueValidator } from './secure-value.validator.js';

describe('secureValueValidator', () => {
    it('should return true for valid secure password', () => {
        expect(secureValueValidator('PASSWORD', 'Strong1!Pass')).toBe(true);
    });

    it('should return error message for password too short', () => {
        expect(secureValueValidator('PASSWORD', 'S1!a')).toBe('PASSWORD must be at least 8 characters long');
    });

    it('should return error message for missing lowercase', () => {
        expect(secureValueValidator('PASSWORD', 'UPPERCASE1!')).toBe(
            'PASSWORD must contain at least one lowercase letter'
        );
    });

    it('should return error message for missing uppercase', () => {
        expect(secureValueValidator('PASSWORD', 'lowercase1!')).toBe(
            'PASSWORD must contain at least one uppercase letter'
        );
    });

    it('should return error message for missing number', () => {
        expect(secureValueValidator('PASSWORD', 'NoNumber!')).toBe('PASSWORD must contain at least one number');
    });

    it('should return error message for missing special character', () => {
        expect(secureValueValidator('PASSWORD', 'NoSpecial1')).toBe(
            'PASSWORD must contain at least one special character'
        );
    });

    it('should return error message for containing spaces', () => {
        expect(secureValueValidator('PASSWORD', 'Has Space1!')).toBe('PASSWORD must not contain spaces');
    });
});
