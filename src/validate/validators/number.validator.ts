import { ValidationResult } from '../../types.js';

export function numberValidator(key: string, value: string): ValidationResult {
    if (value.trim() === '') {
        return `Invalid number for ${key}`;
    }
    return !isNaN(Number(value)) ? true : `Invalid number for ${key}`;
}
