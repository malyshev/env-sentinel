import { ValidationResult } from '../constants.js';

export function validateNumber(key: string, value: string): ValidationResult {
    const errorMessage: string = `Invalid number for ${key}`;
    if (value.trim() === '') {
        return errorMessage;
    }

    return isNaN(Number(value)) ? errorMessage : true;
}
