import { ValidationResult } from '../../types.js';

export function minValueValidator(key: string, value: string, args: string[]): ValidationResult {
    const minValue = parseFloat(args[0]);
    if (isNaN(minValue)) {
        return `Invalid min argument for ${key}`;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
        return `Invalid number for ${key}`;
    }

    if (numValue < minValue) {
        return `${key} must be >= ${minValue}`;
    }

    return true;
}
