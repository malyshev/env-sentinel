import { existsSync, readFileSync } from 'node:fs';
import { inferType } from './infer-type.js';
import { SchemaEntry, Result } from '../types.js';

export function generateSchemaFromEnv(envPath: string, lintResults?: Result): string {
    if (!existsSync(envPath)) {
        throw new Error(`File not found: ${envPath}`);
    }

    const raw: string = readFileSync(envPath, 'utf-8');
    const lines = raw.split(/\r?\n/);
    const schemaEntries: SchemaEntry[] = [];

    // Create a set of line numbers that have errors (to skip them)
    const errorLines = new Set<number>();
    if (lintResults) {
        lintResults.issues
            .filter((issue) => issue.severity === 'error')
            .forEach((issue) => {
                if (issue.line) {
                    errorLines.add(issue.line);
                }
            });
    }

    // First pass: collect all valid key-value pairs to resolve references
    const envVars = new Map<string, string>();
    lines.forEach((line, lineIndex) => {
        const lineNumber = lineIndex + 1;
        const trimmedLine = line.trim();

        // Skip empty lines, comments, and error lines
        if (!trimmedLine || trimmedLine.startsWith('#')) {
            return;
        }
        if (errorLines.has(lineNumber)) {
            return;
        }

        // Try to parse the line
        const equalIndex = trimmedLine.indexOf('=');
        if (equalIndex === -1) {
            return;
        }

        const key = trimmedLine.substring(0, equalIndex).trim();
        const value = trimmedLine.substring(equalIndex + 1).trim();

        // Skip if key is empty or contains invalid characters
        if (!key || key.includes(' ') || key.includes('"') || key.includes("'")) {
            return;
        }

        // Strip surrounding quotes from value
        let cleanValue = value;
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            cleanValue = value.slice(1, -1);
        }

        // Skip empty values (they'll be handled by validation)
        if (cleanValue === '') {
            return;
        }

        envVars.set(key, cleanValue);
    });

    // Second pass: generate schema with resolved references
    lines.forEach((line, lineIndex) => {
        const lineNumber = lineIndex + 1;
        const trimmedLine = line.trim();

        // Skip empty lines, comments, and error lines
        if (!trimmedLine || trimmedLine.startsWith('#')) {
            return;
        }
        if (errorLines.has(lineNumber)) {
            return;
        }

        // Try to parse the line
        const equalIndex = trimmedLine.indexOf('=');
        if (equalIndex === -1) {
            return;
        }

        const key = trimmedLine.substring(0, equalIndex).trim();
        const value = trimmedLine.substring(equalIndex + 1).trim();

        // Skip if key is empty or contains invalid characters
        if (!key || key.includes(' ') || key.includes('"') || key.includes("'")) {
            return;
        }

        // Strip surrounding quotes from value
        let cleanValue = value;
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            cleanValue = value.slice(1, -1);
        }

        // Skip empty values (they'll be handled by validation)
        if (cleanValue === '') {
            return;
        }

        // Resolve variable references for type inference
        let resolvedValue = cleanValue;
        if (cleanValue.startsWith('$') && cleanValue.length > 1) {
            const refKey = cleanValue.substring(1);
            const refValue = envVars.get(refKey);
            if (refValue !== undefined) {
                resolvedValue = refValue;
            }
        }

        const type: 'number' | 'boolean' | '' = inferType(resolvedValue);
        const rule: string = type ? `required|${type}` : 'required';

        schemaEntries.push({ key, rule });
    });

    return (
        `# Generated from ${envPath}\n` +
        schemaEntries.map((entry: SchemaEntry): string => `${entry.key}=${entry.rule}`).join('\n') +
        '\n'
    );
}
