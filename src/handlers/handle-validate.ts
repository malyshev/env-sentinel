import { log } from './../utils/log.js';
import { validate } from './../validate/index.js';
import { parseEnvContent } from './../parsers/index.js';
import { parseSchemaContent } from './../parsers/index.js';
import { readEnvFile, readSchemaFile, handleResult } from './../utils/handler-utils.js';

export function handleValidate(envFilePath: string, schemaFilePath: string): void {
    const rawEnvContent = readEnvFile(envFilePath);
    const rawSchemaContent = readSchemaFile(schemaFilePath);

    const envVars = parseEnvContent(rawEnvContent);
    const schemaVars = parseSchemaContent(rawSchemaContent);

    const result = validate(envVars, schemaVars, rawEnvContent);

    handleResult(result, envFilePath, 'validate');

    if (result.isValid) {
        log.success(`${envFilePath} is valid`);
    } else {
        log.error(`${envFilePath} has validation errors`);
        throw new Error(`Validation failed for ${envFilePath}`);
    }
}
