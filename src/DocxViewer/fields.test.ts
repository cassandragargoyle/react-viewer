/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Unit tests for marking PAGE / NUMPAGES field results in a docx-preview element tree

import { describe, expect, it } from 'vitest';
import { NUMPAGES_FIELD_CLASS, PAGE_FIELD_CLASS, markPageFields } from './fields';

const text = (value: string) => ({ type: 'run', children: [{ type: 'text', text: value }] });
const fieldChar = (charType: string) => ({ type: 'run', fieldRun: true, children: [{ type: 'complexField', charType }] });
const instr = (value: string) => ({ type: 'run', fieldRun: true, children: [{ type: 'instruction', text: value }] });

interface Node {
    type: string;
    className?: string;
    children?: Node[];
    [key: string]: unknown;
}

// "Page <PAGE> of <NUMPAGES>" as Word writes it in a footer paragraph
function footer(): Node {
    return {
        type: 'footer',
        children: [
            {
                type: 'paragraph',
                children: [
                    text('Page '),
                    fieldChar('begin'), instr(' PAGE '), fieldChar('separate'), text('1'), fieldChar('end'),
                    text(' of '),
                    fieldChar('begin'), instr(' NUMPAGES \\* MERGEFORMAT '), fieldChar('separate'), text('1'), fieldChar('end'),
                ],
            },
        ],
    } as Node;
}

describe('markPageFields', () => {
    it('marks the cached results of PAGE and NUMPAGES', () => {
        const root = footer();
        expect(markPageFields({ parts: [{ rootElement: root }] })).toBe(2);
        const runs = root.children![0].children!;
        expect(runs[4].className).toBe(PAGE_FIELD_CLASS);
        expect(runs[10].className).toBe(NUMPAGES_FIELD_CLASS);
        expect(runs[0].className).toBeUndefined();
        expect(runs[6].className).toBeUndefined();
    });

    it('keeps an existing class of the result run', () => {
        const root = footer();
        root.children![0].children![4].className = 'bold';
        markPageFields({ parts: [{ rootElement: root }] });
        expect(root.children![0].children![4].className).toBe(`bold ${PAGE_FIELD_CLASS}`);
    });

    it('leaves other fields alone', () => {
        const root = {
            type: 'paragraph',
            children: [fieldChar('begin'), instr(' DATE '), fieldChar('separate'), text('21.10.2026'), fieldChar('end')],
        };
        expect(markPageFields({ parts: [{ rootElement: root }] })).toBe(0);
    });

    it('marks nothing in a tree it does not understand', () => {
        expect(markPageFields(null)).toBe(0);
        expect(markPageFields({})).toBe(0);
        expect(markPageFields({ parts: [{}] })).toBe(0);
    });
});
