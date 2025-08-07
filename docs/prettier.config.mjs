/** @type {import('prettier').Config} */
const config = {
    plugins: ['prettier-plugin-tailwindcss'],
    // tailwindcss
    tailwindAttributes: ['theme'],
    tailwindFunctions: ['twMerge', 'createTheme'],
    singleQuote: true,
    trailingComma: 'all',
    arrowParens: 'always',
    tabWidth: 4,
    printWidth: 120,
    overrides: [
        {
            files: '*.yml',
            options: {
                tabWidth: 2,
            },
        },
        {
            files: '*.yaml',
            options: {
                tabWidth: 2,
            },
        },
    ],
};

export default config;
