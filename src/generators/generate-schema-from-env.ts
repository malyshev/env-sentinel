import { existsSync, readFileSync } from 'node:fs';
import { inferType } from './infer-type.js';
import { SchemaEntry } from '../types.js';
import { parseEnvContent } from '../parsers/parse-env-content.js';

export function generateSchemaFromEnv(envPath: string): string {
    if (!existsSync(envPath)) {
        throw new Error(`File not found: ${envPath}`);
    }

    const raw: string = readFileSync(envPath, 'utf-8');
    const env = parseEnvContent(raw);

    const schemaEntries: SchemaEntry[] = Object.entries(env).map(([key, value]): SchemaEntry => {
        const type: 'number' | 'boolean' | '' = inferType(value);
        const rule: string = type ? `required|${type}` : 'required';

        return { key, rule }
    })

    return (
        `# Generated from ${envPath}\n` +
        schemaEntries.map((entry: SchemaEntry): string => `${entry.key}=${entry.rule}`).join('\n') +
        '\n'
    );
}
