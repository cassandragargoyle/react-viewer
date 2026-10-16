/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// EmailViewer tabbed body: HTML (sandboxed iframe) / Plain text / Source (raw MIME) / Headers
// Only the tabs backed by content are shown; the HTML tab is preferred when present

import React, { useEffect, useMemo, useState } from 'react';
import type { EmailMessage } from './types';
import { buildInlineHtml } from './inlineHtml';

type BodyTab = 'html' | 'text' | 'source' | 'headers';

// Renders the sanitized HTML body in a fully sandboxed iframe (no scripts, no same-origin).
// Inline images are embedded as data: URIs, so nothing outside the srcDoc is loaded.
function HtmlBody({ email }: { email: EmailMessage }): JSX.Element {
    const srcDoc = useMemo(() => buildInlineHtml(email.html ?? '', email.attachments), [email]);
    return <iframe className="email-html-frame" title="Message body" sandbox="" srcDoc={srcDoc} />;
}

export function EmailBody({ email }: { email: EmailMessage }): JSX.Element {
    // Available tabs, in display order — HTML first when the message has an HTML part
    const tabs = useMemo<BodyTab[]>(() => {
        const list: BodyTab[] = [];
        if (email.html) list.push('html');
        if (email.text) list.push('text');
        list.push('source', 'headers');
        return list;
    }, [email]);

    const [active, setActive] = useState<BodyTab>(tabs[0]);

    // Reset to the first available tab whenever a different message is shown
    useEffect(() => setActive(tabs[0]), [tabs]);

    const labels: Record<BodyTab, string> = {
        html: 'HTML',
        text: 'Plain text',
        source: 'Source',
        headers: 'Headers',
    };

    return (
        <div className="email-body">
            <div className="email-body-tabs" role="tablist">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        role="tab"
                        aria-selected={active === tab}
                        className={`email-body-tab${active === tab ? ' email-body-tab-active' : ''}`}
                        onClick={() => setActive(tab)}
                    >
                        {labels[tab]}
                    </button>
                ))}
            </div>
            <div className="email-body-content">
                {active === 'html' && <HtmlBody email={email} />}
                {active === 'text' && <pre className="email-body-text">{email.text}</pre>}
                {active === 'source' && <pre className="email-body-source">{email.raw}</pre>}
                {active === 'headers' && (
                    <table className="email-headers-table">
                        <tbody>
                            {email.headers.map((h, i) => (
                                <tr key={`${h.key}-${i}`}>
                                    <td className="email-headers-key">{h.key}</td>
                                    <td className="email-headers-value">{h.value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
