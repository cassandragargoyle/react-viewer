/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// The message shape EmailViewer renders, independent of the format it was read from
// A reader (.eml, .msg, ...) produces it; the viewer never sees MIME or MAPI

/** A single mailbox: an address plus an optional display name */
export interface EmailAddress {
    name?: string;
    address: string;
}

/** One attachment or inline part, carried as raw bytes so the viewer owns rendering */
export interface EmailAttachment {
    filename: string;
    mimeType: string;
    size: number;
    /** Content-ID (angle brackets stripped) used to resolve inline cid: references */
    contentId?: string;
    disposition: 'attachment' | 'inline';
    bytes: Uint8Array;
}

/** Message importance; 'normal' renders without a badge */
export type EmailImportance = 'high' | 'normal' | 'low';

/**
 * Normalized message the viewer renders. `html` is the message's raw HTML — the viewer
 * sanitizes it and resolves cid: references itself, so a reader can stay DOM-free.
 */
export interface EmailMessage {
    subject: string;
    from?: EmailAddress;
    to: EmailAddress[];
    cc: EmailAddress[];
    date?: Date;
    importance: EmailImportance;
    html?: string;
    text?: string;
    attachments: EmailAttachment[];
    headers: Array<{ key: string; value: string }>;
    /** Original source shown on the Source tab */
    raw: string;
}

/** Turns the message date into the text of the Date row */
export type EmailDateFormatter = (date: Date) => string;

/** Zero-pad a positive integer to the given width */
function pad(value: number, width = 2): string {
    return String(value).padStart(width, '0');
}

/**
 * Default date format: local time as `YYYY-MM-DD HH:MM:SS`.
 *
 * Unambiguous in every region and never drops the seconds a mail Date: header carries.
 * An invalid Date yields an empty string, so the row is omitted rather than showing `NaN`.
 */
export function formatEmailDate(date: Date): string {
    if (Number.isNaN(date.getTime())) return '';
    const ymd = `${pad(date.getFullYear(), 4)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    const hms = `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    return `${ymd} ${hms}`;
}
