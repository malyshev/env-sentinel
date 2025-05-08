import { log } from './log.js';
import { resolve } from 'node:path';
import { existsSync, writeFileSync } from 'node:fs';
import { DEFAULT_SCHEMA, DEFAULT_SCHEMA_FILE_NAME } from './constants.js';
import { generateSchemaFromEnv } from './generate-schema-from-env.js';

export function handleInit(args: string[]): void {
    const targetPath = resolve(process.cwd(), DEFAULT_SCHEMA_FILE_NAME);
    const forceRecreate = args.includes('--force');
    const envFileArgIndex = args.indexOf('--env-file');

    const envPath = envFileArgIndex !== -1 ? args[envFileArgIndex + 1] : '.env';

    if (existsSync(targetPath) && !forceRecreate) {
        log.warn(`Project already initialized — ${DEFAULT_SCHEMA_FILE_NAME} file already exists.`);
        log.warn(`Use --force to overwrite it or edit it manually.`);
        process.exit(0);
    }

    let schema: string;

    if (existsSync(envPath)) {
        schema = generateSchemaFromEnv(envPath);
        log.success(`Schema inferred from ${envPath}`);
    } else {
        schema = DEFAULT_SCHEMA;
        log.warn(`${envPath} not found, using default template.`);
    }

    writeFileSync(targetPath, schema);
    log.success(`${DEFAULT_SCHEMA_FILE_NAME} created!`);
    process.exit(0);
}
