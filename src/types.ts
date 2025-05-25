export type nil = undefined | unknown | null;

export type SchemaEntry = {
    key: string;
    rule: string;
};

export type ParsedRule = {
    name: string;
    args: string[];
};

export type CommandName = 'init' | 'check' | 'lint' | undefined;

export type ValidationResult = string | true;

export type LintResult = { line: number; issue: string; content?: string; severity?: 'warning' | 'error' };
export type LintResultWithRule = LintResult & { rule: string };

export type ValidatorFn = (key: string, value: string, args: string[]) => ValidationResult;

export type LintCheckFn = (lineNumber: number, lineContent: string) => LintResult | undefined;

export type LintCheck = { name: string; run: LintCheckFn; skipOnEmptyOrComment?: boolean };

export type ExpectedArguments = { command?: CommandName; file?: string; schema?: string; force?: boolean };
