#!/usr/bin/env node

import { performance } from 'node:perf_hooks';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Test data generation
function generateTestEnv(size) {
    const lines = [];
    for (let i = 0; i < size; i++) {
        lines.push(`TEST_VAR_${i}=value_${i}`);
    }
    return lines.join('\n');
}

function generateTestSchema(size) {
    const lines = [];
    for (let i = 0; i < size; i++) {
        lines.push(`TEST_VAR_${i}=required`);
    }
    return lines.join('\n');
}

// Performance measurement
async function measureCLIPerformance(command, args = []) {
    return new Promise((resolve, reject) => {
        const startTime = performance.now();
        const child = spawn('node', ['bin/cli.js', command, ...args], {
            stdio: 'pipe'
        });

        let stdout = '';
        let stderr = '';

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('close', (code) => {
            const endTime = performance.now();
            const duration = endTime - startTime;
            
            resolve({
                duration,
                exitCode: code,
                stdout,
                stderr
            });
        });

        child.on('error', reject);
    });
}

// Benchmark scenarios
async function runBenchmarks() {
    console.log('Running env-sentinel CLI Performance Benchmarks\n');

    const results = [];

    // Test 1: Small file linting
    console.log('Test 1: Small file linting (10 variables)');
    const smallEnv = generateTestEnv(10);
    writeFileSync('.env-benchmark-small', smallEnv);
    
    const smallLintResult = await measureCLIPerformance('lint', ['--file', '.env-benchmark-small']);
    results.push({
        test: 'Small file linting',
        duration: smallLintResult.duration,
        size: '10 variables'
    });
    console.log(`   Duration: ${smallLintResult.duration.toFixed(2)}ms\n`);

    // Test 2: Medium file linting
    console.log('Test 2: Medium file linting (100 variables)');
    const mediumEnv = generateTestEnv(100);
    writeFileSync('.env-benchmark-medium', mediumEnv);
    
    const mediumLintResult = await measureCLIPerformance('lint', ['--file', '.env-benchmark-medium']);
    results.push({
        test: 'Medium file linting',
        duration: mediumLintResult.duration,
        size: '100 variables'
    });
    console.log(`   Duration: ${mediumLintResult.duration.toFixed(2)}ms\n`);

    // Test 3: Large file linting
    console.log('Test 3: Large file linting (1000 variables)');
    const largeEnv = generateTestEnv(1000);
    writeFileSync('.env-benchmark-large', largeEnv);
    
    const largeLintResult = await measureCLIPerformance('lint', ['--file', '.env-benchmark-large']);
    results.push({
        test: 'Large file linting',
        duration: largeLintResult.duration,
        size: '1000 variables'
    });
    console.log(`   Duration: ${largeLintResult.duration.toFixed(2)}ms\n`);

    // Test 4: Validation with schema
    console.log('Test 4: Validation with schema (50 variables)');
    const validationEnv = generateTestEnv(50);
    const validationSchema = generateTestSchema(50);
    writeFileSync('.env-benchmark-validate', validationEnv);
    writeFileSync('.env-sentinel-benchmark', validationSchema);
    
    const validationResult = await measureCLIPerformance('validate', [
        '--file', '.env-benchmark-validate',
        '--schema', '.env-sentinel-benchmark'
    ]);
    results.push({
        test: 'Validation with schema',
        duration: validationResult.duration,
        size: '50 variables'
    });
    console.log(`   Duration: ${validationResult.duration.toFixed(2)}ms\n`);

    // Test 5: Schema generation
    console.log('Test 5: Schema generation (100 variables)');
    const initEnv = generateTestEnv(100);
    writeFileSync('.env-benchmark-init', initEnv);
    
    const initResult = await measureCLIPerformance('init', [
        '--file', '.env-benchmark-init',
        '--force'
    ]);
    results.push({
        test: 'Schema generation',
        duration: initResult.duration,
        size: '100 variables'
    });
    console.log(`   Duration: ${initResult.duration.toFixed(2)}ms\n`);

    // Cleanup
    const cleanupFiles = [
        '.env-benchmark-small',
        '.env-benchmark-medium', 
        '.env-benchmark-large',
        '.env-benchmark-validate',
        '.env-benchmark-init',
        '.env-sentinel-benchmark'
    ];
    
    cleanupFiles.forEach(file => {
        try {
            require('node:fs').unlinkSync(file);
        } catch (e) {
            // File doesn't exist, ignore
        }
    });

    // Summary
    console.log('Performance Summary:');
    console.log('=======================');
    results.forEach(result => {
        console.log(`${result.test} (${result.size}): ${result.duration.toFixed(2)}ms`);
    });

    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;
    console.log(`\nAverage duration: ${avgDuration.toFixed(2)}ms`);

    // Performance recommendations
    console.log('\nPerformance Recommendations:');
    if (avgDuration > 100) {
        console.log('Consider optimizing for better performance');
    } else if (avgDuration > 50) {
        console.log('Performance is acceptable');
    } else {
        console.log('Excellent performance!');
    }
}

// Run benchmarks
runBenchmarks().catch(console.error);
