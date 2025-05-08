import { parseEnvFile } from './parse-env-file.js';
import { readFileSync } from 'node:fs';

jest.mock('node:fs', () => ({
    readFileSync: jest.fn(),
}));

describe('parseEnvFile', () => {
    const mockedReadFileSync = readFileSync as jest.MockedFunction<typeof readFileSync>;

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('parses basic key-value pairs', () => {
        mockedReadFileSync.mockReturnValue(`
            FOO=bar
            BAZ=qux
        `);

        const result = parseEnvFile('dummy.env');

        expect(result).toEqual({
            FOO: 'bar',
            BAZ: 'qux',
        });
    });

    it('ignores comments and empty lines', () => {
        mockedReadFileSync.mockReturnValue(`
            # This is a comment
            FOO=bar

            # Another comment
            BAZ=qux
        `);

        const result = parseEnvFile('dummy.env');

        expect(result).toEqual({
            FOO: 'bar',
            BAZ: 'qux',
        });
    });

    it('joins multiple equals in value', () => {
        mockedReadFileSync.mockReturnValue(`
            PASSWORD=p@ss=123=xyz
        `);

        const result = parseEnvFile('dummy.env');

        expect(result).toEqual({
            PASSWORD: 'p@ss=123=xyz',
        });
    });

    it('trims whitespace around keys and values', () => {
        mockedReadFileSync.mockReturnValue(`
            FOO =   bar
        `);

        const result = parseEnvFile('dummy.env');

        expect(result).toEqual({
            FOO: 'bar',
        });
    });

    it('strips surrounding quotes', () => {
        mockedReadFileSync.mockReturnValue(`
            SINGLE='hello world'
            DOUBLE="hello world"
        `);

        const result = parseEnvFile('dummy.env');

        expect(result).toEqual({
            SINGLE: 'hello world',
            DOUBLE: 'hello world',
        });
    });

    it('ignores lines with empty keys', () => {
        mockedReadFileSync.mockReturnValue(`
            =value
            FOO=bar
        `);

        const result = parseEnvFile('dummy.env');

        expect(result).toEqual({
            FOO: 'bar',
        });
    });

    it('throws a descriptive error when file read fails', () => {
        mockedReadFileSync.mockImplementation(() => {
            throw new Error('File not found');
        });

        expect(() => parseEnvFile('nonexistent.env')).toThrow(
            /Failed to read env file at nonexistent\.env: File not found/,
        );
    });
});
