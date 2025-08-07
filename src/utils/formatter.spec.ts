import { log } from './log.js';
import { formatIssues, printResult } from './formatter.js';
import { Issue, Result } from '../types.js';

// Mock dependencies
jest.mock('./log.js');

describe('formatter', () => {
    const mockedLog = log as jest.Mocked<typeof log>;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('formatIssues', () => {
        it('should format issues with line numbers', () => {
            const issues: Issue[] = [
                {
                    line: 1,
                    message: 'Error message',
                    severity: 'error',
                    rule: 'error-rule'
                },
                {
                    line: 2,
                    message: 'Warning message',
                    severity: 'warning',
                    rule: 'warning-rule'
                }
            ];

            formatIssues(issues, '.env');

            expect(mockedLog.error).toHaveBeenCalledWith('.env:1 [error] error-rule → Error message');
            expect(mockedLog.warn).toHaveBeenCalledWith('.env:2 [warning] warning-rule → Warning message');
        });

        it('should format issues without line numbers', () => {
            const issues: Issue[] = [
                {
                    message: 'Error message',
                    severity: 'error',
                    rule: 'error-rule'
                }
            ];

            formatIssues(issues, '.env');

            expect(mockedLog.error).toHaveBeenCalledWith('.env [error] error-rule → Error message');
        });

        it('should handle different severity levels', () => {
            const issues: Issue[] = [
                {
                    line: 1,
                    message: 'Error message',
                    severity: 'error',
                    rule: 'error-rule'
                },
                {
                    line: 2,
                    message: 'Warning message',
                    severity: 'warning',
                    rule: 'warning-rule'
                },
                {
                    line: 3,
                    message: 'Notice message',
                    severity: 'notice',
                    rule: 'notice-rule'
                }
            ];

            formatIssues(issues, '.env');

            expect(mockedLog.error).toHaveBeenCalledWith('.env:1 [error] error-rule → Error message');
            expect(mockedLog.warn).toHaveBeenCalledWith('.env:2 [warning] warning-rule → Warning message');
            expect(mockedLog.notice).toHaveBeenCalledWith('.env:3 [notice] notice-rule → Notice message');
        });

        it('should default to error severity when not specified', () => {
            const issues: Issue[] = [
                {
                    line: 1,
                    message: 'Message without severity',
                    severity: 'error',
                    rule: 'test-rule'
                }
            ];

            formatIssues(issues, '.env');

            expect(mockedLog.error).toHaveBeenCalledWith('.env:1 [error] test-rule → Message without severity');
        });

        it('should handle empty issues array', () => {
            const issues: Issue[] = [];

            expect(() => formatIssues(issues, '.env')).not.toThrow();
            expect(mockedLog.error).not.toHaveBeenCalled();
            expect(mockedLog.warn).not.toHaveBeenCalled();
            expect(mockedLog.notice).not.toHaveBeenCalled();
        });
    });

    describe('printResult', () => {
        it('should format result issues', () => {
            const result: Result = {
                isValid: false,
                issues: [
                    {
                        line: 1,
                        message: 'Error message',
                        severity: 'error',
                        rule: 'error-rule'
                    }
                ],
                summary: {
                    total: 1,
                    errors: 1,
                    warnings: 0,
                    notices: 0
                }
            };

            printResult(result, '.env');

            expect(mockedLog.error).toHaveBeenCalledWith('.env:1 [error] error-rule → Error message');
        });

        it('should handle result with no issues', () => {
            const result: Result = {
                isValid: true,
                issues: [],
                summary: {
                    total: 0,
                    errors: 0,
                    warnings: 0,
                    notices: 0
                }
            };

            expect(() => printResult(result, '.env')).not.toThrow();
            expect(mockedLog.error).not.toHaveBeenCalled();
            expect(mockedLog.warn).not.toHaveBeenCalled();
            expect(mockedLog.notice).not.toHaveBeenCalled();
        });
    });
});
