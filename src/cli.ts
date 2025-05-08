import process from 'node:process';
import { handleValidate } from './handle-validate.js';
import { handleInit } from './handle-init.js';

export function run() {
    const args = process.argv.slice(2);
    const command = args[0];

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
            console.log(`Usage: env-sentinel [init|validate] [--force] [--env-file FILE] [--schema FILE]`);
            process.exit(1);
    }
}
