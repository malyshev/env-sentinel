import { noInvalidKeyDelimiterCheck } from './no-invalid-key-delimiter.check.js';

describe('noInvalidDelimiterCheck', () => {
    test.each([
        // [line, lineContent, expectedInvalidChars, shouldTrigger]
        [1, 'MY-ENV=123', ['-'], true],
        [2, 'MY:ENV=abc', [':'], true],
        [3, 'MY.ENV=value', ['.'], true],
        [4, 'MY_ENV=value', [], false],
        [5, 'MY ENV=value', [], false], // handled by another check
        [6, 'MY$ENV=val', ['$'], true],
        [7, 'MY@ENV$VA:R=val', ['@', '$', ':'], true], // many invalid delimiters
        [8, 'MY#ENV=val', ['#'], true],
        [9, 'MY_ENV_VAR=123', [], false],
        [9, '-MY_ENV_VAR=123', [], false], // handled by another check
        [10, 'MЁ_ENV=123', [], false], // Cyrillic Ё is not a delimiter in this context
    ])(
        'line %i: should %s detect invalid delimiters',
        (lineNumber, lineContent, invalidChars: string[], shouldTrigger: boolean) => {
            const result = noInvalidKeyDelimiterCheck(lineNumber, lineContent);

            if (shouldTrigger) {
                const delimiterList = invalidChars.map((d) => `"${d}"`).join(', ');
                expect(result).toEqual({
                    line: lineNumber,
                    issue: `Variable name contains invalid delimiter: ${delimiterList}`,
                    content: lineContent,
                    severity: 'error',
                });
            } else {
                expect(result).toBeUndefined();
            }
        },
    );
});
