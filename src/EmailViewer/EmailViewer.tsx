/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Read-only e-mail viewer: renders a format-agnostic EmailMessage (from .eml, .msg or any reader)
// Layout: toolbar, header, attachment chips, tabbed body — fills its host container

import React from 'react';
import type { EmailDateFormatter, EmailMessage } from './types';
import { EmailToolbar } from './EmailToolbar';
import { EmailHeader } from './EmailHeader';
import { AttachmentList } from './AttachmentList';
import { EmailBody } from './EmailBody';
import emailViewerStyles from './EmailViewer.css';

// Inject styles once when bundled with the 'text' loader (single-file bundle, the
// published package). Under the 'css' loader the import resolves to a non-string and
// a sibling stylesheet is emitted instead, so this injection is skipped.
if (
    typeof document !== 'undefined' &&
    typeof emailViewerStyles === 'string' &&
    emailViewerStyles &&
    !document.getElementById('email-viewer-styles')
) {
    const styleEl = document.createElement('style');
    styleEl.id = 'email-viewer-styles';
    styleEl.textContent = emailViewerStyles;
    document.head.appendChild(styleEl);
}

export interface EmailViewerProps {
    // Normalized message to display; produced by a reader independent of format
    email: EmailMessage;
    // Formats the Date row. The host decides how dates look — typically the operating
    // system's own pattern, which a webview or an Electron window cannot read from its
    // environment. Omitted means the fixed `YYYY-MM-DD HH:MM:SS` local-time pattern
    formatDate?: EmailDateFormatter;
}

export function EmailViewer({ email, formatDate }: EmailViewerProps): JSX.Element {
    return (
        <div className="email-viewer">
            <EmailToolbar />
            <EmailHeader email={email} formatDate={formatDate} />
            <AttachmentList attachments={email.attachments} />
            <EmailBody email={email} />
        </div>
    );
}
