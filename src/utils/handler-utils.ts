import fs, { readFileSync } from 'node:fs';
import { Result } from '../types.js';
import { formatIssues } from './formatter.js';

/**
 * Validates that a file exists and throws an error if it doesn't
 */
export function validateFileExists(filePath: string, fileType: string): void {
    if (!fs.existsSync(filePath)) {
        throw new Error(`${fileType} file not found: ${filePath}`);
    }
}

/**
 * Reads an environment file and returns its content
 */
export function readEnvFile(envFilePath: string): string {
    validateFileExists(envFilePath, '.env');
    return readFileSync(envFilePath, 'utf-8');
}

/**
 * Reads a schema file and returns its content
 */
export function readSchemaFile(schemaFilePath: string): string {
    validateFileExists(schemaFilePath, 'Schema');
    return readFileSync(schemaFilePath, 'utf-8');
}

/**
 * Handles the result of linting or validation operations
 * Formats issues and throws an error if validation failed
 */
export function handleResult(result: Result, filePath: string, operation: 'lint' | 'validate'): void {
    formatIssues(result.issues, filePath);
    
    if (operation === 'validate' && !result.isValid) {
        throw new Error(`Validation failed for ${filePath}`);
    }
}
