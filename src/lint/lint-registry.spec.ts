import { lintRegistry } from './lint-registry.js';
import { LintCheck } from '../types.js';

describe('lintRegistry', () => {
    describe('core checks', () => {
        it('should have all core lint checks registered', () => {
            const allChecks = lintRegistry.getAll();
            expect(allChecks.length).toBeGreaterThan(0);
            
            // Check that all core checks are present
            const checkNames = allChecks.map(check => check.name);
            expect(checkNames).toContain('no-leading-spaces');
            expect(checkNames).toContain('no-empty-value');
            expect(checkNames).toContain('no-missing-key');
            expect(checkNames).toContain('no-duplicate-key');
            expect(checkNames).toContain('no-invalid-key-delimiter');
            expect(checkNames).toContain('no-invalid-key-leading-char');
            expect(checkNames).toContain('no-invalid-key-characters');
            expect(checkNames).toContain('no-whitespace-in-key');
            expect(checkNames).toContain('no-lowercase-in-key');
            expect(checkNames).toContain('no-unsafe-key');
            expect(checkNames).toContain('no-quoted-key');
            expect(checkNames).toContain('no-space-before-equal');
            expect(checkNames).toContain('no-space-after-equal');
            expect(checkNames).toContain('no-invalid-reference-syntax');
            expect(checkNames).toContain('no-unquoted-multiline-value');
            expect(checkNames).toContain('no-unescaped-shell-chars');
            expect(checkNames).toContain('no-yaml-boolean-literal');
            expect(checkNames).toContain('no-empty-quotes');
            expect(checkNames).toContain('no-duplicate-reference');
            expect(checkNames).toContain('no-comma-separated-value-in-scalar');
        });

        it('should be able to get specific core checks', () => {
            const leadingSpacesCheck = lintRegistry.get('no-leading-spaces');
            expect(leadingSpacesCheck).toBeDefined();
            expect(leadingSpacesCheck?.name).toBe('no-leading-spaces');
            expect(typeof leadingSpacesCheck?.run).toBe('function');
        });

        it('should return undefined for non-existent checks', () => {
            const nonExistentCheck = lintRegistry.get('non-existent-check');
            expect(nonExistentCheck).toBeUndefined();
        });
    });

    describe('custom checks', () => {
        it('should allow registering custom checks', () => {
            const customCheck: LintCheck = {
                name: 'custom-test-check',
                run: (lineNumber: number, line: string) => {
                    if (line.includes('CUSTOM_TEST')) {
                        return {
                            line: lineNumber,
                            issue: 'Custom test check failed',
                            severity: 'error'
                        };
                    }
                    return undefined;
                }
            };

            lintRegistry.register('custom-test-check', customCheck);
            
            const retrievedCheck = lintRegistry.get('custom-test-check');
            expect(retrievedCheck).toBe(customCheck);
        });

        it('should include custom checks in getAll()', () => {
            const initialCount = lintRegistry.getAll().length;
            
            const customCheck: LintCheck = {
                name: 'another-custom-check',
                run: () => undefined
            };

            lintRegistry.register('another-custom-check', customCheck);
            
            const allChecks = lintRegistry.getAll();
            expect(allChecks.length).toBe(initialCount + 1);
            expect(allChecks).toContain(customCheck);
        });

        it('should allow overriding core checks with custom ones', () => {
            const originalCheck = lintRegistry.get('no-leading-spaces');
            expect(originalCheck).toBeDefined();

            const customCheck: LintCheck = {
                name: 'no-leading-spaces',
                run: () => ({ line: 1, issue: 'Custom override', severity: 'error' })
            };

            lintRegistry.register('no-leading-spaces', customCheck);
            
            const overriddenCheck = lintRegistry.get('no-leading-spaces');
            expect(overriddenCheck).toBe(customCheck);
            expect(overriddenCheck).not.toBe(originalCheck);
        });
    });

    describe('registry behavior', () => {
        it('should maintain core checks when no custom checks are registered', () => {
            const coreChecks = lintRegistry.getAll();
            expect(coreChecks.length).toBeGreaterThan(0);
            
            // All checks should have valid names and run functions
            coreChecks.forEach(check => {
                expect(check.name).toBeDefined();
                expect(typeof check.run).toBe('function');
            });
        });

        it('should handle multiple custom registrations', () => {
            const customCheck1: LintCheck = {
                name: 'custom-check-1',
                run: () => undefined
            };

            const customCheck2: LintCheck = {
                name: 'custom-check-2',
                run: () => undefined
            };

            lintRegistry.register('custom-check-1', customCheck1);
            lintRegistry.register('custom-check-2', customCheck2);

            expect(lintRegistry.get('custom-check-1')).toBe(customCheck1);
            expect(lintRegistry.get('custom-check-2')).toBe(customCheck2);
        });
    });
});
