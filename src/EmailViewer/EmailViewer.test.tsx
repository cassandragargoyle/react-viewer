/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Unit tests for EmailViewer: header rows, the host date formatter and its
// default, the importance badge, attachments and the tabs that adapt to content

import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmailViewer } from './EmailViewer';
import { formatEmailDate, type EmailMessage } from './types';

const MESSAGE: EmailMessage = {
    subject: 'Quarterly report',
    from: { name: 'Jan Novak', address: 'jan@example.com' },
    to: [{ address: 'team@example.com' }],
    cc: [],
    date: new Date(2026, 6, 1, 11, 0, 5),
    importance: 'high',
    text: 'See the attachment.',
    attachments: [
        {
            filename: 'report.pdf',
            mimeType: 'application/pdf',
            size: 2048,
            disposition: 'attachment',
            bytes: new Uint8Array([1, 2, 3]),
        },
    ],
    headers: [{ key: 'Subject', value: 'Quarterly report' }],
    raw: 'Subject: Quarterly report\r\n\r\nSee the attachment.',
};

describe('EmailViewer', () => {
    it('renders the subject and the non-empty address rows', () => {
        render(<EmailViewer email={MESSAGE} />);
        expect(screen.getByText('Quarterly report')).toBeInTheDocument();
        expect(screen.getByText('Jan Novak <jan@example.com>')).toBeInTheDocument();
        expect(screen.getByText('team@example.com')).toBeInTheDocument();
        expect(screen.queryByText('Cc')).not.toBeInTheDocument();
    });

    it('formats the date with the fixed pattern by default', () => {
        render(<EmailViewer email={MESSAGE} />);
        expect(screen.getByText('2026-07-01 11:00:05')).toBeInTheDocument();
    });

    it('formats the date with the formatter the host passes', () => {
        render(<EmailViewer email={MESSAGE} formatDate={(d) => `day ${d.getDate()}`} />);
        expect(screen.getByText('day 1')).toBeInTheDocument();
    });

    it('shows the importance badge and the attachment chip', () => {
        render(<EmailViewer email={MESSAGE} />);
        expect(screen.getByText('High priority')).toBeInTheDocument();
        expect(screen.getByText('report.pdf')).toBeInTheDocument();
    });

    it('offers only the body tabs the message has content for', () => {
        render(<EmailViewer email={MESSAGE} />);
        expect(screen.queryByRole('tab', { name: 'HTML' })).not.toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Plain text' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Source' })).toBeInTheDocument();
    });
});

describe('formatEmailDate', () => {
    it('zero-pads every field and keeps the seconds', () => {
        expect(formatEmailDate(new Date(2026, 0, 2, 3, 4, 5))).toBe('2026-01-02 03:04:05');
    });

    it('returns an empty string for an invalid date', () => {
        expect(formatEmailDate(new Date('not a date'))).toBe('');
    });
});
