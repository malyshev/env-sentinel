import fs from 'node:fs';
import { validateFileExists, readEnvFile, readSchemaFile, handleResult } from './handler-utils.js';
import { Result } from '../types.js';

// Mock fs module
jest.mock('node:fs', () => ({
    existsSync: jest.fn(),
    readFileSync: jest.fn(),
}));

// Mock the formatter module
jest.mock('./formatter.js', () => ({
    formatIssues: jest.fn(),
}));

const mockedFs = fs as jest.Mocked<typeof fs>;

describe('handler-utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('validateFileExists', () => {
        it('should not throw when file exists', () => {
            mockedFs.existsSync.mockReturnValue(true);
            
            expect(() => validateFileExists('/path/to/file', 'Test')).not.toThrow();
        });

        it('should throw when file does not exist', () => {
            mockedFs.existsSync.mockReturnValue(false);
            
            expect(() => validateFileExists('/path/to/file', 'Test')).toThrow('Test file not found: /path/to/file');
        });

        it('should use custom file type in error message', () => {
            mockedFs.existsSync.mockReturnValue(false);
            
            expect(() => validateFileExists('/path/to/file', 'Custom')).toThrow('Custom file not found: /path/to/file');
        });
    });

    describe('readEnvFile', () => {
        it('should read and return file content when file exists', () => {
            const mockContent = 'TEST_VAR=value';
            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readFileSync.mockReturnValue(mockContent);
            
            const result = readEnvFile('/path/to/.env');
            
            expect(result).toBe(mockContent);
            expect(mockedFs.existsSync).toHaveBeenCalledWith('/path/to/.env');
            expect(mockedFs.readFileSync).toHaveBeenCalledWith('/path/to/.env', 'utf-8');
        });

        it('should throw when .env file does not exist', () => {
            mockedFs.existsSync.mockReturnValue(false);
            
            expect(() => readEnvFile('/path/to/.env')).toThrow('.env file not found: /path/to/.env');
        });
    });

    describe('readSchemaFile', () => {
        it('should read and return file content when file exists', () => {
            const mockContent = 'TEST_VAR=required';
            mockedFs.existsSync.mockReturnValue(true);
            mockedFs.readFileSync.mockReturnValue(mockContent);
            
            const result = readSchemaFile('/path/to/schema.env');
            
            expect(result).toBe(mockContent);
            expect(mockedFs.existsSync).toHaveBeenCalledWith('/path/to/schema.env');
            expect(mockedFs.readFileSync).toHaveBeenCalledWith('/path/to/schema.env', 'utf-8');
        });

        it('should throw when schema file does not exist', () => {
            mockedFs.existsSync.mockReturnValue(false);
            
            expect(() => readSchemaFile('/path/to/schema.env')).toThrow('Schema file not found: /path/to/schema.env');
        });
    });

    describe('handleResult', () => {
        it('should not throw for lint operation when result is valid', () => {
            const result: Result = {
                isValid: true,
                issues: [],
                summary: { total: 0, errors: 0, warnings: 0, notices: 0 }
            };
            
            expect(() => handleResult(result, '/path/to/file', 'lint')).not.toThrow();
        });

        it('should not throw for lint operation when result is invalid', () => {
            const result: Result = {
                isValid: false,
                issues: [{ message: 'Error', severity: 'error', rule: 'test' }],
                summary: { total: 1, errors: 1, warnings: 0, notices: 0 }
            };
            
            expect(() => handleResult(result, '/path/to/file', 'lint')).not.toThrow();
        });

        it('should not throw for validate operation when result is valid', () => {
            const result: Result = {
                isValid: true,
                issues: [],
                summary: { total: 0, errors: 0, warnings: 0, notices: 0 }
            };
            
            expect(() => handleResult(result, '/path/to/file', 'validate')).not.toThrow();
        });

        it('should throw for validate operation when result is invalid', () => {
            const result: Result = {
                isValid: false,
                issues: [{ message: 'Error', severity: 'error', rule: 'test' }],
                summary: { total: 1, errors: 1, warnings: 0, notices: 0 }
            };
            
            expect(() => handleResult(result, '/path/to/file', 'validate')).toThrow('Validation failed for /path/to/file');
        });

        it('should handle different file paths correctly', () => {
            const result: Result = {
                isValid: false,
                issues: [{ message: 'Error', severity: 'error', rule: 'test' }],
                summary: { total: 1, errors: 1, warnings: 0, notices: 0 }
            };
            
            expect(() => handleResult(result, '/custom/path/.env', 'validate')).toThrow('Validation failed for /custom/path/.env');
        });
    });
});
