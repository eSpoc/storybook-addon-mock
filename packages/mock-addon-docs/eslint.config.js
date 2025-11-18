import js from '@eslint/js';
import globals from 'globals';
import * as babelParser from '@babel/eslint-parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';

export default [
    // Global ignores
    {
        ignores: [
            'node_modules/**',
            'dist/**',
            'build/**',
            'coverage/**',
            '.storybook-out/**',
            'storybook-static/**',
        ],
    },

    // Base recommended config
    js.configs.recommended,

    // Configuration for all JavaScript/JSX files
    {
        files: ['**/*.{js,jsx,mjs,cjs}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: babelParser.default || babelParser,
            parserOptions: {
                requireConfigFile: false,
                babelOptions: {
                    parserOpts: {
                        plugins: ['jsx'],
                    },
                },
                ecmaFeatures: {
                    jsx: true,
                    modules: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
                ...globals.jest,
            },
        },
        plugins: {
            react: reactPlugin,
            prettier: prettierPlugin,
        },
        settings: {
            react: {
                version: 'detect',
            },
        },
        rules: {
            // React rules
            ...reactPlugin.configs.recommended.rules,
            'react/jsx-filename-extension': [
                1,
                { extensions: ['.js', '.jsx'] },
            ],
            'react/no-array-index-key': 0,

            // Import rules
            'import/no-extraneous-dependencies': 0,

            // Prettier integration
            ...prettierConfig.rules,
            'prettier/prettier': 'error',
        },
    },

    // TypeScript files
    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
                ...globals.jest,
            },
        },
    },
];
