import { log } from './../log.js';
import fs, { readFileSync } from 'node:fs';
import process from 'node:process';
import { parseEnvContent, parseSchemaContent } from './../parsers/index.js';
import { validateEnv } from './../validate-env.js';

export function handleValidate(envFilePath: string, schemaFilePath: string): void {
    let envVars: Record<string, string>;
    let schemaVars: Record<string, string>;

    if (!fs.existsSync(envFilePath)) {
        log.error(`.env file not found: ${envFilePath}`);
        process.exit(1);
    }

    if (!fs.existsSync(schemaFilePath)) {
        log.error(`Schema file not found: ${schemaFilePath}`);
        log.warn(`Hint: You can generate a template by running 'env-sentinel init'`);
        process.exit(1);
    }

    try {
        const rawEnvContent = readFileSync(envFilePath, 'utf-8');
        envVars = parseEnvContent(rawEnvContent);
        const rawSchemaContent = readFileSync(schemaFilePath, 'utf-8');
        schemaVars = parseSchemaContent(rawSchemaContent);
    } catch (e) {
        log.error((e as Error).message);
        process.exit(1);
    }

    const result = validateEnv(envVars, schemaVars);

    if (result) {
        log.success('Environment validation passed!');
        process.exit(0);
    } else {
        log.error('Environment validation failed.');
        process.exit(1);
    }
}
