import remarkGfm from 'remark-gfm';
import { fileURLToPath } from 'url';

const config = {
    stories: [
        '../stories/**/*.mdx',
        '../stories/**/stories.@(js|jsx|mjs|ts|tsx)',
    ],

    addons: [
        '@storybook/addon-links',
        {
            name: '@storybook/addon-docs',
            options: {
                mdxPluginOptions: {
                    mdxCompileOptions: {
                        remarkPlugins: [remarkGfm],
                    },
                },
            },
        },
        import.meta.resolve('./local-preset.ts'),
    ],

    framework: {
        name: '@storybook/react-vite',
        options: {},
    },

    async viteFinal(config) {
        // Fix for mdx-react-shim.js resolution issue with file:// protocol
        config.plugins = config.plugins || [];
        config.plugins.push({
            name: 'resolve-file-protocol',
            resolveId(source) {
                if (source.startsWith('file://')) {
                    return fileURLToPath(source);
                }
                return null;
            },
        });

        return config;
    },
};
export default config;
