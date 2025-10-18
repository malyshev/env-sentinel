import { SchemaEntry } from '../types.js';
import { REFERENCE_REGEX, getReferencedKey } from '../utils/index.js';

export function parseSchemaContent(rawSchemaContent: string): SchemaEntry[] {
    const lines = rawSchemaContent.split(/\r?\n/);
    const entries: SchemaEntry[] = [];
    const entriesWithReferences: Array<{ entry: SchemaEntry; originalRule: string }> = [];
    
    // First pass: collect all entries and detect references
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip empty lines and comments
        if (!trimmedLine || trimmedLine.startsWith('#')) {
            continue;
        }
        
        // Parse variable definitions
        const equalIndex = trimmedLine.indexOf('=');
        if (equalIndex === -1) {
            continue;
        }
        
        const key = trimmedLine.substring(0, equalIndex).trim();
        const ruleString = trimmedLine.substring(equalIndex + 1).trim();
        
        if (!key) {
            continue;
        }
        
        const entry: SchemaEntry = {
            key,
            rule: ruleString
        };
        
        // Check if rule contains references
        if (REFERENCE_REGEX.test(ruleString)) {
            entriesWithReferences.push({ entry, originalRule: ruleString });
        } else {
            entries.push(entry);
        }
    }
    
    // Second pass: resolve references
    for (const { entry, originalRule } of entriesWithReferences) {
        entry.rule = originalRule.replace(REFERENCE_REGEX, (match) => {
            const referencedKey = getReferencedKey(match);
            const referencedEntry = entries.find(e => e.key === referencedKey);
            
            if (!referencedEntry) {
                throw new Error(`Referenced key "${referencedKey}" not found in the schema.`);
            }
            
            return referencedEntry.rule;
        });
        entries.push(entry);
    }
    
    return entries;
}

