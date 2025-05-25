#!/usr/bin/env node --no-warnings

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const { run } = await import(join(__dirname, '..', 'dist', 'index.js'));

run();
