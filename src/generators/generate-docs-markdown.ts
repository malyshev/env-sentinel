import { DocsSection, DocsVariable, ParsedRule } from '../types.js';

export function generateDocsMarkdown(sections: DocsSection[]): string {
    const lines: string[] = [];
    
    lines.push('# Environment Variables Configuration');
    lines.push('');
    lines.push('This document describes all environment variables used in this application.');
    lines.push('');
    
    if (sections.length === 0) {
        lines.push('No documented variables found.');
        return lines.join('\n');
    }
    
    const hasMultipleSections = sections.length > 1 || (sections.length === 1 && sections[0].name !== 'General');
    
    if (hasMultipleSections) {
        lines.push('## Table of Contents');
        lines.push('');
        sections.forEach(section => {
            const anchor = section.name.toLowerCase().replace(/\s+/g, '-');
            lines.push(`- [${section.name}](#${anchor})`);
        });
        lines.push('');
        lines.push('---');
        lines.push('');
    }
    
    sections.forEach(section => {
        lines.push(...generateSectionMarkdown(section, hasMultipleSections));
    });
    
    return lines.join('\n');
}

function generateSectionMarkdown(section: DocsSection, showSectionHeader: boolean): string[] {
    const lines: string[] = [];
    
    if (showSectionHeader) {
        lines.push(`## ${section.name}`);
        lines.push('');
        
        if (section.description) {
            lines.push(section.description);
            lines.push('');
        }
    }
    
    if (section.variables.length === 0) {
        if (showSectionHeader) {
            lines.push('*No variables in this section.*');
            lines.push('');
        }
        return lines;
    }
    
    const hasDescriptions = section.variables.some(v => v.description);
    
    if (hasDescriptions) {
        lines.push('| Variable | Description | Type | Required | Default | Constraints |');
        lines.push('|----------|-------------|------|----------|---------|-------------|');
    } else {
        lines.push('| Variable | Type | Required | Default | Constraints |');
        lines.push('|----------|------|----------|---------|-------------|');
    }
    
    section.variables.forEach(variable => {
        lines.push(generateVariableTableRow(variable, hasDescriptions));
    });
    
    lines.push('');
    
    return lines;
}

function generateVariableTableRow(variable: DocsVariable, includeDescription: boolean): string {
    const isRequired = variable.rules.some(r => r.name === 'required');
    const isSecure = variable.rules.some(r => r.name === 'secure');
    
    const name = isSecure ? `🔒 \`${variable.key}\`` : `\`${variable.key}\``;
    const type = getVariableType(variable.rules);
    const typeFormatted = `\`${type}\``;
    const required = isRequired ? 'Yes' : 'No';
    const defaultValue = variable.default ? `\`${variable.default}\`` : '-';
    const constraints = getConstraints(variable.rules);
    const constraintsText = constraints.length > 0 ? constraints.join('<br>') : '-';
    
    if (includeDescription) {
        const description = variable.description ? variable.description.replace(/\n/g, '<br>') : '-';
        return `| ${name} | ${description} | ${typeFormatted} | ${required} | ${defaultValue} | ${constraintsText} |`;
    } else {
        return `| ${name} | ${typeFormatted} | ${required} | ${defaultValue} | ${constraintsText} |`;
    }
}

function getVariableType(rules: ParsedRule[]): string | undefined {
    const typeRule = rules.find(r => ['number', 'boolean', 'string'].includes(r.name));
    if (typeRule) {
        return typeRule.name;
    }
    
    if (rules.some(r => r.name === 'enum')) {
        return 'enum';
    }
    
    return 'string';
}

function getConstraints(rules: ParsedRule[]): string[] {
    const constraints: string[] = [];
    
    const minRule = rules.find(r => r.name === 'min');
    if (minRule && minRule.args.length > 0) {
        constraints.push(`Min: ${minRule.args[0]}`);
    }
    
    const maxRule = rules.find(r => r.name === 'max');
    if (maxRule && maxRule.args.length > 0) {
        constraints.push(`Max: ${maxRule.args[0]}`);
    }
    
    const enumRule = rules.find(r => r.name === 'enum');
    if (enumRule && enumRule.args.length > 0) {
        constraints.push(`Allowed: ${enumRule.args.join(', ')}`);
    }
    
    return constraints;
}

