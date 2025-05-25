import { nil } from '../types.js';

export function parseArguments<T extends { command?: string }>(argv: string[], expectedArgsWithDefaults?: T): T {
    const parsedArgumentsMap: Map<string, unknown> = new Map();
    const args: string[] = argv.slice(2);
    const expectedKeys = expectedArgsWithDefaults ? Object.keys(expectedArgsWithDefaults) : [];

    const command: string | undefined = args[0]?.startsWith('--') ? undefined : args[0];
    parsedArgumentsMap.set('command', command ?? expectedArgsWithDefaults?.command);

    args.forEach((arg, index) => {
        if (!arg.startsWith('-')) {
            return;
        }

        let argumentName: string;
        let argumentValue: string | nil;

        if (arg.includes('=')) {
            const [argNameRaw, argValueRaw] = arg.split('=');
            argumentName = argNameRaw.replace(/^--?/, '');
            argumentValue = argValueRaw;
        } else {
            argumentName = arg.replace(/^--?/, '');
            const positionalArgument = args[index + 1];

            if ((positionalArgument ?? '').startsWith('-')) {
                argumentValue = true;
            } else {
                argumentValue = positionalArgument;
            }
        }

        if (expectedKeys.includes(argumentName) && argumentValue !== undefined) {
            parsedArgumentsMap.set(argumentName, argumentValue);
        }
    });

    return Object.fromEntries(
        expectedKeys.map((key) => [
            key,
            parsedArgumentsMap.has(key) ? parsedArgumentsMap.get(key) : expectedArgsWithDefaults?.[key as keyof T],
        ]),
    ) as T;
}
