const REFERENCE_REGEX =
    /(?<!\\)(\$\{(?<key1>[A-Za-z_][A-Za-z0-9_]*)\}|\{\$(?<key2>[A-Za-z_][A-Za-z0-9_]*)\}|\$(?<key3>[A-Za-z_][A-Za-z0-9_]*))/;

export function parseEnvContent(rawEnvContent: string): Record<string, string> {
    const env: Record<string, string> = {};
    const lines = rawEnvContent.split(/\r?\n/).filter((line) => line.trim() && !line.trim().startsWith('#'));
    const linesWithReferences: Array<Record<string, string>> = [];

    for (const line of lines) {
        const [key, ...rest] = line.split('=');
        const trimmedKey = key.trim();
        if (!trimmedKey) continue;
        let value = rest.join('=').trim();

        // Strip surrounding quotes
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        if (REFERENCE_REGEX.test(value)) {
            linesWithReferences.push({ key: trimmedKey, value });
            continue;
        }

        env[trimmedKey] = value;
    }

    for (const line of linesWithReferences) {
        const { key, value } = line;

        env[key] = value.replace(REFERENCE_REGEX, (match) => {
            const referencedKey = getReferencedKey(match);
            const referencedValue = env[referencedKey];

            if (referencedValue === undefined) {
                throw new Error(`Referenced key "${referencedKey}" not found in the env.`);
            }

            return referencedValue;
        });
    }

    return env;
}

//get the referenced key from the capture groups
function getReferencedKey(key: string): string {
    const { groups } = REFERENCE_REGEX.exec(key)!;
    return groups!.key1 || groups!.key2 || groups!.key3 || key;
}
