# Documentation Site Roadmap

## Overview

This roadmap outlines the development plan for the env-sentinel documentation site, built with Next.js and deployed to GitHub Pages.

## Current State

### ✅ Already Configured
- Next.js 15.3.5 with App Router
- Static export enabled (`output: 'export'`)
- Tailwind CSS for styling
- TypeScript support
- Basic project structure

## Development Phases

### Phase 1: Foundation & Configuration (High Priority)

#### 1.1 Update Next.js Configuration
- [ ] Configure base path for GitHub Pages (`/env-sentinel`)
- [ ] Enable trailing slashes for static export
- [ ] Configure unoptimized images for static export
- [ ] Add GitHub Pages deployment scripts

#### 1.2 Setup ShadCN UI Components
- [ ] Initialize ShadCN in docs project
- [ ] Add core components: Card, Tabs, Table, Badge, Button, Code
- [ ] Configure theme and styling
- [ ] Test components locally

#### 1.3 Create Basic Layout Components
- [ ] Header component with navigation
- [ ] Footer component
- [ ] Code block component with syntax highlighting
- [ ] Navigation sidebar component
- [ ] API documentation components (ApiDoc, TypeDoc)

#### 1.4 Setup GitHub Actions
- [ ] Create deployment workflow
- [ ] Configure automatic builds on push
- [ ] Test static export locally

### Phase 2: CLI-First Content (High Priority)

#### 2.1 Home Page
- [ ] Project overview and value proposition
- [ ] Quick start section with basic commands
- [ ] Feature highlights
- [ ] Installation instructions

#### 2.2 CLI Reference (Primary Content)
- [ ] **Main CLI page** with command overview
- [ ] **Lint command** documentation
  - [ ] Usage examples
  - [ ] Available options
  - [ ] Output format
  - [ ] Error handling
- [ ] **Validate command** documentation
  - [ ] Usage examples
  - [ ] Schema file format
  - [ ] Validation rules
  - [ ] Error reporting
- [ ] **Init command** documentation
  - [ ] Schema generation
  - [ ] Force flag usage
  - [ ] Generated schema format

#### 2.3 Getting Started Guide
- [ ] Step-by-step installation
- [ ] First .env file validation
- [ ] Creating your first schema
- [ ] Common workflows

### Phase 3: Advanced Documentation (Medium Priority)

#### 3.1 API Reference (ShadCN-style)
- [ ] **Core Functions**
  - [ ] `lint()` function
    - [ ] Function signature
    - [ ] Parameters documentation
    - [ ] Return type details
    - [ ] Usage examples
    - [ ] Error handling
    - [ ] Related types
  - [ ] `validate()` function
    - [ ] Function signature
    - [ ] Parameters documentation
    - [ ] Return type details
    - [ ] Usage examples
    - [ ] Error handling
    - [ ] Related types
  - [ ] `formatIssues()` utility
    - [ ] Function signature
    - [ ] Parameters documentation
    - [ ] Usage examples
    - [ ] Customization options
- [ ] **Type Definitions**
  - [ ] `Result` type
    - [ ] Type definition
    - [ ] Property descriptions
    - [ ] Usage examples
    - [ ] Related functions
  - [ ] `Issue` type
    - [ ] Type definition
    - [ ] Property descriptions
    - [ ] Severity levels
    - [ ] Usage examples
  - [ ] `Summary` type
    - [ ] Type definition
    - [ ] Property descriptions
    - [ ] Usage examples
- [ ] **Integration Examples**
  - [ ] Programmatic usage patterns
  - [ ] Custom formatters
  - [ ] Error handling strategies
  - [ ] Best practices

#### 3.2 Examples & Use Cases
- [ ] **CI/CD Integration**
  - [ ] GitHub Actions examples
  - [ ] GitLab CI examples
  - [ ] Jenkins examples
- [ ] **IDE Integration**
  - [ ] VS Code extension usage
  - [ ] Pre-commit hooks
  - [ ] Editor plugins
- [ ] **Real-world scenarios**
  - [ ] Multi-environment setups
  - [ ] Team collaboration
  - [ ] Production deployment

### Phase 4: Enhanced Features (Low Priority)

#### 4.1 User Experience
- [ ] **Search functionality** (client-side)
- [ ] **Dark mode** toggle
- [ ] **Version selector** (when releases are available)
- [ ] **Interactive examples** with live demos

