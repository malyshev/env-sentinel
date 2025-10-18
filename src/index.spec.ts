import * as envSentinel from './index.js';

describe('index exports', () => {
    it('should export run function', () => {
        expect(envSentinel.run).toBeDefined();
        expect(typeof envSentinel.run).toBe('function');
    });

    it('should export handlers', () => {
        expect(envSentinel.handleInit).toBeDefined();
        expect(envSentinel.handleValidate).toBeDefined();
        expect(envSentinel.handleLint).toBeDefined();
        expect(typeof envSentinel.handleInit).toBe('function');
        expect(typeof envSentinel.handleValidate).toBe('function');
        expect(typeof envSentinel.handleLint).toBe('function');
    });

    it('should export parsers', () => {
        expect(envSentinel.parseSchemaContent).toBeDefined();
        expect(envSentinel.parseEnvContent).toBeDefined();
        expect(typeof envSentinel.parseSchemaContent).toBe('function');
        expect(typeof envSentinel.parseEnvContent).toBe('function');
    });

    it('should export validate function', () => {
        expect(envSentinel.validate).toBeDefined();
        expect(typeof envSentinel.validate).toBe('function');
    });

    it('should export validator registry', () => {
        expect(envSentinel.validatorRegistry).toBeDefined();
        expect(envSentinel.validatorRegistry.get).toBeDefined();
        expect(envSentinel.validatorRegistry.register).toBeDefined();
    });

    it('should export individual validators', () => {
        expect(envSentinel.stringValidator).toBeDefined();
        expect(envSentinel.numberValidator).toBeDefined();
        expect(envSentinel.minValueValidator).toBeDefined();
        expect(envSentinel.maxValueValidator).toBeDefined();
        expect(envSentinel.booleanValueValidator).toBeDefined();
        expect(envSentinel.secureValueValidator).toBeDefined();
        expect(envSentinel.enumValueValidator).toBeDefined();
    });

    it('should export parse rule string', () => {
        expect(envSentinel.parseRuleString).toBeDefined();
        expect(typeof envSentinel.parseRuleString).toBe('function');
    });

    it('should export lint function', () => {
        expect(envSentinel.lint).toBeDefined();
        expect(typeof envSentinel.lint).toBe('function');
    });

    it('should export lint registry', () => {
        expect(envSentinel.lintRegistry).toBeDefined();
        expect(envSentinel.lintRegistry.get).toBeDefined();
        expect(envSentinel.lintRegistry.register).toBeDefined();
    });

    it('should export individual lint checks', () => {
        expect(envSentinel.noLeadingSpacesCheck).toBeDefined();
        expect(envSentinel.noEmptyValueCheck).toBeDefined();
        expect(envSentinel.noMissingKeyCheck).toBeDefined();
        expect(envSentinel.noDuplicateKeyCheck).toBeDefined();
        expect(envSentinel.noInvalidKeyDelimiterCheck).toBeDefined();
        expect(envSentinel.noInvalidKeyLeadingCharCheck).toBeDefined();
        expect(envSentinel.noInvalidKeyCharactersCheck).toBeDefined();
        expect(envSentinel.noWhitespaceInKeyCheck).toBeDefined();
        expect(envSentinel.noLowercaseInKeyCheck).toBeDefined();
        expect(envSentinel.noUnsafeKeyCheck).toBeDefined();
        expect(envSentinel.noQuotedKeyCheck).toBeDefined();
        expect(envSentinel.noSpaceBeforeEqualCheck).toBeDefined();
        expect(envSentinel.noSpaceAfterEqualCheck).toBeDefined();
        expect(envSentinel.noInvalidReferenceSyntaxCheck).toBeDefined();
        expect(envSentinel.noUnquotedMultilineValueCheck).toBeDefined();
        expect(envSentinel.noUnescapedShellCharsCheck).toBeDefined();
        expect(envSentinel.noUnquotedYAMLBooleanLiteralCheck).toBeDefined();
        expect(envSentinel.noEmptyQuotesCheck).toBeDefined();
        expect(envSentinel.noDuplicateReferenceCheck).toBeDefined();
        expect(envSentinel.noCommaSeparatedValueInScalarCheck).toBeDefined();
    });

    it('should export constants', () => {
        expect(envSentinel.DEFAULT_SCHEMA_FILE_NAME).toBeDefined();
        expect(typeof envSentinel.DEFAULT_SCHEMA_FILE_NAME).toBe('string');
    });

    it('should export types', () => {
        expect(envSentinel).toHaveProperty('DEFAULT_SCHEMA_FILE_NAME');
    });
});

