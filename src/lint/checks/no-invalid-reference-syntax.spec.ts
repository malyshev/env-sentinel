import { noInvalidReferenceSyntaxCheck } from './no-invalid-reference-syntax.check.js';

describe('noInvalidReferenceSyntaxCheck', () => {
    it('should allow braced variable reference with quotes', () => {
        expect(noInvalidReferenceSyntaxCheck(1, 'EMAIL="${USER_EMAIL}"')).toBeUndefined();
    });

    it('should allow braced variable reference without quotes', () => {
        expect(noInvalidReferenceSyntaxCheck(2, 'EMAIL=${USER_EMAIL}')).toBeUndefined();
    });

    it('should allow simple variable reference', () => {
        expect(noInvalidReferenceSyntaxCheck(3, 'EMAIL=$USER_EMAIL')).toBeUndefined();
    });

    it('should ignore variable name inside non-shell braces', () => {
        // {$USER_EMAIL} is NOT a shell variable expansion, shouldn't be flagged
        expect(noInvalidReferenceSyntaxCheck(4, 'EMAIL={$USER_EMAIL}')).toBeUndefined();
    });

    it('should allow escaped dollar sign', () => {
        expect(noInvalidReferenceSyntaxCheck(5, 'EMAIL=\\$USER_EMAIL')).toBeUndefined();
    });

    it('should allow default substitution syntax', () => {
        expect(noInvalidReferenceSyntaxCheck(6, 'EMAIL=${USER_EMAIL:-default@example.com}')).toBeUndefined();
    });

    it('should flag empty variable reference `${}`', () => {
        expect(noInvalidReferenceSyntaxCheck(7, 'EMAIL=${}')).toEqual({
            line: 7,
            content: 'EMAIL=${}',
            severity: 'error',
            issue: 'Empty variable reference `${}` is invalid',
        });
    });

    it('should not flag invalid character after $ when not a shell var', () => {
        // Not matched: shell does NOT treat $-INVALID as a reference, nor $/myapp.
        expect(noInvalidReferenceSyntaxCheck(8, 'EMAIL=$-INVALID')).toBeUndefined();
        expect(noInvalidReferenceSyntaxCheck(17, 'PATH=$/myapp')).toBeUndefined();
    });

    it('should flag variable starting with digit', () => {
        expect(noInvalidReferenceSyntaxCheck(9, 'EMAIL=${1INVALID}')).toEqual({
            line: 9,
            content: 'EMAIL=${1INVALID}',
            severity: 'error',
            issue: 'Invalid variable name: must not start with a digit → "1INVALID"',
        });
    });

    it('should flag invalid characters in parameter expansion', () => {
        expect(noInvalidReferenceSyntaxCheck(10, 'EMAIL=${USER!}')).toEqual({
            line: 10,
            content: 'EMAIL=${USER!}',
            severity: 'error',
            issue: 'Invalid character in variable name: "USER!"',
        });
    });

    it('should not flag double dollar', () => {
        // Double dollar as in Makefiles or escaping contexts, should be ignored by this checker
        expect(noInvalidReferenceSyntaxCheck(11, 'COST=pa$$word123')).toBeUndefined();
        expect(noInvalidReferenceSyntaxCheck(12, 'CMD=make $$VAR')).toBeUndefined();
    });

    it('should allow single quoted value containing $ pattern', () => {
        expect(noInvalidReferenceSyntaxCheck(13, "SECRET='pa$$word123'")).toBeUndefined();
    });

    it('should allow $ at end of expansion', () => {
        expect(noInvalidReferenceSyntaxCheck(14, 'COST=$')).toBeUndefined();
    });

    it('should allow value with no references', () => {
        expect(noInvalidReferenceSyntaxCheck(15, 'SAFE=value')).toBeUndefined();
    });

    it('should not flag when $ is followed by non-variable character', () => {
        expect(noInvalidReferenceSyntaxCheck(16, 'DOC=The price is $5')).toBeUndefined();
        expect(noInvalidReferenceSyntaxCheck(17, 'PATH=$/myapp')).toBeUndefined();
    });

    it('should allow inline comments after refs', () => {
        expect(noInvalidReferenceSyntaxCheck(18, 'EMAIL=${USER_EMAIL} # comment')).toBeUndefined();
    });

    it('should allow multiple valid references', () => {
        expect(noInvalidReferenceSyntaxCheck(19, 'EMAIL=$USER_EMAIL, REPO=${GITHUB_REPO}')).toBeUndefined();
    });

    it('should flag the first invalid reference if multiple present', () => {
        expect(noInvalidReferenceSyntaxCheck(20, 'EMAIL=${1INVALID}, REPO=${_VALID}')).toEqual({
            line: 20,
            content: 'EMAIL=${1INVALID}, REPO=${_VALID}',
            severity: 'error',
            issue: 'Invalid variable name: must not start with a digit → "1INVALID"',
        });
    });

    it('should ignore variable syntax inside a comment', () => {
        expect(noInvalidReferenceSyntaxCheck(21, '# EMAIL=${INVALID')).toBeUndefined();
    });

    it('should ignore variable with number only (shell positional param)', () => {
        // These are common as in $1 (positional shell params)
        expect(noInvalidReferenceSyntaxCheck(22, 'ARG=$1')).toBeUndefined();
    });
});
