
<p align="center"><img src="https://raw.githubusercontent.com/malyshev/env-sentinel/refs/heads/develop/assets/env-sentinel-logo.png" width="400" alt="env-sentinel logo"></p>

<p align="center">
<a href="https://github.com/malyshev/env-sentinel/actions"><img src="https://github.com/malyshev/env-sentinel/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://codecov.io/gh/malyshev/env-sentinel"><img src="https://img.shields.io/codecov/c/github/malyshev/env-sentinel" alt="Coverage Status"></a>
<a href="https://www.npmjs.com/package/env-sentinel"><img src="https://img.shields.io/npm/dw/env-sentinel" alt="Total Downloads"></a>
<a href="https://www.npmjs.com/package/env-sentinel"><img src="https://img.shields.io/npm/v/env-sentinel" alt="Latest Stable Version"></a>
<a href="https://www.npmjs.com/package/env-sentinel"><img src="https://img.shields.io/npm/l/env-sentinel" alt="License"></a>
</p>

## 🔎 Intro

**env-sentinel** is a lightweight, zero-dependency CLI tool for analyzing `.env` files in Node.js projects — offering both schema-based **validation** and powerful **linting** to ensure your environment variables are correct, consistent, and production-safe.

In addition to verifying variable types and required keys, **env-sentinel** can detect subtle and hard-to-spot issues such as malformed keys, unsafe characters, unescaped shell tokens, duplicate references, invalid syntax, and YAML pitfalls — problems that typical schema validation can’t catch.

With fast execution and a human-readable schema format, **env-sentinel** eliminates the guesswork of `.env.example` files and bloated config validators — giving you clear, actionable feedback without writing custom validation logic.

### ✨ Key Features

- ✅ Lint .env files to catch formatting issues, unsafe syntax, and common misconfigurations
- ✅ Validate environment variables against a defined schema
- ✅ Simple schema format (e.g. VAR_NAME=required|number)
- ✅ Smart type detection when generating from .env
- ✅ Auto-generate schema with type inference from existing .env files with inferred
- ✅ Zero dependencies and extremely fast
- ✅ Ideal for local development, CI/CD, and team workflows
- ✅ Fast fail with clear, colorized output

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

Then run it:
```shell
npx env-sentinel lint --file .env     # or just: env-sentinel lint
```

### Initialize schema file (.env-sentinel) from existing .env

```bash
npx env-sentinel init
```
- Auto-detects types like number, boolean
- Creates .env-sentinel in current directory

### Re-generate (overwrite existing)

```bash
npx env-sentinel init --force
```

### Use custom .env to generate schema

```bash
npx env-sentinel init --env-file .env.local
```

## Schema Format (.env-sentinel)

Each line represents a variable and its rule:
```dotenv
DB_HOST=required
DB_PORT=required|number
DEBUG=optional|boolean
NODE_ENV=optional|enum:development,production,test
```

## Supported Rules

| Syntax           | Description                                                                                                                                                                                                                    |
|------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **required**     | Must be defined                                                                                                                                                                                                                |
| **optional**     | Can be missed                                                                                                                                                                                                                  |  
| **number**       | Must be a number                                                                                                                                                                                                               |   
| **string**       | Can be anything                                                                                                                                                                                                                |   
| **boolean**      | Must be `true` of `false`                                                                                                                                                                                                      |  
| **min:value**    | Is greater than or equal to the specified minimum value; for strings, it checks the length, and for numbers, it checks the numerical value.                                                                                    |  
| **max:value**    | Is less than or equal to the specified maximum value; for strings, it checks the length, and for numbers, it checks the numerical value.                                                                                       |  
| **enum:foo,bar** | Must match one of listed values                                                                                                                                                                                                |  

## Usage

### Check .env file

```bash
npx env-sentinel
```

**Defaults:**
- .env (env file)
- .env-sentinel (schema file)

### Validate or Lint custom files

```shell
# Validate .env against a schema
npx env-sentinel validate --env-file .env.production --schema config/prod.schema

# Lint .env for formatting issues
npx env-sentinel lint --file .env.production
```

###  Sample Output

**On success:**

> ✅ Environment validation passed!

**On failure:**

```shell
> 🔵 .env:101 [notice] no-empty-value → Variable "COMMENTED_OUT" has an empty value
> 🟡 .env:102 [warning] no-unquoted-multiline-value → Unquoted multiline-looking value in "MULTILINE"
> 🛑 .env:104 [error] no-invalid-key-delimiter → Variable name contains invalid delimiter: ":"
> 🛑 Missing required variable: DB_HOST  
> 🟡 Insecure value detected: DB_PASS=1234
```

## Why use env-sentinel?

- No runtime bloat — stays lightweight and fast
- More transparent than Joi/Zod configs
- Quick to set up and CI-friendly
- Fits modern DX (type-safe, CLI-ready, focused)

## Roadmap (Coming Soon)

- Custom rule plugins
- GitHub Action integration
- VSCode extension
- .env.template generator from schema
- Dry run & suggestion mode

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
