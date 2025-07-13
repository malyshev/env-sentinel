import type { LintResult } from '../../types.js';
import { noUnquotedMultilineValueCheck } from './no-unquoted-multiline-value.check.js';

describe('noUnquotedMultilineValueCheck', () => {
    it('should allow quoted multiline-looking values', () => {
        expect(noUnquotedMultilineValueCheck(1, 'MULTILINE_OK="Line1\\nLine2"')).toBeUndefined();
        expect(noUnquotedMultilineValueCheck(2, "MULTILINE_OK='Line1\\nLine2'")).toBeUndefined();
    });

    it('should warn on unquoted values that contain \\n', () => {
        const result = noUnquotedMultilineValueCheck(3, 'MULTILINE_BAD=Line1\\nLine2') as LintResult;
        expect(result).toEqual({
            line: 3,
            issue: 'Unquoted multiline-looking value in "MULTILINE_BAD"',
            content: 'MULTILINE_BAD=Line1\\nLine2',
            severity: 'warning',
        });
    });

    it('should warn on unquoted values that contain \\r', () => {
        const result = noUnquotedMultilineValueCheck(4, 'MULTILINE_BAD=Line1\\rLine2') as LintResult;
        expect(result).toEqual({
            line: 4,
            issue: 'Unquoted multiline-looking value in "MULTILINE_BAD"',
            content: 'MULTILINE_BAD=Line1\\rLine2',
            severity: 'warning',
        });
    });

    it('should ignore lines without an equal sign', () => {
        expect(noUnquotedMultilineValueCheck(5, 'JUST_A_COMMENT')).toBeUndefined();
    });

    it('should ignore empty value lines', () => {
        expect(noUnquotedMultilineValueCheck(6, 'EMPTY=')).toBeUndefined();
    });

    it('should ignore unquoted values that don’t look multiline', () => {
        expect(noUnquotedMultilineValueCheck(7, 'VALUE=singleline')).toBeUndefined();
    });

    it('should not report quoted values even with trailing spaces', () => {
        expect(noUnquotedMultilineValueCheck(8, 'MULTILINE_OK="Line1\\nLine2"    ')).toBeUndefined();
    });
});
