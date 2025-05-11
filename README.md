# env-sentinel

<p align="center">
<a href="https://github.com/malyshev/env-sentinel/actions"><img src="https://github.com/malyshev/env-sentinel/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://www.npmjs.com/package/env-sentinel"><img src="https://img.shields.io/npm/dw/env-sentinel" alt="Total Downloads"></a>
<a href="https://www.npmjs.com/package/env-sentinel"><img src="https://img.shields.io/npm/v/env-sentinel" alt="Latest Stable Version"></a>
<a href="https://www.npmjs.com/package/env-sentinel"><img src="https://img.shields.io/npm/l/env-sentinel" alt="License"></a>
</p>

## Intro

`env-sentinel` is a lightweight CLI tool for validating `.env` files in Node.js projects using a simple, human-readable schema format.

It helps developers **prevent runtime misconfigurations**, especially in multi-environment projects or CI/CD pipelines. With zero dependencies and blazing-fast execution, `env-sentinel` offers a modern alternative to bloated validators or manual `.env.example` guessing games.

Whether you're working solo or managing a team, `env-sentinel` brings confidence, clarity, and automation to your environment variable workflows — without needing to write a line of custom validation logic.

- **Zero-dependency .env file checker** for Node.js projects.  
- Validate your environment variables with a simple schema.  
- Auto-generate schema from existing `.env` files with type inference.  
- Perfect for CI/CD pipelines, local dev, and safer config handling.

## Features

- **Simple schema format** (e.g. `VAR_NAME=required|number`)
- **Smart type detection** when generating from `.env`
- **Zero dependencies**
- CLI-ready: Use in local dev or pipelines
- Initializes `.env-sentinel` with inferred rules
- Fast fail with clear, colorized output

## Installation

```bash
npx env-sentinel         # no install needed (recommended)
```
or install globally/local if preferred:
```bash
npm install -g env-sentinel
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

### Check custom file paths

```bash
npx env-sentinel check --env-file .env.production --schema config/prod.schema
```

###  Sample Output

**On success:**


> ✅ Environment validation passed!


**On failure:**

> 🛑 Missing required variable: DB_HOST  
> ⚠️ Insecure value detected: DB_PASS=1234

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

## License

[MIT license](https://opensource.org/licenses/MIT) — Free to use, modify, and contribute!
