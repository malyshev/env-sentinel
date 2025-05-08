import { parseEnvFile } from './parse-env-file.js';

export function parseSchema(schemaPath: string): Record<string, string> {
    return parseEnvFile(schemaPath);
}
