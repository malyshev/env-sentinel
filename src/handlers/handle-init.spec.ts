import fs from 'node:fs';
import { log } from '../utils/log.js';
import { handleInit } from './handle-init.js';
import { lint } from '../lint/index.js';
import { generateSchemaFromEnv } from '../generators/index.js';

// Mock dependencies
jest.mock('node:fs');
jest.mock('../utils/log.js');
jest.mock('../lint/index.js');
jest.mock('../generators/index.js');

describe('handleInit', () => {
    const mockedReadFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>;
    const mockedExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
    const mockedWriteFileSync = fs.writeFileSync as jest.MockedFunction<typeof fs.writeFileSync>;
    const mockedLint = lint as jest.MockedFunction<typeof lint>;
    const mockedGenerateSchemaFromEnv = generateSchemaFromEnv as jest.MockedFunction<typeof generateSchemaFromEnv>;
    const mockedLog = log as jest.Mocked<typeof log>;

    beforeEach(() => {
        jest.resetAllMocks();
        // Mock process.cwd() to return a predictable path
        jest.spyOn(process, 'cwd').mockReturnValue('/test/project');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should create schema from existing env file with no issues', () => {
        const envContent = 'APP_NAME=myapp\nDEBUG=true';
        const schemaContent = 'APP_NAME=required\nDEBUG=required|boolean';
        const mockLintResult = {
            isValid: true,
            issues: [],
            summary: { total: 0, errors: 0, warnings: 0, notices: 0 },
        };

        // Mock that .env exists but .env-sentinel doesn't
        mockedExistsSync.mockImplementation((path: fs.PathLike) => {
            const pathStr = path.toString();
            if (pathStr === '.env') return true;
            if (pathStr === '/test/project/.env-sentinel') return false;
            return false;
        });
        mockedReadFileSync.mockReturnValue(envContent);
        mockedLint.mockReturnValue(mockLintResult);
        mockedGenerateSchemaFromEnv.mockReturnValue(schemaContent);

        expect(() => handleInit('.env')).not.toThrow();
        expect(mockedLint).toHaveBeenCalledWith(envContent);
        expect(mockedGenerateSchemaFromEnv).toHaveBeenCalledWith('.env', mockLintResult);
        expect(mockedWriteFileSync).toHaveBeenCalledWith('/test/project/.env-sentinel', schemaContent);
        expect(mockedLog.success).toHaveBeenCalledWith('Schema inferred from .env');
        expect(mockedLog.success).toHaveBeenCalledWith('.env-sentinel created!');
    });

    it('should create schema from existing env file with errors and warnings', () => {
        const envContent = 'APP_NAME=myapp\nDEBUG=true';
        const schemaContent = 'APP_NAME=required\nDEBUG=required|boolean';
        const mockLintResult = {
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

        // Mock that .env exists but .env-sentinel doesn't
        mockedExistsSync.mockImplementation((path: fs.PathLike) => {
            const pathStr = path.toString();
            if (pathStr === '.env') return true;
            if (pathStr === '/test/project/.env-sentinel') return false;
            return false;
        });
        mockedReadFileSync.mockReturnValue(envContent);
        mockedLint.mockReturnValue(mockLintResult);
        mockedGenerateSchemaFromEnv.mockReturnValue(schemaContent);

        expect(() => handleInit('.env')).not.toThrow();
        expect(mockedLog.warn).toHaveBeenCalledWith('Found 1 errors in .env. Invalid entries will be skipped:');
        expect(mockedLog.warn).toHaveBeenCalledWith('Found 1 warnings in .env:');
        expect(mockedLog.warn).toHaveBeenCalledWith(
            'Schema generated with 2 issues found. Please review and fix the issues.',
        );
    });

    it('should use default schema when env file does not exist', () => {
        // Mock that neither .env nor .env-sentinel exist
        mockedExistsSync.mockImplementation((path: fs.PathLike) => {
            const pathStr = path.toString();
            if (pathStr === '.env') return false;
            if (pathStr === '/test/project/.env-sentinel') return false;
            return false;
        });

        expect(() => handleInit('.env')).not.toThrow();
        expect(mockedLog.warn).toHaveBeenCalledWith('.env not found, using default template.');
        expect(mockedWriteFileSync).toHaveBeenCalledWith('/test/project/.env-sentinel', expect.any(String));
    });

    it('should throw error when schema file already exists and force is false', () => {
        // Mock that .env-sentinel already exists
        mockedExistsSync.mockImplementation((path: fs.PathLike) => {
            const pathStr = path.toString();
            if (pathStr === '.env') return true;
            if (pathStr === '/test/project/.env-sentinel') return true;
            return false;
        });

        expect(() => handleInit('.env', false)).toThrow(
            'Project already initialized — .env-sentinel file already exists. Use --force to overwrite it or edit it manually.',
        );
    });

    it('should proceed when schema file exists but force is true', () => {
        const envContent = 'APP_NAME=myapp';
        const schemaContent = 'APP_NAME=required';
        const mockLintResult = {
            isValid: true,
            issues: [],
            summary: { total: 0, errors: 0, warnings: 0, notices: 0 },
        };

        // Mock that both .env and .env-sentinel exist (but force=true)
        mockedExistsSync.mockImplementation((path: fs.PathLike) => {
            const pathStr = path.toString();
            if (pathStr === '.env') return true;
            if (pathStr === '/test/project/.env-sentinel') return true;
            return false;
        });
        mockedReadFileSync.mockReturnValue(envContent);
        mockedLint.mockReturnValue(mockLintResult);
        mockedGenerateSchemaFromEnv.mockReturnValue(schemaContent);

        expect(() => handleInit('.env', true)).not.toThrow();
        expect(mockedWriteFileSync).toHaveBeenCalledWith('/test/project/.env-sentinel', schemaContent);
    });

    it('should handle issues without line numbers', () => {
        const envContent = 'APP_NAME=myapp';
        const schemaContent = 'APP_NAME=required';
        const mockLintResult = {
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

        // Mock that .env exists but .env-sentinel doesn't
        mockedExistsSync.mockImplementation((path: fs.PathLike) => {
            const pathStr = path.toString();
            if (pathStr === '.env') return true;
            if (pathStr === '/test/project/.env-sentinel') return false;
            return false;
        });
        mockedReadFileSync.mockReturnValue(envContent);
        mockedLint.mockReturnValue(mockLintResult);
        mockedGenerateSchemaFromEnv.mockReturnValue(schemaContent);

        expect(() => handleInit('.env')).not.toThrow();
        expect(mockedLog.warn).toHaveBeenCalledWith(expect.stringContaining('Skipped .env [error] required'));
        expect(mockedLog.warn).toHaveBeenCalledWith(expect.not.stringContaining(':'));
    });

    it('should handle different severity levels in lint results', () => {
        const envContent = 'APP_NAME=myapp';
        const schemaContent = 'APP_NAME=required';
        const mockLintResult = {
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

        // Mock that .env exists but .env-sentinel doesn't
        mockedExistsSync.mockImplementation((path: fs.PathLike) => {
            const pathStr = path.toString();
            if (pathStr === '.env') return true;
            if (pathStr === '/test/project/.env-sentinel') return false;
            return false;
        });
        mockedReadFileSync.mockReturnValue(envContent);
        mockedLint.mockReturnValue(mockLintResult);
        mockedGenerateSchemaFromEnv.mockReturnValue(schemaContent);

        expect(() => handleInit('.env')).not.toThrow();
        expect(mockedLog.warn).toHaveBeenCalledWith(expect.stringContaining('Skipped .env:1 [error] error-rule'));
        expect(mockedLog.warn).toHaveBeenCalledWith(expect.stringContaining('.env:2 [warning] warning-rule'));
        // Notice messages are not logged by handleInit, so we don't expect them
    });
});
