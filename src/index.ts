import process from 'node:process';
import { handleInit, handleValidate } from './handlers/index.js';
import { parseArguments } from './parsers/parse-arguments.js';
import { DEFAULT_SCHEMA_FILE_NAME } from './constants.js';
import { ExpectedArguments } from './types.js';
import { handleLint } from './handlers/handle-lint.js';
import { log } from './utils/log.js';

export function run(): void {
    const { command, file, schema, force } = parseArguments<ExpectedArguments>(process.argv, {
        command: 'validate',
        file: '.env',
        schema: DEFAULT_SCHEMA_FILE_NAME,
        force: false,
    });

    try {
        switch (command) {
            case 'check':
                console.warn(
                    'The "check" command is deprecated and will be removed in a future release. Please use "validate" instead.',
                );
                handleValidate(file!, schema!);
                process.exit(0);
                break;
            case 'validate':
                handleValidate(file!, schema!);
                process.exit(0);
                break;
            case 'init':
                handleInit(file!, force);
                process.exit(0);
                break;
            case 'lint':
            case undefined:
                handleLint(file!);
                process.exit(0);
                break;
            default:
                console.log(`Unknown command: ${command}`);
                console.log(`Usage: env-sentinel [init|check] [--force] [--file FILE] [--schema FILE]`);
                process.exit(1);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        log.error(errorMessage);
        process.exit(1);
    }
}

export * from './handlers/index.js';
export * from './parsers/index.js';
export * from './validate/index.js';
export * from './lint/index.js';
export * from './constants.js';
export * from './types.js';
