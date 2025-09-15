import { SchemaEntry, DocumentationMetadata } from '../types.js';
import { REFERENCE_REGEX, getReferencedKey } from '../utils/reference-utils.js';

export function parseSchemaContent(rawSchemaContent: string): SchemaEntry[] {
    const lines = rawSchemaContent.split(/\r?\n/);
    const entries: SchemaEntry[] = [];
    const entriesWithReferences: Array<{ entry: SchemaEntry; originalRule: string }> = [];
    let currentSection: string | undefined;
    let currentSectionDescription: string | undefined;
    
    // First pass: collect all entries and detect references
    for (const line of lines) {
        const trimmedLine = line.trim();
        
        // Skip empty lines
        if (!trimmedLine) {
            continue;
        }
        
        // Handle section comments
        if (trimmedLine.startsWith('# @section:')) {
            currentSection = trimmedLine.replace('# @section:', '').trim();
            continue;
        }
        
        // Handle section descriptions
        if (trimmedLine.startsWith('# @description:')) {
            currentSectionDescription = trimmedLine.replace('# @description:', '').trim();
            continue;
        }
        
        // Skip regular comments
        if (trimmedLine.startsWith('#')) {
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
        
        // Extract metadata from rule string
        const metadata = extractMetadataFromRuleString(ruleString);
        const cleanRule = removeMetadataFromRuleString(ruleString);
        
        const entry: SchemaEntry = {
            key,
            rule: cleanRule,
            metadata: {
                ...metadata,
                section: currentSection,
                sectionDescription: currentSectionDescription
            }
        };
        
        // Check if rule contains references
        if (REFERENCE_REGEX.test(cleanRule)) {
            entriesWithReferences.push({ entry, originalRule: cleanRule });
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

function extractMetadataFromRuleString(ruleString: string): DocumentationMetadata {
    const metadata: DocumentationMetadata = {};
    
    // Extract metadata using regex patterns (with or without leading pipe)
    const descMatch = ruleString.match(/(?:^|\|)desc:"([^"]*?)"/);
    if (descMatch) {
        metadata.description = descMatch[1];
    }
    
    const exampleMatch = ruleString.match(/(?:^|\|)example:"([^"]*?)"/);
    if (exampleMatch) {
        metadata.example = exampleMatch[1];
    }
    
    const defaultMatch = ruleString.match(/(?:^|\|)default:"([^"]*?)"/);
    if (defaultMatch) {
        metadata.default = defaultMatch[1];
    }
    
    
    return metadata;
}

function removeMetadataFromRuleString(ruleString: string): string {
    // Remove all metadata patterns from the rule string (with or without leading pipe)
    return ruleString
        .replace(/(?:^|\|)desc:"[^"]*?"/g, '')
        .replace(/(?:^|\|)example:"[^"]*?"/g, '')
        .replace(/(?:^|\|)default:"[^"]*?"/g, '')
        .replace(/\|\|+/g, '|') // Clean up double pipes
        .replace(/^\|+|\|+$/g, '') // Remove leading/trailing pipes
        .trim();
}

