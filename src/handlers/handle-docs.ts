import { writeFileSync } from 'node:fs';
import { log } from '../utils/log.js';
import { readSchemaFile } from '../utils/handler-utils.js';
import { parseSchemaForDocs } from '../parsers/parse-schema-for-docs.js';
import { generateDocsMarkdown } from '../generators/generate-docs-markdown.js';

export function handleDocs(schemaFilePath: string, outputFilePath: string): void {
    const rawSchemaContent = readSchemaFile(schemaFilePath);
    const sections = parseSchemaForDocs(rawSchemaContent);
    const markdown = generateDocsMarkdown(sections);
    
    writeFileSync(outputFilePath, markdown, 'utf-8');
    
    log.success(`Documentation generated: ${outputFilePath}`);
}
