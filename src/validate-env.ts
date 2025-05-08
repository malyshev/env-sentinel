import { log } from './log.js';
import { getValidator, parseRuleString } from './validation/index.js';
import { ParsedRule, ValidationResult, ValidatorFn } from './constants.js';

export function validateEnv(env: Record<string, string>, schema: Record<string, string>): boolean {
    let isValid = true;
    for (const key in schema) {
        const rawRule: string = schema[key];
        const rules: ParsedRule[] = parseRuleString(rawRule);
        const value: string = env[key];
        const ruleNames: string[] = rules.map((r) => r.name);
        const isRequired: boolean = ruleNames.includes('required');

        if (!isRequired && value === undefined) continue;

        if (isRequired && (value === undefined || value === '')) {
            log.error(`Missing required variable: ${key}`);
            isValid = false;
            continue;
        }

        for (const rule of rules) {
            if (['required', 'optional', 'string'].includes(rule.name)) {
                continue;
            }

            const validator: ValidatorFn | undefined = getValidator(rule.name);
            if (!validator) {
                log.warn(`Unknown rule '${rule.name}' for ${key}`);
                continue;
            }

            const result: ValidationResult = validator(key, value, rule.args);

            if (result !== true) {
                log.error(result);
                isValid = false;
            }
        }
    }

    return isValid;
}
