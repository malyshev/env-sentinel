import type { LintResult } from '../../types.js';
import { noUnsafeKeyCheck } from './no-unsafe-key.check.js';

describe('noUnsafeKeyCheck', () => {
    it('should return undefined for safe keys', () => {
        expect(noUnsafeKeyCheck(1, 'API_KEY=123')).toBeUndefined();
        expect(noUnsafeKeyCheck(2, 'DATABASE_URL=mysql://localhost')).toBeUndefined();
    });

    it('should warn on unsafe keys (exact match)', () => {
        const result = noUnsafeKeyCheck(3, 'NODE_OPTIONS=--inspect') as LintResult;
        expect(result).toEqual({
            line: 3,
            issue: 'Variable "NODE_OPTIONS" is discouraged due to potential security or system conflicts',
            content: 'NODE_OPTIONS=--inspect',
            severity: 'error',
        });
    });

    it('should match unsafe keys case-insensitively', () => {
        const result = noUnsafeKeyCheck(4, 'path=/usr/bin') as LintResult;
        expect(result).toEqual({
            line: 4,
            issue: 'Variable "path" is discouraged due to potential security or system conflicts',
            content: 'path=/usr/bin',
            severity: 'error',
        });
    });

    it('should ignore empty lines and comments', () => {
        expect(noUnsafeKeyCheck(5, '')).toBeUndefined();
        expect(noUnsafeKeyCheck(6, '# CI variable')).toBeUndefined();
    });

    it('should handle quoted keys', () => {
        const result = noUnsafeKeyCheck(7, '"DEBUG"=true') as LintResult;
        expect(result).toEqual({
            line: 7,
            issue: 'Variable "DEBUG" is discouraged due to potential security or system conflicts',
            content: '"DEBUG"=true',
            severity: 'error',
        });
    });

    it('should ignore lines without equal sign', () => {
        expect(noUnsafeKeyCheck(8, 'INVALID_LINE')).toBeUndefined();
    });

    it('should handle keys with extra spaces', () => {
        const result = noUnsafeKeyCheck(9, '  SHELL = /bin/bash  ') as LintResult;
        expect(result).toEqual({
            line: 9,
            issue: 'Variable "SHELL" is discouraged due to potential security or system conflicts',
            content: '  SHELL = /bin/bash  ',
            severity: 'error',
        });
    });
});
