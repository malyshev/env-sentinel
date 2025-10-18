import { parseSchemaContent } from './parse-schema-content.js';

describe('parseSchemaContent', () => {
    describe('basic parsing', () => {
        it('should parse simple schema entries', () => {
            const schema = `
DB_HOST=required
DB_PORT=required|number
DEBUG=boolean
            `.trim();

            const result = parseSchemaContent(schema);

            expect(result).toHaveLength(3);
            expect(result[0]).toEqual({
                key: 'DB_HOST',
                rule: 'required'
            });
            expect(result[1]).toEqual({
                key: 'DB_PORT',
                rule: 'required|number'
            });
            expect(result[2]).toEqual({
                key: 'DEBUG',
                rule: 'boolean'
            });
        });

        it('should skip empty lines', () => {
            const schema = `
DB_HOST=required

DB_PORT=required|number
            `.trim();

            const result = parseSchemaContent(schema);

            expect(result).toHaveLength(2);
        });

        it('should skip comment lines', () => {
            const schema = `
# This is a comment
DB_HOST=required
# Another comment
DB_PORT=required|number
            `.trim();

            const result = parseSchemaContent(schema);

            expect(result).toHaveLength(2);
        });

        it('should skip lines without equal sign', () => {
            const schema = `
DB_HOST=required
INVALID_LINE_WITHOUT_EQUALS
DB_PORT=required|number
            `.trim();

            const result = parseSchemaContent(schema);

            expect(result).toHaveLength(2);
        });

        it('should skip lines with empty key', () => {
            const schema = `
DB_HOST=required
=some_value
DB_PORT=required|number
            `.trim();

            const result = parseSchemaContent(schema);

            expect(result).toHaveLength(2);
        });

        it('should handle values with multiple equal signs', () => {
            const schema = 'CONNECTION_STRING=required';

            const result = parseSchemaContent(schema);

            expect(result).toHaveLength(1);
            expect(result[0].key).toBe('CONNECTION_STRING');
            expect(result[0].rule).toBe('required');
        });
    });


    describe('reference resolution', () => {
        it('should resolve simple ${VAR} references', () => {
            const schema = `
DB_HOST=required
DB_PORT=required|number
CONNECTION=required|\${DB_HOST}
            `.trim();

            const result = parseSchemaContent(schema);

            expect(result[2]).toEqual({
                key: 'CONNECTION',
                rule: 'required|required'
            });
        });

        it('should resolve multiple references in one rule', () => {
            const schema = `
DB_HOST=required
DB_PORT=number
CONNECTION=required|\${DB_HOST}|\${DB_PORT}
            `.trim();

            const result = parseSchemaContent(schema);

            expect(result[2].rule).toBe('required|required|number');
        });

        it('should throw error for missing reference', () => {
            const schema = `
DB_HOST=required
CONNECTION=required|\${MISSING_VAR}
            `.trim();

            expect(() => parseSchemaContent(schema)).toThrow('Referenced key "MISSING_VAR" not found in the schema');
        });

        it('should handle references in correct order (referenced var must come first)', () => {
            const schema = `
BASE_URL=required
API_URL=required|\${BASE_URL}
            `.trim();

            const result = parseSchemaContent(schema);

            expect(result[1].rule).toBe('required|required');
        });

        it('should support {$VAR} reference format', () => {
            const schema = `
DB_HOST=required
CONNECTION=required|{$DB_HOST}
            `.trim();

            const result = parseSchemaContent(schema);

            expect(result[1].rule).toBe('required|required');
        });

        it('should support $VAR reference format', () => {
            const schema = `
DB_HOST=required
CONNECTION=required|$DB_HOST
            `.trim();

            const result = parseSchemaContent(schema);

            expect(result[1].rule).toBe('required|required');
        });
    });

    describe('complex scenarios', () => {
        it('should handle CRLF line endings', () => {
            const schema = 'DB_HOST=required\r\nDB_PORT=number';

            const result = parseSchemaContent(schema);

            expect(result).toHaveLength(2);
        });

        it('should handle mixed line endings', () => {
            const schema = 'DB_HOST=required\r\nDB_PORT=number\nDB_NAME=required';

            const result = parseSchemaContent(schema);

            expect(result).toHaveLength(3);
        });

        it('should return empty array for empty schema', () => {
            const result = parseSchemaContent('');

            expect(result).toEqual([]);
        });

        it('should return empty array for schema with only comments', () => {
            const schema = `
# This is a comment
# Another comment
            `.trim();

            const result = parseSchemaContent(schema);

            expect(result).toEqual([]);
        });
    });

    describe('edge cases', () => {
        it('should handle keys with underscores and numbers', () => {
            const schema = 'DB_HOST_123=required';

            const result = parseSchemaContent(schema);

            expect(result[0].key).toBe('DB_HOST_123');
        });

        it('should handle rules with complex arguments', () => {
            const schema = 'ENV=enum:development,staging,production,test';

            const result = parseSchemaContent(schema);

            expect(result[0].rule).toBe('enum:development,staging,production,test');
        });


    });
});

