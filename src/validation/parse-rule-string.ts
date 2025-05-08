import { ParsedRule } from '../constants.js';

export function parseRuleString(ruleStr: string): ParsedRule[] {
    const parts: string[] = ruleStr
        .split('|')
        .map((part: string): string => part.trim())
        .filter(Boolean);

    return parts.map((rule: string): ParsedRule => {
        const [name, ...argParts] = rule.split(':');
        const args: string[] = argParts.length > 0 ? argParts.join(':').split(',') : [];
        return {
            name,
            args,
        };
    });
}
