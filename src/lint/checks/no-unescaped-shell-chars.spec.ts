import type { LintResult } from '../../types.js';
import { noUnescapedShellCharsCheck } from './no-unescaped-shell-chars.check.js';

describe('noUnescapedShellCharsCheck', () => {
    it('should allow values with escaped shell chars', () => {
        // All escapes, valid
        expect(noUnescapedShellCharsCheck(1, 'PASSWORD=pa\\!\\$\\*word')).toBeUndefined();
        expect(noUnescapedShellCharsCheck(2, 'PATH=/some\\;dir')).toBeUndefined();
        expect(noUnescapedShellCharsCheck(3, 'QUERY_PARAM=query\\&sort\\=asc')).toBeUndefined();
        expect(noUnescapedShellCharsCheck(4, 'USERNAME=user\\(\\)\\[\\]\\{\\}')).toBeUndefined();
        expect(noUnescapedShellCharsCheck(5, 'MAGIC=hello\\?world\\|next')).toBeUndefined();
    });

    it('should allow quoted values with special chars', () => {
        // Fully quoted, valid
        expect(noUnescapedShellCharsCheck(6, 'SECRET_OK_5="literal*star!"')).toBeUndefined();
        expect(noUnescapedShellCharsCheck(7, "QUOTED_OK='user!admin$'")).toBeUndefined();
        expect(noUnescapedShellCharsCheck(8, 'WITH_COMMENT="something$weird*" # comment here')).toBeUndefined();
    });

    it('should allow values with only normal characters', () => {
        expect(noUnescapedShellCharsCheck(9, 'SAFE=just_a_regular_value')).toBeUndefined();
    });

    it('should catch unescaped shell chars', () => {
        // Individually caught cases
        const bad1 = noUnescapedShellCharsCheck(10, 'PASSWORD_UNESCAPED=pa!ssword') as LintResult;
        expect(bad1).toEqual({
            line: 10,
            issue: 'Unescaped shell special character \'!\' in value of "PASSWORD_UNESCAPED"',
            content: 'PASSWORD_UNESCAPED=pa!ssword',
            severity: 'error',
        });

        const bad2 = noUnescapedShellCharsCheck(11, 'SECRET_UNESCAPED=pa$$word123') as LintResult;
        expect(bad2).toEqual({
            line: 11,
            issue: 'Unescaped shell special character \'$\' in value of "SECRET_UNESCAPED"',
            content: 'SECRET_UNESCAPED=pa$$word123',
            severity: 'error',
        });

        const bad3 = noUnescapedShellCharsCheck(12, 'FILENAMES_UNESCAPED=file*end') as LintResult;
        expect(bad3.issue).toMatch(/Unescaped shell special character '\*'/);

        const bad4 = noUnescapedShellCharsCheck(13, 'RUN_CMD_UNESCAPED=cat /tmp/file > /dev/null') as LintResult;
        expect(bad4.issue).toMatch(/Unescaped shell special character '>'/);

        // ...checking more as needed
    });

    it('should catch any unescaped shell char in longer list', () => {
        expect(noUnescapedShellCharsCheck(14, 'SEARCH_UNESCAPED=find . -name *.js')?.issue).toMatch(
            /Unescaped shell special character '\*'/,
        );
        expect(noUnescapedShellCharsCheck(15, 'PIPE_CMD_UNESCAPED=echo ready | tee output')?.issue).toMatch(
            /Unescaped shell special character '\|'/,
        );
        expect(noUnescapedShellCharsCheck(16, 'ASSIGNMENT_UNESCAPED=final=value')?.issue).toMatch(
            /Unescaped shell special character '='/,
        );
        expect(noUnescapedShellCharsCheck(17, 'DESC_UNESCAPED=unusual?')?.issue).toMatch(
            /Unescaped shell special character '\?'/,
        );
        expect(noUnescapedShellCharsCheck(18, 'CALLBACK_UNESCAPED=done()')?.issue).toMatch(
            /Unescaped shell special character '\('/,
        );
        expect(noUnescapedShellCharsCheck(19, 'CALLBACK_UNESCAPED=done();')?.issue).toMatch(
            /Unescaped shell special character '\('/,
        );
        expect(noUnescapedShellCharsCheck(20, 'BRACKETS_UNESCAPED=user[admin]')?.issue).toMatch(
            /Unescaped shell special character '\['/,
        );
        expect(noUnescapedShellCharsCheck(21, 'SEMICOLON_UNESCAPED=hello;')?.issue).toMatch(
            /Unescaped shell special character ';'/,
        );
    });

    it('should respect inline comments in unquoted values', () => {
        // '#' in unquoted values must be treated as comment, chars after ignored
        expect(noUnescapedShellCharsCheck(22, 'SAFE=value # this is a comment')).toBeUndefined();
        expect(noUnescapedShellCharsCheck(23, 'BAD_CMD=echo go > file # output redirected')).toEqual({
            line: 23,
            issue: `Unescaped shell special character '>' in value of "BAD_CMD"`,
            content: 'BAD_CMD=echo go > file # output redirected',
            severity: 'error',
        });
    });

    it('should skip lines without equal sign or blank lines', () => {
        expect(noUnescapedShellCharsCheck(24, '')).toBeUndefined();
        expect(noUnescapedShellCharsCheck(25, '# just a comment')).toBeUndefined();
        expect(noUnescapedShellCharsCheck(26, 'NOT_AN_ASSIGNMENT')).toBeUndefined();
    });

    it('should skip multiline-looking values', () => {
        expect(noUnescapedShellCharsCheck(27, 'MULTILINE=some\\nthing')).toBeUndefined();
        expect(noUnescapedShellCharsCheck(28, 'MULTILINE=foo\\rbar')).toBeUndefined();
    });

    it('should not false-positive for double-backslash escaping', () => {
        // Here, only the *second* backslash escapes, so the next char is NOT escaped
        expect(noUnescapedShellCharsCheck(29, 'STRANGE=hello\\\\!')).toEqual({
            line: 29,
            issue: `Unescaped shell special character '!' in value of "STRANGE"`,
            content: 'STRANGE=hello\\\\!',
            severity: 'error',
        });
        // Odd number of backslashes: the char IS escaped (should be fine)
        expect(noUnescapedShellCharsCheck(30, 'ODD_ESCAPE=hi\\!')).toBeUndefined();
    });
});
