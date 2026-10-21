/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Read-only Word (.docx) viewer: renders the document bytes as pages with docx-preview
// Layout: toolbar (zoom, page position) above a scrolling pane — fills its host container

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { parseAsync, renderDocument } from 'docx-preview';
import { DocxToolbar } from './DocxToolbar';
import { markPageFields } from './fields';
import { paginate } from './paginate';
import { currentPage, resolveScale, zoomIn, zoomOut, type DocxZoom } from './layout';
import docxViewerStyles from './DocxViewer.css';

// Inject styles once when bundled with the 'text' loader (single-file bundle, the
// published package). Under the 'css' loader the import resolves to a non-string and
// a sibling stylesheet is emitted instead, so this injection is skipped.
if (
    typeof document !== 'undefined' &&
    typeof docxViewerStyles === 'string' &&
    docxViewerStyles &&
    !document.getElementById('docx-viewer-styles')
) {
    const styleEl = document.createElement('style');
    styleEl.id = 'docx-viewer-styles';
    styleEl.textContent = docxViewerStyles;
    document.head.appendChild(styleEl);
}

export interface DocxViewerProps {
    // The .docx file content; the host reads the file, the viewer never touches a path.
    // A new value (by identity) renders the document again
    data: ArrayBuffer | Uint8Array;
    // Zoom when the document opens; `auto` (the default) fits the pane up to 100 %
    initialZoom?: DocxZoom;
    // A link to outside the document was clicked. The viewer never navigates itself, so
    // the host decides how to open it (a browser, nothing at all)
    onLinkClick?: (href: string) => void;
    // The document could not be rendered; the pane shows the reason on its own
    onError?: (error: Error) => void;
    // When given, the toolbar offers "Open in default application"; the host opens the
    // file in whatever application the operating system uses for .docx
    onOpenExternally?: () => void;
}

type Status = { kind: 'loading' } | { kind: 'ready' } | { kind: 'error'; message: string };

// docx-preview options: pages as the document defines them, including the page breaks
// Word recorded when it last laid the document out, so pages match the original. A
// document without recorded breaks is split into pages afterwards (paginate.ts)
const RENDER_OPTIONS = {
    className: 'docx',
    inWrapper: true,
    breakPages: true,
    ignoreLastRenderedPageBreak: false,
    renderHeaders: true,
    renderFooters: true,
    renderFootnotes: true,
    renderEndnotes: true,
    renderComments: false,
    renderChanges: false,
    experimental: false,
    useBase64URL: false,
};

// Horizontal space around the pages at 100 %, kept in step with .docx-viewer-content
// .docx-wrapper padding in DocxViewer.css
const PAGE_GUTTER_PX = 16;

function toError(value: unknown): Error {
    return value instanceof Error ? value : new Error(String(value));
}

// Width of the widest page at 100 %, plus its gutter; 0 when nothing is rendered
function measureNaturalWidth(host: HTMLElement): number {
    let widest = 0;
    host.querySelectorAll<HTMLElement>('section.docx').forEach((page) => {
        widest = Math.max(widest, page.offsetWidth);
    });
    return widest > 0 ? widest + 2 * PAGE_GUTTER_PX : 0;
}

// docx-preview's renderAsync, split open so the PAGE / NUMPAGES fields can be marked
// between parsing and rendering. Style nodes go to `styles`, the pages to `body`
async function renderDocx(data: ArrayBuffer | Uint8Array, body: HTMLElement, styles: HTMLElement): Promise<void> {
    const document = await parseAsync(data, RENDER_OPTIONS);
    markPageFields(document);
    const nodes = await renderDocument(document, RENDER_OPTIONS);
    for (const node of nodes) {
        (node.nodeName === 'STYLE' ? styles : body).appendChild(node);
    }
}

// Lay the pages out and measure them, at 100 % whatever the current zoom: the page
// heights docx-preview sets are in document units, compared with unzoomed layout.
// Returns the page count and the natural width of the document
function layoutPages(host: HTMLElement): { pages: number; width: number } {
    const previous = host.style.zoom;
    host.style.zoom = '1';
    try {
        return { pages: paginate(host), width: measureNaturalWidth(host) };
    } finally {
        host.style.zoom = previous;
    }
}

