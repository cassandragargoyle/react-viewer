/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Unit tests for the DocxViewer zoom steps, the fit modes and the current page lookup

import { describe, expect, it } from 'vitest';
import {
    MAX_ZOOM,
    MIN_ZOOM,
    clampZoom,
    currentPage,
    fitWidthScale,
    formatZoom,
    resolveScale,
    zoomIn,
    zoomOut,
} from './layout';

describe('zoom steps', () => {
    it('steps up and down from a step', () => {
        expect(zoomIn(1)).toBe(1.1);
        expect(zoomOut(1)).toBe(0.9);
    });

    it('steps from a factor between steps to the nearest step in that direction', () => {
        expect(zoomIn(1.17)).toBe(1.25);
        expect(zoomOut(1.17)).toBe(1.1);
    });

    it('treats a factor next to a step as that step', () => {
        expect(zoomIn(0.9999)).toBe(1.1);
    });

    it('stops at the ends of the range', () => {
        expect(zoomIn(MAX_ZOOM)).toBe(MAX_ZOOM);
        expect(zoomOut(MIN_ZOOM)).toBe(MIN_ZOOM);
    });

    it('clamps out-of-range and invalid factors', () => {
        expect(clampZoom(10)).toBe(MAX_ZOOM);
        expect(clampZoom(0.01)).toBe(MIN_ZOOM);
        expect(clampZoom(Number.NaN)).toBe(1);
        expect(clampZoom(-2)).toBe(1);
    });
});

describe('fit modes', () => {
    it('fits the document width to the pane', () => {
        expect(fitWidthScale(1000, 500)).toBe(2);
    });

    it('keeps 100 % while the width is unknown', () => {
        expect(fitWidthScale(1000, 0)).toBe(1);
        expect(fitWidthScale(0, 800)).toBe(1);
    });

    it('caps auto at 100 % but follows a narrower pane', () => {
        expect(resolveScale('auto', 1000, 500)).toBe(1);
        expect(resolveScale('auto', 400, 800)).toBe(0.5);
        expect(resolveScale('fit-width', 1000, 500)).toBe(2);
        expect(resolveScale(1.5, 1000, 500)).toBe(1.5);
    });

    it('labels a factor as a percentage', () => {
        expect(formatZoom(1.25)).toBe('125%');
        expect(formatZoom(0.333)).toBe('33%');
    });
});

describe('currentPage', () => {
    const pages = [
        { top: 0, bottom: 100 },
        { top: 110, bottom: 210 },
        { top: 220, bottom: 320 },
    ];

    it('returns the page at the pane top', () => {
        expect(currentPage(pages, 0)).toBe(1);
        expect(currentPage(pages, 150)).toBe(2);
        expect(currentPage(pages, 105)).toBe(2);
    });

    it('returns the last page past the end and 0 without pages', () => {
        expect(currentPage(pages, 400)).toBe(3);
        expect(currentPage([], 0)).toBe(0);
    });
});
