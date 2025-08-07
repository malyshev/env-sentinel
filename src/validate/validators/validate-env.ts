import { parseRuleString } from '../index.js';
import { validatorRegistry } from '../validator-registry.js';
import { ParsedRule, ValidationResult, ValidatorFn, Result, Issue } from '../../types.js';

export function validate(
    envValues: Record<string, string>,
    schema: Record<string, string>,
    fileContent?: string,
): Result {
    const issues: Issue[] = [];
    let errors = 0;
    let warnings = 0;
    const notices = 0;

    // Create a map of line numbers to keys for issue reporting
    const lineMap = new Map<string, number>();
    if (fileContent) {
        const lines = fileContent.split(/\r?\n/);
        lines.forEach((line, index) => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const equalIndex = trimmedLine.indexOf('=');
                if (equalIndex !== -1) {
                    const key = trimmedLine.substring(0, equalIndex).trim();
                    lineMap.set(key, index + 1);
                }
            }
        });
    }

    // Check for required variables
    for (const [key, ruleString] of Object.entries(schema)) {
        const rules: ParsedRule[] = parseRuleString(ruleString);
        const value = envValues[key];
        const isRequired = rules.some((rule) => rule.name === 'required');

        if (isRequired && (value === undefined || value === '')) {
            issues.push({
                key,
                message: `Missing required variable: ${key}`,
                severity: 'error',
                rule: 'required',
                line: lineMap.get(key) || undefined,
            });
            errors++;
            continue;
        }

        // Skip validation if value is undefined and not required
        if (value === undefined) {
            continue;
        }

        // Validate each rule
        for (const rule of rules) {
            if (rule.name === 'required') {
                continue; // Already checked above
            }

            const validator: ValidatorFn | undefined = validatorRegistry.get(rule.name);
            if (!validator) {
                issues.push({
                    key,
                    message: `Unknown rule '${rule.name}' for ${key}`,
                    severity: 'warning',
                    rule: rule.name,
                    line: lineMap.get(key) || undefined,
                });
                warnings++;
                continue;
            }

            const result: ValidationResult = validator(key, value, rule.args);
            if (result !== true) {
                issues.push({
                    key,
                    message: result as string,
                    severity: 'error',
                    rule: rule.name,
                    value,
                    line: lineMap.get(key) || undefined,
                });
                errors++;
            }
        }
    }

    return {
        isValid: errors === 0,
        issues,
        summary: {
            total: issues.length,
            errors,
            warnings,
            notices,
        },
    };
}
