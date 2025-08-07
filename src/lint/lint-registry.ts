import { Registry } from '../utils/registry.js';
import { LintCheck } from '../types.js';
import { noLowercaseInKeyCheck } from './checks/no-lowercase-in-key.check.js';
import { noLeadingSpacesCheck } from './checks/no-leading-spaces.check.js';
import { noEmptyValueCheck } from './checks/no-empty-value.check.js';
import { noMissingKeyCheck } from './checks/no-missing-key.check.js';
import { noDuplicateKeyCheck } from './checks/no-duplicate-key.check.js';
import { noInvalidKeyDelimiterCheck } from './checks/no-invalid-key-delimiter.check.js';
import { noInvalidKeyLeadingCharCheck } from './checks/no-invalid-key-leading-char.check.js';
import { noInvalidKeyCharactersCheck } from './checks/no-invalid-key-characters.check.js';
import { noWhitespaceInKeyCheck } from './checks/no-whitespace-in-key.check.js';
import { noUnsafeKeyCheck } from './checks/no-unsafe-key.check.js';
import { noQuotedKeyCheck } from './checks/no-quoted-key.check.js';
import { noSpaceBeforeEqualCheck } from './checks/no-space-before-equal.check.js';
import { noSpaceAfterEqualCheck } from './checks/no-space-after-equal.check.js';
import { noInvalidReferenceSyntaxCheck } from './checks/no-invalid-reference-syntax.check.js';
import { noUnquotedMultilineValueCheck } from './checks/no-unquoted-multiline-value.check.js';
import { noUnescapedShellCharsCheck } from './checks/no-unescaped-shell-chars.check.js';
import { noEmptyQuotesCheck } from './checks/no-empty-quotes.check.js';
import { noUnquotedYAMLBooleanLiteralCheck } from './checks/no-unquoted-yaml-boolean-literal.check.js';
import { noDuplicateReferenceCheck } from './checks/no-duplicate-reference.check.js';
import { noCommaSeparatedValueInScalarCheck } from './checks/no-comma-separated-value-in-scalar.check.js';

const coreLintChecks: [string, LintCheck][] = [
    ['no-leading-spaces', { name: 'no-leading-spaces', run: noLeadingSpacesCheck }],
    ['no-empty-value', { name: 'no-empty-value', run: noEmptyValueCheck }],
    ['no-missing-key', { name: 'no-missing-key', run: noMissingKeyCheck }],
    ['no-duplicate-key', { name: 'no-duplicate-key', run: noDuplicateKeyCheck }],
    ['no-invalid-key-delimiter', { name: 'no-invalid-key-delimiter', run: noInvalidKeyDelimiterCheck }],
    ['no-invalid-key-leading-char', { name: 'no-invalid-key-leading-char', run: noInvalidKeyLeadingCharCheck }],
    ['no-invalid-key-characters', { name: 'no-invalid-key-characters', run: noInvalidKeyCharactersCheck }],
    ['no-whitespace-in-key', { name: 'no-whitespace-in-key', run: noWhitespaceInKeyCheck }],
    ['no-lowercase-in-key', { name: 'no-lowercase-in-key', run: noLowercaseInKeyCheck }],
    ['no-unsafe-key', { name: 'no-unsafe-key', run: noUnsafeKeyCheck }],
    ['no-quoted-key', { name: 'no-quoted-key', run: noQuotedKeyCheck }],
    ['no-space-before-equal', { name: 'no-space-before-equal', run: noSpaceBeforeEqualCheck }],
    ['no-space-after-equal', { name: 'no-space-after-equal', run: noSpaceAfterEqualCheck }],
    ['no-invalid-reference-syntax', { name: 'no-invalid-reference-syntax', run: noInvalidReferenceSyntaxCheck }],
    ['no-unquoted-multiline-value', { name: 'no-unquoted-multiline-value', run: noUnquotedMultilineValueCheck }],
    ['no-unescaped-shell-chars', { name: 'no-unescaped-shell-chars', run: noUnescapedShellCharsCheck }],
    ['no-yaml-boolean-literal', { name: 'no-yaml-boolean-literal', run: noUnquotedYAMLBooleanLiteralCheck }],
    ['no-empty-quotes', { name: 'no-empty-quotes', run: noEmptyQuotesCheck }],
    ['no-duplicate-reference', { name: 'no-duplicate-reference', run: noDuplicateReferenceCheck }],
    ['no-comma-separated-value-in-scalar', { name: 'no-comma-separated-value-in-scalar', run: noCommaSeparatedValueInScalarCheck }],
];

export const lintRegistry = new Registry<LintCheck>(coreLintChecks);

// Export individual checks for backward compatibility
export {
    noLowercaseInKeyCheck,
    noLeadingSpacesCheck,
    noEmptyValueCheck,
    noMissingKeyCheck,
    noDuplicateKeyCheck,
    noInvalidKeyDelimiterCheck,
    noInvalidKeyLeadingCharCheck,
    noInvalidKeyCharactersCheck,
    noWhitespaceInKeyCheck,
    noUnsafeKeyCheck,
    noQuotedKeyCheck,
    noSpaceBeforeEqualCheck,
    noSpaceAfterEqualCheck,
    noInvalidReferenceSyntaxCheck,
    noUnquotedMultilineValueCheck,
    noUnescapedShellCharsCheck,
    noUnquotedYAMLBooleanLiteralCheck,
    noEmptyQuotesCheck,
    noDuplicateReferenceCheck,
    noCommaSeparatedValueInScalarCheck,
};
