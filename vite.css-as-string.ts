/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// The Vite plugin that makes a component's `import styles from './x.css'` the CSS text
// Used by the library build, so a viewer injects its stylesheet itself

import type { Plugin } from 'vite';

// Components import their stylesheet as a default string and inject it at runtime
// (`import styles from './x.css'; styleEl.textContent = styles`). Redirect bare
// `.css` imports to Vite's `?inline` so the default export is the CSS text and no
// separate stylesheet asset is emitted — the library stays self-contained
export function cssAsString(): Plugin {
    return {
        name: 'react-viewer-css-as-string',
        enforce: 'pre',
        async resolveId(source, importer, options) {
            if (source.endsWith('.css')) {
                const resolved = await this.resolve(source, importer, {
                    ...options,
                    skipSelf: true,
                });
                if (resolved) return `${resolved.id}?inline`;
            }
            return null;
        },
    };
}
