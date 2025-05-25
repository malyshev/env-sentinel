import { noInvalidReferenceSyntaxCheck } from './no-invalid-reference-syntax.check.js';

describe('noInvalidReferenceSyntaxCheck', () => {
    it('should allow braced variable reference with quotes', () => {
        const result = noInvalidReferenceSyntaxCheck(1, 'EMAIL="${USER_EMAIL}"');
        expect(result).toBeUndefined();
    });

    it('should allow braced variable reference without quotes', () => {
        const result = noInvalidReferenceSyntaxCheck(1, 'EMAIL=${USER_EMAIL}');
        expect(result).toBeUndefined();
    });

    it('should allow simple variable reference', () => {
        const result = noInvalidReferenceSyntaxCheck(1, 'EMAIL=$USER_EMAIL');
        expect(result).toBeUndefined();
    });

    it('should allow reference wrapped in outer braces', () => {
        const result = noInvalidReferenceSyntaxCheck(1, 'EMAIL={$USER_EMAIL}');
        expect(result).toBeUndefined();
    });

    it('should allow escaped dollar sign', () => {
        const result = noInvalidReferenceSyntaxCheck(1, 'EMAIL=\\$USER_EMAIL');
        expect(result).toBeUndefined();
    });

    it('should allow default substitution syntax', () => {
        const result = noInvalidReferenceSyntaxCheck(1, 'EMAIL=${USER_EMAIL:-default@example.com}');
        expect(result).toBeUndefined();
    });

    it('should flag empty variable reference `${}`', () => {
        const result = noInvalidReferenceSyntaxCheck(1, 'EMAIL=${}');
        expect(result).toEqual({
            line: 1,
            content: 'EMAIL=${}',
            severity: 'error',
            issue: 'Empty variable reference `${}` is invalid',
        });
    });

    it('should flag invalid character in variable name', () => {
        const result = noInvalidReferenceSyntaxCheck(1, 'EMAIL=$-INVALID');
        expect(result).toEqual({
            line: 1,
            content: 'EMAIL=$-INVALID',
            severity: 'error',
            issue: 'Invalid character in variable name: "-INVALID"',
        });
    });

    it('should flag variable starting with digit', () => {
        const result = noInvalidReferenceSyntaxCheck(1, 'EMAIL=${1INVALID}');
        expect(result).toEqual({
            line: 1,
            content: 'EMAIL=${1INVALID}',
            severity: 'error',
            issue: 'Invalid variable name: must not start with a digit → "1INVALID"',
        });
    });

    it('should flag invalid characters in parameter expansion', () => {
        const result = noInvalidReferenceSyntaxCheck(1, 'EMAIL=${USER!}');
        expect(result).toEqual({
            line: 1,
            content: 'EMAIL=${USER!}',
            severity: 'error',
            issue: 'Invalid character in variable name: "USER!"',
        });
    });
});
