import { REFERENCE_REGEX, getReferencedKey } from './reference-utils.js';

describe('reference-utils', () => {
    describe('REFERENCE_REGEX', () => {
        it('should match ${VAR} format', () => {
            const text = 'some text ${DATABASE_HOST} more text';
            const matches = text.match(REFERENCE_REGEX);
            
            expect(matches).not.toBeNull();
            expect(matches![0]).toBe('${DATABASE_HOST}');
        });

        it('should match {$VAR} format', () => {
            const text = 'some text {$DATABASE_HOST} more text';
            const matches = text.match(REFERENCE_REGEX);
            
            expect(matches).not.toBeNull();
            expect(matches![0]).toBe('{$DATABASE_HOST}');
        });

        it('should match $VAR format', () => {
            const text = 'some text $DATABASE_HOST more text';
            const matches = text.match(REFERENCE_REGEX);
            
            expect(matches).not.toBeNull();
            expect(matches![0]).toBe('$DATABASE_HOST');
        });

        it('should match multiple references in one string (global flag)', () => {
            const text = '${HOST}:${PORT}';
            const matches = text.match(REFERENCE_REGEX);
            
            expect(matches).not.toBeNull();
            expect(matches!.length).toBe(2);
            expect(matches![0]).toBe('${HOST}');
            expect(matches![1]).toBe('${PORT}');
        });

        it('should match mixed reference formats', () => {
            const text = '${HOST} and {$PORT} and $USER';
            const matches = text.match(REFERENCE_REGEX);
            
            expect(matches).not.toBeNull();
            expect(matches!.length).toBe(3);
            expect(matches![0]).toBe('${HOST}');
            expect(matches![1]).toBe('{$PORT}');
            expect(matches![2]).toBe('$USER');
        });

        it('should not match escaped references', () => {
            const text = 'escaped \\${NOT_A_VAR} text';
            const matches = text.match(REFERENCE_REGEX);
            
            expect(matches).toBeNull();
        });

        it('should not match double dollar signs', () => {
            const text = 'price is $$100';
            const matches = text.match(REFERENCE_REGEX);
            
            expect(matches).toBeNull();
        });

        it('should match variable names with underscores', () => {
            const text = '${DATABASE_HOST_NAME}';
            const matches = text.match(REFERENCE_REGEX);
            
            expect(matches).not.toBeNull();
            expect(matches![0]).toBe('${DATABASE_HOST_NAME}');
        });

        it('should match variable names with numbers', () => {
            const text = '${DB_HOST_1}';
            const matches = text.match(REFERENCE_REGEX);
            
            expect(matches).not.toBeNull();
            expect(matches![0]).toBe('${DB_HOST_1}');
        });

        it('should not match variable names starting with numbers', () => {
            const text = '${1_INVALID}';
            const matches = text.match(REFERENCE_REGEX);
            
            expect(matches).toBeNull();
        });

        it('should match variable names starting with underscore', () => {
            const text = '${_PRIVATE_VAR}';
            const matches = text.match(REFERENCE_REGEX);
            
            expect(matches).not.toBeNull();
            expect(matches![0]).toBe('${_PRIVATE_VAR}');
        });

        it('should not match empty braces', () => {
            const text = '${}';
            const matches = text.match(REFERENCE_REGEX);
            
            expect(matches).toBeNull();
        });

        it('should not match single dollar sign alone', () => {
            const text = 'cost is $ 10';
            const matches = text.match(REFERENCE_REGEX);
            
            expect(matches).toBeNull();
        });

        it('should work with replace() for multiple replacements', () => {
            const text = '${HOST}:${PORT}';
            const result = text.replace(REFERENCE_REGEX, 'REPLACED');
            
            expect(result).toBe('REPLACED:REPLACED');
        });
    });

    describe('getReferencedKey', () => {
        it('should extract key from ${VAR} format', () => {
            const result = getReferencedKey('${DATABASE_HOST}');
            
            expect(result).toBe('DATABASE_HOST');
        });

        it('should extract key from {$VAR} format', () => {
            const result = getReferencedKey('{$DATABASE_HOST}');
            
            expect(result).toBe('DATABASE_HOST');
        });

        it('should extract key from $VAR format', () => {
            const result = getReferencedKey('$DATABASE_HOST');
            
            expect(result).toBe('DATABASE_HOST');
        });

        it('should extract key with underscores', () => {
            const result = getReferencedKey('${DATABASE_HOST_NAME}');
            
            expect(result).toBe('DATABASE_HOST_NAME');
        });

        it('should extract key with numbers', () => {
            const result = getReferencedKey('${DB_HOST_123}');
            
            expect(result).toBe('DB_HOST_123');
        });

        it('should extract key starting with underscore', () => {
            const result = getReferencedKey('${_PRIVATE_VAR}');
            
            expect(result).toBe('_PRIVATE_VAR');
        });

        it('should handle keys from mixed content', () => {
            const result = getReferencedKey('prefix ${MY_VAR} suffix');
            
            expect(result).toBe('MY_VAR');
        });

        it('should extract first key if multiple present', () => {
            const result = getReferencedKey('${FIRST} ${SECOND}');
            
            expect(result).toBe('FIRST');
        });
    });
});

