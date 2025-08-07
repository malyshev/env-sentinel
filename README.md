
<p align="center"><img src="https://raw.githubusercontent.com/malyshev/env-sentinel/refs/heads/develop/assets/env-sentinel-logo.png" width="400" alt="env-sentinel logo"></p>

<p align="center">
<a href="https://github.com/malyshev/env-sentinel/actions"><img src="https://github.com/malyshev/env-sentinel/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://codecov.io/gh/malyshev/env-sentinel"><img src="https://img.shields.io/codecov/c/github/malyshev/env-sentinel" alt="Coverage Status"></a>
<a href="https://www.npmjs.com/package/env-sentinel"><img src="https://img.shields.io/npm/dw/env-sentinel" alt="Total Downloads"></a>
<a href="https://www.npmjs.com/package/env-sentinel"><img src="https://img.shields.io/npm/v/env-sentinel" alt="Latest Stable Version"></a>
<a href="https://www.npmjs.com/package/env-sentinel"><img src="https://img.shields.io/npm/l/env-sentinel" alt="License"></a>
</p>

## 🔎 Intro

**env-sentinel** is a lightweight, zero-dependency tool for analyzing `.env` files — offering both schema-based **validation** and powerful **linting** to ensure your environment variables are correct, consistent, and production-safe.

In addition to verifying variable types and required keys, **env-sentinel** can detect subtle and hard-to-spot issues such as malformed keys, unsafe characters, unescaped shell tokens, duplicate references, invalid syntax, and YAML pitfalls — problems that typical schema validation can't catch.

With fast execution and a human-readable schema format, **env-sentinel** eliminates the guesswork of `.env.example` files and bloated config validators — giving you clear, actionable feedback without writing custom validation logic.

### ✨ Key Features

- ✅ Lint .env files to catch formatting issues, unsafe syntax, and common misconfigurations
- ✅ Validate environment variables against a defined schema
- ✅ Simple schema format (e.g. VAR_NAME=required|number)
- ✅ Smart type detection when generating from .env
- ✅ Auto-generate schema with type inference from existing .env files
- ✅ Zero dependencies and extremely fast
- ✅ Ideal for local development, CI/CD, and team workflows
- ✅ Fast fail with clear, colorized output
- ✅ **NEW**: Available as both CLI tool and integrable library

## 📦 Installation

The easiest way to run `env-sentinel` is with `npx` (no installation required):

```shell
npx env-sentinel lint --file .env
```

Alternatively, you can install it globally or as a local project dependency:

### Using npm

```shell
# Global
npm install -g env-sentinel

# Local (in your project)
npm install --save-dev env-sentinel
```

### Using yarn

```shell
# Global
yarn global add env-sentinel

# Local
yarn add --dev env-sentinel
```

### Using pnpm

```shell
# Global
pnpm add -g env-sentinel

# Local
pnpm add -D env-sentinel
```

## 🚀 Quick Start

### 1. Lint your .env file

```bash
# Lint default .env file
npx env-sentinel lint

# Lint specific file
npx env-sentinel lint --file .env.production
```

### 2. Create a schema from your .env

```bash
# Generate schema from .env
npx env-sentinel init

# Overwrite existing schema
npx env-sentinel init --force

# Generate from different file
npx env-sentinel init --file .env.local
```

### 3. Validate against schema

```bash
# Validate default files (.env against .env-sentinel)
npx env-sentinel validate

# Validate custom files
npx env-sentinel validate --file .env.production --schema config/prod.schema
```

## 📋 CLI Commands

### `lint` - Check for formatting issues

```bash
npx env-sentinel lint [--file <path>]
```

**Options:**
- `--file <path>` - Path to .env file (default: `.env`)

**What it checks:**
- Invalid key characters
- Missing or malformed values
- Duplicate keys
- Unsafe shell characters
- YAML boolean literals
- And 20+ other formatting rules

### `validate` - Validate against schema

```bash
npx env-sentinel validate [--file <env-file>] [--schema <schema-file>]
```

**Options:**
- `--file <path>` - Path to .env file (default: `.env`)
- `--schema <path>` - Path to schema file (default: `.env-sentinel`)

**What it validates:**
- Required variables
- Type checking (number, boolean, string)
- Value constraints (min, max, enum)
- Security checks

### `init` - Generate schema from .env

```bash
npx env-sentinel init [--file <env-file>] [--force]
```

