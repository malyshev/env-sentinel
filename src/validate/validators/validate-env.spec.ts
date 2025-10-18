import { validate } from './validate-env.js';

describe('validate', () => {
    it('should return valid result for env matching schema', () => {
        const envVars = {
            DB_HOST: 'localhost',
            DB_PORT: '3306',
            API_KEY: 'secret123'
        };
        const schema = {
            DB_HOST: 'required',
            DB_PORT: 'required|number',
            API_KEY: 'required'
        };

        const result = validate(envVars, schema);

        expect(result.isValid).toBe(true);
        expect(result.issues).toEqual([]);
        expect(result.summary).toEqual({
            total: 0,
            errors: 0,
            warnings: 0,
            notices: 0
        });
    });

    it('should detect missing required variables', () => {
        const envVars = {
            DB_HOST: 'localhost'
        };
        const schema = {
            DB_HOST: 'required',
            DB_PORT: 'required|number'
        };

        const result = validate(envVars, schema);

        expect(result.isValid).toBe(false);
        expect(result.summary.errors).toBe(1);
        const issue = result.issues[0];
        expect(issue.key).toBe('DB_PORT');
        expect(issue.severity).toBe('error');
        expect(issue.rule).toBe('required');
    });

    it('should validate number types', () => {
        const envVars = {
            DB_PORT: 'not-a-number'
        };
        const schema = {
            DB_PORT: 'required|number'
        };

        const result = validate(envVars, schema);

        expect(result.isValid).toBe(false);
        expect(result.summary.errors).toBe(1);
        expect(result.issues[0].rule).toBe('number');
    });

    it('should validate boolean types', () => {
        const envVars = {
            DEBUG: 'not-a-boolean'
        };
        const schema = {
            DEBUG: 'boolean'
        };

        const result = validate(envVars, schema);

        expect(result.isValid).toBe(false);
        expect(result.summary.errors).toBe(1);
        expect(result.issues[0].rule).toBe('boolean');
    });

    it('should validate enum values', () => {
        const envVars = {
            NODE_ENV: 'invalid'
        };
        const schema = {
            NODE_ENV: 'required|enum:development,production,test'
        };

        const result = validate(envVars, schema);

        expect(result.isValid).toBe(false);
        expect(result.summary.errors).toBe(1);
        expect(result.issues[0].rule).toBe('enum');
    });

    it('should validate min values', () => {
        const envVars = {
            PORT: '100'
        };
        const schema = {
            PORT: 'required|number|min:1000'
        };

        const result = validate(envVars, schema);

        expect(result.isValid).toBe(false);
        expect(result.summary.errors).toBe(1);
        expect(result.issues[0].rule).toBe('min');
    });

    it('should validate max values', () => {
        const envVars = {
            PORT: '70000'
        };
        const schema = {
            PORT: 'required|number|max:65535'
        };

        const result = validate(envVars, schema);

        expect(result.isValid).toBe(false);
        expect(result.summary.errors).toBe(1);
        expect(result.issues[0].rule).toBe('max');
    });

    it('should skip validation for optional missing variables', () => {
        const envVars = {
            DB_HOST: 'localhost'
        };
        const schema = {
            DB_HOST: 'required',
            DEBUG: 'boolean'
        };

        const result = validate(envVars, schema);

        expect(result.isValid).toBe(true);
        expect(result.issues).toEqual([]);
    });

    it('should warn on unknown rules', () => {
        const envVars = {
            DB_HOST: 'localhost'
        };
        const schema = {
            DB_HOST: 'required|invalid-rule'
        };

        const result = validate(envVars, schema);

        expect(result.isValid).toBe(true);
        expect(result.summary.warnings).toBe(1);
        expect(result.issues[0].severity).toBe('warning');
        expect(result.issues[0].rule).toBe('invalid-rule');
    });

    it('should include line numbers when fileContent is provided', () => {
        const envVars = {
            DB_HOST: 'localhost'
        };
        const schema = {
            DB_HOST: 'required',
            DB_PORT: 'required'
        };
        const fileContent = 'DB_HOST=localhost\n';

        const result = validate(envVars, schema, fileContent);

        expect(result.issues[0].line).toBeUndefined();
    });

    it('should handle empty values for required fields', () => {
        const envVars = {
            DB_HOST: ''
        };
        const schema = {
            DB_HOST: 'required'
        };

        const result = validate(envVars, schema);

        expect(result.isValid).toBe(false);
        expect(result.summary.errors).toBe(1);
        expect(result.issues[0].rule).toBe('required');
    });

    it('should validate multiple rules on same variable', () => {
        const envVars = {
            PORT: '100'
        };
        const schema = {
            PORT: 'required|number|min:1000|max:65535'
        };

        const result = validate(envVars, schema);

        expect(result.isValid).toBe(false);
        expect(result.summary.errors).toBe(1);
        expect(result.issues[0].rule).toBe('min');
    });

    it('should validate secure values', () => {
        const envVars = {
            API_KEY: 'weak'
        };
        const schema = {
            API_KEY: 'required|secure'
        };

        const result = validate(envVars, schema);

        expect(result.isValid).toBe(false);
        expect(result.summary.errors).toBeGreaterThan(0);
        expect(result.issues[0].rule).toBe('secure');
    });

    it('should count summary correctly', () => {
        const envVars = {
            DB_HOST: 'localhost',
            PORT: 'not-a-number'
        };
        const schema = {
            DB_HOST: 'required',
            DB_PORT: 'required',
            PORT: 'number'
        };

        const result = validate(envVars, schema);

        expect(result.summary.total).toBe(2);
        expect(result.summary.errors).toBe(2);
        expect(result.summary.total).toBe(result.issues.length);
    });

    it('should handle empty schema', () => {
        const envVars = {
            DB_HOST: 'localhost'
        };
        const schema = {};

        const result = validate(envVars, schema);

        expect(result.isValid).toBe(true);
        expect(result.issues).toEqual([]);
    });

    it('should include key in issues', () => {
        const envVars = {
            PORT: 'not-a-number'
        };
        const schema = {
            PORT: 'number'
        };

        const result = validate(envVars, schema);

        expect(result.issues[0].key).toBe('PORT');
    });

    it('should include message in issues', () => {
        const envVars = {
            PORT: 'not-a-number'
        };
        const schema = {
            PORT: 'number'
        };

        const result = validate(envVars, schema);

        expect(result.issues[0].message).toBeDefined();
        expect(typeof result.issues[0].message).toBe('string');
    });

    it('should include value in error issues', () => {
        const envVars = {
            PORT: 'not-a-number'
        };
        const schema = {
            PORT: 'number'
        };

        const result = validate(envVars, schema);

        expect(result.issues[0].value).toBe('not-a-number');
    });
});

