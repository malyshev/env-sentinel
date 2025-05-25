import { parseEnvContent } from './parse-env-content.js';

export function parseSchemaContent(rawSchemaContent: string): Record<string, string> {
    return parseEnvContent(rawSchemaContent);
}
