/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Unit tests for DocxViewer with docx-preview mocked: pages, failure message,
// link handling, the zoom controls and the default application action

import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

// parseAsync is the mock the tests drive; renderDocument returns the nodes it prepared
const parseAsync = vi.fn();
vi.mock('docx-preview', () => ({
    parseAsync: (...args: unknown[]) => parseAsync(...args),
    renderDocument: async (doc: { nodes: Node[] }) => doc.nodes,
}));

import { DocxViewer } from './DocxViewer';

const DATA = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);

// What docx-preview produces: a style element and a wrapper with one section per page
function fakeRender(pages: number, pageHtml = '<p>Text</p>') {
    return async () => {
        const style = document.createElement('style');
        style.textContent = '.docx { color: black; }';
        const wrapper = document.createElement('div');
        wrapper.className = 'docx-wrapper';
        wrapper.innerHTML = Array.from({ length: pages }, () => `<section class="docx">${pageHtml}</section>`).join('');
        return { parts: [], nodes: [style, wrapper] };
    };
}

describe('DocxViewer', () => {
    beforeEach(() => {
        parseAsync.mockReset();
    });

    it('renders the pages and shows the page position', async () => {
        parseAsync.mockImplementation(fakeRender(3));
        const { container } = render(<DocxViewer data={DATA} />);
        expect(await screen.findByText('Page 1 of 3')).toBeInTheDocument();
        expect(container.querySelectorAll('section.docx')).toHaveLength(3);
        expect(container.querySelector('style')).toHaveTextContent('.docx { color: black; }');
        expect(parseAsync).toHaveBeenCalledWith(
            DATA,
            expect.objectContaining({ breakPages: true, renderComments: false }),
        );
    });

    it('shows loading until the document is rendered', () => {
        parseAsync.mockReturnValue(new Promise(() => {}));
        render(<DocxViewer data={DATA} />);
        expect(screen.getByText('Loading document…')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Zoom in' })).toBeDisabled();
    });

    it('shows the reason and reports it when the document cannot be rendered', async () => {
        parseAsync.mockRejectedValue(new Error('End of central directory not found'));
        const onError = vi.fn();
        render(<DocxViewer data={DATA} onError={onError} />);
        expect(await screen.findByRole('alert')).toHaveTextContent(
            'This document cannot be displayed: End of central directory not found',
        );
        expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });

    it('hands an external link to the host instead of navigating', async () => {
        parseAsync.mockImplementation(fakeRender(1, '<a href="https://example.com/">Site</a>'));
        const onLinkClick = vi.fn();
        render(<DocxViewer data={DATA} onLinkClick={onLinkClick} />);
        const link = await screen.findByText('Site');
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        link.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(onLinkClick).toHaveBeenCalledWith('https://example.com/');
    });

    it('scrolls to a bookmark without calling the host', async () => {
        parseAsync.mockImplementation(
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

    it('offers the default application only when the host handles it', async () => {
        parseAsync.mockImplementation(fakeRender(1));
        const { unmount } = render(<DocxViewer data={DATA} />);
        await screen.findByText('Page 1 of 1');
        expect(screen.queryByText('Open in default application')).not.toBeInTheDocument();
        unmount();

        const onOpenExternally = vi.fn();
        render(<DocxViewer data={DATA} onOpenExternally={onOpenExternally} />);
        await screen.findByText('Page 1 of 1');
        fireEvent.click(screen.getByRole('button', { name: /Open in default application/ }));
        expect(onOpenExternally).toHaveBeenCalledTimes(1);
    });

    it('keeps the default application available when the document fails', async () => {
        parseAsync.mockRejectedValue(new Error('Corrupted zip'));
        const onOpenExternally = vi.fn();
        render(<DocxViewer data={DATA} onOpenExternally={onOpenExternally} />);
        await screen.findByRole('alert');
        expect(screen.getByRole('button', { name: 'Zoom in' })).toBeDisabled();
        const open = screen.getByRole('button', { name: /Open in default application/ });
        expect(open).toBeEnabled();
        fireEvent.click(open);
        expect(onOpenExternally).toHaveBeenCalledTimes(1);
    });

    it('steps the zoom and returns to actual size', async () => {
        parseAsync.mockImplementation(fakeRender(1));
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
