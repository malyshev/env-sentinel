import { ValidationResult } from '../../types.js';

/**
 * String validator - no-op validator for type indication
 * All environment variables are strings by default, so this validator
 * always returns true. It's used for type indication and to enable
 * string-specific validation rules like min/max length.
 */
export function stringValidator(): ValidationResult {
    // No-op validator - always returns true since all env vars are strings
    return true;
}