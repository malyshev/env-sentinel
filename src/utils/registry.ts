export class Registry<T> {
    private core: Map<string, T>;
    private custom: Map<string, T>;

    constructor(coreEntries: [string, T][]) {
        this.core = new Map(coreEntries);
        this.custom = new Map();
    }

    register(name: string, item: T) {
        this.custom.set(name, item);
    }

    get(name: string): T | undefined {
        return this.custom.get(name) || this.core.get(name);
    }

    getAll(): T[] {
        return [...this.core.values(), ...this.custom.values()];
    }
}
