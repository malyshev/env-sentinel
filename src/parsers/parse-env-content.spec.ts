import { parseEnvContent } from './parse-env-content.js';

describe('parseEnvFile', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('parses basic key-value pairs', () => {
        const result = parseEnvContent(`
            FOO=bar
            BAZ=qux
        `);

        expect(result).toEqual({
            FOO: 'bar',
            BAZ: 'qux',
        });
    });

    it('ignores comments and empty lines', () => {
        const result = parseEnvContent(`
            # This is a comment
            FOO=bar

            # Another comment
            BAZ=qux
        `);

        expect(result).toEqual({
            FOO: 'bar',
            BAZ: 'qux',
        });
    });

    it('joins multiple equals in value', () => {
        const result = parseEnvContent(`
            PASSWORD=p@ss=123=xyz
        `);

        expect(result).toEqual({
            PASSWORD: 'p@ss=123=xyz',
        });
    });

    it('trims whitespace around keys and values', () => {
        const result = parseEnvContent(`
            FOO =   bar
        `);

        expect(result).toEqual({
            FOO: 'bar',
        });
    });

    it('strips surrounding quotes', () => {
        const result = parseEnvContent(`
            SINGLE='hello world'
            DOUBLE="hello world"
        `);

        expect(result).toEqual({
            SINGLE: 'hello world',
            DOUBLE: 'hello world',
        });
    });

    it('ignores lines with empty keys', () => {
        const result = parseEnvContent(`
            =value
            FOO=bar
        `);

        expect(result).toEqual({
            FOO: 'bar',
        });
    });

    it('expands values referenced with ${VAR}', () => {
        const result = parseEnvContent("FOO=bar\nBAR=${FOO}");

        expect(result).toEqual({
            FOO: 'bar',
            BAR: 'bar'
        });
    });

    it('expands values referenced with {$VAR}', () => {
        const result = parseEnvContent("FOO=bar\nBAR={$FOO}");

        expect(result).toEqual({
            FOO: 'bar',
            BAR: 'bar'
        });
    });

    it('expands values referenced with $VAR', () => {
        const result = parseEnvContent("FOO=bar\nBAR=$FOO");

        expect(result).toEqual({
            FOO: 'bar',
            BAR: 'bar'
        });
    });

    it('throws an error if a referenced variable does not exist', () => {
        expect(() => parseEnvContent("FOO=bar\nBAR=$BAZ")).toThrow(`Referenced key "BAZ" not found in the env.`)
    });

    it('throws an error for self referenced variables', () => {
        expect(() => parseEnvContent("FOO=$FOO")).toThrow(`Referenced key "FOO" not found in the env.`)
    });
});
