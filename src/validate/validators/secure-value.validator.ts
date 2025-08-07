import { ValidationResult } from '../../types.js';

export function secureValueValidator(key: string, value: string): ValidationResult {
    if (value.length < 8) {
        return `${key} must be at least 8 characters long`;
    }

    if (!/[a-z]/.test(value)) {
        return `${key} must contain at least one lowercase letter`;
    }

    if (!/[A-Z]/.test(value)) {
        return `${key} must contain at least one uppercase letter`;
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
