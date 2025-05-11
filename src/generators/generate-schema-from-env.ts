import { existsSync, readFileSync } from 'node:fs';
import { inferType } from './infer-type.js';
import { SchemaEntry } from '../types.js';

export function generateSchemaFromEnv(envPath: string): string {
    if (!existsSync(envPath)) {
        throw new Error(`File not found: ${envPath}`);
    }

    const raw: string = readFileSync(envPath, 'utf-8');
    const lines: string[] = raw
        .split(/\r?\n/)
        .filter((line: string): boolean | '' => line.trim() && !line.startsWith('#'));

    const schemaEntries: SchemaEntry[] = lines.flatMap((line: string): SchemaEntry[] => {
        const [keyRaw, ...valParts] = line.split('=');
        const key: string = keyRaw.trim();
        const value: string = valParts.join('=').trim();

        if (!key || !value) return [];

        const type: 'number' | 'boolean' | '' = inferType(value);
        const rule: string = type ? `required|${type}` : 'required';

        return [{ key, rule }];
    });

    return (
        `# Generated from ${envPath}\n` +
        schemaEntries.map((entry: SchemaEntry): string => `${entry.key}=${entry.rule}`).join('\n') +
        '\n'
    );
}
