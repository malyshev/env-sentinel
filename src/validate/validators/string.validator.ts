import { ValidationResult } from '../../types.js';


export function stringValidator(): ValidationResult {
    // No-op validator - always returns true since all env vars are strings
    return true;
}