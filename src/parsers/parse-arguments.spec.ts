import { parseArguments } from './parse-arguments.js';

type ExpectedArguments = {
    command?: string;
    file?: string;
    schema?: string;
    verbose?: boolean;
};

describe('parseArguments', () => {
    it('parses full set of arguments with defaults', () => {
        const argv = ['node', 'script.js', 'generate', '--file=test.txt', '--schema=s1', '--verbose'];
        const expectedDefaults: ExpectedArguments = {
            command: 'defaultCommand',
            file: 'default.txt',
            schema: 'defaultSchema',
            verbose: true,
        };

        const result = parseArguments(argv, expectedDefaults);

        expect(result).toEqual({
            command: 'generate',
            file: 'test.txt',
            schema: 's1',
            verbose: true,
        });
    });

    it('uses defaults when args are not provided', () => {
        const argv = ['node', 'script.js'];
        const expectedDefaults: ExpectedArguments = {
            command: 'defaultCommand',
            file: 'default.txt',
            schema: 'defaultSchema',
        };

        const result = parseArguments(argv, expectedDefaults);

        expect(result).toEqual({
            command: 'defaultCommand',
            file: 'default.txt',
            schema: 'defaultSchema',
        });
    });

    it('ignores unknown arguments', () => {
        const argv = ['node', 'script.js', 'build', '--file=test.txt', '--unknown=foo'];
        const expectedDefaults: ExpectedArguments = {
            command: '',
            file: '',
        };

        const result = parseArguments(argv, expectedDefaults);

        expect(result).toEqual({
            command: 'build',
            file: 'test.txt',
        });
    });

    it('does not override with undefined', () => {
        const argv = ['node', 'script.js'];
        const expectedDefaults: ExpectedArguments = {
            command: 'run',
            file: 'main.ts',
        };

        const result = parseArguments(argv, expectedDefaults);

        expect(result).toEqual({
            command: 'run',
            file: 'main.ts',
        });
    });

    it('handles "--arg=value" format', () => {
        const argv = ['node', 'script.js', '--file=demo.ts'];
        const expectedDefaults: ExpectedArguments = {
            file: 'default.ts',
        };

        const result = parseArguments(argv, expectedDefaults);

        expect(result).toEqual({
            file: 'demo.ts',
        });
    });

    it('handles "--arg value" format', () => {
        const argv = ['node', 'script.js', '--file', 'demo.ts'];
        const expectedDefaults: ExpectedArguments = {
            file: 'default.ts',
        };

        const result = parseArguments(argv, expectedDefaults);

        expect(result).toEqual({
            file: 'demo.ts',
        });
    });
});
