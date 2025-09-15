import { log } from '../utils/log.js';
import { handleValidate } from './handle-validate.js';
import { validate } from '../validate/index.js';
import { parseEnvContent, parseSchemaContent } from '../parsers/index.js';
import { Result } from '../types.js';
import { existsSync, readFileSync } from 'node:fs';

// Mock dependencies
jest.mock('../utils/log.js');
jest.mock('../validate/index.js');
jest.mock('../parsers/index.js');
jest.mock('node:fs', () => ({
    existsSync: jest.fn(),
    readFileSync: jest.fn(),
}));

const mockedLog = log as jest.Mocked<typeof log>;
const mockedValidate = validate as jest.MockedFunction<typeof validate>;
const mockedParseEnvContent = parseEnvContent as jest.MockedFunction<typeof parseEnvContent>;
const mockedParseSchemaContent = parseSchemaContent as jest.MockedFunction<typeof parseSchemaContent>;
const mockedExistsSync = jest.mocked(existsSync);
const mockedReadFileSync = jest.mocked(readFileSync);

describe('handleValidate', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedExistsSync.mockReturnValue(true);
        mockedReadFileSync.mockReturnValue('test content');
        mockedParseEnvContent.mockReturnValue({});
        mockedParseSchemaContent.mockReturnValue([]);
    });

    it('should validate successfully when no issues', () => {
        const mockResult: Result = {
            isValid: true,
            issues: [],
            summary: { total: 0, errors: 0, warnings: 0, notices: 0 },
        };

        mockedValidate.mockReturnValue(mockResult);

        expect(() => handleValidate('.env', '.env-sentinel')).not.toThrow();
                       expect(mockedLog.success).toHaveBeenCalledWith('.env is valid');
    });

    it('should throw error when validation fails', () => {
        const mockResult: Result = {
            isValid: false,
            issues: [
                {
                    key: 'MISSING_VAR',
                    message: 'Missing required variable: MISSING_VAR',
                    severity: 'error',
                    rule: 'required',
                    line: 1,
                },
            ],
            summary: { total: 1, errors: 1, warnings: 0, notices: 0 },
        };

        mockedValidate.mockReturnValue(mockResult);

        expect(() => handleValidate('.env', '.env-sentinel')).toThrow('Validation failed for .env');
        expect(mockedLog.error).toHaveBeenCalledWith(expect.stringContaining('[error] required'));
    });

    it('should throw error when env file does not exist', () => {
        mockedExistsSync.mockReturnValueOnce(false);

        expect(() => handleValidate('.env', '.env-sentinel')).toThrow('.env file not found: .env');
    });

    it('should throw error when schema file does not exist', () => {
        mockedExistsSync.mockReturnValueOnce(true).mockReturnValueOnce(false);

        expect(() => handleValidate('.env', '.env-sentinel')).toThrow('Schema file not found: .env-sentinel');
    });

    it('should handle validation with warnings and notices', () => {
        const mockResult: Result = {
            isValid: false,
            issues: [
                {
                    key: 'WARNING_VAR',
                    message: 'Warning message',
                    severity: 'warning',
                    rule: 'test-rule',
                    line: 2,
                },
                {
                    key: 'NOTICE_VAR',
                    message: 'Notice message',
                    severity: 'notice',
                    rule: 'test-rule',
                    line: 3,
                },
            ],
            summary: { total: 2, errors: 0, warnings: 1, notices: 1 },
        };

        mockedValidate.mockReturnValue(mockResult);

        expect(() => handleValidate('.env', '.env-sentinel')).toThrow('Validation failed for .env');
        expect(mockedLog.warn).toHaveBeenCalledWith(expect.stringContaining('[warning]'));
        expect(mockedLog.notice).toHaveBeenCalledWith(expect.stringContaining('[notice]'));
    });

    it('should handle issues without line numbers', () => {
        const mockResult: Result = {
            isValid: false,
            issues: [
                {
                    key: 'MISSING_VAR',
                    message: 'Missing required variable: MISSING_VAR',
                    severity: 'error',
                    rule: 'required',
                    // No line number
                },
            ],
            summary: { total: 1, errors: 1, warnings: 0, notices: 0 },
        };

        mockedValidate.mockReturnValue(mockResult);

        expect(() => handleValidate('.env', '.env-sentinel')).toThrow('Validation failed for .env');
        expect(mockedLog.error).toHaveBeenCalledWith(expect.stringContaining('[error] required'));
        expect(mockedLog.error).toHaveBeenCalledWith(expect.stringContaining('.env [error] required'));
    });
});
