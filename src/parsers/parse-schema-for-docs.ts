import { DocsSection, DocsVariable } from '../types.js';
import { parseRuleString } from '../validate/parse-rule-string.js';

const TAGS = {
    SECTION: '@section',
    DESCRIPTION: '@description',
    VAR: '@var',
    EXAMPLE: '@example'
} as const;

export function parseSchemaForDocs(rawSchemaContent: string): DocsSection[] {
    const lines = rawSchemaContent.split(/\r?\n/);
    const sections: DocsSection[] = [];
    
    let i = 0;
    while (i < lines.length) {
        const line = lines[i].trim();
        
        if (!line) {
            i++;
            continue;
        }
        
        if (line.startsWith('#')) {
            const commentContent = line.substring(1).trim();
            
            if (commentContent.startsWith(TAGS.SECTION)) {
                const { section, nextIndex } = parseSection(lines, i);
                sections.push(section);
                i = nextIndex;
                continue;
            }
            
            if (commentContent.startsWith(TAGS.VAR)) {
                const defaultSection = ensureDefaultSection(sections);
                const { variable, nextIndex } = parseVariable(lines, i);
                defaultSection.variables.push(variable);
                i = nextIndex;
                continue;
            }
            
            i++;
            continue;
        }
        
        const equalIndex = line.indexOf('=');
        if (equalIndex !== -1) {
            const defaultSection = ensureDefaultSection(sections);
            const variable = parseVariableWithoutDocs(line, i);
            defaultSection.variables.push(variable);
        }
        
        i++;
    }
    
    return sections;
}

function ensureDefaultSection(sections: DocsSection[]): DocsSection {
    if (sections.length === 0 || sections[sections.length - 1].name !== 'General') {
        const defaultSection: DocsSection = {
            name: 'General',
            description: undefined,
            variables: []
        };
        sections.push(defaultSection);
        return defaultSection;
    }
    return sections[sections.length - 1];
}

function parseVariableWithoutDocs(line: string, lineIndex: number): DocsVariable {
    const equalIndex = line.indexOf('=');
    const key = line.substring(0, equalIndex).trim();
    const ruleString = line.substring(equalIndex + 1).trim();
    
    if (!key) {
        throw new Error(`Invalid variable definition at line ${lineIndex + 1}. Variable name is required.`);
    }
    
    const defaultValue = extractDefault(ruleString);
    const cleanRuleString = removeDefault(ruleString);
    const rules = cleanRuleString ? parseRuleString(cleanRuleString) : [];
    
    return {
        key,
        description: undefined,
        example: undefined,
        rules,
        default: defaultValue
    };
}

function parseSection(lines: string[], startIndex: number): { section: DocsSection; nextIndex: number } {
    const commentContent = lines[startIndex].trim().substring(1).trim();
    let sectionName = commentContent.substring(TAGS.SECTION.length).trim();
    
    if (sectionName.startsWith(':')) {
        sectionName = sectionName.substring(1).trim();
    }
    
    if (!sectionName) {
        throw new Error(`Empty section name at line ${startIndex + 1}. Section name is required.`);
    }
    
    const section: DocsSection = {
        name: sectionName,
        description: undefined,
        variables: []
    };
    
    let i = startIndex + 1;
    
    // Parse section description
    if (i < lines.length) {
        const line = lines[i].trim();
        if (line.startsWith('#')) {
            const content = line.substring(1).trim();
            if (content.startsWith(TAGS.DESCRIPTION)) {
                const { description, nextIndex } = parseDescriptionBlock(lines, i);
                section.description = description;
                i = nextIndex;
            }
        }
    }
    
    // Parse variables until next section or end
    while (i < lines.length) {
        const line = lines[i].trim();
        
        if (!line) {
            i++;
            continue;
        }
        
        if (line.startsWith('#')) {
            const content = line.substring(1).trim();
            
            if (content.startsWith(TAGS.SECTION)) {
                break;
            }
            
            if (content.startsWith(TAGS.VAR)) {
                const { variable, nextIndex } = parseVariable(lines, i);
                section.variables.push(variable);
                i = nextIndex;
                continue;
            }
            
            i++;
            continue;
        }
        
        const equalIndex = line.indexOf('=');
        if (equalIndex !== -1) {
            const variable = parseVariableWithoutDocs(line, i);
            section.variables.push(variable);
        }
        
        i++;
    }
    
    return { section, nextIndex: i };
}

