import type { LintResult } from '../../types.js';
import { noUnquotedYAMLBooleanLiteralCheck } from './no-unquoted-yaml-boolean-literal.check.js';

describe('noUnquotedYAMLBooleanLiteralCheck', () => {
    it('should ignore fully quoted boolean literals', () => {
        expect(noUnquotedYAMLBooleanLiteralCheck(1, 'YAML_BOOL_OK="yes"')).toBeUndefined();
        expect(noUnquotedYAMLBooleanLiteralCheck(2, "YAML_BOOL_OK='off'")).toBeUndefined();
        expect(noUnquotedYAMLBooleanLiteralCheck(3, 'YAML_BOOL_OK="false"')).toBeUndefined();
    });

    it('should warn on unquoted YAML-style boolean literals', () => {
        const result1 = noUnquotedYAMLBooleanLiteralCheck(4, 'YAML_BOOL_BAD_1=yes') as LintResult;
        expect(result1).toEqual({
            line: 4,
            issue: 'Unquoted YAML-style boolean literal "yes" in "YAML_BOOL_BAD_1" may cause unexpected coercion',
            content: 'YAML_BOOL_BAD_1=yes',
            severity: 'warning',
        });

        const result2 = noUnquotedYAMLBooleanLiteralCheck(5, 'YAML_BOOL_BAD_2=off # comment') as LintResult;
        expect(result2).toEqual({
            line: 5,
            issue: 'Unquoted YAML-style boolean literal "off" in "YAML_BOOL_BAD_2" may cause unexpected coercion',
            content: 'YAML_BOOL_BAD_2=off # comment',
            severity: 'warning',
        });

        const result3 = noUnquotedYAMLBooleanLiteralCheck(6, 'FEATURE_ENABLED=No') as LintResult;
        expect(result3).toEqual({
            line: 6,
            issue: 'Unquoted YAML-style boolean literal "no" in "FEATURE_ENABLED" may cause unexpected coercion',
            content: 'FEATURE_ENABLED=No',
            severity: 'warning',
        });
    });

    it('should not warn on unrelated values', () => {
        expect(noUnquotedYAMLBooleanLiteralCheck(7, 'DEBUG=maybe')).toBeUndefined();
        expect(noUnquotedYAMLBooleanLiteralCheck(8, 'ENABLED=YESNO')).toBeUndefined();
        expect(noUnquotedYAMLBooleanLiteralCheck(9, 'FLAG=1')).toBeUndefined();
    });

    it('should skip lines without equal sign', () => {
        expect(noUnquotedYAMLBooleanLiteralCheck(10, 'INVALID_LINE')).toBeUndefined();
    });
});
