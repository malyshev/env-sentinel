import { log } from './log.js';
import { Issue, Result } from '../types.js';
import { ErrorFormatter } from './error-formatter.js';

export function formatIssues(issues: Issue[], filePath: string): void {
    issues.forEach((issue) => {
        const formattedMessage = ErrorFormatter.formatIssue(issue, { filePath, lineNumber: issue.line });

        switch (issue.severity || 'error') {
            case 'notice':
                log.notice(formattedMessage);
                break;
            case 'warning':
                log.warn(formattedMessage);
                break;
            case 'error':
            default:
                log.error(formattedMessage);
                break;
        }
    });
}

export function printResult(result: Result, filePath: string): void {
    formatIssues(result.issues, filePath);
}
