import { ValidationResult } from '../constants.js';

export function validateSecureValue(key: string, value: string): ValidationResult {
    const minLength = 8;

    if (value.length < minLength) {
        return `${key} must be at least ${minLength} characters long`;
    }

    if (!/[A-Z]/.test(value)) {
        return `${key} must contain at least one uppercase letter`;
    }

    if (!/[a-z]/.test(value)) {
        return `${key} must contain at least one lowercase letter`;
    }

    if (!/\d/.test(value)) {
        return `${key} must contain at least one number`;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        return `${key} must contain at least one special character`;
    }

    if (/\s/.test(value)) {
        return `${key} must not contain spaces`;
    }

    return true;
}
