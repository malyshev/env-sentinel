import { lint } from '../lint/index.js';
import { readEnvFile, handleResult } from '../utils/handler-utils.js';

export function handleLint(envFilePath: string): void {
    const rawEnvContent = readEnvFile(envFilePath);
    const result = lint(rawEnvContent);
    
    handleResult(result, envFilePath, 'lint');
}
