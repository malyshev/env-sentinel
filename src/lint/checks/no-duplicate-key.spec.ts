import { __resetSeenKeysForTests, noDuplicateKeyCheck } from './no-duplicate-key.check.js';

describe('noDuplicateKeyCheck', () => {
    beforeEach(() => __resetSeenKeysForTests());
    it('should detect a duplicate key', () => {
        const line1 = 'KEY=value';
        const line2 = 'KEY=value2';

        // First check (should be no issue)
        expect(noDuplicateKeyCheck(1, line1)).toBeUndefined();

        // Second check (should detect duplicate)
        expect(noDuplicateKeyCheck(2, line2)).toEqual({
            line: 2,
            issue: 'Duplicate variable name "KEY" (already defined on line 1)',
            content: line2,
            severity: 'error',
        });
    });

    it('should not detect duplicates for different keys', () => {
        const line1 = 'KEY1=value';
        const line2 = 'KEY2=value2';

        expect(noDuplicateKeyCheck(1, line1)).toBeUndefined();
        expect(noDuplicateKeyCheck(2, line2)).toBeUndefined();
    });

    it('should not detect duplicates if no key is provided', () => {
        const line1 = 'KEY=value';
        const line2 = 'KEY2=value2';

        // First check (should be no issue)
        expect(noDuplicateKeyCheck(1, line1)).toBeUndefined();

        // Second check (no duplicate)
        expect(noDuplicateKeyCheck(2, line2)).toBeUndefined();
    });
});
