export function inferType(value: string): 'boolean' | 'number' | '' {
    if (/^(true|false)$/i.test(value)) return 'boolean';
    if (/^-?\d+(\.\d+)?$/.test(value)) return 'number';
    return '';
}