#### 4.2 Content Enhancement
- [ ] **Troubleshooting guide**
- [ ] **FAQ section**
- [ ] **Migration guides** (for future versions)
- [ ] **Contributing guide**

## Technical Implementation

### File Structure
```
docs/src/app/
├── page.tsx (Home/Landing)
├── cli/
│   ├── page.tsx (CLI Reference)
│   ├── lint/
│   │   └── page.tsx
│   ├── validate/
│   │   └── page.tsx
│   └── init/
│       └── page.tsx
├── api/
│   ├── page.tsx (API Overview)
│   ├── functions/
│   │   ├── lint/
│   │   │   └── page.tsx
│   │   ├── validate/
│   │   │   └── page.tsx
│   │   └── format-issues/
│   │       └── page.tsx
│   └── types/
│       ├── result/
│       │   └── page.tsx
│       ├── issue/
│       │   └── page.tsx
│       └── summary/
│           └── page.tsx
├── examples/
│   └── page.tsx (Use Cases)
└── components/
    ├── Header.tsx
    ├── Footer.tsx
    ├── CodeBlock.tsx
    ├── Navigation.tsx
    ├── ApiDoc.tsx (ShadCN-style API component)
    ├── TypeDoc.tsx (ShadCN-style type component)
    └── ui/ (ShadCN components)
        ├── card.tsx
        ├── tabs.tsx
        ├── table.tsx
        ├── badge.tsx
        ├── button.tsx
        └── code.tsx
```

### Configuration Updates
```typescript
// next.config.ts
const nextConfig: NextConfig = {
    output: 'export',
    basePath: process.env.NODE_ENV === 'production' ? '/env-sentinel' : '',
    trailingSlash: true,
    images: { unoptimized: true }
};
```

### GitHub Actions Workflow
```yaml
# .github/workflows/docs.yml
name: Deploy Documentation
on:
  push:
    branches: [main]
    paths: ['docs/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: cd docs && npm ci && npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs/out
```

## Success Criteria

### ✅ Phase 1 Complete When:
- [ ] ShadCN UI components are installed and configured
- [ ] Static export works correctly
- [ ] GitHub Pages deployment is automated
- [ ] Basic layout components are functional
- [ ] Local development environment works

### ✅ Phase 2 Complete When:
- [ ] CLI documentation is comprehensive
- [ ] All commands are documented with examples
- [ ] Getting started guide is clear and actionable
- [ ] Home page effectively communicates value

### ✅ Phase 3 Complete When:
- [ ] API reference is complete and accurate
- [ ] Integration examples are practical
- [ ] Type definitions are documented
- [ ] Real-world use cases are covered

### ✅ Phase 4 Complete When:
- [ ] Search functionality works
- [ ] Dark mode is implemented
- [ ] Interactive features are functional
- [ ] Content is comprehensive and user-friendly

## Timeline

- **Phase 1**: 1-2 days
- **Phase 2**: 3-5 days
- **Phase 3**: 2-3 days
- **Phase 4**: 1-2 weeks

**Total Estimated Time**: 1-2 weeks

## ShadCN-Style API Documentation Structure

### Function Documentation Template
```typescript
// Function signature with syntax highlighting
function lint(envContent: string): Result

// Parameters table
| Parameter | Type | Description |
|-----------|------|-------------|
| envContent | string | Raw .env file content |

// Return type
Returns: `Result`

// Usage examples
```typescript
import { lint } from 'env-sentinel';

const result = lint(envContent);
console.log(result.isValid);
```

// Error handling section
// Related types section
```

### Type Documentation Template
```typescript
// Type definition
type Result = {
  isValid: boolean;
  issues: Issue[];
  summary: Summary;
}

// Properties table
| Property | Type | Description |
|----------|------|-------------|
| isValid | boolean | Whether the validation passed |
| issues | Issue[] | Array of validation issues |
| summary | Summary | Summary statistics |

// Usage examples
// Related functions
```

## Notes

- All content should prioritize CLI usage as the primary interface
- Library API documentation should be secondary but comprehensive
- Examples should focus on real-world integration scenarios
- Documentation should be versioned alongside the library
- Regular updates should reflect new features and improvements
- API documentation follows ShadCN-style structure with clear function signatures, parameter tables, and usage examples
- ShadCN UI components provide consistent, professional styling and faster development
