/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// Turns a message's raw HTML into a safe sandboxed-iframe document: resolves inline cid:
// images to data: URIs, sanitizes with DOMPurify, and blocks remote content via CSP (issue 075)

import DOMPurify from 'dompurify';
import type { MailAttachment } from '../../../../shared/readers/mail';

// Tags never useful in a mail body and risky to keep: scripts, framing, plugins, forms, and
// resource-loading head elements (remote CSS/base). DOMPurify strips scripts/handlers anyway;
// this is defense in depth alongside the iframe sandbox and CSP.
const FORBID_TAGS = ['script', 'iframe', 'object', 'embed', 'form', 'base', 'meta', 'link'];

// Base64-encode raw bytes (chunked to avoid call-stack limits on large inputs)
function bytesToBase64(bytes: Uint8Array): string {
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
}

/**
 * Build the sandboxed-iframe document for a mail's HTML body. Inline cid: references are
 * rewritten to data: URIs built from the matching inline attachments — data: (not blob:)
 * because a fully sandboxed iframe has an opaque origin and cannot load the parent's blob:
 * URLs. Everything else is sanitized and wrapped in a restrictive CSP that permits only
 * data: images and inline styles, so remote content (tracking pixels, external CSS) is
 * blocked by default.
 */
export function buildInlineHtml(rawHtml: string, attachments: MailAttachment[]): string {
    const cidMap = new Map<string, string>();
    for (const att of attachments) {
        if (att.disposition === 'inline' && att.contentId) {
            cidMap.set(att.contentId, `data:${att.mimeType};base64,${bytesToBase64(att.bytes)}`);
        }
    }

    // Rewrite cid: sources to their data: URI before sanitizing
    const doc = new DOMParser().parseFromString(rawHtml, 'text/html');
    doc.querySelectorAll('[src]').forEach((el) => {
        const src = el.getAttribute('src') ?? '';
        if (src.toLowerCase().startsWith('cid:')) {
            const id = src.slice(4).replace(/^<|>$/g, '');
            const mapped = cidMap.get(id);
            if (mapped) el.setAttribute('src', mapped);
            else el.removeAttribute('src');
        }
    });

    const clean = DOMPurify.sanitize(doc.body.innerHTML, {
        FORBID_TAGS,
        FORBID_ATTR: ['ping'],
        ALLOW_UNKNOWN_PROTOCOLS: false,
    });

    return [
        '<!doctype html><html><head><meta charset="utf-8">',
        '<meta http-equiv="Content-Security-Policy" ',
        'content="default-src \'none\'; img-src data:; style-src \'unsafe-inline\'; font-src data:;">',
        '<style>html,body{margin:0;padding:12px;background:#ffffff;color:#111111;',
        "font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:13px;line-height:1.5;}",
        'img{max-width:100%;height:auto;}a{color:#0645ad;}</style>',
        '</head><body>',
        clean,
        '</body></html>',
    ].join('');
}
