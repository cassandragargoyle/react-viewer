/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// DocxViewer toolbar: zoom out / level / zoom in, page width, actual size, page position
// Stateless: the viewer owns the zoom and the page numbers and passes them in

import React from 'react';
import { ActualSizeIcon, FitWidthIcon, ZoomInIcon, ZoomOutIcon } from './icons';
import { MAX_ZOOM, MIN_ZOOM, formatZoom, type DocxZoom } from './layout';

export interface DocxToolbarProps {
    // The requested zoom and the factor it resolves to (fit width depends on the pane)
    zoom: DocxZoom;
    scale: number;
    page: number;
    pageCount: number;
    // False while the document is loading or failed; the controls are then disabled
    enabled: boolean;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onZoom: (zoom: DocxZoom) => void;
}

export function DocxToolbar({
    zoom,
    scale,
    page,
    pageCount,
    enabled,
    onZoomIn,
    onZoomOut,
    onZoom,
}: DocxToolbarProps): JSX.Element {
    return (
        <div className="docx-toolbar" role="toolbar" aria-label="Document view">
            <button
                className="docx-toolbar-btn"
                type="button"
                title="Zoom out"
                aria-label="Zoom out"
                disabled={!enabled || scale <= MIN_ZOOM}
                onClick={onZoomOut}
            >
                <ZoomOutIcon />
            </button>
            <span className="docx-toolbar-zoom" aria-live="polite">
                {formatZoom(scale)}
            </span>
            <button
                className="docx-toolbar-btn"
                type="button"
                title="Zoom in"
                aria-label="Zoom in"
                disabled={!enabled || scale >= MAX_ZOOM}
                onClick={onZoomIn}
            >
                <ZoomInIcon />
            </button>
            <span className="docx-toolbar-sep" aria-hidden="true" />
            <button
                className="docx-toolbar-btn"
                type="button"
                title="Page width"
                aria-label="Page width"
                aria-pressed={zoom === 'fit-width'}
                disabled={!enabled}
                onClick={() => onZoom('fit-width')}
            >
                <FitWidthIcon />
            </button>
            <button
                className="docx-toolbar-btn"
                type="button"
                title="Actual size"
                aria-label="Actual size"
                aria-pressed={zoom === 1}
                disabled={!enabled}
                onClick={() => onZoom(1)}
            >
                <ActualSizeIcon />
            </button>
            {pageCount > 0 && (
                <span className="docx-toolbar-pages">
                    Page {page} of {pageCount}
                </span>
            )}
        </div>
    );
}