**Options:**
- `--file <path>` - Source .env file (default: `.env`)
- `--force` - Overwrite existing schema file

**Features:**
- Auto-detects types (number, boolean, string)
- Infers required/optional based on usage
- Skips invalid entries and reports them

## 📝 Schema Format (.env-sentinel)

Each line represents a variable and its validation rules:

```dotenv
DB_HOST=required
DB_PORT=required|number
DEBUG=optional|boolean
NODE_ENV=optional|enum:development,production,test
API_KEY=required|min:32
MAX_CONNECTIONS=optional|number|max:100
```

## Supported Validation Rules

| Rule | Description | Example |
|------|-------------|---------|
| **required** | Must be defined | `DB_HOST=required` |
| **optional** | Can be missed | `DEBUG=optional` |
| **number** | Must be a number | `PORT=required\|number` |
| **boolean** | Must be `true` or `false` | `DEBUG=optional\|boolean` |
| **string** | Can be anything | `NAME=required\|string` |
| **min:value** | Minimum value/length | `API_KEY=required\|min:32` |
| **max:value** | Maximum value/length | `PORT=required\|number\|max:65535` |
| **enum:values** | Must match one of listed values | `NODE_ENV=required\|enum:dev,prod,test` |

## 📊 Sample Output

### Linting Output

```bash
.env:5 [error] no-missing-key → Variable name is missing
.env:8 [warning] no-unescaped-shell-chars → Unescaped shell characters in value
.env:12 [notice] no-empty-value → Variable "COMMENTED_OUT" has an empty value
```

### Validation Output

```bash
.env:3 [error] required → Missing required variable: DB_HOST
.env:5 [error] number → PORT must be a number (got: "abc")
.env:8 [warning] unknown-rule → Unknown rule 'invalid' for DEBUG
```

## 🔧 Library Integration

**env-sentinel** is also available as an integrable library for programmatic use:

### Installation

```bash
npm install env-sentinel
```

### Basic Usage

```typescript
import { lint, validate, parseEnvContent, parseSchemaContent } from 'env-sentinel';

// Lint .env content
const lintResult = lint(envContent);
if (!lintResult.isValid) {
  console.log(`Found ${lintResult.summary.errors} errors`);
}

// Validate against schema
const envVars = parseEnvContent(envContent);
const schemaVars = parseSchemaContent(schemaContent);
const validateResult = validate(envVars, schemaVars, envContent);

// Handle results
validateResult.issues.forEach(issue => {
  console.log(`${issue.severity}: ${issue.message}`);
});
```

### Available Functions

#### Core Functions
| Function | Description | Returns |
|----------|-------------|---------|
| `lint(envContent: string)` | Lint .env content | `Result` |
| `validate(envVars, schema, fileContent?)` | Validate against schema | `Result` |
| `parseEnvContent(content: string)` | Parse .env content | `Record<string, string>` |
| `parseSchemaContent(content: string)` | Parse schema content | `Record<string, string>` |

#### Individual Validators
| Function | Description | Returns |
|----------|-------------|---------|
| `numberValidator(key, value, args)` | Validate number type | `ValidationResult` |
| `booleanValueValidator(key, value, args)` | Validate boolean type | `ValidationResult` |
| `minValueValidator(key, value, args)` | Validate minimum value | `ValidationResult` |
| `maxValueValidator(key, value, args)` | Validate maximum value | `ValidationResult` |
| `enumValueValidator(key, value, args)` | Validate enum values | `ValidationResult` |
| `secureValueValidator(key, value, args)` | Validate secure values | `ValidationResult` |

