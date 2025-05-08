import { ValidationResult } from '../constants.js';

export function validateMinValue(key: string, value: string, args: string[]): ValidationResult {
    const min: number = Number(args[0]);
    if (isNaN(min)) {
        return `Invalid min argument for ${key}`;
    }

    // Empty string should be treated as string, not number
    if (value === '') {
        return value.length < min ? `${key} must be at least ${min} characters long` : true;
    }

    // Try to interpret value as a number
    const numValue: number = Number(value);
    if (!isNaN(numValue)) {
        return numValue < min ? `${key} must be >= ${min}` : true;
    }

    // Default to string length
    return value.length < min ? `${key} must be at least ${min} characters long` : true;
}
