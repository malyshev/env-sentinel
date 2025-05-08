import { getValidator, registerValidator } from './validator-registry.js';
import { validateNumber } from './validate-number.js';
import { validateMinValue } from './validate-min-value.js';
import { validateMaxValue } from './validate-max-value.js';
import { validateBooleanValue } from './validate-boolean-value.js';
import { validateSecureValue } from './validate-secure-value.js';
import { validateEnumValue } from './validate-enum-value.js';

registerValidator('number', validateNumber);
registerValidator('min', validateMinValue);
registerValidator('max', validateMaxValue);
registerValidator('boolean', validateBooleanValue);
registerValidator('secure', validateSecureValue);
registerValidator('enum', validateEnumValue);

export * from './parse-rule-string.js';
export { registerValidator, getValidator, validateNumber };
