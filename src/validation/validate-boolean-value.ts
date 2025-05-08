import { ValidationResult } from '../constants.js';

export function validateBooleanValue(key: string, value: string): ValidationResult {
    const lowerValue: string = value.toLowerCase();
    return ['true', 'false'].includes(lowerValue) ? true : `Invalid boolean for ${key}, must be 'true' or 'false'`;
}
