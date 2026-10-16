/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Read-only e-mail viewer: renders a format-agnostic ParsedEmail (from .eml now, .msg later)
// Layout: toolbar, header, attachment chips, tabbed body — fills its host container

import React from 'react';
import type { ParsedEmail } from '../../../../shared/readers/mail';
import type { OsDateTimeFormat } from '../../../../shared/format';
import { EmailToolbar } from './EmailToolbar';
import { EmailHeader } from './EmailHeader';
import { AttachmentList } from './AttachmentList';
import { EmailBody } from './EmailBody';
import './EmailViewer.css';

export interface EmailViewerProps {
    // Normalized message to display; produced by a reader (parseEml) independent of format
    email: ParsedEmail;
    // How the operating system wants dates rendered, resolved by the host (issue 115): its
    // locale and, on Windows, its own short-date and time patterns. The component never reads
    // this from the environment, because in a webview or an Electron window that yields the
    // application UI language instead of the OS setting. Omitted means "unknown", which
    // formats the date in the fixed fallback pattern.
    dateFormat?: OsDateTimeFormat;
}

export function EmailViewer({ email, dateFormat }: EmailViewerProps): JSX.Element {
    return (
        <div className="email-viewer">
            <EmailToolbar />
            <EmailHeader email={email} dateFormat={dateFormat} />
            <AttachmentList attachments={email.attachments} />
            <EmailBody email={email} />
        </div>
    );
}
