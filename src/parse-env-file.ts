import { readFileSync } from 'node:fs';

export function parseEnvFile(filePath: string): Record<string, string> {
    const env: Record<string, string> = {};
    try {
        const raw = readFileSync(filePath, 'utf-8');
        const lines = raw.split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith('#'));

        for (const line of lines) {
            const [key, ...rest] = line.split('=');
            const trimmedKey = key.trim();
            if (!trimmedKey) continue;
            let value = rest.join('=').trim();

            // Strip surrounding quotes
            if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }

            env[trimmedKey] = value;
        }
    } catch (error) {
        throw new Error(`Failed to read env file at ${filePath}: ${(error as Error).message}`);
    }

    return env;
}
