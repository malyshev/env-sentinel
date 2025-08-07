import { Issue } from '../types.js';

export interface ErrorContext {
    filePath?: string;
    lineNumber?: number;
    key?: string;
    value?: string;
    expectedValue?: string;
    actualValue?: string;
}

export class ErrorFormatter {
    /**
     * Formats an issue into a standardized error message
     */
    static formatIssue(issue: Issue, context: ErrorContext = {}): string {
        const parts: string[] = [];

        // File path and line number
        if (context.filePath) {
            const lineNumber = context.lineNumber || issue.line;
            const lineInfo = lineNumber ? `:${lineNumber}` : '';
            parts.push(`${context.filePath}${lineInfo}`);
        }

        // Severity and rule
        const severity = issue.severity || 'error';
        const rule = issue.rule || 'unknown';
        parts.push(`[${severity}] ${rule}`);

        // Message with context
        const message = this.formatMessage(issue, context);
        parts.push(`→ ${message}`);

        return parts.join(' ');
    }

    /**
     * Formats the message part with additional context
     */
    private static formatMessage(issue: Issue, context: ErrorContext): string {
        let message = issue.message;

        // Add key context for validation errors
        if (issue.key && !message.includes(issue.key)) {
            message = `${issue.key}: ${message}`;
        }

        // Add value context when available
        if (context.actualValue && context.expectedValue) {
            message += ` (expected: ${context.expectedValue}, got: ${context.actualValue})`;
        } else if (context.actualValue) {
            message += ` (got: ${context.actualValue})`;
        } else if (issue.value) {
            message += ` (value: ${issue.value})`;
        }

        return message;
    }

    /**
     * Formats multiple issues with consistent spacing
     */
    static formatIssues(issues: Issue[], context: ErrorContext = {}): string[] {
        return issues.map(issue => this.formatIssue(issue, context));
    }

    /**
     * Creates a summary message for a set of issues
     */
    static formatSummary(issues: Issue[], context: ErrorContext = {}): string {
        const errorCount = issues.filter(i => i.severity === 'error').length;
        const warningCount = issues.filter(i => i.severity === 'warning').length;
        const noticeCount = issues.filter(i => i.severity === 'notice').length;

        const parts: string[] = [];
        if (errorCount > 0) parts.push(`${errorCount} error${errorCount !== 1 ? 's' : ''}`);
        if (warningCount > 0) parts.push(`${warningCount} warning${warningCount !== 1 ? 's' : ''}`);
        if (noticeCount > 0) parts.push(`${noticeCount} notice${noticeCount !== 1 ? 's' : ''}`);

        const summary = parts.join(', ');
        return context.filePath ? `${context.filePath}: ${summary}` : summary;
    }
}
