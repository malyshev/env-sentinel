import { LintCheck, LintResult, LintResultWithRule } from '../types.js';
import { lintChecks } from './checks/index.js';
import { parseDisabledRules } from './utils.js';

export function lintEnvContent(envContent: string): LintResultWithRule[] {
    const lines = envContent.split(/\r?\n/);
    const issues: LintResultWithRule[] = [];

    const disabledRules = parseDisabledRules(lines);

    lines.forEach((rawLine, idx) => {
        const lineNumber = idx + 1;
        lintChecks.forEach((check: LintCheck) => {
            if (disabledRules?.get(lineNumber)?.has(check.name)) {
                return;
            }

            // Skip a comment line.
            if (rawLine.trim().startsWith('#')) {
                return;
            }

            const checkResult: LintResult | undefined = check.run(lineNumber, rawLine);
            if (checkResult !== undefined) {
                issues.push({ ...checkResult, rule: check.name });
            }
        });
    });

    return issues;
}
