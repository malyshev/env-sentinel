import { lint } from './lint-env.js';
import { __resetSeenKeysForTests } from './checks/no-duplicate-key.check.js';

describe('lint', () => {
    beforeEach(() => {
        __resetSeenKeysForTests();
    });
    it('should return valid result for clean .env content', () => {
        const envContent = `
DB_HOST=localhost
DB_PORT=3306
API_KEY=secret123
        `.trim();

        const result = lint(envContent);

        expect(result.isValid).toBe(true);
        expect(result.issues).toEqual([]);
        expect(result.summary).toEqual({
            total: 0,
            errors: 0,
            warnings: 0,
            notices: 0
        });
    });

    it('should detect errors and set isValid to false', () => {
        const envContent = `
=missing_key
 LEADING_SPACE=value
        `.trim();

        const result = lint(envContent);

        expect(result.isValid).toBe(false);
        expect(result.summary.errors).toBeGreaterThan(0);
    });

    it('should collect issues with correct line numbers', () => {
        const envContent = `
DB_HOST=localhost
=missing_key
DB_PORT=3306
        `.trim();

        const result = lint(envContent);

        const missingKeyIssue = result.issues.find(i => i.rule === 'no-missing-key');
        expect(missingKeyIssue).toBeDefined();
        expect(missingKeyIssue?.line).toBe(2);
    });

    it('should categorize issues by severity', () => {
        const envContent = [
            ' LEADING_SPACE=value',
            'EMPTY_VALUE='
        ].join('\n');

        const result = lint(envContent);

        expect(result.summary.total).toBeGreaterThan(0);
        expect(result.summary.total).toBe(result.summary.errors + result.summary.warnings + result.summary.notices);
    });

    it('should skip comment lines', () => {
        const envContent = [
            '# This is a comment',
            'DB_HOST=localhost',
            '# Another comment'
        ].join('\n');

        const result = lint(envContent);

        expect(result.isValid).toBe(true);
        expect(result.issues).toEqual([]);
    });

    it('should skip empty lines', () => {
        const envContent = `
DB_HOST=localhost

DB_PORT=3306

        `.trim();

        const result = lint(envContent);

        expect(result.isValid).toBe(true);
    });

    it('should handle multiple errors on different lines', () => {
        const envContent = [
            '=no_key_1',
            'DB_HOST=localhost',
            '=no_key_2'
        ].join('\n');

        const result = lint(envContent);

        expect(result.summary.errors).toBeGreaterThanOrEqual(2);
        const missingKeyIssues = result.issues.filter(i => i.rule === 'no-missing-key');
        expect(missingKeyIssues).toHaveLength(2);
        expect(missingKeyIssues[0].line).toBe(1);
        expect(missingKeyIssues[1].line).toBe(3);
    });

    it('should respect disabled rules via es-disable comments', () => {
        const envContent = [
            '# es-disable: no-leading-spaces',
            ' LEADING_SPACE=value'
        ].join('\n');

        const result = lint(envContent);

        const leadingSpaceIssue = result.issues.find(i => i.rule === 'no-leading-spaces');
        expect(leadingSpaceIssue).toBeUndefined();
    });

    it('should count total issues correctly', () => {
        const envContent = `
=missing_key
 LEADING_SPACE=value
EMPTY_VALUE=
        `.trim();

        const result = lint(envContent);

        expect(result.summary.total).toBe(result.issues.length);
    });

    it('should handle CRLF line endings', () => {
        const envContent = 'DB_HOST=localhost\r\nDB_PORT=3306';

        const result = lint(envContent);

        expect(result.isValid).toBe(true);
    });

    it('should handle empty env content', () => {
        const envContent = '';

        const result = lint(envContent);

        expect(result.isValid).toBe(true);
        expect(result.issues).toEqual([]);
        expect(result.summary).toEqual({
            total: 0,
            errors: 0,
            warnings: 0,
            notices: 0
        });
    });

    it('should handle env content with only comments', () => {
        const envContent = `
# Comment 1
# Comment 2
# Comment 3
        `.trim();

        const result = lint(envContent);

        expect(result.isValid).toBe(true);
        expect(result.issues).toEqual([]);
    });

    it('should include rule name in issues', () => {
        const envContent = '=missing_key';

        const result = lint(envContent);

        expect(result.issues[0].rule).toBe('no-missing-key');
    });

    it('should include message in issues', () => {
        const envContent = '=missing_key';

        const result = lint(envContent);

        expect(result.issues[0].message).toBeDefined();
        expect(typeof result.issues[0].message).toBe('string');
    });

    it('should include severity in issues', () => {
        const envContent = '=missing_key';

        const result = lint(envContent);

        expect(result.issues[0].severity).toBeDefined();
        expect(['error', 'warning', 'notice']).toContain(result.issues[0].severity);
    });
});

