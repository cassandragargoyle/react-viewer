/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Guards the package entry point against a viewer going missing from the barrel
// These names are the contract portunix-vscode's pilot-ui re-exports depend on

import { describe, expect, it } from 'vitest';

import * as api from './index';

const EXPECTED = ['DocxViewer', 'EmailViewer', 'formatEmailDate'] as const;

describe('package entry point', () => {
    it.each(EXPECTED)('exports %s', (name) => {
        expect(api[name]).toBeTypeOf('function');
    });

    it('exports nothing beyond the declared surface', () => {
        expect(Object.keys(api).sort()).toEqual([...EXPECTED].sort());
    });
});
