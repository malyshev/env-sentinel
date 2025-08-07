import { lint } from '../../src/lint/index.js';
import { validate } from '../../src/validate/index.js';
import { parseEnvContent, parseSchemaContent } from '../../src/parsers/index.js';

describe('Performance Benchmarks', () => {
    describe('Linting Performance', () => {
        it('should lint small files quickly (< 10ms)', () => {
            const smallEnvContent = `
# Small test file
API_KEY=abc123
DATABASE_URL=postgres://localhost:5432/db
DEBUG=true
`.trim();

            const startTime = performance.now();
            const result = lint(smallEnvContent);
            const endTime = performance.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(10);
            expect(result.isValid).toBeDefined();
        });

        it('should lint medium files efficiently (< 50ms)', () => {
            // Generate medium-sized content
            const mediumEnvContent = Array.from({ length: 100 }, (_, i) => 
                `VAR_${i}=value_${i}`
            ).join('\n');

            const startTime = performance.now();
            const result = lint(mediumEnvContent);
            const endTime = performance.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(50);
            expect(result.isValid).toBeDefined();
        });

        it('should handle large files reasonably (< 200ms)', () => {
            // Generate large content
            const largeEnvContent = Array.from({ length: 1000 }, (_, i) => 
                `LARGE_VAR_${i}=large_value_${i}_with_more_content`
            ).join('\n');

            const startTime = performance.now();
            const result = lint(largeEnvContent);
            const endTime = performance.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(200);
            expect(result.isValid).toBeDefined();
        });
    });

    describe('Validation Performance', () => {
        it('should validate simple schemas quickly (< 15ms)', () => {
            const envContent = `
API_KEY=abc123
DATABASE_URL=postgres://localhost:5432/db
DEBUG=true
`.trim();

            const schemaContent = `
API_KEY=required
DATABASE_URL=required
DEBUG=boolean
`.trim();

            const envVars = parseEnvContent(envContent);
            const schemaVars = parseSchemaContent(schemaContent);

            const startTime = performance.now();
            const result = validate(envVars, schemaVars, envContent);
            const endTime = performance.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(15);
            expect(result.isValid).toBeDefined();
        });

        it('should validate complex schemas efficiently (< 100ms)', () => {
            // Generate complex schema with many rules
            const envVars: Record<string, string> = {};
            const schemaVars: Record<string, string> = {};

            for (let i = 0; i < 50; i++) {
                envVars[`VAR_${i}`] = i % 2 === 0 ? `${i}` : `value_${i}`;
                schemaVars[`VAR_${i}`] = i % 2 === 0 ? 'number' : 'required';
            }

            const startTime = performance.now();
            const result = validate(envVars, schemaVars);
            const endTime = performance.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(100);
            expect(result.isValid).toBeDefined();
        });
    });

    describe('Registry Performance', () => {
        it('should lookup core validators quickly (< 20ms)', async () => {
            const { validatorRegistry } = await import('../../src/validate/validator-registry.js');
            
            const startTime = performance.now();
            for (let i = 0; i < 1000; i++) {
                validatorRegistry.get('number');
                validatorRegistry.get('boolean');
                validatorRegistry.get('required');
            }
            const endTime = performance.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(20);
        });

        it('should lookup core lint checks quickly (< 20ms)', async () => {
            const { lintRegistry } = await import('../../src/lint/lint-registry.js');
            
            const startTime = performance.now();
            for (let i = 0; i < 1000; i++) {
                lintRegistry.get('no-leading-spaces');
                lintRegistry.get('no-empty-value');
                lintRegistry.get('no-missing-key');
            }
            const endTime = performance.now();
            const duration = endTime - startTime;

            expect(duration).toBeLessThan(20);
        });
    });

    describe('Memory Usage', () => {
        it('should not leak memory during repeated operations', () => {
            const baseMemory = process.memoryUsage().heapUsed;
            
            // Perform many operations
            for (let i = 0; i < 100; i++) {
                const testContent = `VAR_${i}=value_${i}`;
                lint(testContent);
            }

            const finalMemory = process.memoryUsage().heapUsed;
            const memoryIncrease = finalMemory - baseMemory;
            
            // Memory increase should be reasonable (< 1MB)
            expect(memoryIncrease).toBeLessThan(1024 * 1024);
        });
    });
});
