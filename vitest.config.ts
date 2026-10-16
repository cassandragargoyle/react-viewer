/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Vitest config for the react-viewer library (portunix-vscode ADR-012 and issue 132)
// jsdom environment plus a plugin that stubs `*.css` imports to an empty string

import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [
        {
            // Components import their stylesheet as a string (`import s from './x.css'`)
            // and inject it at runtime; under test we resolve every .css to '' so the
            // injection guard (`typeof s === 'string' && s`) is a graceful no-op
            name: 'stub-css',
            enforce: 'pre',
            resolveId(id: string) {
                if (id.endsWith('.css')) return `\0stub-css:${id}`;
                return null;
            },
            load(id: string) {
                if (id.startsWith('\0stub-css:')) return 'export default "";';
                return null;
            },
        },
    ],
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./vitest.setup.ts'],
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
});
