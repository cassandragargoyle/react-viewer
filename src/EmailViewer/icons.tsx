/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Monochrome stroke icons for the EmailViewer (16px, stroke inherits currentColor)
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

export function ReplyIcon(): JSX.Element {
    return (
        <svg {...base} aria-hidden="true">
            <path d="M6 4 2 8l4 4" />
            <path d="M2 8h6a5 5 0 0 1 5 5" />
        </svg>
    );
}

export function ReplyAllIcon(): JSX.Element {
    return (
        <svg {...base} aria-hidden="true">
            <path d="M5 4 1 8l4 4" />
            <path d="M9 4 5 8l4 4" />
            <path d="M5 8h4a5 5 0 0 1 5 5" />
        </svg>
    );
}

export function ForwardIcon(): JSX.Element {
    return (
        <svg {...base} aria-hidden="true">
            <path d="M10 4l4 4-4 4" />
            <path d="M14 8H8a5 5 0 0 0-5 5" />
        </svg>
    );
}

export function DownloadIcon(): JSX.Element {
    return (
        <svg {...base} aria-hidden="true">
            <path d="M8 2v8" />
            <path d="M4.5 7 8 10.5 11.5 7" />
            <path d="M3 13h10" />
        </svg>
    );
}

export function AttachmentIcon(): JSX.Element {
    return (
        <svg {...base} aria-hidden="true">
            <path d="M12.5 6.5 7 12a3 3 0 0 1-4-4l5.5-5.5a2 2 0 0 1 3 3L6 11" />
        </svg>
    );
}

// High importance: double chevron up
export function PriorityHighIcon(): JSX.Element {
    return (
        <svg {...base} aria-hidden="true">
            <path d="M4 9l4-4 4 4" />
            <path d="M4 12l4-4 4 4" />
        </svg>
    );
}

// Low importance: single chevron down
export function PriorityLowIcon(): JSX.Element {
    return (
        <svg {...base} aria-hidden="true">
            <path d="M4 6l4 4 4-4" />
        </svg>
    );
}
