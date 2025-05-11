import process from 'node:process';
import { handleInit, handleValidate } from './handlers/index.js';
import { parseArguments } from './parsers/parse-arguments.js';
import { DEFAULT_SCHEMA_FILE_NAME } from './constants.js';
import { ExpectedArguments } from './types.js';

export function run(): void {
    const { command, file, schema } = parseArguments<ExpectedArguments>(process.argv, {
        command: 'check',
        file: '.env',
        schema: DEFAULT_SCHEMA_FILE_NAME,
        force: false,
    });

    console.log(command, file, schema);

    switch (command) {
        case 'init':
            handleInit(file!);
            break;
        case 'check':
        case undefined:
            handleValidate(file!, schema!);
            break;
        default:
            console.log(`Unknown command: ${command}`);
            console.log(`Usage: env-sentinel [init|check] [--force] [--env-file FILE] [--schema FILE]`);
            process.exit(1);
    }
}

export * from './handlers/index.js';
export * from './parsers/index.js';
export * from './validate-env.js';
export * from './constants.js';
export * from './types.js';
