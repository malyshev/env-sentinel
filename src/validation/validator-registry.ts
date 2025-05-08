import { ValidatorFn } from '../constants.js';

const validatorRegistry = new Map<string, ValidatorFn>();

export function registerValidator(name: string, fn: ValidatorFn): void {
    validatorRegistry.set(name, fn);
}

export function getValidator(name: string): ValidatorFn | undefined {
    return validatorRegistry.get(name);
}
