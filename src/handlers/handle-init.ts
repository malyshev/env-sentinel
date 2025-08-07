import { log } from './../utils/log.js';
import { resolve } from 'node:path';
import { existsSync, writeFileSync, readFileSync } from 'node:fs';
import { DEFAULT_SCHEMA, DEFAULT_SCHEMA_FILE_NAME } from './../constants.js';
import { generateSchemaFromEnv } from './../generators/index.js';
import { lint } from './../lint/index.js';

export function handleInit(envFilePath: string, forceRecreate: boolean = false): void {
    const targetPath = resolve(process.cwd(), DEFAULT_SCHEMA_FILE_NAME);

    if (existsSync(targetPath) && !forceRecreate) {
        throw new Error(
            `Project already initialized — ${DEFAULT_SCHEMA_FILE_NAME} file already exists. Use --force to overwrite it or edit it manually.`,
        );
    }

    let schema: string;

    if (existsSync(envFilePath)) {
        // First, lint the file to identify issues
        const rawEnvContent = readFileSync(envFilePath, 'utf-8');
        const lintResults = lint(rawEnvContent);

        // Separate errors and warnings
        const errors = lintResults.issues.filter((issue) => issue.severity === 'error');
        const warnings = lintResults.issues.filter((issue) => issue.severity === 'warning');

        if (errors.length > 0) {
            log.warn(`Found ${errors.length} errors in ${envFilePath}. Invalid entries will be skipped:`);
            errors.forEach((issue) => {
                const lineInfo = issue.line ? `:${issue.line}` : '';
                log.warn(`  Skipped ${envFilePath}${lineInfo} [${issue.severity}] ${issue.rule} → ${issue.message}`);
            });
        }

        if (warnings.length > 0) {
            log.warn(`Found ${warnings.length} warnings in ${envFilePath}:`);
            warnings.forEach((issue) => {
                const lineInfo = issue.line ? `:${issue.line}` : '';
                log.warn(`  ${envFilePath}${lineInfo} [${issue.severity}] ${issue.rule} → ${issue.message}`);
            });
        }

        // Generate schema from the file, passing linting results to skip invalid entries
        schema = generateSchemaFromEnv(envFilePath, lintResults);

        const totalIssues = errors.length + warnings.length;
        if (totalIssues > 0) {
            log.warn(`Schema generated with ${totalIssues} issues found. Please review and fix the issues.`);
        } else {
            log.success(`Schema inferred from ${envFilePath}`);
        }
    } else {
        schema = DEFAULT_SCHEMA;
        log.warn(`${envFilePath} not found, using default template.`);
    }

    writeFileSync(targetPath, schema);
    log.success(`${DEFAULT_SCHEMA_FILE_NAME} created!`);
}
