import { Registry } from './registry.js';

describe('Registry', () => {
    // Mock function type for testing
    type TestFunction = (input: string) => string;

    let registry: Registry<TestFunction>;

    const mockCoreFunction1: TestFunction = (input: string) => `core1: ${input}`;
    const mockCoreFunction2: TestFunction = (input: string) => `core2: ${input}`;
    const mockCustomFunction: TestFunction = (input: string) => `custom: ${input}`;

    const coreEntries: [string, TestFunction][] = [
        ['core1', mockCoreFunction1],
        ['core2', mockCoreFunction2],
    ];

    beforeEach(() => {
        registry = new Registry<TestFunction>(coreEntries);
    });

    describe('constructor', () => {
        it('should initialize with core entries', () => {
            expect(registry.get('core1')).toBe(mockCoreFunction1);
            expect(registry.get('core2')).toBe(mockCoreFunction2);
        });

        it('should return undefined for non-existent entries', () => {
            expect(registry.get('nonexistent')).toBeUndefined();
        });
    });

    describe('register', () => {
        it('should register custom entries', () => {
            registry.register('custom', mockCustomFunction);
            expect(registry.get('custom')).toBe(mockCustomFunction);
        });

        it('should allow overriding core entries with custom ones', () => {
            registry.register('core1', mockCustomFunction);
            expect(registry.get('core1')).toBe(mockCustomFunction);
        });

        it('should allow multiple custom registrations', () => {
            const custom1: TestFunction = (input: string) => `custom1: ${input}`;
            const custom2: TestFunction = (input: string) => `custom2: ${input}`;

            registry.register('custom1', custom1);
            registry.register('custom2', custom2);

            expect(registry.get('custom1')).toBe(custom1);
            expect(registry.get('custom2')).toBe(custom2);
        });
    });

    describe('get', () => {
        it('should return core entries', () => {
            expect(registry.get('core1')).toBe(mockCoreFunction1);
            expect(registry.get('core2')).toBe(mockCoreFunction2);
        });

        it('should return custom entries', () => {
            registry.register('custom', mockCustomFunction);
            expect(registry.get('custom')).toBe(mockCustomFunction);
        });

        it('should prioritize custom entries over core entries', () => {
            registry.register('core1', mockCustomFunction);
            expect(registry.get('core1')).toBe(mockCustomFunction);
        });

        it('should return undefined for non-existent entries', () => {
            expect(registry.get('nonexistent')).toBeUndefined();
        });
    });

    describe('getAll', () => {
        it('should return all core entries when no custom entries', () => {
            const all = registry.getAll();
            expect(all).toHaveLength(2);
            expect(all).toContain(mockCoreFunction1);
            expect(all).toContain(mockCoreFunction2);
        });

        it('should return core and custom entries', () => {
            registry.register('custom', mockCustomFunction);
            const all = registry.getAll();
            expect(all).toHaveLength(3);
            expect(all).toContain(mockCoreFunction1);
            expect(all).toContain(mockCoreFunction2);
            expect(all).toContain(mockCustomFunction);
        });

        it('should return custom entries first, then core entries', () => {
            registry.register('custom', mockCustomFunction);
            const all = registry.getAll();
            
            // Core entries should come first, then custom entries
            expect(all.slice(0, 2)).toContain(mockCoreFunction1);
            expect(all.slice(0, 2)).toContain(mockCoreFunction2);
            expect(all[2]).toBe(mockCustomFunction);
        });
    });

    describe('edge cases', () => {
        it('should handle empty core entries', () => {
            const emptyRegistry = new Registry<TestFunction>([]);
            expect(emptyRegistry.getAll()).toHaveLength(0);
            expect(emptyRegistry.get('any')).toBeUndefined();
        });

        it('should handle registering the same name multiple times', () => {
            const custom1: TestFunction = (input: string) => `custom1: ${input}`;
            const custom2: TestFunction = (input: string) => `custom2: ${input}`;

            registry.register('custom', custom1);
            registry.register('custom', custom2);

            expect(registry.get('custom')).toBe(custom2);
            expect(registry.getAll()).toContain(custom2);
            expect(registry.getAll()).not.toContain(custom1);
        });
    });
});
