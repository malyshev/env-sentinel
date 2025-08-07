export const log = {
    error: (msg: string): void => console.error(`\x1b[31m${msg}\x1b[0m`),
    warn: (msg: string): void => console.warn(`\x1b[33m${msg}\x1b[0m`),
    notice: (msg: string): void => console.info(`\x1b[36m${msg}\x1b[0m`),
    success: (msg: string): void => console.log(`\x1b[32m${msg}\x1b[0m`),
};
