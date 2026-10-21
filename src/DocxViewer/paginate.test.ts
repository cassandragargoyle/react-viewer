/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Unit tests for the DocxViewer pagination, with block heights given as data-h attributes
// jsdom has no layout, so a fake measure stacks the blocks the way a browser would

import { describe, expect, it } from 'vitest';
import { NUMPAGES_FIELD_CLASS, PAGE_FIELD_CLASS } from './fields';
import { paginate, splitPage, type PageMeasure } from './paginate';

function height(el: Element): number {
    if (el.tagName === 'TABLE') {
        return Array.from(el.querySelectorAll('tr')).reduce((sum, tr) => sum + height(tr), 0);
    }
    return Number(el.getAttribute('data-h') ?? 0);
}

function stackedBottom(el: Element): number {
    let bottom = height(el);
    for (let prev = el.previousElementSibling; prev; prev = prev.previousElementSibling) bottom += height(prev);
    return bottom;
}

const fakeMeasure: PageMeasure = {
    innerHeight: (page) => Number(page.getAttribute('data-inner')),
    flowHeight: (el) => height(el),
    bottomWithin(el) {
        if (el.tagName !== 'TR') return stackedBottom(el);
        const table = el.closest('table') as Element;
        const rows: Element[] = Array.from(table.querySelectorAll('tr'));
        const rowsBottom = rows.slice(0, rows.indexOf(el) + 1).reduce((sum, tr) => sum + height(tr), 0);
        return stackedBottom(table) - height(table) + rowsBottom;
    },
};

function page(inner: number, articleHtml: string, footerHtml = ''): HTMLElement {
    const section = document.createElement('section');
    section.className = 'docx';
    section.setAttribute('data-inner', String(inner));
    section.innerHTML = `<header data-h="10">Head</header><article>${articleHtml}</article><footer data-h="10">${footerHtml}</footer>`;
    const wrapper = document.createElement('div');
    wrapper.className = 'docx-wrapper';
    wrapper.appendChild(section);
    document.body.replaceChildren(wrapper);
    return section;
}

const blocks = (count: number, h: number) =>
    Array.from({ length: count }, (_, i) => `<p data-h="${h}">P${i + 1}</p>`).join('');

const texts = (section: HTMLElement) =>
    Array.from(section.querySelectorAll('article > *'), (el) => el.textContent);

describe('splitPage', () => {
    it('keeps a page whose content fits', () => {
        const section = page(120, blocks(5, 20));
        expect(splitPage(section, fakeMeasure)).toHaveLength(1);
    });

    it('keeps a page that overflows by less than the tolerance', () => {
        // 100 available (120 - header - footer), 105 of content
        const section = page(120, blocks(3, 35));
        expect(splitPage(section, fakeMeasure)).toHaveLength(1);
    });

    it('splits a long page between blocks and repeats header and footer', () => {
        const section = page(120, blocks(12, 20));
        const pages = splitPage(section, fakeMeasure);
        expect(pages).toHaveLength(3);
        expect(pages.map(texts)).toEqual([
            ['P1', 'P2', 'P3', 'P4', 'P5'],
            ['P6', 'P7', 'P8', 'P9', 'P10'],
            ['P11', 'P12'],
        ]);
        for (const p of pages) {
            expect(p.querySelector('header')?.textContent).toBe('Head');
            expect(p.querySelector('footer')).not.toBeNull();
            expect(p.className).toBe('docx');
        }
    });

    it('splits a table between rows and keeps the column widths', () => {
        const rows = Array.from({ length: 8 }, (_, i) => `<tr data-h="20"><td>R${i + 1}</td></tr>`).join('');
        const section = page(120, `<p data-h="40">Intro</p><table><colgroup><col></colgroup><tbody>${rows}</tbody></table>`);
        const pages = splitPage(section, fakeMeasure);
        expect(pages).toHaveLength(2);
        expect(Array.from(pages[0].querySelectorAll('td'), (td) => td.textContent)).toEqual(['R1', 'R2', 'R3']);
        expect(Array.from(pages[1].querySelectorAll('td'), (td) => td.textContent)).toEqual(['R4', 'R5', 'R6', 'R7', 'R8']);
        expect(pages[1].querySelector('table > colgroup > col')).not.toBeNull();
        expect(pages[1].querySelector('table > tbody > tr')).not.toBeNull();
    });

    it('leaves a block taller than a page on its own and moves on', () => {
        const section = page(120, '<p data-h="300">Huge</p><p data-h="20">After</p>');
        const pages = splitPage(section, fakeMeasure);
        expect(pages.map(texts)).toEqual([['Huge'], ['After']]);
    });

    it('does not split column sections', () => {
        const section = page(120, blocks(12, 20));
        section.querySelector('article')!.style.columnCount = '2';
        expect(splitPage(section, fakeMeasure)).toHaveLength(1);
    });

    it('does nothing without a page size', () => {
        const section = page(0, blocks(12, 20));
        expect(splitPage(section, fakeMeasure)).toHaveLength(1);
    });
});

describe('paginate', () => {
    it('numbers the PAGE and NUMPAGES fields on every page', () => {
        const footer = `Page <span class="${PAGE_FIELD_CLASS}">1</span> of <span class="${NUMPAGES_FIELD_CLASS}">1</span>`;
        const section = page(120, blocks(12, 20), footer);
        const root = section.parentElement as HTMLElement;
        expect(paginate(root, fakeMeasure)).toBe(3);
        expect(Array.from(root.querySelectorAll('footer'), (f) => f.textContent)).toEqual([
            'Page 1 of 3',
            'Page 2 of 3',
            'Page 3 of 3',
        ]);
    });
});
