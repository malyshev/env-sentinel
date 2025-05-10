export function parseEnvContent(rawEnvContent: string): Record<string, string> {
    const env: Record<string, string> = {};
    const lines = rawEnvContent.split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith('#'));

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

    return env;
}