function parseDescriptionBlock(lines: string[], startIndex: number): { description: string; nextIndex: number } {
    const commentContent = lines[startIndex].trim().substring(1).trim();
    let firstLine = commentContent.substring(TAGS.DESCRIPTION.length).trim();
    
    if (firstLine.startsWith(':')) {
        firstLine = firstLine.substring(1).trim();
    }
    
    const descLines: string[] = firstLine ? [firstLine] : [];
    
    let i = startIndex + 1;
    
    while (i < lines.length) {
        const line = lines[i].trim();
        
        if (!line || !line.startsWith('#')) {
            break;
        }
        
        const content = line.substring(1).trim();
        if (content.startsWith('@')) {
            break;
        }
        
        if (isSeparatorLine(content)) {
            i++;
            continue;
        }
        
        descLines.push(content);
        i++;
    }
    
    return { description: descLines.join('\n'), nextIndex: i };
}

function parseVariable(lines: string[], startIndex: number): { variable: DocsVariable; nextIndex: number } {
    const commentContent = lines[startIndex].trim().substring(1).trim();
    let firstLine = commentContent.substring(TAGS.VAR.length).trim();
    
    if (firstLine.startsWith(':')) {
        firstLine = firstLine.substring(1).trim();
    }
    
    const descLines: string[] = firstLine ? [firstLine] : [];
    
    let i = startIndex + 1;
    let example: string | undefined;
    
    // Parse variable description and example
    while (i < lines.length) {
        const line = lines[i].trim();
        
        if (!line || !line.startsWith('#')) {
            break;
        }
        
        const content = line.substring(1).trim();
        
        if (content.startsWith(TAGS.EXAMPLE)) {
            let exampleValue = content.substring(TAGS.EXAMPLE.length).trim();
            if (exampleValue.startsWith(':')) {
                exampleValue = exampleValue.substring(1).trim();
            }
            example = exampleValue;
            i++;
            continue;
        }
        
        if (content.startsWith('@')) {
            break;
        }
        
        if (isSeparatorLine(content)) {
            i++;
            continue;
        }
        
        descLines.push(content);
        i++;
    }
    
    // Find the actual variable definition
    while (i < lines.length) {
        const line = lines[i].trim();
        
        if (!line || line.startsWith('#')) {
            i++;
            continue;
        }
        
        const equalIndex = line.indexOf('=');
        if (equalIndex !== -1) {
            const key = line.substring(0, equalIndex).trim();
            const ruleString = line.substring(equalIndex + 1).trim();
            
            if (!key) {
                throw new Error(`Invalid variable definition at line ${i + 1}. Variable name is required.`);
            }
            
            const defaultValue = extractDefault(ruleString);
            const cleanRuleString = removeDefault(ruleString);
            const rules = cleanRuleString ? parseRuleString(cleanRuleString) : [];
            
            const variable: DocsVariable = {
                key,
                description: descLines.length > 0 ? descLines.join('\n') : undefined,
                example,
                rules,
                default: defaultValue
            };
            
            return { variable, nextIndex: i + 1 };
        }
        
        i++;
    }
    
    throw new Error(`Variable definition not found after @var comment at line ${startIndex + 1}. Expected variable assignment (KEY=value).`);
}

function extractDefault(ruleString: string): string | undefined {
    const match = ruleString.match(/(?:^|\|)default:"([^"]*?)"/);
    return match ? match[1] : undefined;
}

function removeDefault(ruleString: string): string {
    return ruleString
        .replace(/(?:^|\|)default:"[^"]*?"/g, '')
        .replace(/\|\|+/g, '|')
        .replace(/^\|+|\|+$/g, '')
        .trim();
}

function isSeparatorLine(content: string): boolean {
    return /^[=\-_*]+$/.test(content);
}
