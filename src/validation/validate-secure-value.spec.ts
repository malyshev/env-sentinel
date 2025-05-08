import { validateSecureValue } from './validate-secure-value.js';

describe('validateSecureValue', () => {
    it('returns true for a valid secure password', () => {
        expect(validateSecureValue('PASSWORD', 'Strong1!Pass')).toBe(true);
    });

    it('fails for password shorter than 8 characters', () => {
        expect(validateSecureValue('PASSWORD', 'S1!a')).toBe('PASSWORD must be at least 8 characters long');
    });

    it('fails if no uppercase letter', () => {
        expect(validateSecureValue('PASSWORD', 'lowercase1!')).toBe(
            'PASSWORD must contain at least one uppercase letter',
        );
    });

    it('fails if no lowercase letter', () => {
        expect(validateSecureValue('PASSWORD', 'UPPERCASE1!')).toBe(
            'PASSWORD must contain at least one lowercase letter',
        );
    });

    it('fails if no number', () => {
        expect(validateSecureValue('PASSWORD', 'NoNumber!')).toBe('PASSWORD must contain at least one number');
    });

    it('fails if no special character', () => {
        expect(validateSecureValue('PASSWORD', 'NoSpecial1')).toBe(
            'PASSWORD must contain at least one special character',
        );
    });

    it('fails if contains spaces', () => {
        expect(validateSecureValue('PASSWORD', 'Has Space1!')).toBe('PASSWORD must not contain spaces');
    });
});
