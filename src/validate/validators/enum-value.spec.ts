import { enumValueValidator } from './enum-value.validator.js';

describe('enumValueValidator', () => {
    it('should return true for valid enum value', () => {
        const result = enumValueValidator('ENV', 'production', ['development', 'staging', 'production']);
        expect(result).toBe(true);
    });

    it('should return error message for invalid enum value', () => {
        const result = enumValueValidator('ENV', 'invalid', ['development', 'staging', 'production']);
        expect(result).toBe('ENV must be one of: development, staging, production');
    });

    it('should return error message for empty allowed values', () => {
        const result = enumValueValidator('ENV', 'production', []);
        expect(result).toBe('ENV must be one of: ');
    });
});