#### Individual Lint Checks
| Function | Description | Returns |
|----------|-------------|---------|
| `noLeadingSpacesCheck(lineNumber, lineContent)` | Check for leading spaces | `LintResult \| undefined` |
| `noEmptyValueCheck(lineNumber, lineContent)` | Check for empty values | `LintResult \| undefined` |
| `noMissingKeyCheck(lineNumber, lineContent)` | Check for missing keys | `LintResult \| undefined` |
| `noDuplicateKeyCheck(lineNumber, lineContent)` | Check for duplicate keys | `LintResult \| undefined` |
| `noInvalidKeyDelimiterCheck(lineNumber, lineContent)` | Check for invalid key delimiters | `LintResult \| undefined` |
| `noInvalidKeyLeadingCharCheck(lineNumber, lineContent)` | Check for invalid leading chars | `LintResult \| undefined` |
| `noInvalidKeyCharactersCheck(lineNumber, lineContent)` | Check for invalid key characters | `LintResult \| undefined` |
| `noWhitespaceInKeyCheck(lineNumber, lineContent)` | Check for whitespace in keys | `LintResult \| undefined` |
| `noLowercaseInKeyCheck(lineNumber, lineContent)` | Check for lowercase in keys | `LintResult \| undefined` |
| `noUnsafeKeyCheck(lineNumber, lineContent)` | Check for unsafe keys | `LintResult \| undefined` |
| `noQuotedKeyCheck(lineNumber, lineContent)` | Check for quoted keys | `LintResult \| undefined` |
| `noSpaceBeforeEqualCheck(lineNumber, lineContent)` | Check for space before equals | `LintResult \| undefined` |
| `noSpaceAfterEqualCheck(lineNumber, lineContent)` | Check for space after equals | `LintResult \| undefined` |
| `noInvalidReferenceSyntaxCheck(lineNumber, lineContent)` | Check for invalid references | `LintResult \| undefined` |
| `noUnquotedMultilineValueCheck(lineNumber, lineContent)` | Check for unquoted multiline values | `LintResult \| undefined` |
| `noUnescapedShellCharsCheck(lineNumber, lineContent)` | Check for unescaped shell chars | `LintResult \| undefined` |
| `noEmptyQuotesCheck(lineNumber, lineContent)` | Check for empty quotes | `LintResult \| undefined` |
| `noUnquotedYAMLBooleanLiteralCheck(lineNumber, lineContent)` | Check for unquoted YAML booleans | `LintResult \| undefined` |
| `noDuplicateReferenceCheck(lineNumber, lineContent)` | Check for duplicate references | `LintResult \| undefined` |
| `noCommaSeparatedValueInScalarCheck(lineNumber, lineContent)` | Check for comma-separated values | `LintResult \| undefined` |

### Custom Validators & Checks

#### Validator Function Signature
```typescript
type ValidatorFn = (key: string, value: string, args: string[]) => ValidationResult;
type ValidationResult = string | true; // Return true for success, string for error message

// Example custom validator
const customValidator: ValidatorFn = (key, value, args) => {
  if (value.length < 8) {
    return `${key} must be at least 8 characters long`;
  }
  return true;
};
```

#### Lint Check Function Signature
```typescript
type LintCheckFn = (lineNumber: number, lineContent: string) => LintResult | undefined;
type LintResult = { 
  line: number; 
  issue: string; 
  severity?: 'warning' | 'error' | 'notice' 
};

// Example custom lint check
const customCheck: LintCheckFn = (lineNumber, lineContent) => {
  if (lineContent.includes('TODO')) {
    return {
      line: lineNumber,
      issue: 'Found TODO comment in .env file',
      severity: 'warning'
    };
  }
  return undefined; // No issue found
};
```

#### Registering Custom Functions
```typescript
import { validatorRegistry, lintRegistry } from 'env-sentinel';

// Register custom validator
validatorRegistry.register('custom-min-length', customValidator);

// Register custom lint check
lintRegistry.register('no-todo-comments', {
  name: 'no-todo-comments',
  run: customCheck
});
```

### Result Types

```typescript
type Result = {
  isValid: boolean;
  issues: Issue[];
  summary: Summary;
};

type Issue = {
  line?: number;
  key?: string;
  message: string;
  severity: 'error' | 'warning' | 'notice';
  rule?: string;
  value?: string;
};

type Summary = {
  total: number;
  errors: number;
  warnings: number;
  notices: number;
};
```

## 🤝 Why use env-sentinel?

- **Zero dependencies** — stays lightweight and fast
- **Human-readable schema** — more transparent than Joi/Zod configs
- **Quick setup** — works out of the box with npx
- **CI/CD friendly** — perfect for automated validation
- **Extensible** — custom validators and lint checks
- **Type-safe** — full TypeScript support
- **Dual purpose** — CLI tool and integrable library

## 💖 Sponsors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/dartcdev">
        <img src="https://avatars.githubusercontent.com/dartcdev?v=4" width="64px;" alt=""/>
        <br />
        <sub><b>@dartcdev</b></sub>
      </a>
    </td>
  </tr>
</table>

## License

[MIT license](https://opensource.org/licenses/MIT) — Free to use, modify, and contribute!
