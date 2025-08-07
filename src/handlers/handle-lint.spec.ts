import fs from 'node:fs';
import { log } from '../utils/log.js';
import { handleLint } from './handle-lint.js';
import { lint } from '../lint/index.js';

// Mock dependencies
jest.mock('node:fs');
jest.mock('../utils/log.js');
jest.mock('../lint/index.js');

describe('handleLint', () => {
    const mockedReadFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>;
    const mockedExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
    const mockedLint = lint as jest.MockedFunction<typeof lint>;
    const mockedLog = log as jest.Mocked<typeof log>;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should handle successful linting with no issues', () => {
        const envContent = 'APP_NAME=myapp\nDEBUG=true';
        const mockResult = {
            isValid: true,
            issues: [],
            summary: { total: 0, errors: 0, warnings: 0, notices: 0 },
        };

        mockedExistsSync.mockReturnValue(true);
        mockedReadFileSync.mockReturnValue(envContent);
        mockedLint.mockReturnValue(mockResult);

        expect(() => handleLint('.env')).not.toThrow();
        expect(mockedLint).toHaveBeenCalledWith(envContent);
        expect(mockedLog.error).not.toHaveBeenCalled();
    });

    it('should handle linting with errors and warnings', () => {
        const envContent = 'APP_NAME=myapp\nDEBUG=true';
        const mockResult = {
            isValid: false,
            issues: [
                {
                    line: 1,
                    message: 'Variable name contains invalid character',
                    severity: 'error' as const,
                    rule: 'no-invalid-key-characters',
                },
                {
                    line: 2,
                    message: 'Unquoted boolean literal',
                    severity: 'warning' as const,
                    rule: 'no-yaml-boolean-literal',
                },
            ],
            summary: { total: 2, errors: 1, warnings: 1, notices: 0 },
        };

        mockedExistsSync.mockReturnValue(true);
        mockedReadFileSync.mockReturnValue(envContent);
        mockedLint.mockReturnValue(mockResult);

        expect(() => handleLint('.env')).not.toThrow();
        expect(mockedLog.error).toHaveBeenCalledWith(expect.stringContaining('[error] no-invalid-key-characters'));
        expect(mockedLog.warn).toHaveBeenCalledWith(expect.stringContaining('[warning] no-yaml-boolean-literal'));
    });

    it('should throw error when file does not exist', () => {
        mockedExistsSync.mockReturnValue(false);

        expect(() => handleLint('nonexistent.env')).toThrow('.env file not found: nonexistent.env');
    });

    it('should handle issues without line numbers', () => {
        const envContent = 'APP_NAME=myapp';
        const mockResult = {
            isValid: false,
            issues: [
                {
                    message: 'Missing required variable',
                    severity: 'error' as const,
                    rule: 'required',
                },
            ],
            summary: { total: 1, errors: 1, warnings: 0, notices: 0 },
        };

        mockedExistsSync.mockReturnValue(true);
        mockedReadFileSync.mockReturnValue(envContent);
        mockedLint.mockReturnValue(mockResult);

        expect(() => handleLint('.env')).not.toThrow();
        expect(mockedLog.error).toHaveBeenCalledWith(expect.stringContaining('[error] required'));
        expect(mockedLog.error).toHaveBeenCalledWith(expect.not.stringContaining(':'));
    });

    it('should handle different severity levels correctly', () => {
        const envContent = 'APP_NAME=myapp';
        const mockResult = {
            isValid: false,
            issues: [
                {
                    line: 1,
                    message: 'Error message',
                    severity: 'error' as const,
                    rule: 'error-rule',
                },
                {
                    line: 2,
                    message: 'Warning message',
                    severity: 'warning' as const,
                    rule: 'warning-rule',
                },
                {
                    line: 3,
                    message: 'Notice message',
                    severity: 'notice' as const,
                    rule: 'notice-rule',
                },
            ],
            summary: { total: 3, errors: 1, warnings: 1, notices: 1 },
        };

        mockedExistsSync.mockReturnValue(true);
        mockedReadFileSync.mockReturnValue(envContent);
        mockedLint.mockReturnValue(mockResult);

        expect(() => handleLint('.env')).not.toThrow();
        expect(mockedLog.error).toHaveBeenCalledWith(expect.stringContaining('[error]'));
        expect(mockedLog.warn).toHaveBeenCalledWith(expect.stringContaining('[warning]'));
        expect(mockedLog.notice).toHaveBeenCalledWith(expect.stringContaining('[notice]'));
    });
});
