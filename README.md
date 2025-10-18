
<p align="center"><img src="https://raw.githubusercontent.com/malyshev/env-sentinel/refs/heads/develop/assets/env-sentinel-logo.png" width="400" alt="env-sentinel logo"></p>

<p align="center">
<a href="https://envsentinel.dev"><img src="https://img.shields.io/website?down_color=red&down_message=offline&style=flat&url=https%3A%2F%2Fenvsentinel.dev" alt="Website Status"></a>
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

---

## 📚 Documentation

**[📖 Read the full documentation at envsentinel.dev/docs →](https://envsentinel.dev/docs)**

Find detailed guides, examples, and API references on our official documentation site:
- **Quickstart Guide** - Get started in minutes
- **Linting** - Catch unused and inconsistent variables
- **Validation** - Validate against schema to prevent misconfigurations
- **Documenting** - Generate clear documentation for your team
- **API Reference** - Integration guides for programmatic use

---

### ✨ Key Features

- ✅ Lint .env files to catch formatting issues, unsafe syntax, and common misconfigurations
- ✅ Validate environment variables against a defined schema
- ✅ Generate markdown documentation from annotated schemas
- ✅ Simple schema format (e.g. VAR_NAME=required|number)
- ✅ Smart type detection when generating from .env
- ✅ Auto-generate schema with type inference from existing .env files
- ✅ Zero dependencies and extremely fast
- ✅ Ideal for local development, CI/CD, and team workflows
- ✅ Fast fail with clear, colorized output
- ✅ Available as both CLI tool and integrable library

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

### 4. Generate documentation

```bash
# Generate documentation from schema
npx env-sentinel docs

# Specify custom files
npx env-sentinel docs --schema .env-sentinel-example --output CONFIG.md
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

### `docs` - Generate documentation from schema

```bash
npx env-sentinel docs [--schema <schema-file>] [--output <output-file>]
```

**Options:**
- `--schema <path>` - Schema file to document (default: `.env-sentinel`)
- `--output <path>` - Output markdown file (default: `CONFIGURATION.md`)

**Features:**
- Generates markdown documentation from annotated schema
- Supports sections, descriptions, examples, and constraints
- Creates a table of contents for easy navigation
- Highlights sensitive variables (marked with `secure` validator)
- See [example schema](.env-sentinel-example) and [generated output](EXAMPLE_GENERATED_DOCS.md)

## 📝 Schema Format (.env-sentinel)

The `.env-sentinel` file defines validation rules for your environment variables. Think of it as a contract that your `.env` file must follow.

**Quick example:**

```dotenv
# Your .env file
DB_HOST=localhost
DB_PORT=5432
API_KEY=my-secret-key-12345
```

```dotenv
# Your .env-sentinel schema file
DB_HOST=required
DB_PORT=required|number|min:1|max:65535
API_KEY=required|min:16
```

When you run `npx env-sentinel validate`, it checks that:
- ✅ `DB_HOST` exists (it does: "localhost")
- ✅ `DB_PORT` exists AND is a number between 1-65535 (it is: 5432)
- ✅ `API_KEY` exists AND is at least 16 characters long (it is)

---

### Basic Schema

Each line in `.env-sentinel` represents a variable and its validation rules. You can combine multiple rules using the pipe (`|`) character:

```dotenv
# Simple validation - just check if exists
DB_HOST=required

# Type validation - must be a number
DB_PORT=required|number

# With constraints - number between 1 and 65535
DB_PORT=required|number|min:1|max:65535

# Optional variables
DEBUG=boolean
NODE_ENV=enum:development,production,test

# String validation - minimum length
API_KEY=required|min:32

# Complex example - all together
DB_PASSWORD=required|secure|min:12|default:"changeme"
```

### Documented Schema

Add documentation annotations using comment tags for markdown generation:

```dotenv
# @section Database
# @description Database connection settings

# @var Database server hostname
# @example localhost
DB_HOST=required

# @var Database server port
# @example 5432
DB_PORT=required|number|min:1|max:65535

# @var Database password (keep secure!)
DB_PASS=required|secure|min:8
```

**Available tags:**
- `# @section <name>` - Group variables into sections
- `# @description <text>` - Add description for section (supports multi-line)
- `# @var <description>` - Document a variable (supports multi-line)
- `# @example <value>` - Provide example value

**Documentation features:**
- Multi-line descriptions are supported
- Variables with `secure` validator are automatically highlighted with 🔒
- Default values from `default:"value"` are shown in documentation
- Type and constraints (min/max/enum) are automatically extracted
- Table of contents is generated for sections

See [.env-sentinel-example](.env-sentinel-example) for a full example.

### Supported Validation Rules

Use these rules in your `.env-sentinel` schema file to validate environment variables. Multiple rules can be combined using the pipe (`|`) separator.

| Rule | What it does | Usage Example | Common use cases |
|------|--------------|---------------|------------------|
| `required` | Variable must exist and have a value | `DB_HOST=required` | Critical variables like database connections, API endpoints |
| `number` | Value must be a valid number (integer or decimal) | `PORT=required\|number` | Ports, IDs, timeouts, counts, rate limits |
| `boolean` | Value must be exactly `true` or `false` | `DEBUG=boolean` | Feature flags, toggle switches, enable/disable settings |
| `string` | Explicitly marks variable as text (optional, default type) | `APP_NAME=string` | Documentation purposes, explicit type declaration |
| `min:value` | For numbers: minimum value<br>For strings: minimum length | `PORT=number\|min:1`<br>`API_KEY=min:32` | Valid port ranges, minimum key/password length |
| `max:value` | For numbers: maximum value<br>For strings: maximum length | `PORT=number\|max:65535`<br>`USERNAME=max:50` | Port limits, username/input length restrictions |
| `enum:val1,val2` | Value must be one of the listed options | `NODE_ENV=enum:dev,staging,prod` | Environment modes, log levels, deployment targets |
| `secure` | Enforces strong passwords (uppercase + lowercase + special chars) | `DB_PASS=required\|secure\|min:8` | Passwords, API keys, sensitive credentials |
| `default:"value"` | Specifies default value (shown in docs, not used in validation) | `PORT=number\|default:"3000"` | Documenting fallback values, optional configuration |

**How rules work together:**

```dotenv
# Single rule - just check if it exists
DB_HOST=required

# Multiple rules - must be required AND a number
DB_PORT=required|number

# Complex validation - required, must be a number, and between 1-65535
DB_PORT=required|number|min:1|max:65535

# With metadata - required, secure password, min 8 chars, with default shown in docs
DB_PASS=required|secure|min:8|default:"ChangeMe123!"

# Enum - must be one of these exact values
NODE_ENV=required|enum:development,staging,production
```

**Important notes:**
- `required` means the variable **must exist** in your `.env` file
- If you don't specify `required`, the variable is **optional**
- `min` and `max` are smart: they check **numeric value** for numbers, **character length** for strings
- `secure` validator checks for: uppercase letter + lowercase letter + number + special character
- `default` is for documentation only - it doesn't set actual values in your app

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
