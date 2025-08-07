export function isEmptyOrCommentLine(lineContent: string): boolean {
    const trimmed = lineContent.trim();
    return trimmed === '' || trimmed.startsWith('#');
}

export function parseDisabledRules(lines: string[]): Map<number, Set<string>> {
    const disabledRules = new Map<number, Set<string>>();

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(/#\s*es-disable:\s*(.+)/i);

        if (!match) continue;

        const rules = match[1]
            .split(',')
            .map((r) => r.trim())
            .filter(Boolean);

        if (rules.length === 0) {
            continue;
        }

        // Find the next non-comment, non-empty line
        for (let j = i + 1; j < lines.length; j++) {
            const nextLine = lines[j].trim();
            if (isEmptyOrCommentLine(nextLine)) {
                continue;
            }

            const targetLine = j + 1;
            const set = disabledRules.get(targetLine) ?? new Set();
            rules.forEach((rule) => set.add(rule));
            disabledRules.set(targetLine, set);
            break; // attach once to the next valid line only
        }
    }

    return disabledRules;
}
