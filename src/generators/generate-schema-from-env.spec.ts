import fs from 'node:fs';
import { inferType } from './infer-type.js';
import { generateSchemaFromEnv } from './generate-schema-from-env.js';

jest.mock('node:fs');
jest.mock('./infer-type');

describe('generateSchemaFromEnv', () => {
    const mockedReadFileSync = fs.readFileSync as jest.MockedFunction<typeof fs.readFileSync>;
    const mockedExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
    const mockedInferType = inferType as jest.MockedFunction<typeof inferType>;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should generate a schema from an .env file with types', () => {
        mockedExistsSync.mockReturnValue(true);
        mockedReadFileSync.mockReturnValue(`
# Comment line
PORT=3000
DEBUG=true
APP_NAME=my-app
`);

        mockedInferType.mockImplementation((value: string) => {
            if (value === '3000') return 'number';
            if (value === 'true') return 'boolean';
            return '';
        });

        const result = generateSchemaFromEnv('/path/to/.env');

        expect(result).toBe(`# Generated from /path/to/.env
PORT=required|number
DEBUG=required|boolean
APP_NAME=required
`);
    });

    it('should ignore empty lines and comments', () => {
        mockedExistsSync.mockReturnValue(true);
        mockedReadFileSync.mockReturnValue(`

# This is a comment
FOO=bar

`);

        mockedInferType.mockReturnValue('');

        const result = generateSchemaFromEnv('/mocked.env');
        expect(result).toBe(`# Generated from /mocked.env
FOO=required
`);
    });

    it('should skip lines with empty keys', () => {
        mockedExistsSync.mockReturnValue(true);
        mockedReadFileSync.mockReturnValue(`=invalid`);

        mockedInferType.mockReturnValue('');

        const result = generateSchemaFromEnv('/mocked.env');

        expect(result.trim()).toBe(`# Generated from /mocked.env`);
    });

    it('throws a descriptive error when file not found', () => {
        mockedExistsSync.mockReturnValue(false);

        expect(() => generateSchemaFromEnv('nonexistent.env')).toThrow(/File not found: nonexistent\.env/);
    });

    it('should generate schema for referenced variables', () => {
        mockedExistsSync.mockReturnValue(true);
        mockedReadFileSync.mockReturnValue(`
# Comment line
PORT=3000
NEW_PORT=$PORT
`);

        mockedInferType.mockImplementation((value: string) => {
            if (value === '3000') return 'number';
            return '';
        });

        const result = generateSchemaFromEnv('/path/to/.env');

        expect(result).toBe(`# Generated from /path/to/.env
PORT=required|number
NEW_PORT=required|number
`);
    });
});
