/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Unit tests for DocxViewer with docx-preview mocked: pages, failure message,
// link handling and the zoom controls

import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

const renderAsync = vi.fn();
vi.mock('docx-preview', () => ({ renderAsync: (...args: unknown[]) => renderAsync(...args) }));

import { DocxViewer } from './DocxViewer';

const DATA = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);

// What docx-preview produces: a wrapper with one section per page, styles separately
function fakeRender(pages: number, pageHtml = '<p>Text</p>') {
    return async (_data: unknown, body: HTMLElement, styles: HTMLElement) => {
        styles.innerHTML = '<style>.docx { color: black; }</style>';
        const sections = Array.from({ length: pages }, () => `<section class="docx">${pageHtml}</section>`);
        body.innerHTML = `<div class="docx-wrapper">${sections.join('')}</div>`;
    };
}

describe('DocxViewer', () => {
    beforeEach(() => {
        renderAsync.mockReset();
    });

    it('renders the pages and shows the page position', async () => {
        renderAsync.mockImplementation(fakeRender(3));
        const { container } = render(<DocxViewer data={DATA} />);
        expect(await screen.findByText('Page 1 of 3')).toBeInTheDocument();
        expect(container.querySelectorAll('section.docx')).toHaveLength(3);
        expect(renderAsync).toHaveBeenCalledWith(
            DATA,
            expect.any(HTMLElement),
            expect.any(HTMLElement),
            expect.objectContaining({ breakPages: true, renderComments: false }),
        );
    });

    it('shows loading until the document is rendered', () => {
        renderAsync.mockReturnValue(new Promise(() => {}));
        render(<DocxViewer data={DATA} />);
        expect(screen.getByText('Loading document…')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Zoom in' })).toBeDisabled();
    });

    it('shows the reason and reports it when the document cannot be rendered', async () => {
        renderAsync.mockRejectedValue(new Error('End of central directory not found'));
        const onError = vi.fn();
        render(<DocxViewer data={DATA} onError={onError} />);
        expect(await screen.findByRole('alert')).toHaveTextContent(
            'This document cannot be displayed: End of central directory not found',
        );
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });

    it('hands an external link to the host instead of navigating', async () => {
        renderAsync.mockImplementation(fakeRender(1, '<a href="https://example.com/">Site</a>'));
        const onLinkClick = vi.fn();
        render(<DocxViewer data={DATA} onLinkClick={onLinkClick} />);
        const link = await screen.findByText('Site');
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        link.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(onLinkClick).toHaveBeenCalledWith('https://example.com/');
    });

    it('scrolls to a bookmark without calling the host', async () => {
        renderAsync.mockImplementation(
            fakeRender(1, '<a href="#intro">Go</a><span id="intro">Intro</span>'),
        );
        const onLinkClick = vi.fn();
        render(<DocxViewer data={DATA} onLinkClick={onLinkClick} />);
        const target = await screen.findByText('Intro');
        target.scrollIntoView = vi.fn();
        fireEvent.click(screen.getByText('Go'));
        expect(target.scrollIntoView).toHaveBeenCalled();
        expect(onLinkClick).not.toHaveBeenCalled();
    });

    it('steps the zoom and returns to actual size', async () => {
        renderAsync.mockImplementation(fakeRender(1));
        render(<DocxViewer data={DATA} initialZoom={1} />);
        await screen.findByText('Page 1 of 1');
        expect(screen.getByText('100%')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
        expect(screen.getByText('110%')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
        fireEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
        expect(screen.getByText('90%')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Actual size' }));
        expect(screen.getByText('100%')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Actual size' })).toHaveAttribute('aria-pressed', 'true');
    });
});
