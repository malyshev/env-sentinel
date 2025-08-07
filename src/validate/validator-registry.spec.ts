import { validatorRegistry } from './validator-registry.js';
import { ValidatorFn } from '../types.js';

describe('validatorRegistry', () => {
    // Store original validators to restore them after tests
    const originalValidators = new Map<string, ValidatorFn>();

    beforeEach(() => {
        // Store original validators before each test
        ['number', 'min', 'max', 'boolean', 'secure', 'enum'].forEach(name => {
            const validator = validatorRegistry.get(name);
            if (validator) {
                originalValidators.set(name, validator);
            }
        });
    });

    afterEach(() => {
        // Restore original validators after each test
        originalValidators.forEach((validator, name) => {
            validatorRegistry.register(name, validator);
        });
        originalValidators.clear();
    });

    describe('core validators', () => {
        it('should have all core validators registered', () => {
            const allValidators = validatorRegistry.getAll();
            expect(allValidators.length).toBeGreaterThan(0);
            
            // Check that all core validators are present
            const validatorNames = ['number', 'min', 'max', 'boolean', 'secure', 'enum'];
            validatorNames.forEach(name => {
                const validator = validatorRegistry.get(name);
                expect(validator).toBeDefined();
                expect(typeof validator).toBe('function');
            });
        });

        it('should be able to get specific core validators', () => {
            const numberValidator = validatorRegistry.get('number');
            expect(numberValidator).toBeDefined();
            expect(typeof numberValidator).toBe('function');
        });

        it('should return undefined for non-existent validators', () => {
            const nonExistentValidator = validatorRegistry.get('non-existent-validator');
            expect(nonExistentValidator).toBeUndefined();
        });
    });

    describe('custom validators', () => {
        it('should allow registering custom validators', () => {
            const customValidator: ValidatorFn = (key: string, value: string, _args: string[]) => {
                if (value.includes('CUSTOM_TEST')) {
                    return `Custom validator failed for ${key}`;
                }
                return true;
            };

            validatorRegistry.register('custom-test-validator', customValidator);
            
            const retrievedValidator = validatorRegistry.get('custom-test-validator');
            expect(retrievedValidator).toBe(customValidator);
        });

        it('should include custom validators in getAll()', () => {
            const initialCount = validatorRegistry.getAll().length;
            
            const customValidator: ValidatorFn = () => true;

            validatorRegistry.register('another-custom-validator', customValidator);
            
            const allValidators = validatorRegistry.getAll();
            expect(allValidators.length).toBe(initialCount + 1);
            expect(allValidators).toContain(customValidator);
        });

        it('should allow overriding core validators with custom ones', () => {
            const originalValidator = validatorRegistry.get('number');
            expect(originalValidator).toBeDefined();

            const customValidator: ValidatorFn = () => 'Custom override';

            validatorRegistry.register('number', customValidator);
            
            const overriddenValidator = validatorRegistry.get('number');
            expect(overriddenValidator).toBe(customValidator);
            expect(overriddenValidator).not.toBe(originalValidator);
        });
    });

    describe('validator functionality', () => {
        it('should have working number validator', () => {
            const numberValidator = validatorRegistry.get('number');
            expect(numberValidator).toBeDefined();

            if (numberValidator) {
                expect(numberValidator('TEST', '123', [])).toBe(true);
                expect(numberValidator('TEST', 'abc', [])).toBe('Invalid number for TEST');
            }
        });

        it('should have working boolean validator', () => {
            const booleanValidator = validatorRegistry.get('boolean');
            expect(booleanValidator).toBeDefined();

            if (booleanValidator) {
                expect(booleanValidator('TEST', 'true', [])).toBe(true);
                expect(booleanValidator('TEST', 'false', [])).toBe(true);
                expect(booleanValidator('TEST', 'yes', [])).toBe('Invalid boolean for TEST, must be \'true\' or \'false\'');
            }
        });

        it('should have working enum validator', () => {
            const enumValidator = validatorRegistry.get('enum');
            expect(enumValidator).toBeDefined();

            if (enumValidator) {
                expect(enumValidator('TEST', 'value1', ['value1', 'value2'])).toBe(true);
                expect(enumValidator('TEST', 'invalid', ['value1', 'value2'])).toBe('TEST must be one of: value1, value2');
            }
        });
    });

    describe('registry behavior', () => {
        it('should maintain core validators when no custom validators are registered', () => {
            const coreValidators = validatorRegistry.getAll();
            expect(coreValidators.length).toBeGreaterThan(0);
            
            // All validators should be functions
            coreValidators.forEach(validator => {
                expect(typeof validator).toBe('function');
            });
        });

        it('should handle multiple custom registrations', () => {
            const customValidator1: ValidatorFn = () => true;
            const customValidator2: ValidatorFn = () => true;

            validatorRegistry.register('custom-validator-1', customValidator1);
            validatorRegistry.register('custom-validator-2', customValidator2);

            expect(validatorRegistry.get('custom-validator-1')).toBe(customValidator1);
            expect(validatorRegistry.get('custom-validator-2')).toBe(customValidator2);
        });

        it('should handle validator execution with different parameters', () => {
            const numberValidator = validatorRegistry.get('number');
            expect(numberValidator).toBeDefined();

            if (numberValidator) {
                // Test with different key names
                expect(numberValidator('PORT', '3000', [])).toBe(true);
                expect(numberValidator('DATABASE_PORT', '5432', [])).toBe(true);
                
                // Test with invalid values
                expect(numberValidator('PORT', 'abc', [])).toBe('Invalid number for PORT');
                expect(numberValidator('DATABASE_PORT', '', [])).toBe('Invalid number for DATABASE_PORT');
            }
        });
    });
});
