import { ValidationResult } from '../../types.js';

export function maxValueValidator(key: string, value: string, args: string[]): ValidationResult {
    const maxValue = parseFloat(args[0]);
    if (isNaN(maxValue)) {
        return `Invalid max argument for ${key}`;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue.toString() === value) {
        // Value is a valid number - validate as numeric
        if (numValue > maxValue) {
            return `${key} must be <= ${maxValue}`;
        }
    } else {
        // Value is not a valid number - validate as string length
        if (value.length > maxValue) {
            return `${key} must be at most ${maxValue} characters long`;
        }
    }

    return true;
}
