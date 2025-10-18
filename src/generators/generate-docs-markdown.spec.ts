import { generateDocsMarkdown } from './generate-docs-markdown.js';
import { DocsSection } from '../types.js';

describe('generateDocsMarkdown', () => {
    it('should generate markdown for simple section', () => {
        const sections: DocsSection[] = [
            {
                name: 'Database',
                description: 'Database settings',
                variables: [
                    {
                        key: 'DB_HOST',
                        description: 'Database hostname',
                        example: 'localhost',
                        rules: [{ name: 'required', args: [] }],
                        default: undefined
                    }
                ]
            }
        ];

        const result = generateDocsMarkdown(sections);

        expect(result).toContain('# Environment Variables Configuration');
        expect(result).toContain('## Table of Contents');
        expect(result).toContain('- [Database](#database)');
        expect(result).toContain('## Database');
        expect(result).toContain('Database settings');
        expect(result).toContain('| Variable | Description | Type | Required | Default | Constraints |');
        expect(result).toContain('| `DB_HOST` | Database hostname | `string` | Yes | - | - |');
    });

    it('should skip TOC and section header for single General section', () => {
        const sections: DocsSection[] = [
            {
                name: 'General',
                description: undefined,
                variables: [
                    {
                        key: 'DB_HOST',
                        description: undefined,
                        example: undefined,
                        rules: [{ name: 'required', args: [] }],
                        default: undefined
                    }
                ]
            }
        ];

        const result = generateDocsMarkdown(sections);

        expect(result).not.toContain('## Table of Contents');
        expect(result).not.toContain('## General');
        expect(result).toContain('# Environment Variables Configuration');
        expect(result).toContain('| Variable | Type | Required | Default | Constraints |');
    });

    it('should omit Description column when no variables have descriptions', () => {
        const sections: DocsSection[] = [
            {
                name: 'Database',
                description: undefined,
                variables: [
                    {
                        key: 'DB_HOST',
                        description: undefined,
                        example: undefined,
                        rules: [{ name: 'required', args: [] }],
                        default: undefined
                    }
                ]
            }
        ];

        const result = generateDocsMarkdown(sections);

        expect(result).toContain('| Variable | Type | Required | Default | Constraints |');
        expect(result).not.toContain('| Variable | Description | Type');
        expect(result).toContain('| `DB_HOST` | `string` | Yes | - | - |');
    });

    it('should include Description column when at least one variable has description', () => {
        const sections: DocsSection[] = [
            {
                name: 'Database',
                description: undefined,
                variables: [
                    {
                        key: 'DB_HOST',
                        description: 'Database hostname',
                        example: undefined,
                        rules: [{ name: 'required', args: [] }],
                        default: undefined
                    },
                    {
                        key: 'DB_PORT',
                        description: undefined,
                        example: undefined,
                        rules: [{ name: 'number', args: [] }],
                        default: undefined
                    }
                ]
            }
        ];

        const result = generateDocsMarkdown(sections);

        expect(result).toContain('| Variable | Description | Type | Required | Default | Constraints |');
        expect(result).toContain('| `DB_HOST` | Database hostname | `string` |');
        expect(result).toContain('| `DB_PORT` | - | `number` |');
    });

    it('should handle multi-line descriptions with br tags', () => {
        const sections: DocsSection[] = [
            {
                name: 'Security',
                description: undefined,
                variables: [
                    {
                        key: 'JWT_SECRET',
                        description: 'JWT secret key.\nMust be 32 characters.\nKeep secure.',
                        example: undefined,
                        rules: [{ name: 'required', args: [] }],
                        default: undefined
                    }
                ]
            }
        ];

        const result = generateDocsMarkdown(sections);

        expect(result).toContain('JWT secret key.<br>Must be 32 characters.<br>Keep secure.');
    });

    it('should mark secure variables with lock emoji', () => {
        const sections: DocsSection[] = [
            {
                name: 'Security',
                description: undefined,
                variables: [
                    {
                        key: 'API_KEY',
                        description: undefined,
                        example: undefined,
                        rules: [{ name: 'required', args: [] }, { name: 'secure', args: [] }],
                        default: undefined
                    }
                ]
            }
        ];

        const result = generateDocsMarkdown(sections);

        expect(result).toContain('🔒 `API_KEY`');
    });

    it('should display default values', () => {
        const sections: DocsSection[] = [
            {
                name: 'App',
                description: undefined,
                variables: [
                    {
                        key: 'DEBUG',
                        description: undefined,
                        example: undefined,
                        rules: [{ name: 'boolean', args: [] }],
                        default: 'false'
                    }
                ]
            }
        ];

        const result = generateDocsMarkdown(sections);

        expect(result).toContain('| `DEBUG` | `boolean` | No | `false` | - |');
    });

    it('should display constraints from rules', () => {
        const sections: DocsSection[] = [
            {
                name: 'App',
                description: undefined,
                variables: [
                    {
                        key: 'PORT',
                        description: undefined,
                        example: undefined,
                        rules: [
                            { name: 'number', args: [] },
                            { name: 'min', args: ['1'] },
                            { name: 'max', args: ['65535'] }
                        ],
                        default: undefined
                    }
                ]
            }
        ];

        const result = generateDocsMarkdown(sections);

        expect(result).toContain('Min: 1<br>Max: 65535');
    });

    it('should display enum constraints', () => {
        const sections: DocsSection[] = [
            {
                name: 'App',
                description: undefined,
                variables: [
                    {
                        key: 'NODE_ENV',
                        description: undefined,
                        example: undefined,
                        rules: [{ name: 'enum', args: ['dev', 'prod', 'test'] }],
                        default: undefined
                    }
                ]
            }
        ];

        const result = generateDocsMarkdown(sections);

        expect(result).toContain('Allowed: dev, prod, test');
    });

    it('should detect types from rules', () => {
        const sections: DocsSection[] = [
            {
                name: 'App',
                description: undefined,
                variables: [
                    {
                        key: 'COUNT',
                        description: undefined,
                        example: undefined,
                        rules: [{ name: 'number', args: [] }],
                        default: undefined
                    },
                    {
                        key: 'ENABLED',
                        description: undefined,
                        example: undefined,
                        rules: [{ name: 'boolean', args: [] }],
                        default: undefined
                    }
                ]
            }
        ];

        const result = generateDocsMarkdown(sections);

        expect(result).toContain('| `COUNT` | `number` |');
        expect(result).toContain('| `ENABLED` | `boolean` |');
    });

    it('should handle multiple sections', () => {
        const sections: DocsSection[] = [
            {
                name: 'Database',
                description: undefined,
                variables: [
                    {
                        key: 'DB_HOST',
                        description: undefined,
                        example: undefined,
                        rules: [{ name: 'required', args: [] }],
                        default: undefined
                    }
                ]
            },
            {
                name: 'Cache',
                description: undefined,
                variables: [
                    {
                        key: 'CACHE_DRIVER',
                        description: undefined,
                        example: undefined,
                        rules: [{ name: 'required', args: [] }],
                        default: undefined
                    }
                ]
            }
        ];

        const result = generateDocsMarkdown(sections);

        expect(result).toContain('## Table of Contents');
        expect(result).toContain('- [Database](#database)');
        expect(result).toContain('- [Cache](#cache)');
        expect(result).toContain('## Database');
        expect(result).toContain('## Cache');
    });

    it('should handle empty sections array', () => {
        const result = generateDocsMarkdown([]);

        expect(result).toContain('# Environment Variables Configuration');
        expect(result).toContain('No documented variables found.');
    });

    it('should handle section with no variables', () => {
        const sections: DocsSection[] = [
            {
                name: 'Empty',
                description: 'Empty section',
                variables: []
            }
        ];

        const result = generateDocsMarkdown(sections);

        expect(result).toContain('## Empty');
        expect(result).toContain('Empty section');
        expect(result).toContain('*No variables in this section.*');
    });

    it('should handle multi-line section description', () => {
        const sections: DocsSection[] = [
            {
                name: 'Database',
                description: 'Line 1\nLine 2\nLine 3',
                variables: [
                    {
                        key: 'DB_HOST',
                        description: undefined,
                        example: undefined,
                        rules: [{ name: 'required', args: [] }],
                        default: undefined
                    }
                ]
            }
        ];

        const result = generateDocsMarkdown(sections);

        expect(result).toContain('Line 1\nLine 2\nLine 3');
    });
});

