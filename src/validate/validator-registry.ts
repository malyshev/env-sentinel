import { Registry } from '../utils/registry.js';
import { ValidatorFn } from '../types.js';
import { numberValidator } from './validators/number.validator.js';
import { minValueValidator } from './validators/min-value.validator.js';
import { maxValueValidator } from './validators/max-value.validator.js';
import { booleanValueValidator } from './validators/boolean-value.validator.js';
import { secureValueValidator } from './validators/secure-value.validator.js';
import { enumValueValidator } from './validators/enum-value.validator.js';

const coreValidators: [string, ValidatorFn][] = [
    ['number', numberValidator],
    ['min', minValueValidator],
    ['max', maxValueValidator],
    ['boolean', booleanValueValidator],
    ['secure', secureValueValidator],
    ['enum', enumValueValidator],
];

export const validatorRegistry = new Registry<ValidatorFn>(coreValidators);

// Export individual validators for backward compatibility
export {
    numberValidator,
    minValueValidator,
    maxValueValidator,
    booleanValueValidator,
    secureValueValidator,
    enumValueValidator,
};
