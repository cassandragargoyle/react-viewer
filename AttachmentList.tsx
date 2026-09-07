/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// EmailViewer attachment strip: one chip per attachment with a download action
// Attachment bytes are never executed — download only, no auto-open (issue 075 security)

import React from 'react';
import type { MailAttachment } from '../../../../shared/readers/mail';
import { AttachmentIcon, DownloadIcon } from './icons';

// Human-readable byte size (B / KB / MB) for the chip label
function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Save an attachment's raw bytes via a transient object URL, revoked right after the click
function downloadAttachment(att: MailAttachment): void {
    const url = URL.createObjectURL(new Blob([att.bytes as BlobPart], { type: att.mimeType }));
    const a = document.createElement('a');
    a.href = url;
    a.download = att.filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

export function AttachmentList({ attachments }: { attachments: MailAttachment[] }): JSX.Element | null {
    if (attachments.length === 0) return null;
    return (
        <div className="email-attachments" aria-label="Attachments">
            {attachments.map((att, i) => (
                <button
                    key={`${att.filename}-${i}`}
                    type="button"
                    className="email-attachment-chip"
                    onClick={() => downloadAttachment(att)}
                    title={`Download ${att.filename} (${formatSize(att.size)})`}
                >
                    <span className="email-attachment-icon">
                        <AttachmentIcon />
                    </span>
                    <span className="email-attachment-name">{att.filename}</span>
                    <span className="email-attachment-size">{formatSize(att.size)}</span>
                    <span className="email-attachment-download">
                        <DownloadIcon />
                    </span>
                </button>
            ))}
        </div>
    );
}
