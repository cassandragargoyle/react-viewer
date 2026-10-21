/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Zoom steps and page lookup for the DocxViewer, free of React and of the DOM
// Kept pure so the toolbar arithmetic is tested without rendering a document

/**
 * How the pages are scaled: a fixed factor (1 = 100 %), as wide as the pane, or `auto` —
 * as wide as the pane but never above 100 %, the default of a PDF viewer
 */
export type DocxZoom = number | 'fit-width' | 'auto';

/** Zoom factors the toolbar steps through, the same scale a PDF viewer offers */
export const ZOOM_STEPS = [0.25, 0.5, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 2, 3, 4] as const;

export const MIN_ZOOM = ZOOM_STEPS[0];
export const MAX_ZOOM = ZOOM_STEPS[ZOOM_STEPS.length - 1];

// Tolerance for comparing a fit-width factor with a step, so 0.9999 counts as 1
const EPSILON = 0.001;

/** Limit a factor to the range the toolbar supports */
export function clampZoom(scale: number): number {
    if (!Number.isFinite(scale) || scale <= 0) return 1;
    return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, scale));
}

/** The next larger step; a factor between steps (from fit width) goes to the nearest one above */
export function zoomIn(scale: number): number {
    return ZOOM_STEPS.find((step) => step > scale + EPSILON) ?? MAX_ZOOM;
}

/** The next smaller step; a factor between steps goes to the nearest one below */
export function zoomOut(scale: number): number {
    for (let i = ZOOM_STEPS.length - 1; i >= 0; i--) {
        if (ZOOM_STEPS[i] < scale - EPSILON) return ZOOM_STEPS[i];
    }
    return MIN_ZOOM;
}

/**
 * The factor that makes the document as wide as the pane. `naturalWidth` is the width
 * of the rendered pages at 100 %; an unknown width (nothing rendered yet) keeps 100 %
 */
export function fitWidthScale(paneWidth: number, naturalWidth: number): number {
    if (paneWidth <= 0 || naturalWidth <= 0) return 1;
    return clampZoom(paneWidth / naturalWidth);
}

/** The factor a requested zoom resolves to in a pane of the given width */
export function resolveScale(zoom: DocxZoom, paneWidth: number, naturalWidth: number): number {
    if (zoom === 'fit-width') return fitWidthScale(paneWidth, naturalWidth);
    if (zoom === 'auto') return Math.min(1, fitWidthScale(paneWidth, naturalWidth));
    return clampZoom(zoom);
}

/** Toolbar label of a factor, e.g. `125%` */
export function formatZoom(scale: number): string {
    return `${Math.round(scale * 100)}%`;
}

/** Vertical extent of one page, in any coordinate system shared with the pane top */
export interface PageBox {
    top: number;
    bottom: number;
}

/**
 * 1-based number of the page shown at the top of the pane: the first page whose bottom
 * is still below the pane top. Past the last page the last one counts; no pages give 0
 */
export function currentPage(pages: readonly PageBox[], paneTop: number): number {
    if (pages.length === 0) return 0;
    const index = pages.findIndex((page) => page.bottom > paneTop + 1);
    return index === -1 ? pages.length : index + 1;
}
