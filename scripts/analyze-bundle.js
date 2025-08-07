#!/usr/bin/env node

import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeBundle() {
    console.log('Bundle Size Analysis\n');

    const files = [
        { path: 'dist/index.js', name: 'Main Library' },
        { path: 'bin/cli.js', name: 'CLI Binary' },
        { path: 'dist/index.d.ts', name: 'Type Definitions' }
    ];

    let totalSize = 0;

    files.forEach(file => {
        try {
            const fullPath = resolve(file.path);
            const stats = statSync(fullPath);
            const size = stats.size;
            totalSize += size;
            
            console.log(`${file.name}:`);
            console.log(`  Size: ${formatBytes(size)}`);
            console.log(`  Path: ${file.path}\n`);
        } catch (error) {
            console.log(`${file.name}: Not found (${file.path})\n`);
        }
    });

    console.log('📊 Summary:');
    console.log(`Total bundle size: ${formatBytes(totalSize)}`);

    // Performance recommendations based on bundle size
    if (totalSize > 1024 * 1024) { // > 1MB
        console.log('Bundle size is large. Consider optimization.');
    } else if (totalSize > 512 * 1024) { // > 512KB
        console.log('Bundle size is acceptable.');
    } else {
        console.log('Excellent bundle size!');
    }

    // Check for common optimization opportunities
    console.log('\nOptimization Opportunities:');
    
    try {
        const mainBundle = readFileSync('dist/index.js', 'utf-8');
        
        // Check for unused imports (basic check)
        const importLines = mainBundle.match(/import.*from/g) || [];
        console.log(`  Import statements: ${importLines.length}`);
        
        // Check for large dependencies
        const dependencyMatches = mainBundle.match(/node_modules/g) || [];
        console.log(`  External dependencies: ${dependencyMatches.length}`);
        
        if (dependencyMatches.length > 10) {
            console.log('  Consider tree-shaking or reducing dependencies');
        }
        
    } catch (error) {
        console.log('  Could not analyze main bundle');
    }
}

analyzeBundle();
