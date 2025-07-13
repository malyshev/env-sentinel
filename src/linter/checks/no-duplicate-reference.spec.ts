import type { LintResult } from '../../types.js';
import { noDuplicateReferenceCheck } from './no-duplicate-reference.check.js';

describe('noDuplicateReferenceCheck', () => {
    it('should allow a single reference', () => {
        expect(noDuplicateReferenceCheck(1, 'REF_OK=${BASE_DIR}/conf')).toBeUndefined();
        expect(noDuplicateReferenceCheck(2, 'CONFIG_PATH=${CONFIG}/subdir')).toBeUndefined();
    });

    it('should detect duplicated references (back-to-back)', () => {
        const result = noDuplicateReferenceCheck(3, 'REF_BAD_1=${BASE_DIR}${BASE_DIR}') as LintResult;
        expect(result).toEqual({
            line: 3,
            issue: 'Duplicate reference "${BASE_DIR}" found 2 times in "REF_BAD_1"',
            content: 'REF_BAD_1=${BASE_DIR}${BASE_DIR}',
            severity: 'notice',
        });
    });

    it('should detect duplicated references (with separator)', () => {
        const result = noDuplicateReferenceCheck(4, 'REF_BAD_2=${BASE_DIR}/${BASE_DIR}') as LintResult;
        expect(result).toEqual({
            line: 4,
            issue: 'Duplicate reference "${BASE_DIR}" found 2 times in "REF_BAD_2"',
            content: 'REF_BAD_2=${BASE_DIR}/${BASE_DIR}',
            severity: 'notice',
        });
    });

    it('should detect more than two duplicates', () => {
        const result = noDuplicateReferenceCheck(5, 'TRIPLE=${A}${A}${A}') as LintResult;
        expect(result).toEqual({
            line: 5,
            issue: 'Duplicate reference "${A}" found 3 times in "TRIPLE"',
            content: 'TRIPLE=${A}${A}${A}',
            severity: 'notice',
        });
    });

    it('should ignore quoted values', () => {
        expect(noDuplicateReferenceCheck(6, 'SAFE_REF="${BASE_DIR}${BASE_DIR}"')).toBeUndefined();
        expect(noDuplicateReferenceCheck(7, "SAFE_REF='${X}${X}'")).toBeUndefined();
    });

    it('should skip lines without equal sign', () => {
        expect(noDuplicateReferenceCheck(8, 'INVALID_LINE')).toBeUndefined();
    });

    it('should strip inline comments and still detect duplicates', () => {
        const result = noDuplicateReferenceCheck(9, 'PATH=${X}/${X} # duplicated') as LintResult;
        expect(result).toEqual({
            line: 9,
            issue: 'Duplicate reference "${X}" found 2 times in "PATH"',
            content: 'PATH=${X}/${X} # duplicated',
            severity: 'notice',
        });
    });

    it('should not warn for different variables', () => {
        expect(noDuplicateReferenceCheck(10, 'COMPOSITE=${A}${B}${C}')).toBeUndefined();
    });
});
