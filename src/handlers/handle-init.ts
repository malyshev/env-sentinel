import { log } from './../log.js';
import { resolve } from 'node:path';
import { existsSync, writeFileSync } from 'node:fs';
import { DEFAULT_SCHEMA, DEFAULT_SCHEMA_FILE_NAME } from './../constants.js';
import { generateSchemaFromEnv } from './../generators/index.js';

export function handleInit(envFilePath: string, forceRecreate: boolean = false): void {
    const targetPath = resolve(process.cwd(), DEFAULT_SCHEMA_FILE_NAME);

    if (existsSync(targetPath) && !forceRecreate) {
        log.warn(`Project already initialized — ${DEFAULT_SCHEMA_FILE_NAME} file already exists.`);
        log.warn(`Use --force to overwrite it or edit it manually.`);
        process.exit(0);
    }

    let schema: string;

    if (existsSync(envFilePath)) {
        schema = generateSchemaFromEnv(envFilePath);
        log.success(`Schema inferred from ${envFilePath}`);
    } else {
        schema = DEFAULT_SCHEMA;
        log.warn(`${envFilePath} not found, using default template.`);
    }

    writeFileSync(targetPath, schema);
    log.success(`${DEFAULT_SCHEMA_FILE_NAME} created!`);
    process.exit(0);
}
