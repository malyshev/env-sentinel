import fs, { readFileSync } from 'node:fs';
import { log } from '../log.js';
import process from 'node:process';
import { lintEnvContent } from '../linter/index.js';
import { LintResultWithRule } from '../types.js';

export function handleLint(envFilePath: string) {
    if (!fs.existsSync(envFilePath)) {
        log.error(`.env file not found: ${envFilePath}`);
        process.exit(1);
    }

    const rawEnvContent = readFileSync(envFilePath, 'utf-8');
    const result: LintResultWithRule[] = lintEnvContent(rawEnvContent);

    result.forEach((lintResult: LintResultWithRule): void => {
        const message: string = `${envFilePath}:${lintResult.line} [${lintResult.severity}] ${lintResult.rule} → ${lintResult.issue}`;

        if (lintResult.severity === 'warning') {
            log.warn(message);
        } else {
            log.error(message);
        }
    });
}