export function DocxViewer({
    data,
    initialZoom = 'auto',
    onLinkClick,
    onError,
    onOpenExternally,
}: DocxViewerProps): JSX.Element {
    const paneRef = useRef<HTMLDivElement>(null);
    // Filled imperatively by docx-preview; React only sets its zoom
    const contentRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<Status>({ kind: 'loading' });
    const [zoom, setZoom] = useState<DocxZoom>(initialZoom);
    const [paneWidth, setPaneWidth] = useState(0);
    const [naturalWidth, setNaturalWidth] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [page, setPage] = useState(0);

    // Latest callbacks without re-rendering the document when the host passes new ones
    const onErrorRef = useRef(onError);
    onErrorRef.current = onError;
    const onLinkClickRef = useRef(onLinkClick);
    onLinkClickRef.current = onLinkClick;

    // Render into detached elements and swap them in when done, so a slow render of a
    // previous value can never mix with the current one. Pagination needs layout, so it
    // runs right after the swap, before the browser paints the unsplit pages
    useEffect(() => {
        let cancelled = false;
        setStatus({ kind: 'loading' });
        const body = document.createElement('div');
        const styles = document.createElement('div');
        renderDocx(data, body, styles)
            .then(() => {
                const host = contentRef.current;
                if (cancelled || !host) return;
                host.replaceChildren(styles, body);
                const { pages, width } = layoutPages(host);
                setPageCount(pages);
                setPage(1);
                setNaturalWidth(width);
                setStatus({ kind: 'ready' });
            })
            .catch((reason: unknown) => {
                if (cancelled) return;
                const error = toError(reason);
                contentRef.current?.replaceChildren();
                setPageCount(0);
                setPage(0);
                setStatus({ kind: 'error', message: error.message });
                onErrorRef.current?.(error);
            });
        return () => {
            cancelled = true;
        };
    }, [data]);

    // Track the pane width for the fit modes
    useLayoutEffect(() => {
        const pane = paneRef.current;
        if (!pane) return;
        setPaneWidth(pane.clientWidth);
        if (typeof ResizeObserver === 'undefined') return;
        const observer = new ResizeObserver(() => setPaneWidth(pane.clientWidth));
        observer.observe(pane);
        return () => observer.disconnect();
    }, []);

    const scale = resolveScale(zoom, paneWidth, naturalWidth);

    const updatePage = useCallback(() => {
        const pane = paneRef.current;
        const host = contentRef.current;
        if (!pane || !host) return;
        const boxes = Array.from(host.querySelectorAll('section.docx'), (section) => {
            const rect = section.getBoundingClientRect();
            return { top: rect.top, bottom: rect.bottom };
        });
        if (boxes.length > 0) setPage(currentPage(boxes, pane.getBoundingClientRect().top));
    }, []);

    // The page at the top moves when the zoom changes, not only on scroll
    useEffect(() => {
        if (status.kind === 'ready') updatePage();
    }, [scale, status, updatePage]);

    // Links: a bookmark scrolls within the document, anything else goes to the host.
    // The webview or window itself must never navigate away from the viewer
    const handleClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const host = contentRef.current;
        const target = event.target as Element | null;
        const anchor = target?.closest?.('a[href]');
        if (!host || !anchor || !host.contains(anchor)) return;
        event.preventDefault();
        const href = anchor.getAttribute('href') ?? '';
        if (href.startsWith('#')) {
            const bookmark = document.getElementById(decodeURIComponent(href.slice(1)));
            if (bookmark && host.contains(bookmark)) bookmark.scrollIntoView({ block: 'start' });
            return;
        }
        if (href) onLinkClickRef.current?.(href);
    }, []);

    return (
        <div className="docx-viewer">
            <DocxToolbar
                zoom={zoom}
                scale={scale}
                page={page}
                pageCount={pageCount}
                enabled={status.kind === 'ready'}
                onZoomIn={() => setZoom(zoomIn(scale))}
                onZoomOut={() => setZoom(zoomOut(scale))}
                onZoom={setZoom}
                onOpenExternally={onOpenExternally}
            />
            <div className="docx-viewer-pane" ref={paneRef} onScroll={updatePage}>
                {status.kind === 'loading' && pageCount === 0 && (
                    <div className="docx-viewer-message">Loading document…</div>
                )}
                {status.kind === 'error' && (
                    <div className="docx-viewer-message docx-viewer-error" role="alert">
                        This document cannot be displayed: {status.message}
                    </div>
                )}
                <div
                    className="docx-viewer-content"
                    ref={contentRef}
                    style={{ zoom: scale }}
                    onClick={handleClick}
                />
            </div>
        </div>
    );
}
