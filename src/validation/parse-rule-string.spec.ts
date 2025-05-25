import { parseRuleString } from './parse-rule-string';
import { ParsedRule } from '../types.js';

describe('parseRuleString', () => {
    it('parses single rule with no arguments', () => {
        const input = 'required';
        const expected: ParsedRule[] = [{ name: 'required', args: [] }];
        expect(parseRuleString(input)).toEqual(expected);
    });

    it('parses multiple rules without arguments', () => {
        const input = 'required|secure';
        const expected: ParsedRule[] = [
            { name: 'required', args: [] },
            { name: 'secure', args: [] },
        ];
        expect(parseRuleString(input)).toEqual(expected);
    });

    it('parses rule with single argument', () => {
        const input = 'min:16';
        const expected: ParsedRule[] = [{ name: 'min', args: ['16'] }];
        expect(parseRuleString(input)).toEqual(expected);
    });

    it('parses rule with multiple arguments', () => {
        const input = 'enum:dev,prod,test';
        const expected: ParsedRule[] = [{ name: 'enum', args: ['dev', 'prod', 'test'] }];
        expect(parseRuleString(input)).toEqual(expected);
    });

    it('parses mixed rule types correctly', () => {
        const input = 'required|enum:yes,no,maybe|min:2';
        const expected: ParsedRule[] = [
            { name: 'required', args: [] },
            { name: 'enum', args: ['yes', 'no', 'maybe'] },
            { name: 'min', args: ['2'] },
        ];
        expect(parseRuleString(input)).toEqual(expected);
    });

    it('trims spaces and ignores empty rules', () => {
        const input = '  required |  secure  | ';
        const expected: ParsedRule[] = [
            { name: 'required', args: [] },
            { name: 'secure', args: [] },
        ];
        expect(parseRuleString(input)).toEqual(expected);
    });

    it('handles rules with colons in arguments', () => {
        const input = 'regex:^https?://.*';
        const expected: ParsedRule[] = [{ name: 'regex', args: ['^https?://.*'] }];
        expect(parseRuleString(input)).toEqual(expected);
    });
});
