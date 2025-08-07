import { ErrorFormatter, ErrorContext } from './error-formatter.js';
import { Issue } from '../types.js';

describe('ErrorFormatter', () => {
    describe('formatIssue', () => {
        it('should format basic issue with file path and line number', () => {
            const issue: Issue = {
                line: 5,
                message: 'Invalid number for PORT',
                severity: 'error',
                rule: 'number'
            };

            const context: ErrorContext = {
                filePath: '.env'
            };

            const result = ErrorFormatter.formatIssue(issue, context);
            expect(result).toBe('.env:5 [error] number → Invalid number for PORT');
        });

        it('should format issue without line number', () => {
            const issue: Issue = {
                message: 'Missing required variable: API_KEY',
                severity: 'error',
                rule: 'required'
            };

            const context: ErrorContext = {
                filePath: '.env'
            };

            const result = ErrorFormatter.formatIssue(issue, context);
            expect(result).toBe('.env [error] required → Missing required variable: API_KEY');
        });

        it('should format issue with key context', () => {
            const issue: Issue = {
                key: 'PORT',
                message: 'Invalid number',
                severity: 'error',
                rule: 'number'
            };

            const context: ErrorContext = {
                filePath: '.env',
                lineNumber: 3
            };

            const result = ErrorFormatter.formatIssue(issue, context);
            expect(result).toBe('.env:3 [error] number → PORT: Invalid number');
        });

        it('should format issue with value context', () => {
            const issue: Issue = {
                key: 'PORT',
                message: 'Invalid number',
                severity: 'error',
                rule: 'number',
                value: 'abc'
            };

            const context: ErrorContext = {
                filePath: '.env'
            };

            const result = ErrorFormatter.formatIssue(issue, context);
            expect(result).toBe('.env [error] number → PORT: Invalid number (value: abc)');
        });

        it('should format issue with expected vs actual values', () => {
            const issue: Issue = {
                key: 'DEBUG',
                message: 'Invalid boolean',
                severity: 'error',
                rule: 'boolean'
            };

            const context: ErrorContext = {
                filePath: '.env',
                expectedValue: 'true or false',
                actualValue: 'yes'
            };

            const result = ErrorFormatter.formatIssue(issue, context);
            expect(result).toBe('.env [error] boolean → DEBUG: Invalid boolean (expected: true or false, got: yes)');
        });

        it('should handle notice severity', () => {
            const issue: Issue = {
                message: 'Consider using quotes',
                severity: 'notice',
                rule: 'style'
            };

            const context: ErrorContext = {
                filePath: '.env'
            };

            const result = ErrorFormatter.formatIssue(issue, context);
            expect(result).toBe('.env [notice] style → Consider using quotes');
        });

        it('should handle warning severity', () => {
            const issue: Issue = {
                message: 'Unquoted value',
                severity: 'warning',
                rule: 'style'
            };

            const context: ErrorContext = {
                filePath: '.env'
            };

            const result = ErrorFormatter.formatIssue(issue, context);
            expect(result).toBe('.env [warning] style → Unquoted value');
        });

        it('should handle issue without context', () => {
            const issue: Issue = {
                message: 'Generic error',
                severity: 'error',
                rule: 'unknown'
            };

            const result = ErrorFormatter.formatIssue(issue);
            expect(result).toBe('[error] unknown → Generic error');
        });
    });

    describe('formatIssues', () => {
        it('should format multiple issues', () => {
            const issues: Issue[] = [
                {
                    line: 1,
                    message: 'Error 1',
                    severity: 'error',
                    rule: 'rule1'
                },
                {
                    line: 2,
                    message: 'Warning 1',
                    severity: 'warning',
                    rule: 'rule2'
                }
            ];

            const context: ErrorContext = {
                filePath: '.env'
            };

            const result = ErrorFormatter.formatIssues(issues, context);
            expect(result).toEqual([
                '.env:1 [error] rule1 → Error 1',
                '.env:2 [warning] rule2 → Warning 1'
            ]);
        });

        it('should handle empty issues array', () => {
            const issues: Issue[] = [];
            const context: ErrorContext = {
                filePath: '.env'
            };

            const result = ErrorFormatter.formatIssues(issues, context);
            expect(result).toEqual([]);
        });
    });

    describe('formatSummary', () => {
        it('should format summary with errors and warnings', () => {
            const issues: Issue[] = [
                { message: 'Error 1', severity: 'error', rule: 'rule1' },
                { message: 'Error 2', severity: 'error', rule: 'rule2' },
                { message: 'Warning 1', severity: 'warning', rule: 'rule3' }
            ];

            const context: ErrorContext = {
                filePath: '.env'
            };

            const result = ErrorFormatter.formatSummary(issues, context);
            expect(result).toBe('.env: 2 errors, 1 warning');
        });

        it('should format summary with single error', () => {
            const issues: Issue[] = [
                { message: 'Error 1', severity: 'error', rule: 'rule1' }
            ];

            const context: ErrorContext = {
                filePath: '.env'
            };

            const result = ErrorFormatter.formatSummary(issues, context);
            expect(result).toBe('.env: 1 error');
        });

        it('should format summary with notices', () => {
            const issues: Issue[] = [
                { message: 'Notice 1', severity: 'notice', rule: 'rule1' },
                { message: 'Notice 2', severity: 'notice', rule: 'rule2' }
            ];

            const context: ErrorContext = {
                filePath: '.env'
            };

            const result = ErrorFormatter.formatSummary(issues, context);
            expect(result).toBe('.env: 2 notices');
        });

        it('should format summary without file path', () => {
            const issues: Issue[] = [
                { message: 'Error 1', severity: 'error', rule: 'rule1' },
                { message: 'Warning 1', severity: 'warning', rule: 'rule2' }
            ];

            const result = ErrorFormatter.formatSummary(issues);
            expect(result).toBe('1 error, 1 warning');
        });

        it('should handle empty issues array', () => {
            const issues: Issue[] = [];
            const context: ErrorContext = {
                filePath: '.env'
            };

            const result = ErrorFormatter.formatSummary(issues, context);
            expect(result).toBe('.env: ');
        });
    });
});
