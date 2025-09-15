// Shared utilities for handling variable references in .env files

export const REFERENCE_REGEX = /(?<!\\)(\$\{(?<key1>[A-Za-z_][A-Za-z0-9_]*)\}|\{\$(?<key2>[A-Za-z_][A-Za-z0-9_]*)\}|\$(?<key3>[A-Za-z_][A-Za-z0-9_]*)(?![A-Za-z0-9_]*\$))/;

export function getReferencedKey(key: string): string {
    const { groups } = REFERENCE_REGEX.exec(key)!;
    return groups!.key1 || groups!.key2 || groups!.key3 || key;
}
