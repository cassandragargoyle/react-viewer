/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Monochrome stroke icons for the DocxViewer toolbar (16px, stroke inherits currentColor)
// Follows the GUI design principles: single-color, fill:none, rounded caps

import React from 'react';

const base = {
    width: 16,
    height: 16,
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.3,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
};

export function ZoomInIcon(): JSX.Element {
    return (
        <svg {...base} aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5 14 14" />
            <path d="M5 7h4" />
            <path d="M7 5v4" />
        </svg>
    );
}

export function ZoomOutIcon(): JSX.Element {
    return (
        <svg {...base} aria-hidden="true">
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5 14 14" />
            <path d="M5 7h4" />
        </svg>
    );
}

// Page width: two bars with arrows pointing at them
export function FitWidthIcon(): JSX.Element {
    return (
        <svg {...base} aria-hidden="true">
            <path d="M2 3v10" />
            <path d="M14 3v10" />
            <path d="M4.5 8h7" />
            <path d="M6.5 6 4.5 8l2 2" />
            <path d="M9.5 6l2 2-2 2" />
        </svg>
    );
}

// Actual size: a page outline
export function ActualSizeIcon(): JSX.Element {
    return (
        <svg {...base} aria-hidden="true">
            <path d="M4 2h5.5L12 4.5V14H4z" />
            <path d="M9.5 2v2.5H12" />
        </svg>
    );
}
