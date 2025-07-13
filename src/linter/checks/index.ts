import { LintCheck } from '../../types.js';
import { noLowercaseInKeyCheck } from './no-lowercase-in-key.check.js';
import { noLeadingSpacesCheck } from './no-leading-spaces.check.js';
import { noEmptyValueCheck } from './no-empty-value.check.js';
import { noMissingKeyCheck } from './no-missing-key.check.js';
import { noDuplicateKeyCheck } from './no-duplicate-key.check.js';
import { noInvalidKeyDelimiterCheck } from './no-invalid-key-delimiter.check.js';
import { noInvalidKeyLeadingCharCheck } from './no-invalid-key-leading-char.check.js';
import { noInvalidKeyCharactersCheck } from './no-invalid-key-characters.check.js';
import { noWhitespaceInKeyCheck } from './no-whitespace-in-key.check.js';
import { noUnsafeKeyCheck } from './no-unsafe-key.check.js';
import { noQuotedKeyCheck } from './no-quoted-key.check.js';
import { noSpaceBeforeEqualCheck } from './no-space-before-equal.check.js';
import { noSpaceAfterEqualCheck } from './no-space-after-equal.check.js';
import { noInvalidReferenceSyntaxCheck } from './no-invalid-reference-syntax.check.js';
import { noUnquotedMultilineValueCheck } from './no-unquoted-multiline-value.check.js';
import { noUnescapedShellCharsCheck } from './no-unescaped-shell-chars.check.js';
import { noEmptyQuotesCheck } from './no-empty-quotes.check.js';
import { noUnquotedYAMLBooleanLiteralCheck } from './no-unquoted-yaml-boolean-literal.check.js';
import { noDuplicateReferenceCheck } from './no-duplicate-reference.check.js';
import { noCommaSeparatedValueInScalarCheck } from './no-comma-separated-value-in-scalar.check.js';

const lintChecks: LintCheck[] = [
    {
        name: 'no-leading-spaces',
        run: noLeadingSpacesCheck,
    },
    {
        name: 'no-empty-value',
        run: noEmptyValueCheck,
    },
    {
        name: 'no-missing-key',
        run: noMissingKeyCheck,
    },
    {
        name: 'no-duplicate-key',
        run: noDuplicateKeyCheck,
    },
    {
        name: 'no-invalid-key-delimiter',
        run: noInvalidKeyDelimiterCheck,
    },
    {
        name: 'no-invalid-key-leading-char',
        run: noInvalidKeyLeadingCharCheck,
    },
    {
        name: 'no-invalid-key-characters',
        run: noInvalidKeyCharactersCheck,
    },
    {
        name: 'no-whitespace-in-key',
        run: noWhitespaceInKeyCheck,
    },
    {
        name: 'no-lowercase-in-key',
        run: noLowercaseInKeyCheck,
    },
    {
        name: 'no-unsafe-key',
        run: noUnsafeKeyCheck,
    },
    {
        name: 'no-quoted-key',
        run: noQuotedKeyCheck,
    },
    {
        name: 'no-space-before-equal',
        run: noSpaceBeforeEqualCheck,
    },
    {
        name: 'no-space-after-equal',
        run: noSpaceAfterEqualCheck,
    },
    {
        name: 'no-invalid-reference-syntax',
        run: noInvalidReferenceSyntaxCheck,
    },
    {
        name: 'no-unquoted-multiline-value',
        run: noUnquotedMultilineValueCheck,
    },
    {
        name: 'no-unescaped-shell-chars',
        run: noUnescapedShellCharsCheck,
    },
    {
        name: 'no-yaml-boolean-literal',
        run: noUnquotedYAMLBooleanLiteralCheck,
    },
    {
        name: 'no-empty-quotes',
        run: noEmptyQuotesCheck,
    },
    {
        name: 'no-duplicate-reference',
        run: noDuplicateReferenceCheck,
    },
    {
        name: 'no-comma-separated-value-in-scalar',
        run: noCommaSeparatedValueInScalarCheck,
    },
];

export {
    lintChecks,
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
