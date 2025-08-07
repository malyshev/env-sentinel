import { ValidationResult } from '../../types.js';

export function enumValueValidator(key: string, value: string, args: string[]): ValidationResult {
    const allowedValues: string[] = args;
    if (!Array.isArray(allowedValues)) {
        return `Invalid enum definition for ${key}, expected an array of allowed values`;
    }

    if (!allowedValues.includes(value)) {
        return `${key} must be one of: ${allowedValues.join(', ')}`;
    }

    return true;
}
