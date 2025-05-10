import process from 'node:process';
import { handleInit, handleValidate } from './handlers/index.js';

export function run() {
    const args = process.argv.slice(2);
    const command: 'init' | 'check' | unknown = args[0] ?? 'check';

    switch (command) {
        case 'init':
            handleInit(args);
            break;
        case 'check':
        case undefined:
            handleValidate(args);
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
