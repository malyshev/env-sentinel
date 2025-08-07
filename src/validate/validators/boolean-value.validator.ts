import { ValidationResult } from '../../types.js';

export function booleanValueValidator(key: string, value: string): ValidationResult {
    const lowerValue: string = value.toLowerCase();
    return ['true', 'false'].includes(lowerValue) ? true : `Invalid boolean for ${key}, must be 'true' or 'false'`;
}
