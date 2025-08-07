import { ValidationResult } from '../../types.js';

export function maxValueValidator(key: string, value: string, args: string[]): ValidationResult {
    const maxValue = parseFloat(args[0]);
    if (isNaN(maxValue)) {
        return `Invalid max argument for ${key}`;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
        return `Invalid number for ${key}`;
    }

    if (numValue > maxValue) {
        return `${key} must be <= ${maxValue}`;
    }

    return true;
}
