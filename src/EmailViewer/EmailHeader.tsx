/*
 *  This file is part of CassandraGargoyle Community Project
 *  Licensed under the MIT License - see LICENSE file for details
 */

// EmailViewer header block: subject plus From / To / Cc / Date rows
// Renders the normalized ParsedEmail fields; omits empty recipient rows

import React from 'react';
import type { EmailAddress, ParsedEmail } from '../../../../shared/readers/mail';
import { formatDateTime } from '../../../../shared/format';
import type { OsDateTimeFormat } from '../../../../shared/format';
import { PriorityHighIcon, PriorityLowIcon } from './icons';

// Render an address as "Name <addr>" or just the address when unnamed
function formatAddress(a: EmailAddress): string {
    return a.name ? `${a.name} <${a.address}>` : a.address;
}

function formatAddresses(list: EmailAddress[]): string {
    return list.map(formatAddress).join(', ');
}

// Badge shown next to the subject for non-normal importance; normal renders nothing
function ImportanceBadge({ importance }: { importance: ParsedEmail['importance'] }): JSX.Element | null {
    if (importance === 'high') {
        return (
            <span className="email-importance email-importance-high" title="High importance">
                <PriorityHighIcon />
                High priority
            </span>
        );
    }
    if (importance === 'low') {
        return (
            <span className="email-importance email-importance-low" title="Low importance">
                <PriorityLowIcon />
                Low priority
            </span>
        );
    }
    return null;
}

function AddressRow({ label, value }: { label: string; value: string }): JSX.Element | null {
    if (!value) return null;
    return (
        <div className="email-header-row">
            <span className="email-header-label">{label}</span>
            <span className="email-header-value">{value}</span>
        </div>
    );
}

export function EmailHeader({ email, dateFormat }: { email: ParsedEmail; dateFormat?: OsDateTimeFormat }): JSX.Element {
    const date = email.date ? formatDateTime(email.date, dateFormat) : '';
    return (
        <div className="email-header">
            <div className="email-header-subject-row">
                <span className="email-header-subject">{email.subject}</span>
                <ImportanceBadge importance={email.importance} />
            </div>
            <AddressRow label="From" value={email.from ? formatAddress(email.from) : ''} />
            <AddressRow label="To" value={formatAddresses(email.to)} />
            <AddressRow label="Cc" value={formatAddresses(email.cc)} />
            <AddressRow label="Date" value={date} />
        </div>
    );
}
