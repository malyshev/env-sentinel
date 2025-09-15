import { ValidationResult } from '../../types.js';

export function minValueValidator(key: string, value: string, args: string[]): ValidationResult {
    const minValue = parseFloat(args[0]);
    if (isNaN(minValue)) {
        return `Invalid min argument for ${key}`;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue.toString() === value) {
        // Value is a valid number - validate as numeric
        if (numValue < minValue) {
            return `${key} must be >= ${minValue}`;
        }
    } else {
        // Value is not a valid number - validate as string length
        if (value.length < minValue) {
            return `${key} must be at least ${minValue} characters long`;
        }
    }

    return true;
}
