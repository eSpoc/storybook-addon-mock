import js from '@eslint/js';
import globals from 'globals';
import * as babelParser from '@babel/eslint-parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import tseslint from 'typescript-eslint';

export default [
    // Global ignores
    {
        ignores: [
            '**/node_modules/**',
            '**/dist/**',
            '**/build/**',
            '**/coverage/**',
            '**/.storybook-out/**',
            '**/storybook-static/**',
            '**/scripts/prepublish-checks.js',
        ],
    },

    // Base recommended config
    js.configs.recommended,

    // Global configuration for all JavaScript/JSX files
    {
        files: ['**/*.{js,jsx,mjs,cjs}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: babelParser.default || babelParser,
            parserOptions: {
                babelOptions: {
                    parserOpts: {
                        plugins: ['jsx'],
                    },
                },
                requireConfigFile: false,
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
            import: importPlugin,
            'jsx-a11y': jsxA11yPlugin,
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

    // TypeScript files configuration
    ...tseslint.configs.recommended.map((config) => ({
        ...config,
        files: ['**/*.{ts,tsx}'],
    })),

    {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            parser: tseslint.parser,
            parserOptions: {
                babelOptions: {
                    parserOpts: {
                        plugins: ['jsx'],
                    },
                },
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
        plugins: {
            '@typescript-eslint': tseslint.plugin,
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
                { extensions: ['.ts', '.tsx'] },
            ],
            'react/no-array-index-key': 0,

            // TypeScript specific rules
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/explicit-module-boundary-types': 'off',

            // Prettier integration
            ...prettierConfig.rules,
            'prettier/prettier': 'error',
        },
    },
];
