import { parseSchemaForDocs } from './parse-schema-for-docs.js';

describe('parseSchemaForDocs', () => {
    it('should parse simple section with variables', () => {
        const schema = [
            '# @section: Database',
            '# @description: Database settings',
            '',
            '# @var: Database hostname',
            '# @example: localhost',
            'DB_HOST=required',
            '',
            '# @var: Database port',
            'DB_PORT=number'
        ].join('\n');

        const result = parseSchemaForDocs(schema);

        expect(result).toHaveLength(1);
        expect(result[0].name).toBe('Database');
        expect(result[0].description).toBe('Database settings');
        expect(result[0].variables).toHaveLength(2);
        
        expect(result[0].variables[0]).toEqual({
            key: 'DB_HOST',
            description: 'Database hostname',
            example: 'localhost',
            rules: [{ name: 'required', args: [] }],
            default: undefined
        });
        
        expect(result[0].variables[1]).toEqual({
            key: 'DB_PORT',
            description: 'Database port',
            example: undefined,
            rules: [{ name: 'number', args: [] }],
            default: undefined
        });
    });

    it('should parse multi-line section description', () => {
        const schema = [
            '# @section: Database',
            '# @description: Database connection settings.',
            '# All database-related variables.',
            '# Use secure passwords in production.',
            '',
            '# @var: Database host',
            'DB_HOST=required'
        ].join('\n');

        const result = parseSchemaForDocs(schema);

        expect(result[0].description).toBe(
            'Database connection settings.\nAll database-related variables.\nUse secure passwords in production.'
        );
    });

    it('should parse multi-line variable description', () => {
        const schema = [
            '# @section: Security',
            '',
            '# @var: JWT secret key.',
            '# Must be at least 32 characters.',
            '# Never commit to version control.',
            'JWT_SECRET=required|secure'
        ].join('\n');

        const result = parseSchemaForDocs(schema);

        expect(result[0].variables[0].description).toBe(
            'JWT secret key.\nMust be at least 32 characters.\nNever commit to version control.'
        );
    });

    it('should parse multiple sections', () => {
        const schema = [
            '# @section: Database',
            '# @var DB host',
            'DB_HOST=required',
            '',
            '# @section: Cache',
            '# @var: Cache driver',
            'CACHE_DRIVER=enum:redis,memcached'
        ].join('\n');

        const result = parseSchemaForDocs(schema);

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Database');
        expect(result[1].name).toBe('Cache');
    });

    it('should extract default values', () => {
        const schema = [
            '# @section: App',
            '# @var: Debug mode',
            'DEBUG=boolean|default:"false"'
        ].join('\n');

        const result = parseSchemaForDocs(schema);

        expect(result[0].variables[0].default).toBe('false');
        expect(result[0].variables[0].rules).toEqual([{ name: 'boolean', args: [] }]);
    });

    it('should parse complex validation rules', () => {
        const schema = [
            '# @section: App',
            '# @var: Server port',
            'PORT=required|number|min:1|max:65535|default:"3000"'
        ].join('\n');

        const result = parseSchemaForDocs(schema);

        expect(result[0].variables[0].rules).toEqual([
            { name: 'required', args: [] },
            { name: 'number', args: [] },
            { name: 'min', args: ['1'] },
            { name: 'max', args: ['65535'] }
        ]);
        expect(result[0].variables[0].default).toBe('3000');
    });

    it('should parse enum rules with arguments', () => {
        const schema = [
            '# @section: App',
            '# @var: Environment',
            'NODE_ENV=enum:dev,staging,prod'
        ].join('\n');

        const result = parseSchemaForDocs(schema);

        expect(result[0].variables[0].rules).toEqual([
            { name: 'enum', args: ['dev', 'staging', 'prod'] }
        ]);
    });

    it('should handle variables with @var but no description text', () => {
        const schema = [
            '# @section: App',
            '# @var',
            'DB_HOST=required'
        ].join('\n');

        const result = parseSchemaForDocs(schema);

        expect(result[0].variables[0]).toEqual({
            key: 'DB_HOST',
            description: undefined,
            example: undefined,
            rules: [{ name: 'required', args: [] }],
            default: undefined
        });
    });

    it('should handle section without description', () => {
        const schema = [
            '# @section: Database',
            '# @var DB host',
            'DB_HOST=required'
        ].join('\n');

        const result = parseSchemaForDocs(schema);

        expect(result[0].description).toBeUndefined();
    });

    it('should handle variables without validation rules', () => {
        const schema = [
            '# @section: App',
            '# @var: Optional var',
            'OPTIONAL_VAR='
        ].join('\n');

        const result = parseSchemaForDocs(schema);

        expect(result[0].variables[0].rules).toEqual([]);
    });

    it('should skip regular comments', () => {
        const schema = [
            '# Regular comment',
            '# @section: Database',
            '# Another comment',
            '# @var: DB host',
            '# Yet another comment',
            'DB_HOST=required'
        ].join('\n');

        const result = parseSchemaForDocs(schema);

        expect(result).toHaveLength(1);
        expect(result[0].variables).toHaveLength(1);
    });

    it('should filter out visual separator lines', () => {
        const schema = [
            '# ============================================================================',
            '# @section: Database',
            '# @description: Database settings',
            '# ============================================================================',
            '# @var: DB host',
            'DB_HOST=required'
        ].join('\n');

        const result = parseSchemaForDocs(schema);

        expect(result[0].description).toBe('Database settings');
        expect(result[0].variables).toHaveLength(1);
    });

    it('should handle empty schema', () => {
        const result = parseSchemaForDocs('');

        expect(result).toEqual([]);
    });

    it('should handle schema with only comments', () => {
        const schema = [
            '# Just a comment',
            '# Another comment'
        ].join('\n');

        const result = parseSchemaForDocs(schema);

        expect(result).toEqual([]);
    });

    it('should accept tags without space after hash', () => {
        const schema = [
            '#@section: Database',
            '#@description: Database settings',
            '#@var Database host',
            '#@example: localhost',
            'DB_HOST=required'
        ].join('\n');

        const result = parseSchemaForDocs(schema);

        expect(result[0].name).toBe('Database');
        expect(result[0].description).toBe('Database settings');
        expect(result[0].variables[0].description).toBe('Database host');
        expect(result[0].variables[0].example).toBe('localhost');
    });

    it('should accept tags with extra spaces', () => {
        const schema = [
            '#  @section: Database',
            '#   @description: Database settings',
            '#    @var Database host',
            'DB_HOST=required'
        ].join('\n');

        const result = parseSchemaForDocs(schema);

        expect(result[0].name).toBe('Database');
        expect(result[0].description).toBe('Database settings');
        expect(result[0].variables[0].description).toBe('Database host');
    });
});

