/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Splits rendered docx-preview pages that are taller than their page size into pages
// docx-preview breaks only where the file records a break; this lays out the rest

import { NUMPAGES_FIELD_CLASS, PAGE_FIELD_CLASS } from './fields';

/**
 * A page is split only when its content is this much taller than the page. A document
 * saved by Word records its page breaks, and its pages may come out slightly taller here
 * because fonts measure differently; splitting those would add pages with a single line
 */
export const OVERFLOW_TOLERANCE = 0.1;

/** Layout measurements, in CSS pixels; replaceable so the logic is testable without layout */
export interface PageMeasure {
    // Height of the page content box (page height without the top and bottom margins)
    innerHeight(page: HTMLElement): number;
    // Vertical space an element takes in the page flow, margins included (header, footer)
    flowHeight(element: HTMLElement): number;
    // Bottom edge of an element, measured from the top of its article
    bottomWithin(element: HTMLElement, article: HTMLElement): number;
}

function px(value: string): number {
    const n = parseFloat(value);
    return Number.isFinite(n) ? n : 0;
}

/** Measurements from the browser layout */
export const domMeasure: PageMeasure = {
    innerHeight(page) {
        const style = getComputedStyle(page);
        return px(style.minHeight) - px(style.paddingTop) - px(style.paddingBottom);
    },
    flowHeight(element) {
        const style = getComputedStyle(element);
        const height = element.getBoundingClientRect().height + px(style.marginTop) + px(style.marginBottom);
        return Math.max(0, height);
    },
    bottomWithin(element, article) {
        const marginBottom = px(getComputedStyle(element).marginBottom);
        return element.getBoundingClientRect().bottom + marginBottom - article.getBoundingClientRect().top;
    },
};

// Where the content of an article stops fitting: before child `index`, or inside the
// table at `index` before its row `row`
interface SplitPoint {
    index: number;
    row?: number;
}

function tableRows(table: HTMLElement): HTMLElement[] {
    return Array.from(table.querySelectorAll<HTMLElement>(':scope > tr, :scope > thead > tr, :scope > tbody > tr, :scope > tfoot > tr'));
}

function findSplit(article: HTMLElement, limit: number, measure: PageMeasure): SplitPoint | null {
    const children = Array.from(article.children) as HTMLElement[];
    for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (measure.bottomWithin(child, article) <= limit + 0.5) continue;
        if (child.tagName === 'TABLE') {
            const rows = tableRows(child);
            const row = rows.findIndex((r) => measure.bottomWithin(r, article) > limit + 0.5);
            // A table whose first row already does not fit starts on the next page,
            // unless it is the first block: then at least one row stays here
            if (row > 0) return { index: i, row };
            if (row === 0 && i === 0 && rows.length > 1) return { index: 0, row: 1 };
        }
        if (i > 0) return { index: i };
        // A single block taller than the page stays where it is; what follows moves on
        return children.length > 1 ? { index: 1 } : null;
    }
    return null;
}

// The rows from `row` on, moved into a copy of the table placed after it. Row groups
// (thead, tbody) and the column widths are copied, so the continuation keeps its layout
function splitTable(table: HTMLElement, row: number): HTMLElement {
    const rest = table.cloneNode(false) as HTMLElement;
    const colgroup = table.querySelector(':scope > colgroup');
    if (colgroup) rest.appendChild(colgroup.cloneNode(true));
    const groups = new Map<Element, Element>();
    for (const tr of tableRows(table).slice(row)) {
        const parent = tr.parentElement;
        if (!parent || parent === table) {
            rest.appendChild(tr);
            continue;
        }
        let group = groups.get(parent);
        if (!group) {
            group = parent.cloneNode(false) as Element;
            groups.set(parent, group);
            rest.appendChild(group);
        }
        group.appendChild(tr);
    }
    return rest;
}

// A new empty page after `page`: same size and margins, copies of its header and
// footer, and an empty article. Footnotes stay on the page that cites them
function createNextPage(page: HTMLElement, article: HTMLElement): { next: HTMLElement; content: HTMLElement } {
    const next = page.cloneNode(false) as HTMLElement;
    const content = article.cloneNode(false) as HTMLElement;
    for (const child of Array.from(page.children)) {
        if (child === article) next.appendChild(content);
        else if (child.tagName === 'HEADER' || child.tagName === 'FOOTER') next.appendChild(child.cloneNode(true));
    }
    page.after(next);
    return { next, content };
}

// Space the article can use on a page: the content box without header, footer and notes
function articleLimit(page: HTMLElement, article: HTMLElement, measure: PageMeasure): number {
    let limit = measure.innerHeight(page);
    for (const child of Array.from(page.children) as HTMLElement[]) {
        if (child !== article) limit -= measure.flowHeight(child);
    }
    return limit;
}

function pageArticle(page: HTMLElement): HTMLElement | null {
    const articles = Array.from(page.children).filter((c) => c.tagName === 'ARTICLE') as HTMLElement[];
    // Several articles are column sections on one page; columns flow on their own
    if (articles.length !== 1) return null;
    const article = articles[0];
    return article.style.columnCount ? null : article;
}

function contentHeight(article: HTMLElement, measure: PageMeasure): number {
    const last = article.lastElementChild as HTMLElement | null;
    return last ? measure.bottomWithin(last, article) : 0;
}

/** Split one rendered page into as many pages as its content needs; returns the pages */
export function splitPage(page: HTMLElement, measure: PageMeasure = domMeasure): HTMLElement[] {
    const pages = [page];
    let article = pageArticle(page);
    if (!article) return pages;
    const firstLimit = articleLimit(page, article, measure);
    if (firstLimit <= 0 || contentHeight(article, measure) <= firstLimit * (1 + OVERFLOW_TOLERANCE)) {
        return pages;
    }
    let current = page;
    // Bounded by the number of blocks: every pass moves at least one block to a new page
    for (let guard = article.children.length * 2 + 2; guard > 0 && article; guard--) {
        const limit = articleLimit(current, article, measure);
        const split = findSplit(article, limit, measure);
        if (!split) break;
        const { next, content } = createNextPage(current, article);
        const children = Array.from(article.children);
        if (split.row !== undefined) {
            content.appendChild(splitTable(children[split.index] as HTMLElement, split.row));
            children.slice(split.index + 1).forEach((c) => content.appendChild(c));
        } else {
            children.slice(split.index).forEach((c) => content.appendChild(c));
        }
        pages.push(next);
        current = next;
        article = content;
    }
    return pages;
}

/** Write the page number and the page count into the marked PAGE and NUMPAGES fields */
export function numberPages(pages: readonly HTMLElement[]): void {
    pages.forEach((page, index) => {
        page.querySelectorAll(`.${PAGE_FIELD_CLASS}`).forEach((el) => {
            el.textContent = String(index + 1);
        });
        page.querySelectorAll(`.${NUMPAGES_FIELD_CLASS}`).forEach((el) => {
            el.textContent = String(pages.length);
        });
    });
}

/**
 * Lay out every page under `root` (the docx-preview wrapper or an ancestor) and number
 * them. Must run while `root` is in the document, at zoom 1. Returns the page count
 */
export function paginate(root: HTMLElement, measure: PageMeasure = domMeasure): number {
    const pages: HTMLElement[] = [];
    for (const page of Array.from(root.querySelectorAll<HTMLElement>('section.docx'))) {
        pages.push(...splitPage(page, measure));
    }
    numberPages(pages);
    return pages.length;
}
