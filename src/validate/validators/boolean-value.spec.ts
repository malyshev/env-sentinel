import { booleanValueValidator } from './boolean-value.validator.js';

describe('booleanValueValidator', () => {
    it('should return true for valid boolean "true"', () => {
        const result = booleanValueValidator('MY_BOOLEAN', 'true');
        expect(result).toBe(true);
    });

    it('should return true for valid boolean "false"', () => {
        const result = booleanValueValidator('MY_BOOLEAN', 'false');
        expect(result).toBe(true);
    });

    it('should return error message for invalid boolean "yes"', () => {
        const result = booleanValueValidator('MY_BOOLEAN', 'yes');
        expect(result).toBe("Invalid boolean for MY_BOOLEAN, must be 'true' or 'false'");
    });

    it('should return error message for invalid boolean "1"', () => {
        const result = booleanValueValidator('MY_BOOLEAN', '1');
        expect(result).toBe("Invalid boolean for MY_BOOLEAN, must be 'true' or 'false'");
    });

    it('should return error message for invalid boolean "0"', () => {
        const result = booleanValueValidator('MY_BOOLEAN', '0');
        expect(result).toBe("Invalid boolean for MY_BOOLEAN, must be 'true' or 'false'");
    });

    it('should return error message for empty string', () => {
        const result = booleanValueValidator('MY_BOOLEAN', '');
        expect(result).toBe("Invalid boolean for MY_BOOLEAN, must be 'true' or 'false'");
    });
});
