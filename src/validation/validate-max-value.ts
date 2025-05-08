import { ValidationResult } from '../constants.js';

export function validateMaxValue(key: string, value: string, args: string[]): ValidationResult {
    const max: number = Number(args[0]);
    if (isNaN(max)) {
        return `Invalid max argument for ${key}`;
    }

    // If value is numeric and not empty string, validate as number
    if (value !== '' && !isNaN(Number(value))) {
        return Number(value) > max ? `${key} must be <= ${max}` : true;
    }

    // Fallback to string length
    return value.length > max ? `${key} must be at most ${max} characters long` : true;
}
