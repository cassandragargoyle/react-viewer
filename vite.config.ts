/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Library build for the @cassandragargoyle/react-viewer package (portunix-vscode ADR-012 and issue 132)
// Emits ESM JS plus a per-file .d.ts tree from the single src/index.ts entry

import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

import { cssAsString } from './vite.css-as-string.ts';

const root = dirname(fileURLToPath(import.meta.url));

// Any bare specifier (react and every optional peer a component may pull in) is a
// dependency the consumer installs — keep it external. Only this package's own
// source, reached by relative import, gets inlined into the bundle
function isExternal(id: string): boolean {
    if (id.startsWith('.') || id.startsWith('\0') || isAbsolute(id)) return false;
    return true;
}

export default defineConfig({
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: true,
        cssCodeSplit: false,
        lib: {
            entry: { index: resolve(root, 'src/index.ts') },
            formats: ['es'],
        },
        rollupOptions: {
            external: isExternal,
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: 'chunks/[name]-[hash].js',
                assetFileNames: '[name][extname]',
            },
        },
    },
    plugins: [
        cssAsString(),
        dts({
            // Per-file .d.ts tree rather than an api-extractor rollup: a rollup cannot
            // resolve optional peers that ship no bundled types. entryRoot keeps the
            // emitted tree flat, so ./dist/index.d.ts matches package.json "types"
            rollupTypes: false,
            entryRoot: 'src',
            tsconfigPath: resolve(root, 'tsconfig.build.json'),
        }),
    ],
});
