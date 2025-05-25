export type nil = undefined | unknown | null;

export type SchemaEntry = {
    key: string;
    rule: string;
};

export type ParsedRule = {
    name: string;
    args: string[];
};

export type CommandName = 'init' | 'check' | undefined;

export type ValidationResult = string | true;

export type ValidatorFn = (key: string, value: string, args: string[]) => ValidationResult;

export type ExpectedArguments = { command?: CommandName; file?: string; schema?: string; force?: boolean };
