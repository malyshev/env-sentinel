import { log } from './../log.js';
import fs, { readFileSync } from 'node:fs';
import process from 'node:process';
import { parseEnvContent, parseSchemaContent } from './../parsers/index.js';
import { validateEnv } from './../validate-env.js';
import { DEFAULT_SCHEMA_FILE_NAME } from './../constants.js';

export function handleValidate(args: string[]) {
    let envVars: Record<string, string>;
    let schemaVars: Record<string, string>;

    const envFilePath = args.includes('--env-file') ? args[args.indexOf('--env-file') + 1] : '.env';
    const schemaFilePath = args.includes('--schema') ? args[args.indexOf('--schema') + 1] : DEFAULT_SCHEMA_FILE_NAME;

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
