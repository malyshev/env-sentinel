import { LintCheck, LintResult, Result, Issue, Summary } from '../types.js';
import { lintRegistry } from './lint-registry.js';
import { parseDisabledRules } from './utils.js';

export function lint(envContent: string): Result {
    const lines = envContent.split(/\r?\n/);
    const issues: Issue[] = [];
    let errors = 0;
    let warnings = 0;
    let notices = 0;

    const disabledRules = parseDisabledRules(lines);
    const lintChecks = lintRegistry.getAll();

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
                const severity = checkResult.severity || 'error';

                issues.push({
                    line: lineNumber,
                    message: checkResult.issue,
                    severity,
                    rule: check.name,
                });

                switch (severity) {
                    case 'error':
                        errors++;
                        break;
                    case 'warning':
                        warnings++;
                        break;
                    case 'notice':
                        notices++;
                        break;
                }
            }
        });
    });

    const summary: Summary = {
        total: issues.length,
        errors,
        warnings,
        notices,
    };

    return {
        isValid: errors === 0,
        issues,
        summary,
    };
}
