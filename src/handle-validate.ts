import { log } from './log.js';
import fs from 'node:fs';
import process from 'node:process';
import { parseEnvFile } from './parse-env-file.js';
import { parseSchema } from './parse-schema.js';
import { validateEnv } from './validate-env.js';
import { DEFAULT_SCHEMA_FILE_NAME } from './constants.js';

export function handleValidate(args: string[]) {
    let envVars: Record<string, string>;
    let schemaVars: Record<string, string>;

    const envPath = args.includes('--env-file') ? args[args.indexOf('--env-file') + 1] : '.env';
    const schemaPath = args.includes('--schema') ? args[args.indexOf('--schema') + 1] : DEFAULT_SCHEMA_FILE_NAME;

    if (!fs.existsSync(envPath)) {
        log.error(`.env file not found: ${envPath}`);
        process.exit(1);
    }

    if (!fs.existsSync(schemaPath)) {
        log.error(`Schema file not found: ${schemaPath}`);
        log.warn(`Hint: You can generate a template by running 'env-sentinel init'`);
        process.exit(1);
    }

    try {
        envVars = parseEnvFile(envPath);
        schemaVars = parseSchema(schemaPath);
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
