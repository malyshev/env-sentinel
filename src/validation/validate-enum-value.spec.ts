import { validateEnumValue } from './validate-enum-value.js';

describe('validateEnumValue', () => {
    it('returns true when value is in allowed values', () => {
        const result = validateEnumValue('ENV', 'stage', ['dev', 'stage', 'prod']);
        expect(result).toBe(true);
    });

    it('returns error when value is not in allowed values', () => {
        const result = validateEnumValue('ENV', 'test', ['dev', 'stage', 'prod']);
        expect(result).toBe('ENV must be one of: dev, stage, prod');
    });

    it('returns error when args is not an array', () => {
        // @ts-expect-error testing runtime behavior with invalid args
        const result = validateEnumValue('ENV', 'stage', 'dev');
        expect(result).toBe('Invalid enum definition for ENV, expected an array of allowed values');
    });

    it('returns error when args array is empty', () => {
        const result = validateEnumValue('ENV', 'stage', []);
        expect(result).toBe('ENV must be one of: ');
    });
});
