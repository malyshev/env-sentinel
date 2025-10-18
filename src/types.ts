export type nil = undefined | unknown | null;

export type SchemaEntry = {
    key: string;
    rule: string;
};

export type DocsSection = {
    name: string;
    description?: string;
    variables: DocsVariable[];
};

export type DocsVariable = {
    key: string;
    description?: string;
    example?: string;
    rules: ParsedRule[];
    default?: string;
};

export type ParsedRule = {
    name: string;
    args: string[];
};

export type CommandName = 'init' | 'validate' | 'check' | 'lint' | 'docs' | undefined;

export type ValidationResult = string | true;

export type LintResult = { line: number; issue: string; content?: string; severity?: 'warning' | 'error' | 'notice' };
export type LintResultWithRule = LintResult & { rule: string };

export type ValidatorFn = (key: string, value: string, args: string[]) => ValidationResult;

export type LintCheckFn = (lineNumber: number, lineContent: string) => LintResult | undefined;

export type LintCheck = { name: string; run: LintCheckFn; skipOnEmptyOrComment?: boolean };

export type ExpectedArguments = { 
    command?: CommandName; 
    file?: string; 
    schema?: string; 
    force?: boolean;
    output?: string;
};

// Unified result types for library integration
export type Result = {
    isValid: boolean;
    issues: Issue[];
    summary: Summary;
};

export type Issue = {
    line?: number;
    key?: string;
    message: string;
    severity: 'error' | 'warning' | 'notice';
    rule?: string;
    value?: string;
};

export type Summary = {
    total: number;
    errors: number;
    warnings: number;
    notices: number;
};
